import json
import re

from .ollama_client import OllamaClientError, generate_response


SYSTEM_PROMPT = """You are SAT-SA AI, the local AI intelligence component of SAT-SA, a Supervisory Analytics Tool for SOC Assessment.

You are assisting a SOC analyst by interpreting evidence supplied by SAT-SA.

Use only the supplied SAT-SA evidence.
Do not invent events, scores, IP addresses, attacks, severity, usernames, timestamps, or facts.
Do not change deterministic SAT-SA scores.
Clearly distinguish observed evidence from inference.
If the evidence is insufficient, say so.
Do not claim certainty without evidence.
Do not provide offensive attack instructions.
Focus on defensive SOC analysis."""

ASSESSMENT_SCHEMA = {
    "type": "object",
    "required": [
        "overall_assessment",
        "detected_security_concerns",
        "evidence",
        "risk_interpretation",
        "recommended_actions",
        "analyst_priority",
    ],
    "properties": {
        "overall_assessment": {"type": "string"},
        "detected_security_concerns": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["type", "severity", "confidence", "description"],
                "properties": {
                    "type": {"type": "string"},
                    "severity": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "description": {"type": "string"},
                },
            },
        },
        "evidence": {"type": "array", "items": {"type": "string"}},
        "risk_interpretation": {"type": "string"},
        "recommended_actions": {"type": "array", "items": {"type": "string"}},
        "analyst_priority": {"type": "string", "enum": ["LOW", "MEDIUM", "HIGH"]},
    },
}

def _compact_context(normalized, behaviour, correlation, attention, resilience, risk, findings, negative_space=None):
    events = []
    for event in (normalized or [])[:25]:
        events.append({
            "event_id": event.get("event_id"),
            "timestamp": event.get("timestamp"),
            "agent": event.get("agent", {}),
            "rule": event.get("rule", {}),
            "decoder": event.get("decoder"),
            "location": event.get("location"),
            "activity_type": event.get("activity_type"),
        })

    compact_findings = []
    for finding in (findings or {}).get("findings", [])[:20]:
        compact_findings.append({
            "finding_id": finding.get("finding_id"),
            "title": finding.get("title"),
            "severity": finding.get("severity"),
            "risk_score": finding.get("risk_score"),
            "affected_entity": finding.get("affected_entity"),
            "evidence_references": finding.get("evidence_references", []),
            "contributing_factors": finding.get("contributing_factors", []),
            "explanation": finding.get("explanation"),
            "recommendation": finding.get("recommendation"),
            "confidence": finding.get("confidence"),
        })

    compact_ns = None
    if negative_space:
        compact_ns = {
            "negative_space_score": negative_space.get("negative_space_score", 0),
            "indicator_count": negative_space.get("indicator_count", 0),
            "status": negative_space.get("status", "normal"),
            "indicators": [
                {
                    "type": ind.get("type"),
                    "severity": ind.get("severity"),
                    "title": ind.get("title"),
                    "description": ind.get("description"),
                }
                for ind in (negative_space.get("indicators") or [])[:10]
            ],
            "message": negative_space.get("message", ""),
        }

    return {
        "normalized_events": events,
        "behaviour": behaviour or {},
        "correlation": correlation or {},
        "attention": attention or {},
        "resilience": resilience or {},
        "risk": risk or {},
        "findings": {
            "total_findings": (findings or {}).get("total_findings", 0),
            "findings": compact_findings,
        },
        "negative_space": compact_ns,
    }


