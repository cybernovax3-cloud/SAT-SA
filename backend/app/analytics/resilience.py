class ResilienceAnalytics:

    def calculate(self, behaviour, correlation):

        total_events = behaviour.get(
            "total_events_analyzed", 0
        )

        unusual_events = behaviour.get(
            "unusual_events", 0
        )

        clusters = correlation.get(
            "correlated_clusters", 0
        )

        if total_events == 0:
            return {
                "resilience_score": 100,
                "resilience_level": "high",
                "reasons": []
            }

        unusual_ratio = unusual_events / total_events

        # Start with a fully resilient baseline.
        score = 100

        reasons = []

        # Behavioural deviations reduce resilience.
        deviation_penalty = unusual_ratio * 50
        score -= deviation_penalty

        if unusual_events > 0:
            reasons.append(
                f"{unusual_events} unusual behavioural events "
                "indicate areas requiring monitoring"
            )

        # Correlated events indicate concentrated operational exposure.
        correlation_penalty = min(clusters * 5, 25)
        score -= correlation_penalty

        if clusters > 0:
            reasons.append(
                f"{clusters} correlated evidence cluster(s) "
                "indicate concentrated activity"
            )

        score = max(0, min(round(score), 100))

        if score >= 75:
            level = "high"
        elif score >= 50:
            level = "medium"
        else:
            level = "low"

        return {
            "resilience_score": score,
            "resilience_level": level,
            "reasons": reasons
        }
