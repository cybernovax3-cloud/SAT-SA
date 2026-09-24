from collections import Counter


class BehaviourProfiler:

    def analyze(self, alerts, baseline):

        results = []

        entities = baseline.get("entities", {})

        for alert in alerts:

            agent = alert.get("agent", {})
            agent_id = agent.get("id", "unknown")

            entity = entities.get(agent_id)

            if not entity:
                continue

            rule = alert.get("rule", {})

            severity = rule.get("severity", 0)
            rule_id = str(rule.get("id", "unknown"))
            decoder = alert.get("decoder", "unknown")

            severity_distribution = entity.get(
                "severity_distribution", {}
            )

            rule_distribution = entity.get(
                "rule_distribution", {}
            )

            decoder_distribution = entity.get(
                "decoder_distribution", {}
            )

            # Determine whether this behaviour is already common
            severity_count = severity_distribution.get(
                str(severity), 0
            )

            rule_count = rule_distribution.get(
                rule_id, 0
            )

            decoder_count = decoder_distribution.get(
                decoder, 0
            )

            behaviour = "normal"
            reasons = []

            # Rare severity
            if severity_count <= 2:
                behaviour = "unusual"
                reasons.append(
                    "Rare severity level for this entity"
                )

            # Rare rule
            if rule_count <= 2:
                behaviour = "unusual"
                reasons.append(
                    "Rare rule observed for this entity"
                )

            # Rare decoder
            if decoder_count <= 2:
                behaviour = "unusual"
                reasons.append(
                    "Rare event source observed for this entity"
                )

            # Higher severity deserves additional attention
            if severity >= 7:
                reasons.append(
                    "High-severity Wazuh event"
                )

            results.append({
                "event_id": alert.get("event_id"),
                "timestamp": alert.get("timestamp"),
                "agent_id": agent_id,
                "agent_name": agent.get("name"),
                "agent_ip": agent.get("ip"),
                "rule_id": rule_id,
                "severity": severity,
                "decoder": decoder,
                "behaviour": behaviour,
                "reasons": reasons
            })

        unusual = sum(
            1 for item in results
            if item["behaviour"] == "unusual"
        )

        normal = len(results) - unusual

        return {
            "total_events_analyzed": len(results),
            "normal_events": normal,
            "unusual_events": unusual,
            "profiles": results
        }
