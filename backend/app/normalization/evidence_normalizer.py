class EvidenceNormalizer:

    @staticmethod
    def classify_alert_type(alert):
        rule = alert.get("rule", {})
        rule_id = str(rule.get("id") or "")
        description = (rule.get("description") or "").lower()
        
        dec_obj = alert.get("decoder", {})
        decoder = (dec_obj.get("name") if isinstance(dec_obj, dict) else dec_obj or "").lower()
        
        full_log = (alert.get("full_log") or "").lower()

        # 1. User / Group management (check first to avoid 'ping' username collision)
        if rule_id == "5901" or "new group added" in description or "new group:" in full_log:
            return "New Group Created"
        if rule_id == "5902" or "new user added" in description or "new user:" in full_log:
            return "New User Created"
        if rule_id == "5903" or "group (or user) deleted" in description or "delete user" in full_log:
            return "User/Group Deleted"

        # 2. File integrity & Anomaly detection (check before general strings to avoid file path collisions)
        if "rootcheck" in decoder or "rootcheck" in description or rule_id == "510":
            return "Host Anomaly Detection (Rootcheck)"
        if "syscheck" in decoder or "syscheck" in description or rule_id in {"550", "554"}:
            if "file added" in description or rule_id == "554":
                return "System File Added"
            if "integrity checksum changed" in description or rule_id == "550":
                return "System File Integrity Changed"

        # 3. Dpkg packages (check to avoid matching nmap/ping package installation as scans)
        if "dpkg" in decoder or "dpkg-decoder" in decoder or "dpkg" in description:
            return "Software Package Management Event"

        # 4. SSH Authentication Success / Failure / Brute-Force
        ssh_brute_force_rules = {"5712", "5720", "5758"}
        ssh_brute_force_keywords = ["brute force", "multiple connection attempts", "maximum authentication attempts exceeded"]
        if rule_id in ssh_brute_force_rules or any(kw in description for kw in ssh_brute_force_keywords):
            return "SSH Brute-Force Activity"

        if "sshd: authentication success" in description or rule_id == "5715" or ("sshd" in decoder and "accepted password" in full_log):
            return "SSH Authentication Success"

        ssh_auth_rules = {"5710", "5716", "5725", "5760"}
        ssh_auth_keywords = ["authentication failed", "failed password", "attempt to login", "invalid user", "login failed", "authentication failure"]
        if decoder == "sshd" or description.startswith("sshd:") or "sshd" in full_log:
            if rule_id in ssh_auth_rules or any(kw in description for kw in ssh_auth_keywords):
                return "SSH Authentication Failure"

        # 5. PAM Login sessions
        if "pam" in decoder or "pam:" in description:
            if "session opened" in description or rule_id == "5501":
                return "PAM Session Opened"
            if "session closed" in description or rule_id == "5502":
                return "PAM Session Closed"
            if "login failed" in description or rule_id == "5503":
                return "PAM Authentication Failure"

        # 6. Actual Nmap Scanning
        # Must be nmap execution, not installation
        is_apt_install_nmap = "apt" in full_log and "nmap" in full_log
        if ("nmap" in description or "nmap" in decoder or "nmap" in full_log) and not is_apt_install_nmap:
            # Check if it looks like actual scanning or running the command
            if "command=" in full_log and ("nmap" in full_log.split("command=")[-1] or "nping" in full_log.split("command=")[-1]):
                return "Nmap Network Scanning"
            # Or if Wazuh rule specifically mentions scanning
            if "scan" in description or "recon" in description:
                return "Nmap Network Scanning"
            # Fallback if nmap is mentioned in sudo execution command
            if "sudo" in decoder and "nmap" in full_log:
                return "Nmap Network Scanning"

        # 7. ICMP Probing
        # Exclude ping as a username/group (already handled by useradd rules, but be safe)
        is_ping_cmd = "ping" in description or "icmp" in description or "icmp" in decoder or "icmp" in full_log
        if is_ping_cmd:
            # Check if it's command execution of ping or actual ICMP traffic
            if "command=" in full_log and "ping" in full_log.split("command=")[-1]:
                return "ICMP Probing"
            if "icmp" in decoder or "icmp" in full_log or "echo request" in full_log or "echo reply" in full_log:
                return "ICMP Probing"

        # 8. Sudo execution (if not matched by Nmap/ICMP commands above)
        if "sudo" in decoder or "sudo" in description:
            if "successful sudo" in description or rule_id == "5402":
                return "Successful Sudo Execution"
            return "Sudo Activity"

        # 9. Generic Scan / Recon
        if any(term in description for term in ["reconnaissance", "port scanning", "portscan", "network scan", "recon", "scanning", "scan"]):
            return "Network Reconnaissance / Port Scanning"
        if any(term in decoder for term in ["reconnaissance", "port scanning", "portscan", "network scan", "recon", "scanning", "scan"]):
            return "Network Reconnaissance / Port Scanning"

        return "Security Event"

    @staticmethod
    def normalize(alert):

        agent = alert.get("agent", {})
        rule = alert.get("rule", {})
        decoder = alert.get("decoder", {})
        activity_type = EvidenceNormalizer.classify_alert_type(alert)

        return {
            "event_id": alert.get("id"),
            "timestamp": alert.get("timestamp"),

            "source": "wazuh",
            "activity_type": activity_type,

            "agent": {
                "id": agent.get("id"),
                "name": agent.get("name"),
                "ip": agent.get("ip")
            },

            "rule": {
                "id": rule.get("id"),
                "severity": rule.get("level"),
                "description": rule.get("description")
            },

            "decoder": decoder.get("name") if isinstance(decoder, dict) else decoder,

            "location": alert.get("location"),
            "full_log": alert.get("full_log"),

            "evidence_quality": "high"
        }

