"""
OCR module for extracting text from PDF files using the marker library
"""
import os
import gc
from datetime import datetime
from marker.converters.table import TableConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

def process_pdf(pdf_path):
    """
    Process a PDF file and extract text and tables using marker library
    
    Args:
        pdf_path (str): Path to the PDF file
        dpi (int): Resolution for processing (lower = less memory)
        batch_size (int): Number of pages to process at once
        
    Returns:
        dict: Dictionary containing extraction results
    """
    try:
        # Force garbage collection before processing
        
        print(f"Processing PDF: {pdf_path}")
        
        # Extract text from PDF using marker library
        converter = TableConverter(
            artifact_dict=create_model_dict(),
        )
        rendered = converter(pdf_path)
        
        text, tables, images = text_from_rendered(rendered)
        
        # Generate a timestamp for the extraction
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create output directory if it doesn't exist
        output_dir = "extraction_results"
        os.makedirs(output_dir, exist_ok=True)
        
        # Save the extracted text to a file for reference
        output_file = os.path.join(output_dir, f"ocr_output_{timestamp}.txt")
        
        # Use UTF-8 encoding when writing to the file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"OCR EXTRACTION RESULTS\n")
            f.write(f"PDF: {pdf_path}\n")
            f.write(f"Extraction Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"{'-' * 50}\n\n")
            f.write("EXTRACTED TEXT:\n\n")
            f.write(text)
            
            f.write("\n\n")
            f.write(f"{'-' * 50}\n")
            f.write(f"Number of tables detected: {len(tables)}\n")
            f.write(f"Number of images detected: {len(images)}\n")
        
        print(f"Extraction successful! Results saved to: {output_file}")
        
        # Create a response object with all extraction details
        response = {
            "success": True,
            "extractedText": text,
            "tables": len(tables),
            "images": len(images),
            "outputFile": output_file,
            "timestamp": timestamp
        }
        
        # Force garbage collection after processing
        
        return response
    
    except Exception as e:
        print(f"Error during OCR extraction: {str(e)}")
        # Force garbage collection to free resources after error
        gc.collect()
        return {"success": False, "error": str(e)}

def extract_text_from_pdf(pdf_path):
    """
    Simple wrapper function to extract only text from a PDF
    Used by app.py to get text for further processing
    
    Args:
        pdf_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from the PDF, or empty string on error
    """
    try:
        result = process_pdf(pdf_path)
        if result["success"]:
            return result["extractedText"]
        else:
            print(f"Error in text extraction: {result.get('error', 'Unknown error')}")
            return ""
    except Exception as e:
        print(f"Exception in text extraction: {str(e)}")
        return ""


# For testing directly
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        test_pdf = sys.argv[1]
        if os.path.exists(test_pdf):
            result = process_pdf(test_pdf)
            print("=" * 80)
            print(f"Success: {result['success']}")
            print(f"Text length: {len(result.get('extractedText', ''))}")
            print(f"Tables: {result.get('tables', 0)}")
            print(f"Images: {result.get('images', 0)}")
            print("=" * 80)
            
            # Test parameter extraction if gemini2.py is available
            try:
                from services.gemini2 import extract_parameters
                params = extract_parameters(result.get("extractedText", ""))
                print("Extracted Parameters:")
                for key, value in params.items():
                    print(f"  {key}: {value}")
            except ImportError:
                print("Note: services.gemini2 module not available for testing")
        else:
            print(f"Error: File {test_pdf} does not exist")
    else:
        print("Usage: python ocr.py [pdf_file_path]")