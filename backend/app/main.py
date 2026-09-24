from fastapi import FastAPI, Request
from pydantic import BaseModel, validator
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.ingestion.wazuh_client import WazuhIndexer, WazuhIndexerError
from app.normalization.evidence_normalizer import EvidenceNormalizer
from app.profiling.entity_baseline import EntityBaseline
from app.profiling.behaviour_profiler import BehaviourProfiler
from app.correlation.correlation_engine import CorrelationEngine
from app.analytics.attention import AttentionAnalytics
from app.analytics.resilience import ResilienceAnalytics
from app.analytics.risk import RiskAnalytics
from app.analytics.negative_space import NegativeSpaceAnalytics
from app.findings.finding_generator import FindingGenerator
from app.intelligence.intelligence_engine import analyze_supervisory_data, answer_chat_question, explain_alert
from app.intelligence.ollama_client import OllamaClientError, get_model_name

# ============================================================
# EXECUTION GAP DETECTION -- IMPORTS
# ============================================================
from app.execution_gap.gap_engine import ExecutionGapEngine
from app.execution_gap.gap_store import gap_store
from app.intelligence.ollama_client import generate_response, OllamaClientError

gap_engine = ExecutionGapEngine(gap_store)



app = FastAPI(
    title="SAT-SA Backend",
    description="Supervisory Analytics Tool for SOC Assessment",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8005",
        "http://127.0.0.1:8005",
        "http://0.0.0.0:4173",
        "http://0.0.0.0:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(WazuhIndexerError)
async def wazuh_indexer_error_handler(
    request: Request,
    exc: WazuhIndexerError
):
    return JSONResponse(
        status_code=503,
        content={
            "error": "wazuh_indexer_unavailable",
            "message": str(exc),
        },
    )


@app.exception_handler(OllamaClientError)
async def ollama_client_error_handler(request: Request, exc: OllamaClientError):
    return JSONResponse(
        status_code=503,
        content={
            "error": "local_ai_unavailable",
            "message": str(exc),
        },
    )


# ============================================================
# SAT-SA COMPONENT INITIALIZATION
# ============================================================

indexer = WazuhIndexer()

baseline_engine = EntityBaseline()
behaviour_engine = BehaviourProfiler()
correlation_engine = CorrelationEngine()

attention_engine = AttentionAnalytics()
resilience_engine = ResilienceAnalytics()
risk_engine = RiskAnalytics()

finding_generator = FindingGenerator()
negative_space_engine = NegativeSpaceAnalytics()


class ChatRequest(BaseModel):
    message: str

    @validator("message")
    def message_must_not_be_empty(cls, value):
        message = value.strip()
        if not message:
            raise ValueError("message must not be empty")
        if len(message) > 4000:
            raise ValueError("message must not exceed 4000 characters")
        return message


class AlertExplanationRequest(BaseModel):
    alert_id: str

    @validator("alert_id")
    def alert_id_must_not_be_empty(cls, value):
        alert_id = value.strip()
        if not alert_id:
            raise ValueError("alert_id must not be empty")
        if len(alert_id) > 256:
            raise ValueError("alert_id must not exceed 256 characters")
        return alert_id

# ============================================================
# EXECUTION GAP -- REQUEST MODELS
# ============================================================
class GapActionRequest(BaseModel):
    action: str
    analyst: str = "SOC Analyst"
    notes: str = ""

    @validator("action")
    def action_must_be_valid(cls, v):
        valid = {"acknowledge", "investigate", "escalate", "remediate", "close"}
        v = v.strip().lower()
        if v not in valid:
            raise ValueError(f"action must be one of: {sorted(valid)}")
        return v



# ============================================================
# COMMON SAT-SA ANALYTICS PIPELINE
# ============================================================

def build_pipeline(limit: int = 100):

    data = indexer.get_latest_alerts(limit)

    alerts = data.get("hits", {}).get("hits", [])

    normalized = [
        EvidenceNormalizer.normalize(
            item.get("_source", {})
        )
        for item in alerts
    ]

    baseline = baseline_engine.build(
        normalized
    )

    behaviour = behaviour_engine.analyze(
        normalized,
        baseline
    )

    correlation = correlation_engine.correlate(
        normalized
    )

    attention = attention_engine.calculate(
        behaviour,
        correlation
    )

    resilience = resilience_engine.calculate(
        behaviour,
        correlation
    )

    risk = risk_engine.calculate(
        normalized,
        behaviour,
        correlation,
        resilience
    )

    return {
        "normalized": normalized,
        "behaviour": behaviour,
        "correlation": correlation,
        "attention": attention,
        "resilience": resilience,
        "risk": risk,
    }


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "system": "SAT-SA",
        "status": "running"
    }


