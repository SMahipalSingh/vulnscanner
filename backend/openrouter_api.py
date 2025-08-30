import os
import requests
import json
import re

# Read from env variable called "OPENROUTER_API_KEY"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# (for testing, you can fallback to hardcoded key if env var is missing)
if not OPENROUTER_API_KEY:
    OPENROUTER_API_KEY = "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"

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def extract_json(raw_text):
    """
    Extracts the first JSON object from the raw text output of the LLM.
    Returns a dict if successful, or an error dict otherwise.
    """
    match = re.search(r'(\{.*\})', raw_text, re.DOTALL)
    if match:
        json_str = match.group(1)
        try:
            return json.loads(json_str)
        except Exception as e:
            return {"error": f"AI JSON parse error: {e}", "raw_output": raw_text}
    return {"error": "No JSON block found", "raw_output": raw_text}

def get_openrouter_suggestions(scan_results, model="gpt-3.5-turbo"):
    prompt = f"""
You are a cybersecurity expert.
Analyze the following scan results and do 2 things:
1. List detected vulnerabilities with recommendations.
2. Provide an overall security score out of 10 (where 10 = perfect security).

Scan Results:
{json.dumps(scan_results, indent=2)}

IMPORTANT: Only respond with a valid, minified JSON object. Do NOT output any explanation, markdown, headings, or extra text.
Format:
{{"vulnerabilities": [...], "recommendations": [...], "security_score": 7}}
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
                ai_raw = data["choices"][0]["message"]["content"]
                return extract_json(ai_raw)
            return {"error": "No choices returned from OpenRouter"}
        else:
            return {"error": f"OpenRouter API error {response.status_code}: {response.text}"}
    except Exception as e:
        return {"error": str(e)}