def _context_text(normalized, behaviour, correlation, attention, resilience, risk, findings, negative_space=None):
    context = _compact_context(
        normalized, behaviour, correlation, attention,
        resilience, risk, findings, negative_space,
    )
    lines = [
        "SAT-SA SECURITY CONTEXT",
        f"Events analyzed: {len(normalized or [])}",
        f"Attention score: {(attention or {}).get('attention_score', 0)}/100",
        f"Resilience score: {(resilience or {}).get('resilience_score', 100)}/100",
        f"Risk score: {(risk or {}).get('overall_risk_score', 0)}/100",
        "",
        "FINDINGS",
    ]
    compact_findings = context["findings"]["findings"]
    if compact_findings:
        for finding in compact_findings:
            lines.append(
                f"- {finding.get('title', 'Untitled finding')} | "
                f"severity={finding.get('severity', 'unknown')} | "
                f"entity={finding.get('affected_entity', 'unknown')} | "
                f"{finding.get('explanation', '')}"
            )
    else:
        lines.append("- No generated findings.")

    lines.extend(["", "BEHAVIOUR ANALYSIS", _summarize_value(behaviour)])
    lines.extend(["", "CORRELATION ANALYSIS", _summarize_value(correlation)])
    lines.extend(["", "ATTENTION ANALYSIS", _summarize_value(attention)])
    lines.extend(["", "RESILIENCE ANALYSIS", _summarize_value(resilience)])
    lines.extend(["", "RISK ANALYSIS", _summarize_value(risk)])

    # --- Negative Space section ---
    ns = context.get("negative_space")
    lines.extend(["", "NEGATIVE SPACE ANALYSIS"])
    if ns:
        lines.append(
            f"Score: {ns.get('negative_space_score', 0)} | "
            f"Indicators: {ns.get('indicator_count', 0)} | "
            f"Status: {ns.get('status', 'normal')} | "
            f"{ns.get('message', '')}"
        )
        for ind in ns.get("indicators") or []:
            lines.append(
                f"  - [{ind.get('severity', 'unknown').upper()}] {ind.get('title', '')} | "
                f"{ind.get('description', '')}"
            )
    else:
        lines.append("- Negative space data not available.")

    lines.extend(["", "IMPORTANT NORMALIZED EVENTS"])
    if context["normalized_events"]:
        for event in context["normalized_events"]:
            agent = event.get("agent") or {}
            rule = event.get("rule") or {}
            lines.append(
                f"- event_id={event.get('event_id') or 'unknown'}; "
                f"timestamp={event.get('timestamp') or 'unknown'}; "
                f"agent={agent.get('name') or agent.get('id') or 'unknown'}; "
                f"agent_ip={agent.get('ip') or 'unknown'}; "
                f"rule={rule.get('id') or 'unknown'}; "
                f"severity={rule.get('severity') or 'unknown'}; "
                f"description={rule.get('description') or 'unknown'}; "
                f"decoder={event.get('decoder') or 'unknown'}; "
                f"location={event.get('location') or 'unknown'}; "
                f"activity_type={event.get('activity_type') or 'unknown'}"
            )
    else:
        lines.append("- No normalized events available.")
    return "\n".join(lines)


def _summarize_value(value):
    if not value:
        return "No data available."
    if isinstance(value, dict):
        lines = []
        for key, item in value.items():
            if isinstance(item, list):
                lines.append(f"{key}: {len(item)} item(s)")
            elif isinstance(item, dict):
                lines.append(f"{key}: {_summarize_value(item)}")
            else:
                lines.append(f"{key}: {item}")
        return "; ".join(lines)
    return str(value)


def _chat_text(response):
    if not isinstance(response, str) or not response.strip():
        raise OllamaClientError("Ollama returned an empty chat response.")
    answer = response.strip()
    fenced = re.fullmatch(r"```(?:text|markdown|json)?\s*(.*?)\s*```", answer, re.DOTALL)
    if fenced:
        answer = fenced.group(1).strip()
    if answer.startswith("{") and answer.endswith("}"):
        try:
            parsed = json.loads(answer)
        except json.JSONDecodeError as exc:
            raise OllamaClientError("Ollama returned malformed chat content.") from exc
        if isinstance(parsed, dict) and isinstance(parsed.get("answer"), str):
            answer = parsed["answer"].strip()
        elif isinstance(parsed, dict) and isinstance(parsed.get("response"), str):
            answer = parsed["response"].strip()
        else:
            raise OllamaClientError("Ollama returned structured chat content instead of prose.")
    if not answer:
        raise OllamaClientError("Ollama returned an empty chat response.")
    return answer


