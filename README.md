# VitalsIQ - ML Health Analyzer

## Overview  
**VitalsIQ** is a machine learning-powered health analysis system that extracts medical data from user-uploaded reports and provides AI-driven insights. The project leverages **Marker OCR** for text extraction and **Gemini APIs** for intelligent health assessments. It aims to assist users in understanding their health parameters and detecting potential risks.

## Features  
- 📄 **OCR-Based Report Extraction**: Uses **Marker OCR** to extract key health metrics from uploaded medical reports.  
- 🧠 **AI-Powered Health Insights**: Integrates **two Gemini APIs** to analyze extracted data and provide intelligent health assessments.  
- 📊 **Health Parameter Analysis**: Supports health data processing using **Gemini API** for structuring and extracting meaningful insights.  
- 🌐 **Web-Based Interface**: A simple yet effective front-end built with **HTML, CSS, and JavaScript** for user interaction.  

## Pages  
The **VitalsIQ** web application consists of three main pages:  
1. **Landing Page** – A welcoming interface explaining the purpose of the application.  
2. **About Us Page** – Provides background information on the project.  
3. **Main Analysis Page** – Allows users to upload medical reports, extracts data, and displays AI-powered insights.  

## Technologies Used  
- **Languages**: Python, JavaScript, HTML, CSS  
- **OCR & AI**: Marker OCR, Gemini APIs  
- **Web Development**: Flask (or any backend framework used)  

## How It Works  
1. **User Uploads a Medical Report**: The system accepts scanned reports or images as input.  
2. **OCR Extraction**: **Marker OCR** processes the document, extracting key health parameters.  
3. **Data Processing**: The extracted data is formatted and structured using **Gemini API 1** for further analysis.  
4. **AI-Powered Insights**: The **Gemini API 2** analyzes trends, assess potential risks, and provide health recommendations.  
5. **Results Display**: The web interface presents users with their analyzed health data and AI-generated insights.  

## Installation & Setup  
### Prerequisites  
- Python 3.x  
- pip (Python package manager)  

### Steps  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/vitalsiq.git
   cd vitalsiq
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
3. Run the application:
   ```bash
   python app.py

## Future Enhancements  
- 🏥 **Expansion of Health Parameters:** Supporting additional health metrics for more detailed assessments.
- 📱 **Mobile-Friendly Interface:** Enhancing accessibility via a responsive web design.  
- 🧬 **More Advanced AI Integration:** Improving analysis accuracy through additional AI-driven insights.
