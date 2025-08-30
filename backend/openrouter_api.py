import os
import requests
import json

# Read from env variable called "OPENROUTER_API_KEY"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# (for testing, you can fallback to hardcoded key if env var is missing)
if not OPENROUTER_API_KEY:
    OPENROUTER_API_KEY = "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"

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def get_openrouter_suggestions(scan_results, model="gpt-3.5-turbo"):
    prompt = f"""
    You are a cybersecurity expert.
    Analyze the following scan results and do 2 things:
    1. List detected vulnerabilities with recommendations.
    2. Provide an overall security score out of 10 (where 10 = perfect security).
    
    Scan Results:
    {json.dumps(scan_results, indent=2)}

    Format your response in JSON with keys:
    - "vulnerabilities": [list of issues]
    - "recommendations": [list of fixes]
    - "security_score": (number out of 10)
    """

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                # Try parsing AI response as JSON
                try:
                    return json.loads(data["choices"][0]["message"]["content"])
                except:
                    return {"raw_output": data["choices"][0]["message"]["content"]}
            return {"error": "No choices returned from OpenRouter"}
        else:
            return {"error": f"OpenRouter API error {response.status_code}: {response.text}"}
    except Exception as e:
        return {"error": str(e)}