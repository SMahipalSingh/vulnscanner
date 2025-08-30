import requests

def test_command_injection(url):
    payloads = ["; ls", "&& whoami", "| dir"]
    vulnerable = False
    findings = []

    for payload in payloads:
        try:
            resp = requests.get(url, params={"test": payload}, timeout=3)
            if any(keyword in resp.text.lower() for keyword in ["root", "admin", "directory", "volume"]):
                vulnerable = True
                findings.append(f"Possible command injection with payload: {payload}")
        except:
            continue

    return {"command_injection": vulnerable, "details": findings}
