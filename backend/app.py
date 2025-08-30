from flask import Flask, request, jsonify
from flask_cors import CORS  
from scanners.port_scanner import scan_ports
from scanners.xss_scanner import test_xss
from scanners.sqli_scanner import test_sqli
from scanners.cmd_injection import test_command_injection
from scanners.csrf_scanner import test_csrf
from scanners.ssl_scanner import test_ssl
from openrouter_api import get_openrouter_suggestions

app = Flask(__name__)
CORS(app)  # ✅ Allow all origins (frontend can now hit backend)

@app.route("/scan", methods=["POST"])
def scan():
    try:
        data = request.get_json()
        ip = data.get("ip", "").strip()
        url = data.get("url", "").strip()

        # If IP is given but no URL → convert IP into an http:// target
        if ip and not url:
            url = f"http://{ip}"

        if not ip and not url:
            return jsonify({"error": "No IP or URL provided"}), 400

        # 🔍 Run all scanners
        results = {
            "ip": ip,
            "target_url": url,
            "open_ports": scan_ports(ip) if ip else [],
            "xss": test_xss(url) if url else None,
            "sqli": test_sqli(url) if url else None,
            "command_injection": test_command_injection(url) if url else None,
            "csrf": test_csrf(url) if url else None,
            "ssl_tls": test_ssl(url) if url else None,
        }

        # 🤖 Get AI-powered suggestions & score
        ai_suggestions = get_openrouter_suggestions(results)

        # Make sure always returns expected keys for frontend robustness
        if isinstance(ai_suggestions, dict):
            ai_suggestions.setdefault("vulnerabilities", [])
            ai_suggestions.setdefault("recommendations", [])
            ai_suggestions.setdefault("security_score", None)

        return jsonify({
            "success": True,
            "scan_results": results,
            "ai_suggestions": ai_suggestions
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
