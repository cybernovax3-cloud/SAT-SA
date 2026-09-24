from collections import defaultdict


class CorrelationEngine:

    def correlate(self, alerts):

        groups = defaultdict(list)

        for alert in alerts:

            agent = alert.get("agent", {})

            agent_id = agent.get("id", "unknown")

            groups[agent_id].append(alert)

        clusters = []

        for agent_id, events in groups.items():

            if len(events) < 2:
                continue

            severities = [
                event.get("rule", {}).get("severity", 0)
                for event in events
            ]

            rules = list({
                str(event.get("rule", {}).get("id"))
                for event in events
            })

            decoders = list({
                event.get("decoder")
                for event in events
                if event.get("decoder")
            })

            high_severity_events = [
                event
                for event in events
                if event.get("rule", {}).get("severity", 0) >= 7
            ]

            clusters.append({
                "entity": {
                    "agent_id": agent_id,
                    "agent_name": events[0].get("agent", {}).get("name"),
                    "agent_ip": events[0].get("agent", {}).get("ip")
                },

                "event_count": len(events),

                "rule_ids": rules,

                "decoders": decoders,

                "maximum_severity": max(severities),

                "high_severity_count": len(high_severity_events),

                "event_ids": [
                    event.get("event_id")
                    for event in events
                ],

                "correlation_reason": (
                    "Multiple security events observed "
                    "for the same entity"
                )
            })

        return {
            "total_events": len(alerts),
            "correlated_clusters": len(clusters),
            "clusters": clusters
        }
