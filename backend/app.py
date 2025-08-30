from flask import Flask, request, jsonify
from scanners.port_scanner import scan_ports
from scanners.xss_scanner import test_xss
from scanners.sqli_scanner import test_sqli
from scanners.cmd_injection import test_command_injection
from scanners.csrf_scanner import test_csrf
from scanners.ssl_scanner import test_ssl

app = Flask(__name__)

@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()
    ip = data["ip"]
    url = data.get("url", f"http://{ip}")

    results = {
        "ip": ip,
        "open_ports": scan_ports(ip),
        "xss": test_xss(url),
        "sqli": test_sqli(url),
        "command_injection": test_command_injection(url),
        "csrf": test_csrf(url),
        "ssl_tls": test_ssl(url)
    }

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
