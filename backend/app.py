from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import tempfile
import traceback  # Added for better error logging

# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyze_health_data', methods=['POST'])
def analyze_health_data_route():
    """Handle manually entered health parameters"""
    try:
        # Import here to avoid circular imports
        from services.gemini1 import analyze_health_data
        
        # Get the health data from the request
        health_data = request.json
        
        # Call the analyze_health_data function with the health parameters
        result = analyze_health_data(health_data)
        
        # Return the result
        return result
    except Exception as e:
        print(f"Error in analyze_health_data_route: {str(e)}")
        print(traceback.format_exc())  # Print detailed error for debugging
        return jsonify({
            "success": False,
            "error": f"Error analyzing health data: {str(e)}"
        }), 500

@app.route('/upload_report', methods=['POST'])
def upload_report_route():
    """Handle PDF report upload"""
    temp_path = None
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and file.filename.lower().endswith('.pdf'):
            # Create temp directory if it doesn't exist
            os.makedirs('temp', exist_ok=True)
            
            # Save the uploaded file temporarily with a more reliable method
            _, temp_filename = tempfile.mkstemp(suffix='.pdf')
            temp_path = os.path.join('temp', os.path.basename(temp_filename))
            file.save(temp_path)
            
            # Check if file was saved correctly
            if not os.path.exists(temp_path) or os.path.getsize(temp_path) == 0:
                return jsonify({
                    "success": False,
                    "error": "Failed to save uploaded file"
                }), 500
            
            # Process the PDF with OCR using your existing module
            from services.ocr import extract_text_from_pdf
            extracted_text = extract_text_from_pdf(temp_path)
            
            if not extracted_text or len(extracted_text.strip()) == 0:
                return jsonify({
                    "success": False,
                    "error": "Failed to extract text from PDF"
                }), 500
            
            # Extract health parameters using Gemini
            from services.gemini2 import extract_parameters
            health_parameters = extract_parameters(extracted_text)
            
            if not health_parameters:
                return jsonify({
                    "success": False,
                    "error": "Failed to extract health parameters from the text"
                }), 500
            
            # Analyze the health parameters
            from services.gemini1 import analyze_health_data
            result = analyze_health_data(health_parameters)
            
            # Clean up the temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            return result
            
        else:
            return jsonify({
                "success": False,
                "error": "File must be a PDF"
            }), 400
            
    except ImportError as e:
        print(f"Import Error in upload_report_route: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": f"Missing dependency: {str(e)}"
        }), 500
    except Exception as e:
        print(f"Error in upload_report_route: {str(e)}")
        print(traceback.format_exc())  # Print detailed error for debugging
        
        # Make sure to clean up even if there's an error
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            "success": False,
            "error": f"Error processing PDF: {str(e)}"
        }), 500

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    print("Health Analysis API")
    print("=" * 50)
    print("Available endpoints:")
    print("  POST /analyze_health_data - Analyze manually entered health data")
    print("  POST /upload_report - Upload and process a PDF health report")
    print("  GET /health - Health check endpoint")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)