# ============================================================
# ALERTS
# ============================================================

@app.get("/api/alerts")
def get_alerts(limit: int = 10):

    data = indexer.get_latest_alerts(limit)

    alerts = data.get("hits", {}).get("hits", [])

    normalized = []

    for item in alerts:

        alert = item.get(
            "_source",
            {}
        )

        normalized.append(
            EvidenceNormalizer.normalize(
                alert
            )
        )

    return {
        "total": len(normalized),
        "alerts": normalized
    }


# ============================================================
# BASELINE
# ============================================================

@app.get("/api/baseline")
def get_baseline(limit: int = 100):

    data = indexer.get_latest_alerts(limit)

    alerts = data.get(
        "hits",
        {}
    ).get(
        "hits",
        []
    )

    normalized = []

    for item in alerts:

        alert = item.get(
            "_source",
            {}
        )

        normalized.append(
            EvidenceNormalizer.normalize(
                alert
            )
        )

    baseline = baseline_engine.build(
        normalized
    )

    return baseline


# ============================================================
# BEHAVIOUR
# ============================================================

@app.get("/api/behaviour")
def get_behaviour(limit: int = 100):

    data = indexer.get_latest_alerts(limit)

    alerts = data.get(
        "hits",
        {}
    ).get(
        "hits",
        []
    )

    normalized = []

    for item in alerts:

        alert = item.get(
            "_source",
            {}
        )

        normalized.append(
            EvidenceNormalizer.normalize(
                alert
            )
        )

    baseline = baseline_engine.build(
        normalized
    )

    behaviour = behaviour_engine.analyze(
        normalized,
        baseline
    )

    return behaviour


# ============================================================
# CORRELATION
# ============================================================

@app.get("/api/correlation")
def get_correlation(limit: int = 100):

    data = indexer.get_latest_alerts(limit)

    alerts = data.get(
        "hits",
        {}
    ).get(
        "hits",
        []
    )

    normalized = []

    for item in alerts:

        alert = item.get(
            "_source",
            {}
        )

        normalized.append(
            EvidenceNormalizer.normalize(
                alert
            )
        )

    correlations = correlation_engine.correlate(
        normalized
    )

    return correlations


# ============================================================
# ATTENTION ANALYTICS
# ============================================================

@app.get("/api/analytics/attention")
def get_attention(limit: int = 100):

    pipeline = build_pipeline(
        limit
    )

    return pipeline["attention"]


# ============================================================
# RESILIENCE ANALYTICS
# ============================================================

@app.get("/api/analytics/resilience")
def get_resilience(limit: int = 100):

    pipeline = build_pipeline(
        limit
    )

    return pipeline["resilience"]


# ============================================================
# RISK ANALYTICS
# ============================================================

@app.get("/api/analytics/risk")
def get_risk(limit: int = 100):

    pipeline = build_pipeline(
        limit
    )

    return pipeline["risk"]


# ============================================================
# NEGATIVE SPACE ANALYTICS
# ============================================================

@app.get("/api/analytics/negative-space")
def get_negative_space(limit: int = 100):
    """
    Analyse the current normalized event window and return evidence gaps
    (what is absent, silent, or unexpectedly quiet).
    """
    pipeline = build_pipeline(limit)
    result = negative_space_engine.calculate(pipeline["normalized"])
    return result


# ============================================================
# FINDINGS
# ============================================================

