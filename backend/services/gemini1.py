"""
Gemini API health analysis module
Analyzes health parameters and provides comprehensive health report
"""
import os
import requests
import json
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY_1')

def analyze_health_data(health_data):
    """
    Analyze health parameters using Gemini API
    
    Args:
        health_data (dict): Health parameters (either from frontend or extracted from PDF)
        
    Returns:
        flask.Response: JSON response with health analysis
    """
    from flask import jsonify
    
    # If API key is missing, return an error
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY_1 environment variable not set")
        return jsonify({
            "success": False,
            "error": "Gemini API key not configured"
        }), 500
    
    # Log the incoming data for debugging
    print(f"Analyzing health data: {json.dumps(health_data, indent=2)}")
    
    # Construct the prompt for Gemini API
    prompt = f"""
    Please provide a comprehensive health report based on the following parameters:
    
    Blood Pressure: {health_data.get('bloodPressure', 'Not Provided')} mmHg
    Blood Glucose: {health_data.get('glucose', 'Not Provided')} mg/dL
    Hemoglobin: {health_data.get('hemoglobin', 'Not Provided')} g/dL
    Total Cholesterol: {health_data.get('cholesterol', 'Not Provided')} mg/dL
    HDL Cholesterol: {health_data.get('hdl', 'Not Provided')} mg/dL
    LDL Cholesterol: {health_data.get('ldl', 'Not Provided')} mg/dL
    White Blood Cell Count: {health_data.get('wbc', 'Not Provided')} cells/µL
    Platelets: {health_data.get('platelets', 'Not Provided')} cells/µL
    
    Return your response as a JSON object with the following format:
    {{
      "overallAssessment": "Text describing the overall assessment in 3-4 lines",
      "potentialRisks": ["Risk 1 with detailed explanation (2-3 sentences)", "Risk 2 with detailed explanation (2-3 sentences)", "Risk 3 with detailed explanation (2-3 sentences)"],
      "possibleCauses": ["Detailed explanation of possible cause 1 (2-3 sentences)", "Detailed explanation of possible cause 2 (2-3 sentences)", "Detailed explanation of possible cause 3 (2-3 sentences)"],
      "lifestyleChanges": ["Detailed lifestyle change recommendation 1 (2-3 sentences)", "Detailed lifestyle change recommendation 2 (2-3 sentences)", "Detailed lifestyle change recommendation 3 (2-3 sentences)"],
      "potentialSupplements": ["Detailed supplement recommendation 1 with dosage and benefits (2-3 sentences)", "Detailed supplement recommendation 2 with dosage and benefits (2-3 sentences)", "Detailed supplement recommendation 3 with dosage and benefits (2-3 sentences)"],
      "additionalRecommendations": ["Detailed additional recommendation 1 (2-3 sentences)", "Detailed additional recommendation 2 (2-3 sentences)", "Detailed additional recommendation 3 (2-3 sentences)"]
    }}
    
    For each section, provide comprehensive and detailed explanations. For the lists (potentialRisks, possibleCauses, lifestyleChanges, potentialSupplements, and additionalRecommendations), make each item 2-3 sentences long with specific and actionable information based on the provided health parameters.
    
    For the potentialSupplements section, include both general supplements that could be beneficial (like protein, creatine, multivitamins, etc.) as well as specific supplements that address potential issues indicated by the health parameters.
    """
    
    # Set up request for Gemini API
    try:
        print("Sending health data to Gemini API for analysis...")
        
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048
                }
            }
        )
        
        # Check if request was successful
        response.raise_for_status()
        data = response.json()
        
        # Extract the response from Gemini's data structure
        if (data.get('candidates') and
            len(data['candidates']) > 0 and
            data['candidates'][0].get('content') and
            data['candidates'][0]['content'].get('parts') and
            len(data['candidates'][0]['content']['parts']) > 0):
            
            generated_text = data['candidates'][0]['content']['parts'][0].get('text', '')
            
            # Try to parse the JSON response
            try:
                # Find JSON in the response (in case there's additional text)
                json_match = re.search(r'\{[\s\S]*\}', generated_text)
                json_string = json_match.group(0) if json_match else generated_text
                health_report = json.loads(json_string)
                
                # Ensure all required fields are present
                required_fields = ["overallAssessment", "potentialRisks", "possibleCauses", 
                                   "lifestyleChanges", "potentialSupplements", "additionalRecommendations"]
                
                for field in required_fields:
                    if field not in health_report:
                        if field == "overallAssessment":
                            health_report[field] = "Not available"
                        else:
                            health_report[field] = []
                
                # Log success and print the full health report
                print("Successfully generated health report")
                print("Full Health Report:")
                print(json.dumps(health_report, indent=2))
                
                return jsonify({
                    "success": True,
                    "data": health_report
                })
                
            except Exception as e:
                # If parsing fails, return the error and raw text
                print(f"Error parsing JSON from Gemini: {str(e)}")
                print(f"Raw Gemini response: {generated_text}")
                
                return jsonify({
                    "success": False,
                    "error": f"Error parsing JSON from Gemini: {str(e)}",
                    "rawResponse": generated_text
                }), 500
        else:
            print("Unexpected response structure from Gemini API")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            return jsonify({
                "success": False,
                "error": "Unexpected response structure from Gemini API"
            }), 500
            
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Gemini API: {str(e)}")
        
        return jsonify({
            "success": False,
            "error": f"Error connecting to Gemini API: {str(e)}"
        }), 500

# If this script is run directly, it can be used for testing
if __name__ == "__main__":
    # Test with example health data
    test_data = {
        "bloodPressure": "135/85",
        "glucose": "110",
        "hemoglobin": "14.5",
        "cholesterol": "195",
        "hdl": "55",
        "ldl": "120",
        "wbc": "7500",
        "platelets": "250000"
    }
    
    from flask import Flask
    with Flask(__name__).app_context():
        result = analyze_health_data(test_data)
        if hasattr(result, 'get_json'):
            print(json.dumps(result.get_json(), indent=2))
        else:
            print(result)