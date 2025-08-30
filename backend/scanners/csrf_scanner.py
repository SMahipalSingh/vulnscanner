import requests

def test_csrf(url):
    try:
        resp = requests.get(url, timeout=5)
        if "csrf" in resp.text.lower() or "token" in resp.text.lower():
            return {"csrf_protection": True}
        else:
            return {"csrf_protection": False}
    except:
        return {"csrf_protection": "error"}
