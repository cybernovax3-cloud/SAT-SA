class AttentionAnalytics:

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
                "attention_score": 0,
                "attention_level": "low",
                "reasons": []
            }

        unusual_ratio = unusual_events / total_events

        score = 0
        reasons = []

        # Behaviour deviation
        score += unusual_ratio * 50

        if unusual_events > 0:
            reasons.append(
                f"{unusual_events} unusual behavioural events detected"
            )

        # Correlated evidence
        if clusters > 0:
            score += min(clusters * 10, 30)

            reasons.append(
                f"{clusters} correlated evidence cluster(s) detected"
            )

        score = min(round(score), 100)

        if score >= 70:
            level = "high"
        elif score >= 40:
            level = "medium"
        else:
            level = "low"

        return {
            "attention_score": score,
            "attention_level": level,
            "reasons": reasons
        }
