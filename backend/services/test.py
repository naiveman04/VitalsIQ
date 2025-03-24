import os
from datetime import datetime

def test_ocr_extraction(pdf_path):
    """Test OCR extraction and save results to a text file"""
    try:
        # Import marker components
        from marker.converters.table import TableConverter
        from marker.models import create_model_dict
        from marker.output import text_from_rendered
        
        print("Running OCR extraction...")
        
        # Extract text from PDF using marker library
        converter = TableConverter(artifact_dict=create_model_dict())
        rendered = converter(pdf_path)
        
        text, tables, images = text_from_rendered(rendered)
        
        # Save the extracted text to a file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"ocr_output_{timestamp}.txt"
        
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
        
        # Display excerpt of extracted text
        print("\nExtracted Text Preview:")
        print("-" * 50)
        preview_lines = text.split("\n")[:10]  # Show first 10 lines
        for line in preview_lines:
            print(line)
        if len(text.split("\n")) > 10:
            print("...")
        print("-" * 50)
        
        return True
    
    except Exception as e:
        print(f"Error during OCR extraction: {str(e)}")
        return False

if __name__ == "__main__":
    print("OCR Extraction Test")
    print("=" * 50)
    
    # Use a raw string (r prefix) for Windows file paths to avoid escape sequence issues
    pdf_path = r"C:\Users\ADMIN\Downloads\tableConvert.com_hqyuot.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: The specified PDF file does not exist: {pdf_path}")
        print("Please update the pdf_path variable with the correct path to your PDF file.")
        exit(1)
    
    print(f"Using PDF: {pdf_path}")
    
    # Test OCR extraction
    success = test_ocr_extraction(pdf_path)
    
    if success:
        print("\nOCR test completed successfully!")
    else:
        print("\nOCR test failed. Check the error messages above.")