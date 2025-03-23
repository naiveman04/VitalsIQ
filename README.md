# VitalsIQ - ML Health Analyzer

## Overview
VitalsIQ is a machine learning-powered health analysis system that extracts medical data from user-uploaded reports and provides AI-driven insights. The project leverages Tesseract OCR for text extraction and Gemini APIs for intelligent health assessments. It aims to assist users in understanding their health parameters and detecting potential risks.

## Features
📄 OCR-Based Report Extraction: Uses Tesseract OCR to extract key health metrics from uploaded medical reports.
🧠 AI-Powered Health Insights: Integrates two Gemini APIs to analyze extracted data and provide intelligent health assessments.
📊 Health Parameter Analysis: Supports health data processing using Pandas for structuring and extracting meaningful insights.
🌐 Web-Based Interface: A simple yet effective front-end built with HTML, CSS, and JavaScript for user interaction.

## Technologies Used
Languages: Python, JavaScript, HTML, CSS
Data Processing: Pandas
OCR & AI: Tesseract OCR, Gemini APIs
Web Development: Flask (or any backend framework used)

## How It Works
User Uploads a Medical Report: The system accepts scanned reports or images as input.
OCR Extraction: Tesseract OCR processes the document, extracting key health parameters.
Data Processing: The extracted data is formatted and structured using Pandas for further analysis.
AI-Powered Insights: The Gemini APIs analyze trends, assess potential risks, and provide health recommendations.
Results Display: The web interface presents users with their analyzed health data and AI-generated insights.

## Installation & Setup

### Clone the repository:
git clone https://github.com/your-username/vitalsiq.git
### Install dependencies:
pip install -r requirements.txt
### Run the application:
python app.py

## Future Enhancements
🏥 Expansion of Health Parameters: Supporting additional health metrics for more detailed assessments.
📱 Mobile-Friendly Interface: Enhancing accessibility via a responsive web design.
🧬 More Advanced AI Integration: Improving analysis accuracy through additional AI-driven insights.
