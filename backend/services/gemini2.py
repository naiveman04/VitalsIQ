"""
Gemini API parameter extraction module for health reports
Extracts relevant health parameters from OCR-extracted text
"""
import os
import json
import re
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY_2')

def extract_parameters(text):
    """
    Extract relevant health parameters from OCR text using Gemini API
    
    Args:
        text (str): The text extracted from PDF using OCR
        
    Returns:
        dict: Extracted health parameters in the required format
    """
    # If API key is missing, return an error
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY_2 environment variable not set")
        return {
            "error": "Gemini API key not configured",
            "bloodPressure": "Not Provided",
            "glucose": "Not Provided",
            "hemoglobin": "Not Provided",
            "cholesterol": "Not Provided",
            "hdl": "Not Provided",
            "ldl": "Not Provided",
            "wbc": "Not Provided",
            "platelets": "Not Provided"
        }
    
    # Construct the prompt for Gemini API
    prompt = f"""
    Extract all health-related parameters from the following OCR-extracted text.
    The text is from a medical report or prescription document.
    
    Return ONLY a JSON object with the following format:
    {{
      "bloodPressure": "value in mmHg (e.g., 120/80) or 'Not Provided' if not found",
      "glucose": "value in mg/dL or 'Not Provided' if not found",
      "hemoglobin": "value in g/dL or 'Not Provided' if not found",
      "cholesterol": "value in mg/dL or 'Not Provided' if not found",
      "hdl": "value in mg/dL or 'Not Provided' if not found",
      "ldl": "value in mg/dL or 'Not Provided' if not found",
      "wbc": "value in cells/µL or 'Not Provided' if not found",
      "platelets": "value in cells/µL or 'Not Provided' if not found"
    }}
    
    If a parameter is not found in the text, set its value to 'Not Provided'.
    Ensure you extract ONLY the numerical values with their units if present.
    Do not include any explanations, just the JSON object.
    
    OCR-extracted text:
    {text}
    """
    
    # Set up request for Gemini API
    try:
        print("Sending extracted text to Gemini API for parameter extraction...")
        
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
                    "temperature": 0.2,  # Lower temperature for more consistent output
                    "maxOutputTokens": 1024
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
                parameters = json.loads(json_string)
                
                # Ensure all expected fields are present with proper default values
                expected_fields = ["bloodPressure", "glucose", "hemoglobin", 
                                  "cholesterol", "hdl", "ldl", "wbc", "platelets"]
                for field in expected_fields:
                    if field not in parameters:
                        parameters[field] = "Not Provided"
                    elif parameters[field] is None:
                        parameters[field] = "Not Provided"
                
                # Print extracted parameters for debugging
                print(f"Extracted parameters: {json.dumps(parameters, indent=2)}")
                
                # Generate the parameter analysis HTML content for frontend display
                parameters_html = generate_parameters_html(parameters)
                
                # Add HTML content to the parameters dictionary for frontend
                parameters["parametersHtml"] = parameters_html
                
                return parameters
                
            except Exception as e:
                print(f"Error parsing JSON from Gemini: {str(e)}")
                print(f"Raw Gemini response: {generated_text}")
                
                # Return default values with error information
                default_parameters = {
                    "error": f"Error parsing JSON from Gemini: {str(e)}",
                    "rawResponse": generated_text,
                    "bloodPressure": "Not Provided",
                    "glucose": "Not Provided",
                    "hemoglobin": "Not Provided",
                    "cholesterol": "Not Provided",
                    "hdl": "Not Provided",
                    "ldl": "Not Provided",
                    "wbc": "Not Provided",
                    "platelets": "Not Provided"
                }
                
                # Generate parameters HTML for frontend even with default values
                default_parameters["parametersHtml"] = generate_parameters_html(default_parameters)
                
                return default_parameters
        else:
            print("Unexpected response structure from Gemini API")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            default_parameters = {
                "error": "Unexpected response structure from Gemini API",
                "bloodPressure": "Not Provided",
                "glucose": "Not Provided",
                "hemoglobin": "Not Provided",
                "cholesterol": "Not Provided",
                "hdl": "Not Provided",
                "ldl": "Not Provided",
                "wbc": "Not Provided",
                "platelets": "Not Provided"
            }
            
            # Generate parameters HTML for frontend even with default values
            default_parameters["parametersHtml"] = generate_parameters_html(default_parameters)
            
            return default_parameters
            
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Gemini API: {str(e)}")
        
        default_parameters = {
            "error": f"Error connecting to Gemini API: {str(e)}",
            "bloodPressure": "Not Provided",
            "glucose": "Not Provided",
            "hemoglobin": "Not Provided",
            "cholesterol": "Not Provided",
            "hdl": "Not Provided",
            "ldl": "Not Provided",
            "wbc": "Not Provided",
            "platelets": "Not Provided"
        }
        
        # Generate parameters HTML for frontend even with default values
        default_parameters["parametersHtml"] = generate_parameters_html(default_parameters)
        
        return default_parameters

def generate_parameters_html(parameters):
    """
    Generate HTML for parameter display in the frontend
    
    Args:
        parameters (dict): Extracted health parameters
        
    Returns:
        str: HTML content for displaying parameters
    """
    return f"""
    <h3>Parameter Analysis</h3>
    <div class="parameter-row">
        <span class="parameter-name">Blood Pressure:</span>
        <span class="parameter-value">{parameters.get('bloodPressure', 'Not Provided')} mmHg</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">Blood Glucose:</span>
        <span class="parameter-value">{parameters.get('glucose', 'Not Provided')} mg/dL</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">Hemoglobin:</span>
        <span class="parameter-value">{parameters.get('hemoglobin', 'Not Provided')} g/dL</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">Total Cholesterol:</span>
        <span class="parameter-value">{parameters.get('cholesterol', 'Not Provided')} mg/dL</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">HDL Cholesterol:</span>
        <span class="parameter-value">{parameters.get('hdl', 'Not Provided')} mg/dL</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">LDL Cholesterol:</span>
        <span class="parameter-value">{parameters.get('ldl', 'Not Provided')} mg/dL</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">White Blood Cell Count:</span>
        <span class="parameter-value">{parameters.get('wbc', 'Not Provided')} cells/µL</span>
    </div>
    <div class="parameter-row">
        <span class="parameter-name">Platelets:</span>
        <span class="parameter-value">{parameters.get('platelets', 'Not Provided')} cells/µL</span>
    </div>
    """

# If this script is run directly, it can be used for testing
if __name__ == "__main__":
    # Test with example OCR text
    test_text = """
    Patient Health Report
    
    Blood Pressure: 135/85 mmHg
    Blood Glucose: 110 mg/dL
    Hemoglobin: 14.5 g/dL
    Cholesterol: 195 mg/dL
    HDL: 55 mg/dL
    LDL: 120 mg/dL
    WBC Count: 7500 cells/µL
    Platelets: 250000 cells/µL
    """
    
    result = extract_parameters(test_text)
    print("Test Complete")
    print(json.dumps(result, indent=2))
    
    # Print the HTML for visual inspection
    print("\nGenerated HTML for frontend:")
    print(result.get("parametersHtml", "No HTML generated"))