@app.get("/api/findings")
def get_findings(limit: int = 100):

    pipeline = build_pipeline(
        limit
    )

    findings = finding_generator.generate(
        pipeline["normalized"],
        pipeline["behaviour"],
        pipeline["correlation"],
        pipeline["attention"],
        pipeline["resilience"],
        pipeline["risk"]
    )

    return findings


# ============================================================
# STANDARD SUPERVISORY ASSESSMENT
# ============================================================

@app.get("/api/supervisory/assessment")
def get_supervisory_assessment(
    limit: int = 100
):

    pipeline = build_pipeline(
        limit
    )

    findings = finding_generator.generate(
        pipeline["normalized"],
        pipeline["behaviour"],
        pipeline["correlation"],
        pipeline["attention"],
        pipeline["resilience"],
        pipeline["risk"]
    )

    attention_score = pipeline[
        "attention"
    ].get(
        "attention_score",
        0
    )

    risk_score = pipeline[
        "risk"
    ].get(
        "overall_risk_score",
        0
    )

    maximum_score = max(
        attention_score,
        risk_score
    )

    if maximum_score >= 70:

        priority = "high"

    elif maximum_score >= 40:

        priority = "medium"

    else:

        priority = "low"

    return {

        "assessment": {

            "overall_attention": attention_score,

            "overall_resilience": pipeline[
                "resilience"
            ].get(
                "resilience_score",
                100
            ),

            "overall_risk": risk_score,

            "priority": priority,

            "summary": (
                f"Supervisory priority is {priority} "
                f"with {findings['total_findings']} finding(s) "
                f"supported by "
                f"{len(pipeline['normalized'])} event(s)."
            ),
        },

        "findings": findings[
            "findings"
        ],

        "evidence": pipeline[
            "normalized"
        ],
    }


# ============================================================
# OLLAMA AI SUPERVISORY ASSESSMENT
# ============================================================

@app.get("/api/supervisory/ai-assessment")
def get_ai_supervisory_assessment(
    limit: int = 100
):

    # --------------------------------------------------------
    # 1. Run existing SAT-SA deterministic analytics
    # --------------------------------------------------------

    pipeline = build_pipeline(
        limit
    )

    # --------------------------------------------------------
    # 2. Generate SAT-SA findings
    # --------------------------------------------------------

    findings = finding_generator.generate(
        pipeline["normalized"],
        pipeline["behaviour"],
        pipeline["correlation"],
        pipeline["attention"],
        pipeline["resilience"],
        pipeline["risk"]
    )

    # --------------------------------------------------------
    # 3. Send processed evidence to local Ollama
    # --------------------------------------------------------

    negative_space_result = negative_space_engine.calculate(pipeline["normalized"])

    ai_assessment = analyze_supervisory_data(

        normalized=pipeline[
            "normalized"
        ],

        behaviour=pipeline[
            "behaviour"
        ],

        correlation=pipeline[
            "correlation"
        ],

        attention=pipeline[
            "attention"
        ],

        resilience=pipeline[
            "resilience"
        ],

        risk=pipeline[
            "risk"
        ],

        findings=findings,

        negative_space=negative_space_result,
    )

    # --------------------------------------------------------
    # 4. Return AI assessment + source information
    # --------------------------------------------------------

    return {

        "ai_assessment": ai_assessment,

        "model": get_model_name(),

        "source": {

            "events_analyzed": len(
                pipeline["normalized"]
            ),

            "findings": findings[
                "total_findings"
            ],

            "attention_score": pipeline[
                "attention"
            ].get(
                "attention_score",
                0
            ),

            "resilience_score": pipeline[
                "resilience"
            ].get(
                "resilience_score",
                100
            ),

            "risk_score": pipeline[
                "risk"
            ].get(
                "overall_risk_score",
                0
            )
        }
    }


# ============================================================
# SAT-SA AI CHAT ASSISTANT
# ============================================================

