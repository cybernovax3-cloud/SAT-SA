from collections import Counter


class EntityBaseline:

    def build(self, alerts):
        """
        Build a basic behavioural baseline from normalized SAT-SA alerts.
        """

        if not alerts:
            return {
                "total_events": 0,
                "entities": {},
                "summary": {}
            }

        entity_data = {}

        for alert in alerts:

            agent = alert.get("agent", {})

            agent_id = agent.get("id", "unknown")
            agent_name = agent.get("name", "unknown")
            agent_ip = agent.get("ip", "unknown")

            if agent_id not in entity_data:
                entity_data[agent_id] = {
                    "agent_id": agent_id,
                    "agent_name": agent_name,
                    "agent_ip": agent_ip,
                    "total_events": 0,
                    "severity_distribution": Counter(),
                    "rule_distribution": Counter(),
                    "decoder_distribution": Counter()
                }

            entity = entity_data[agent_id]

            entity["total_events"] += 1

            rule = alert.get("rule", {})

            severity = rule.get("severity")
            rule_id = rule.get("id")

            decoder = alert.get("decoder")

            if severity is not None:
                entity["severity_distribution"][str(severity)] += 1

            if rule_id:
                entity["rule_distribution"][str(rule_id)] += 1

            if decoder:
                entity["decoder_distribution"][decoder] += 1

        # Convert Counter objects to normal dictionaries
        for entity in entity_data.values():

            entity["severity_distribution"] = dict(
                entity["severity_distribution"]
            )

            entity["rule_distribution"] = dict(
                entity["rule_distribution"]
            )

            entity["decoder_distribution"] = dict(
                entity["decoder_distribution"]
            )

        return {
            "total_events": len(alerts),
            "entities": entity_data,
            "summary": {
                "entities_observed": len(entity_data)
            }
        }