ALERT_EXPLANATION_SCHEMA = {
    "type": "object",
    "required": [
        "what_happened", "why_it_matters", "evidence",
        "risk_interpretation", "recommended_actions", "analyst_note",
    ],
    "properties": {
        "what_happened": {"type": "string"},
        "why_it_matters": {"type": "string"},
        "evidence": {"type": "array", "items": {"type": "string"}},
        "risk_interpretation": {"type": "string"},
        "recommended_actions": {"type": "array", "items": {"type": "string"}},
        "analyst_note": {"type": "string"},
    },
}


def _parse_alert_explanation(response):
    if not isinstance(response, str):
        raise OllamaClientError("Ollama returned a malformed alert explanation.")
    candidate = response.strip()
    fenced = re.search(r"```(?:json)?\s*(\{.*\})\s*```", candidate, re.DOTALL)
    if fenced:
        candidate = fenced.group(1)
    else:
        start, end = candidate.find("{"), candidate.rfind("}")
        if start >= 0 and end > start:
            candidate = candidate[start:end + 1]
    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise OllamaClientError("Ollama returned a malformed alert explanation.") from exc
    required = set(ALERT_EXPLANATION_SCHEMA["required"])
    if not isinstance(parsed, dict) or not required.issubset(parsed):
        raise OllamaClientError("Ollama returned an incomplete alert explanation.")
    list_fields = {"evidence", "recommended_actions"}
    if not all(isinstance(parsed[field], list) and all(isinstance(item, str) for item in parsed[field]) for field in list_fields):
        raise OllamaClientError("Ollama returned invalid alert explanation lists.")
    if not all(isinstance(parsed[field], str) for field in required - list_fields):
        raise OllamaClientError("Ollama returned invalid alert explanation text.")
    return {field: parsed[field] for field in required}


def explain_alert(alert, behaviour, correlation, attention, resilience, risk, finding=None):
    alert_context = _context_text(
        [alert], behaviour, correlation, attention, resilience, risk,
        {"total_findings": 1 if finding else 0, "findings": [finding] if finding else []},
    )
    prompt = f"""You are the SAT-SA local AI security analyst.

You are analyzing ONE alert from the SAT-SA security monitoring system.
Use ONLY the evidence supplied in the ALERT EVIDENCE section.
Do not invent facts, fields, attacks, IP addresses, usernames, timestamps, or severities.
Do not assume an attack occurred unless the supplied evidence supports that interpretation.
Clearly distinguish observed evidence, security interpretation, and recommended defensive investigation.
Do not change or recalculate deterministic SAT-SA scores; explain them as supplied.
If evidence is insufficient, explicitly say so.
Do not provide offensive attack instructions, exploit commands, payloads, or attack instructions.
Answer directly as a SOC analyst. Do not mention JSON or the prompt format.

Return only valid JSON matching this schema:
{{"what_happened":"...","why_it_matters":"...","evidence":["..."],"risk_interpretation":"...","recommended_actions":["..."],"analyst_note":"..."}}

ALERT EVIDENCE:
{alert_context}
"""
    return _parse_alert_explanation(
        generate_response(prompt, response_format=ALERT_EXPLANATION_SCHEMA)
    )