@app.post("/api/ai/chat")
def post_ai_chat(request: ChatRequest, limit: int = 100):
    pipeline = build_pipeline(limit)

    findings = finding_generator.generate(
        pipeline["normalized"],
        pipeline["behaviour"],
        pipeline["correlation"],
        pipeline["attention"],
        pipeline["resilience"],
        pipeline["risk"],
    )

    negative_space_result = negative_space_engine.calculate(pipeline["normalized"])

    answer = answer_chat_question(
        message=request.message,
        normalized=pipeline["normalized"],
        behaviour=pipeline["behaviour"],
        correlation=pipeline["correlation"],
        attention=pipeline["attention"],
        resilience=pipeline["resilience"],
        risk=pipeline["risk"],
        findings=findings,
        negative_space=negative_space_result,
    )

    return {
        "answer": answer,
        "model": get_model_name(),
        "source": {
            "events_analyzed": len(pipeline["normalized"]),
            "findings": findings["total_findings"],
            "attention_score": pipeline["attention"].get("attention_score", 0),
            "resilience_score": pipeline["resilience"].get("resilience_score", 100),
            "risk_score": pipeline["risk"].get("overall_risk_score", 0),
        },
    }


@app.post("/api/ai/alert-explanation")
def post_ai_alert_explanation(request: AlertExplanationRequest, limit: int = 100):
    pipeline = build_pipeline(limit)
    alert = next(
        (item for item in pipeline["normalized"]
         if str(item.get("event_id")) == request.alert_id),
        None,
    )
    if not alert:
        raise WazuhIndexerError(
            "Alert evidence could not be retrieved from the active assessment window."
        )

    findings = finding_generator.generate(
        pipeline["normalized"],
        pipeline["behaviour"],
        pipeline["correlation"],
        pipeline["attention"],
        pipeline["resilience"],
        pipeline["risk"],
    )
    finding = next(
        (item for item in findings["findings"]
         if request.alert_id in item.get("evidence_references", [])),
        None,
    )
    explanation = explain_alert(
        alert=alert,
        behaviour=pipeline["behaviour"],
        correlation=pipeline["correlation"],
        attention=pipeline["attention"],
        resilience=pipeline["resilience"],
        risk=pipeline["risk"],
        finding=finding,
    )
    return {
        "alert_id": request.alert_id,
        "explanation": explanation,
        "source": {
            "rule_id": alert.get("rule", {}).get("id"),
            "severity": alert.get("rule", {}).get("severity"),
            "decoder": alert.get("decoder"),
            "agent": alert.get("agent", {}).get("name") or alert.get("agent", {}).get("id"),
        },
        "model": get_model_name(),
    }


# ============================================================
# EXECUTION GAP DETECTION API
# ============================================================

def _build_gap_incidents(normalized: list) -> list:
    """Convert normalized alerts into execution-gap incident analyses."""
    results = []
    for alert in normalized:
        incident_id = alert.get("event_id") or alert.get("rule", {}).get("id", "unknown")
        if not incident_id:
            continue
        incident_id = str(incident_id)
        alert_type = alert.get("rule", {}).get("description") or "Unknown Alert"
        severity_level = alert.get("rule", {}).get("severity") or 0
        activity_type = alert.get("activity_type")
        result = gap_engine.analyze_incident(
            incident_id=incident_id,
            alert_type=alert_type,
            severity_level=severity_level,
            activity_type=activity_type,
        )
        result["agent"] = alert.get("agent", {})
        result["timestamp"] = alert.get("timestamp")
        results.append(result)
    return results


@app.get("/api/execution-gaps")
def get_execution_gaps(limit: int = 100):
    """
    List all execution gap analyses for current Wazuh alerts.
    Reads alert data read-only; does NOT modify any existing pipeline.
    """
    data = indexer.get_latest_alerts(limit)
    alerts = data.get("hits", {}).get("hits", [])
    normalized = [EvidenceNormalizer.normalize(item.get("_source", {})) for item in alerts]
    incidents = _build_gap_incidents(normalized)
    stats = gap_engine.build_statistics(incidents)
    return {
        "total": len(incidents),
        "incidents": incidents,
        "statistics": stats,
    }


