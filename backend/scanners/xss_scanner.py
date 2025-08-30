import requests

def test_xss(url):
    payloads = ['<script>alert(1)</script>', '" onmouseover="alert(1)']
    vulnerable = False
    details = []

    for payload in payloads:
        try:
            resp = requests.get(url, params={"q": payload}, timeout=3)
            if payload in resp.text:
                vulnerable = True
                details.append(f"Reflected XSS with payload: {payload}")
        except:
            continue

    return {"xss": vulnerable, "details": details}