def _parse_assessment(response):
    if not isinstance(response, str):
        raise OllamaClientError("Ollama returned a malformed assessment.")

    candidate = response.strip()
    fenced = re.search(r"```(?:json)?\s*(\{.*\})\s*```", candidate, re.DOTALL)
    if fenced:
        candidate = fenced.group(1)
    else:
        start, end = candidate.find("{"), candidate.rfind("}")
        if start >= 0 and end > start:
            candidate = candidate[start:end + 1]

    try:
        parsed = json.loads(candidate)
    except (TypeError, json.JSONDecodeError):
        raise OllamaClientError("Ollama returned a malformed assessment.")

    if not isinstance(parsed, dict):
        raise OllamaClientError("Ollama returned a malformed assessment.")

    required = {
        "overall_assessment",
        "detected_security_concerns",
        "evidence",
        "risk_interpretation",
        "recommended_actions",
        "analyst_priority",
    }
    if not required.issubset(parsed):
        raise OllamaClientError("Ollama returned an incomplete assessment.")
    if parsed["analyst_priority"] not in {"LOW", "MEDIUM", "HIGH"}:
        raise OllamaClientError("Ollama returned an invalid assessment priority.")
    if not all(isinstance(parsed[key], list) for key in {
        "detected_security_concerns", "evidence", "recommended_actions"
    }):
        raise OllamaClientError("Ollama returned invalid assessment lists.")
    if not all(isinstance(item, dict) for item in parsed["detected_security_concerns"]):
        raise OllamaClientError("Ollama returned invalid security concerns.")
    for concern in parsed["detected_security_concerns"]:
        if not {"type", "severity", "confidence", "description"}.issubset(concern):
            raise OllamaClientError("Ollama returned incomplete security concerns.")
        if not isinstance(concern["confidence"], (int, float)) or not 0 <= concern["confidence"] <= 1:
            raise OllamaClientError("Ollama returned invalid concern confidence.")
    if not all(isinstance(item, str) for item in parsed["evidence"] + parsed["recommended_actions"]):
        raise OllamaClientError("Ollama returned non-text assessment content.")
    placeholder_text = {
        "no overall assessment available.",
        "no risk interpretation available.",
    }
    if any(parsed[key].strip().lower() in placeholder_text for key in {
        "overall_assessment", "risk_interpretation"
    }):
        raise OllamaClientError("Ollama returned placeholder assessment content.")
    assessment = {key: parsed[key] for key in required}
    return assessment


def analyze_supervisory_data(
    normalized,
    behaviour,
    correlation,
    attention,
    resilience,
    risk,
    findings,
    negative_space=None,
):
    context = _context_text(
        normalized, behaviour, correlation, attention,
        resilience, risk, findings, negative_space,
    )
    prompt = f"""{SYSTEM_PROMPT}

Return only valid JSON matching this schema. The deterministic SAT-SA scores are authoritative; interpret them and do not replace them:
{{"overall_assessment":"...","detected_security_concerns":[{{"type":"...","severity":"...","confidence":0.0,"description":"..."}}],"evidence":[],"risk_interpretation":"...","recommended_actions":[],"analyst_priority":"LOW"}}

SAT-SA processed evidence:
{context}
"""
    return _parse_assessment(generate_response(prompt, response_format=ASSESSMENT_SCHEMA))


def answer_chat_question(
    message,
    normalized,
    behaviour,
    correlation,
    attention,
    resilience,
    risk,
    findings,
    negative_space=None,
):
    context = _context_text(
        normalized, behaviour, correlation, attention,
        resilience, risk, findings, negative_space,
    )
    authoritative_scores = {
        "attention_score": (attention or {}).get("attention_score", 0),
        "resilience_score": (resilience or {}).get("resilience_score", 100),
        "risk_score": (risk or {}).get("overall_risk_score", 0),
    }
    prompt = f"""{SYSTEM_PROMPT}

You are answering a SOC analyst's question about the current SAT-SA state.
Use only the supplied processed evidence. Explain observed evidence separately from inference.
This assistant is only for SAT-SA security analysis. If the question is unrelated to the supplied SAT-SA evidence, say that you can only analyze the available SAT-SA security evidence.
The deterministic scores below are authoritative. Repeat them exactly when relevant; never calculate, replace, or silently change them:
{json.dumps(authoritative_scores, separators=(',', ':'))}

Answer the analyst clearly and concisely in natural language. Do not return JSON, markdown code fences, or describe the prompt/data format. Do not begin with phrases such as "Based on the provided JSON data" or "I will attempt to provide a summary". Explain uncertainty when evidence is insufficient.
Suggest defensive investigation steps only. Do not provide offensive attack instructions.

Analyst question:
{message.strip()}

SAT-SA processed evidence:
{context}
"""
    answer = _chat_text(generate_response(prompt))

    score_line = (
        "Authoritative SAT-SA scores: "
        f"attention={authoritative_scores['attention_score']}, "
        f"resilience={authoritative_scores['resilience_score']}, "
        f"risk={authoritative_scores['risk_score']}."
    )
    return f"{answer}\n\n{score_line}"
