from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()
app = Flask(__name__)
CORS(app)

BODY_PART_MAPPING = {
    "left_elbow": "left elbow (lateral epicondyle)",
    "right_knee": "right knee (patellar region)",
    "left_shoulder": "left shoulder (glenohumeral joint)",
    "upper_arm": "upper arm (biceps/triceps region)",
}

@app.route('/diagnose', methods=['POST'])
def diagnose():
    try:
        api_key = os.getenv('OPENROUTER_API_KEY')
        if not api_key:
            logger.error("OPENROUTER_API_KEY is not set in .env")
            return jsonify({"error": "Server configuration error: API key missing"}), 500

        data = request.json
        if not data or 'locations' not in data:
            logger.error("Invalid request data: %s", data)
            return jsonify({"error": "Invalid request: 'locations' is required"}), 400

        body_parts = [BODY_PART_MAPPING.get(loc, loc) for loc in data['locations']]
        body_parts_str = ", ".join(body_parts)
        logger.debug("Processing diagnosis for body parts: %s", body_parts_str)

        prompt = f"""
        You are a board-certified physician with expertise in clinical diagnosis, tasked with providing a precise, evidence-based diagnosis for a patient. Based on the following patient information, provide the single most probable diagnosis along with a detailed explanation of your clinical reasoning and actionable recommendations for the patient.

        ### Patient Information:
        - Pain locations: {body_parts_str}
        - Pain type: {data.get('painType', 'unspecified')}
        - Duration: {data.get('duration', 'unknown')}
        - Severity (1-10): {data.get('severity', '1')}
        - Additional symptoms: {data.get('additional', 'none')}
        - Extra details: {data.get('extraDetails', 'none')}
        - Medical history: {data.get('medicalHistory', 'none')}
        - Age: {data.get('age', 'unspecified')}
        - Gender: {data.get('gender', 'unspecified')}
        - Does the pain worsen with movement?: {data.get('followUpAnswer', 'unspecified')}

        ### Instructions:
        1. **Analyze All Inputs Thoroughly**:
           - Carefully evaluate every piece of information provided: pain locations, type, duration, severity, additional symptoms, extra details, medical history, age, gender, and follow-up answer.
           - Ensure anatomical accuracy for the specified pain locations. For example:
             - Pain in the "right knee (patellar region)" should focus on knee-specific conditions like patellar tendinitis, not unrelated areas like the hip.
             - Pain in the "left shoulder (glenohumeral joint)" should focus on shoulder-specific conditions like rotator cuff tendinitis, not lower arm issues.
           - Use pain type to differentiate conditions (e.g., sharp pain may indicate an acute injury like a tear, while dull pain may suggest chronic inflammation).
           - Assess duration to determine chronicity (e.g., pain for weeks may indicate a chronic condition like osteoarthritis).
           - Evaluate severity to gauge urgency (e.g., severity 8-10 with fever may suggest an infection requiring immediate attention).
           - Incorporate additional symptoms and extra details to refine the diagnosis (e.g., swelling may indicate inflammation, fever may suggest infection).
           - Use medical history to identify risk factors (e.g., previous injuries may suggest a recurrent issue).
           - Consider age and gender to adjust likelihood (e.g., osteoarthritis is more common in older adults, fibromyalgia is more prevalent in females).
           - Use the follow-up answer to narrow down causes (e.g., pain worsening with movement suggests a musculoskeletal issue like a strain).

        2. **Provide the Most Probable Diagnosis**:
           - Identify the single most likely diagnosis based on the provided information.
           - Do not provide a differential diagnosis with multiple options; focus only on the most probable condition.
           - Ensure the diagnosis is clinically plausible and aligns with the anatomical location and symptoms.

        3. **Explain Clinical Reasoning**:
           - Provide a detailed explanation of your reasoning, referencing specific patient inputs.
           - Example: "The patient presents with sharp pain in the right knee (patellar region) for 3 days, with a severity of 7 and swelling. The pain worsens with movement, suggesting a musculoskeletal issue. Given the location and symptoms, the most likely diagnosis is **patellar tendinitis**, likely due to overuse or acute stress on the patellar tendon."
           - Highlight any red flags (e.g., "The presence of fever alongside high-severity pain raises concern for a possible infection, warranting urgent evaluation.").

        4. **Provide Actionable Recommendations**:
           - Offer clear, safe, and practical recommendations for the patient, suitable for non-medical individuals.
           - Tailor recommendations to the severity of the condition (e.g., for high severity, recommend seeking medical attention; for low severity, suggest home care like rest or ice).
           - Include specific steps (e.g., "Apply ice for 15 minutes every 2 hours to reduce swelling") and general advice (e.g., "Avoid activities that exacerbate the pain, such as running").
           - If red flags are present, emphasize the need for professional evaluation (e.g., "Due to the high severity and fever, seek immediate medical attention to rule out infection.").

        5. **Training Examples**:
           - **Example 1 (Acute Injury)**:
             - Input: Sharp pain in the right knee (patellar region) for 3 days, severity 7, swelling present, age 25, gender male, pain worsens with movement, no medical history.
             - Output:
               - Diagnosis: "**Patellar tendinitis** - The patient presents with sharp pain in the patellar region for 3 days, with a severity of 7 and swelling. The pain worsens with movement, indicating a likely musculoskeletal injury. Given the location and symptoms, patellar tendinitis is the most probable diagnosis, likely due to overuse or acute stress on the patellar tendon."
               - Recommendations: "Rest the knee and avoid activities like running or jumping. Apply ice for 15 minutes every 2 hours to reduce swelling. If pain persists beyond a week or worsens, consult a healthcare provider for further evaluation."
           - **Example 2 (Chronic Condition)**:
             - Input: Dull pain in the left shoulder (glenohumeral joint) for 2 months, severity 4, stiffness present, age 60, gender female, history of arthritis, pain worsens with movement.
             - Output:
               - Diagnosis: "**Shoulder osteoarthritis** - The patient presents with dull pain in the left shoulder for 2 months, with a severity of 4 and stiffness. The pain worsens with movement, and the patient has a history of arthritis. Given the age, chronicity, and symptoms, shoulder osteoarthritis is the most likely diagnosis, affecting the glenohumeral joint."
               - Recommendations: "Apply heat to the shoulder for 15 minutes daily to reduce stiffness. Perform gentle range-of-motion exercises, avoiding painful movements. Consult a physician for possible imaging or anti-inflammatory medication if symptoms persist."
           - **Example 3 (Systemic Issue)**:
             - Input: Aching pain in multiple locations (left shoulder, right knee) for 6 weeks, severity 5, fatigue present, age 40, gender female, no medical history, pain unchanged with movement.
             - Output:
               - Diagnosis: "**Fibromyalgia** - The patient presents with aching pain in multiple locations (left shoulder and right knee) for 6 weeks, with a severity of 5 and fatigue. The pain does not change with movement, suggesting a non-musculoskeletal etiology. Given the widespread pain, fatigue, age, and gender, fibromyalgia is the most likely diagnosis, a chronic condition often seen in females in this age group."
               - Recommendations: "Maintain a regular sleep schedule and reduce stress through relaxation techniques. Consider gentle exercise like walking or yoga to improve symptoms. Consult a rheumatologist for a comprehensive evaluation and possible medication to manage fibromyalgia."
           - **Example 4 (Red Flag Case)**:
             - Input: Severe pain in the upper arm (biceps/triceps region) for 2 days, severity 9, fever present, age 35, gender male, history of recent trauma, pain worsens with movement.
             - Output:
               - Diagnosis: "**Possible deep tissue infection (cellulitis or abscess)** - The patient presents with severe pain in the upper arm for 2 days, with a severity of 9 and fever. The pain worsens with movement, and there is a history of recent trauma. The combination of high severity, fever, and trauma raises concern for a deep tissue infection such as cellulitis or an abscess, which requires urgent evaluation."
               - Recommendations: "Seek immediate medical attention at an emergency department to rule out infection. Do not delay, as fever and severe pain may indicate a serious condition requiring antibiotics or surgical intervention. Avoid using the arm until evaluated by a healthcare provider."

        ### Output Format:
        Return your response in the following JSON format:
        {{
          "diagnosis": "**Condition** - Detailed clinical reasoning referencing specific patient inputs.",
          "recommendations": "Specific, safe steps for the patient to follow, tailored to the severity and condition."
        }}
        Ensure the condition name in the diagnosis is wrapped in ** markers (e.g., **Patellar tendinitis**) to indicate it should be highlighted in the frontend. The response must be concise yet detailed, professional, and suitable for a non-medical audience.
        """

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct:free",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5,
            "max_tokens": 800
        }

        logger.debug("Sending request to OpenRouter API")
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            logger.error("OpenRouter API failed: %s %s", response.status_code, response.text)
            return jsonify({"error": f"OpenRouter API failed: ${response.status_code} ${response.text}"}), 500

        result = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
        if not result:
            logger.error("Empty response from OpenRouter API")
            return jsonify({"error": "Empty response from API"}), 500

        logger.debug("API response: %s", result)
        try:
            import json
            parsed_result = json.loads(result)
            if not isinstance(parsed_result, dict) or 'diagnosis' not in parsed_result or 'recommendations' not in parsed_result:
                raise ValueError("Invalid JSON structure: missing 'diagnosis' or 'recommendations'")
            if not parsed_result['diagnosis'] or not parsed_result['recommendations']:
                raise ValueError("Invalid JSON content: 'diagnosis' or 'recommendations' is empty")
            return jsonify(parsed_result)
        except json.JSONDecodeError as e:
            logger.error("JSON parsing error: %s", e)
            return jsonify({
                "diagnosis": "Unable to parse diagnosis due to an internal error.",
                "recommendations": "Please consult a healthcare professional for personalized advice."
            }), 200
        except ValueError as e:
            logger.error("Invalid JSON structure: %s", e)
            return jsonify({
                "diagnosis": "Unable to parse diagnosis due to an internal error.",
                "recommendations": "Please consult a healthcare professional for personalized advice."
            }), 200

    except Exception as e:
        logger.error("Unexpected error: %s", str(e), exc_info=True)
        return jsonify({"error": f"Server error: ${str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)