def test_ssl(url):
    if url.startswith("https://"):
        return {"ssl": True}
    else:
        return {"ssl": False}