@app.get("/api/execution-gaps/statistics")
def get_execution_gap_statistics(limit: int = 100):
    """Return aggregated statistics across all execution gap analyses."""
    data = indexer.get_latest_alerts(limit)
    alerts = data.get("hits", {}).get("hits", [])
    normalized = [EvidenceNormalizer.normalize(item.get("_source", {})) for item in alerts]
    incidents = _build_gap_incidents(normalized)
    return gap_engine.build_statistics(incidents)


@app.get("/api/execution-gaps/{incident_id}")
def get_execution_gap_detail(incident_id: str, limit: int = 100):
    """Return the execution gap analysis for a specific incident."""
    data = indexer.get_latest_alerts(limit)
    alerts = data.get("hits", {}).get("hits", [])
    normalized = [EvidenceNormalizer.normalize(item.get("_source", {})) for item in alerts]

    # Find the matching alert by event_id
    alert = next(
        (a for a in normalized if str(a.get("event_id", "")) == incident_id),
        None,
    )
    if alert is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Incident not found in current alert window.")

    result = gap_engine.analyze_incident(
        incident_id=incident_id,
        alert_type=alert.get("rule", {}).get("description") or "Unknown Alert",
        severity_level=alert.get("rule", {}).get("severity") or 0,
        activity_type=alert.get("activity_type"),
    )
    result["agent"] = alert.get("agent", {})
    result["timestamp"] = alert.get("timestamp")
    return result


@app.post("/api/execution-gaps/{incident_id}/actions")
def record_gap_action(incident_id: str, request: GapActionRequest):
    """Record an analyst action for a specific incident."""
    entry = gap_store.record_action(
        incident_id=incident_id,
        action=request.action,
        analyst=request.analyst,
        notes=request.notes,
    )
    return {
        "incident_id": incident_id,
        "recorded": entry,
        "message": f"Action '{request.action}' recorded for incident {incident_id}.",
    }


@app.post("/api/execution-gaps/{incident_id}/ai-assessment")
def get_gap_ai_assessment(incident_id: str, limit: int = 100):
    """
    Request an isolated AI assessment of the execution gap for this incident.
    Uses only structured gap data -- does NOT modify existing Ollama integration.
    """
    data = indexer.get_latest_alerts(limit)
    alerts = data.get("hits", {}).get("hits", [])
    normalized = [EvidenceNormalizer.normalize(item.get("_source", {})) for item in alerts]

    alert = next(
        (a for a in normalized if str(a.get("event_id", "")) == incident_id),
        None,
    )
    if alert is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Incident not found in current alert window.")

    gap_result = gap_engine.analyze_incident(
        incident_id=incident_id,
        alert_type=alert.get("rule", {}).get("description") or "Unknown Alert",
        severity_level=alert.get("rule", {}).get("severity") or 0,
        activity_type=alert.get("activity_type"),
    )

    prompt = (
        "You are a SOC analyst assistant. Analyze this execution gap using ONLY the data provided.\n\n"
        f"Alert: {gap_result['alert_type']}\n"
        f"Activity Type: {gap_result['activity_type']}\n"
        f"Severity: {gap_result['severity']} (level {gap_result['severity_level']})\n"
        f"Expected Actions: {', '.join(gap_result['expected_actions'])}\n"
        f"Completed Actions: {', '.join(gap_result['completed_actions']) or 'none'}\n"
        f"Missing Actions: {', '.join(gap_result['missing_actions']) or 'none'}\n"
        f"Gap Types: {', '.join(gap_result['gap_types']) or 'none'}\n\n"
        "Explain:\n"
        "1. What happened based on the alert type\n"
        "2. What SOC actions were expected\n"
        "3. Which actions were completed\n"
        "4. Which actions are missing and why they matter\n"
        "5. What the analyst should verify next\n\n"
        "Do not invent events, users, timestamps, or conclusions not supported by the supplied data.\n"
        "Label your response as an AI Assessment, not authoritative evidence."
    )

    analysis = generate_response(prompt)
    return {
        "incident_id": incident_id,
        "analysis": analysis,
        "gap_summary": {
            "expected_actions": gap_result["expected_actions"],
            "completed_actions": gap_result["completed_actions"],
            "missing_actions": gap_result["missing_actions"],
            "execution_gap": gap_result["execution_gap"],
        },
    }
