// Initialize AOS animations
AOS.init();

// Page loader
$(window).on("load", function () {
  setTimeout(function () {
    $(".page-loader").addClass("fade-out");
  }, 1000);
});

// Toggle overlay navigation
function openNav() {
  document.getElementById("myNav").style.width = "100%";
  setTimeout(function () {
    document.getElementById("myNav").classList.add("open");
  }, 100);
}

function closeNav() {
  document.getElementById("myNav").classList.remove("open");
  setTimeout(function () {
    document.getElementById("myNav").style.width = "0%";
  }, 300);
}

// Sticky header
$(window).scroll(function () {
  if ($(this).scrollTop() > 50) {
    $(".header_section").addClass("scrolled");
    $(".scroll-to-top").addClass("active");
  } else {
    $(".header_section").removeClass("scrolled");
    $(".scroll-to-top").removeClass("active");
  }
});

// Scroll to top functionality
$(".scroll-to-top").click(function () {
  $("html, body").animate({ scrollTop: 0 }, 800);
  return false;
});

// Upload & Analyze button functionality
document
  .getElementById("uploadAnalyzeBtn")
  .addEventListener("click", function () {
    // Show output section
    document.getElementById("outputSection").style.display = "block";

    // Scroll to output section
    $("html, body").animate(
      {
        scrollTop: $("#outputSection").offset().top - 100,
      },
      800
    );
  });

// Analyze Parameters button functionality
document
  .getElementById("analyzeParamsBtn")
  .addEventListener("click", function () {
    // Show output section
    document.getElementById("outputSection").style.display = "block";

    // Collect entered values
    const bloodPressure =
      document.getElementById("bloodPressure").value || "Not Provided";
    const glucose = document.getElementById("glucose").value || "Not Provided";
    const hemoglobin =
      document.getElementById("hemoglobin").value || "Not Provided";
    const cholesterol =
      document.getElementById("cholesterol").value || "Not Provided";
    const hdl = document.getElementById("hdl").value || "Not Provided";
    const ldl = document.getElementById("ldl").value || "Not Provided";
    const wbc = document.getElementById("wbc").value || "Not Provided";
    const platelets =
      document.getElementById("platelets").value || "Not Provided";

    // Create the parameter analysis section
    const parametersContent = `
      <h3>Parameter Analysis</h3>
      <div class="parameter-row">
          <span class="parameter-name">Blood Pressure:</span>
          <span class="parameter-value">${bloodPressure} mmHg</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">Blood Glucose:</span>
          <span class="parameter-value">${glucose} mg/dL</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">Hemoglobin:</span>
          <span class="parameter-value">${hemoglobin} g/dL</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">Total Cholesterol:</span>
          <span class="parameter-value">${cholesterol} mg/dL</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">HDL Cholesterol:</span>
          <span class="parameter-value">${hdl} mg/dL</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">LDL Cholesterol:</span>
          <span class="parameter-value">${ldl} mg/dL</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">White Blood Cell Count:</span>
          <span class="parameter-value">${wbc} cells/µL</span>
      </div>
      <div class="parameter-row">
          <span class="parameter-name">Platelets:</span>
          <span class="parameter-value">${platelets} cells/µL</span>
      </div>
  `;

    // Clear any existing content and add parameters
    document.getElementById("analysisContent").innerHTML = parametersContent;

    // Prepare data for Gemini API
    const healthData = {
      bloodPressure,
      glucose,
      hemoglobin,
      cholesterol,
      hdl,
      ldl,
      wbc,
      platelets,
    };

    // Call function to send data to Gemini API
    sendToGeminiAPI(healthData);

    // Scroll to output section
    $("html, body").animate(
      {
        scrollTop: $("#outputSection").offset().top - 100,
      },
      800
    );
  });

// Copy button functionality
document.getElementById("copyBtn").addEventListener("click", function () {
  const content = document.getElementById("analysisContent").innerText;
  navigator.clipboard.writeText(content).then(function () {
    // Show copy notification
    const copyAlert = document.getElementById("copyAlert");
    copyAlert.classList.add("show");
    setTimeout(function () {
      copyAlert.classList.remove("show");
    }, 2000);
  });
});

// Download PDF functionality
document
  .getElementById("downloadPdfBtn")
  .addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // Show loading message
    const loadingMessage = document.createElement("div");
    loadingMessage.className = "loading-pdf";
    loadingMessage.innerHTML = "<p>Generating PDF, please wait...</p>";
    loadingMessage.style.position = "fixed";
    loadingMessage.style.top = "50%";
    loadingMessage.style.left = "50%";
    loadingMessage.style.transform = "translate(-50%, -50%)";
    loadingMessage.style.background = "rgba(0,0,0,0.7)";
    loadingMessage.style.color = "white";
    loadingMessage.style.padding = "20px";
    loadingMessage.style.borderRadius = "5px";
    loadingMessage.style.zIndex = "1000";
    document.body.appendChild(loadingMessage);

    // Setup PDF dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 30;
    let pageCount = 1;

    // Extract text content
    const content = document.getElementById("analysisContent");

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Your Health Report Analysis", pageWidth / 2, 20, {
      align: "center",
    });

    // Define parameters based on variable names from the form
    const parameterNames = {
      "Blood Pressure:": "bloodPressure",
      "Blood Glucose:": "glucose",
      "Hemoglobin:": "hemoglobin",
      "Total Cholesterol:": "cholesterol",
      "HDL Cholesterol:": "hdl",
      "LDL Cholesterol:": "ldl",
      "White Blood Cell Count:": "wbc",
      "Platelets:": "platelets"
    };

    // Track processed list items to avoid duplicates
    const processedListItems = new Set();
    
    // Track if parameters section has been processed
    let parametersProcessed = false;

    // Define known subtitles that should be formatted specially
    const knownSubtitles = [
      "Recommendations:",
      "Risk Factors:",
      "Potential Risks:",
      "Analysis:",
      "Summary:",
      "Interpretation:",
      "Treatment Options:",
      "Next Steps:",
      "Conclusion:",
      "Key Findings:",
      "Diagnosis:",
      "Health Status:",
      "Medical Advice:"
    ];

    // Extract and add sections recursively
    function addContentToPDF(element, indent = 0, processChildNodes = true) {
      if (!element) return;

      // Process this element
      if (element.nodeType === Node.TEXT_NODE) {
        const text = element.textContent.trim();
        if (text) {
          // Check if we need a new page
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
            pageCount++;
          }

          // Calculate available width for text (accounting for margins and indentation)
          const maxWidth = pageWidth - (2 * margin) - indent;
          
          // Split text to fit within page width
          const lines = doc.splitTextToSize(text, maxWidth);
          
          for (let i = 0; i < lines.length; i++) {
            // Check if we need a new page for each line
            if (y > pageHeight - 20) {
              doc.addPage();
              y = 20;
              pageCount++;
            }
            
            doc.text(lines[i], margin + indent, y);
            y += 7;
          }
        }
      } else if (element.nodeType === Node.ELEMENT_NODE) {
        // Handle based on element type
        if (
          element.tagName === "H1" ||
          element.tagName === "H2" ||
          element.tagName === "H3"
        ) {
          // Check if we need a new page
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
            pageCount++;
          }

          // Add spacing before headings (except at top of page)
          if (y > 30) y += 10;

          // Heading styles based on level
          doc.setFont("helvetica", "bold");
          const fontSize =
            element.tagName === "H1" ? 16 : element.tagName === "H2" ? 14 : 12;
          doc.setFontSize(fontSize);

          // Get heading text
          const headingText = element.textContent.trim();
          
          // Calculate available width for heading
          const maxWidth = pageWidth - (2 * margin);
          
          // Split heading text if needed
          const lines = doc.splitTextToSize(headingText, maxWidth);
          
          // Add each line of the heading
          for (let i = 0; i < lines.length; i++) {
            doc.text(lines[i], margin, y);
            y += 8;
          }
          
          // Add extra space after heading
          y += 5;

          // Reset font
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          
          // Mark parameters as processed if this is the parameters heading
          if (headingText === "Parameter Analysis") {
            parametersProcessed = true;
          }
        } else if (
          element.tagName === "DIV" &&
          (element.classList.contains("parameter-row") ||
            element.getAttribute("data-param"))
        ) {
          // This is a parameter row, extract label and value
          let label = "";
          let value = "";

          // Try to get label and value from children
          const labelElement =
            element.querySelector(".parameter-name") ||
            element.querySelector(".parameter-label") ||
            element.querySelector("[data-label]");
          const valueElement =
            element.querySelector(".parameter-value") ||
            element.querySelector("[data-value]");

          if (labelElement) label = labelElement.textContent.trim();
          if (valueElement) value = valueElement.textContent.trim();

          // Check if we need a new page
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
            pageCount++;
          }

          // Add parameter label (left-aligned)
          doc.setFont("helvetica", "normal");
          doc.text(label, margin, y);

          // Add value (right-aligned)
          if (value) {
            doc.setFont("helvetica", "bold");
            doc.text(value, pageWidth - margin, y, { align: "right" });
          }

          y += 8;
          doc.setFont("helvetica", "normal");
        } else if (element.tagName === "UL" || element.tagName === "OL") {
          // Increase indent for list items
          indent += 5;
        } else if (element.tagName === "LI") {
          // Generate a unique ID for this list item to avoid duplicates
          const itemText = element.textContent.trim();
          const itemId = itemText.substring(0, 50); // First 50 chars as ID
          
          // Skip if already processed
          if (!processedListItems.has(itemId)) {
            processedListItems.add(itemId);
            
            // Check if we need a new page
            if (y > pageHeight - 20) {
              doc.addPage();
              y = 20;
              pageCount++;
            }

            // Add bullet point
            doc.text("•", margin + indent - 5, y);

            // Handle text wrapping to prevent content going outside PDF limits
            const maxWidth = pageWidth - (2 * margin) - indent - 5;
            const lines = doc.splitTextToSize(itemText, maxWidth);

            // Add each line of text
            for (let i = 0; i < lines.length; i++) {
              if (i === 0) {
                // First line is already positioned with the bullet
                doc.text(lines[i], margin + indent, y);
              } else {
                // Check for new page for subsequent lines
                if (y + 7 > pageHeight - 20) {
                  doc.addPage();
                  y = 20;
                  pageCount++;
                }
                y += 7;
                doc.text(lines[i], margin + indent, y);
              }
            }

            // Add space after list item
            y += 10;
          }
          
          // For list items, we don't process child nodes separately since we're getting the text content
          processChildNodes = false;
        } else if (element.tagName === "P") {
          // Check if we need a new page
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
            pageCount++;
          }

          // Get paragraph text
          const paraText = element.textContent.trim();
          if (paraText) {
            // Check if this paragraph is a known subtitle
            const isSubtitle = knownSubtitles.some(subtitle => 
              paraText === subtitle || paraText.startsWith(subtitle)
            );
            
            // Handle text wrapping
            const maxWidth = pageWidth - (2 * margin) - indent;
            const lines = doc.splitTextToSize(paraText, maxWidth);
            
            if (isSubtitle) {
              // Add extra space before subtitle
              y += 5;
              
              // Format subtitle in bold and larger
              doc.setFont("helvetica", "bold");
              doc.setFontSize(14);
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(12);
            }

            // Add each line of text
            for (let i = 0; i < lines.length; i++) {
              if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
                pageCount++;
              }

              doc.text(lines[i], margin + indent, y);
              y += 7;
            }

            // Reset font after subtitle
            if (isSubtitle) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(12);
              
              // Add extra space after subtitle
              y += 3;
            } else {
              // Regular paragraph spacing
              y += 5;
            }
          }
        }

        // Process children elements only if this element isn't a parameter row
        // and we are supposed to process child nodes
        if (
          processChildNodes &&
          !(
            element.classList &&
            (element.classList.contains("parameter-row") || 
             element.hasAttribute("data-param"))
          )
        ) {
          for (let i = 0; i < element.childNodes.length; i++) {
            addContentToPDF(element.childNodes[i], indent, true);
          }
        }

        // Reset indent after lists
        if (element.tagName === "UL" || element.tagName === "OL") {
          indent -= 5;
        }
      }
    }

    // Start extraction with main content section
    addContentToPDF(content);

    // Add page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
    }

    // Remove loading message
    document.body.removeChild(loadingMessage);

    // Save the PDF
    doc.save("health-report-analysis.pdf");
  });

// Function to send data to Gemini API
function sendToGeminiAPI(healthData) {
  // Clear any existing analysis content
  const analysisContentDiv = document.getElementById("analysisContent");

  // Preserve the parameter analysis section if it exists
  const parameterContent =
    analysisContentDiv.querySelector("h3:first-of-type")?.parentElement;

  if (parameterContent) {
    // Keep only the parameter analysis part, remove any existing health analysis
    const geminiResponseSection = analysisContentDiv.querySelector(
      ".gemini-response-section"
    );
    if (geminiResponseSection) {
      geminiResponseSection.remove();
    }
  }

  // Construct the prompt for Gemini API
  const prompt = `
    Please provide a comprehensive health report based on the following parameters:
    
    Blood Pressure: ${healthData.bloodPressure} mmHg
    Blood Glucose: ${healthData.glucose} mg/dL
    Hemoglobin: ${healthData.hemoglobin} g/dL
    Total Cholesterol: ${healthData.cholesterol} mg/dL
    HDL Cholesterol: ${healthData.hdl} mg/dL
    LDL Cholesterol: ${healthData.ldl} mg/dL
    White Blood Cell Count: ${healthData.wbc} cells/µL
    Platelets: ${healthData.platelets} cells/µL
    
    Return your response as a JSON object with the following format:
    {
      "overallAssessment": "Text describing the overall assessment in 3-4 lines",
      "potentialRisks": ["Risk 1 with detailed explanation (2-3 sentences)", "Risk 2 with detailed explanation (2-3 sentences)", "Risk 3 with detailed explanation (2-3 sentences)"],
      "possibleCauses": ["Detailed explanation of possible cause 1 (2-3 sentences)", "Detailed explanation of possible cause 2 (2-3 sentences)", "Detailed explanation of possible cause 3 (2-3 sentences)"],
      "lifestyleChanges": ["Detailed lifestyle change recommendation 1 (2-3 sentences)", "Detailed lifestyle change recommendation 2 (2-3 sentences)", "Detailed lifestyle change recommendation 3 (2-3 sentences)"],
      "potentialSupplements": ["Detailed supplement recommendation 1 with dosage and benefits (2-3 sentences)", "Detailed supplement recommendation 2 with dosage and benefits (2-3 sentences)", "Detailed supplement recommendation 3 with dosage and benefits (2-3 sentences)"],
      "additionalRecommendations": ["Detailed additional recommendation 1 (2-3 sentences)", "Detailed additional recommendation 2 (2-3 sentences)", "Detailed additional recommendation 3 (2-3 sentences)"]
    }
    
    For each section, provide comprehensive and detailed explanations. For the lists (potentialRisks, possibleCauses, lifestyleChanges, potentialSupplements, and additionalRecommendations), make each item 2-3 sentences long with specific and actionable information based on the provided health parameters.
    
    For the potentialSupplements section, include both general supplements that could be beneficial (like protein, creatine, multivitamins, etc.) as well as specific supplements that address potential issues indicated by the health parameters.
    `;

  console.log("Prompt prepared for Gemini API:", prompt);

  // API key - replace with your actual key
  const apiKey = "AIzaSyA7bnjeH7PeRaOVrvQlTvg-BImwB-TOAGg"; // Replace with your valid API key

  // Add Gemini response section
  analysisContentDiv.innerHTML += `
        <div class="gemini-response-section">
            <h3 id="analysisTitle">Health Analysis</h3>
            <p id="connectingMessage">Connecting to AI for comprehensive health analysis...</p>
            <div id="geminiResponse" class="gemini-response">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

  // Set up request for Gemini API - Using updated endpoint
  fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received data from Gemini API:", data);

      // Extract the response from Gemini's data structure
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        const generatedText = data.candidates[0].content.parts[0].text;

        // Try to parse the JSON response
        try {
          // Find JSON in the response (in case there's additional text)
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
          const healthReport = JSON.parse(jsonString);

          // Hide connecting message
          document.getElementById("connectingMessage").style.display = "none";

          // Format and display the health report with animation
          displayHealthReportAnimated(healthReport, healthData);
        } catch (e) {
          console.error("Error parsing JSON from Gemini:", e);
          // If parsing fails, just display the text as-is
          document.getElementById("connectingMessage").style.display = "none";
          document.getElementById(
            "geminiResponse"
          ).innerHTML = `<p class="error">Error processing the response: ${e.message}</p>
                     <p>Raw response:</p>
                     <pre>${generatedText}</pre>`;
        }
      } else {
        throw new Error("Unexpected response structure from Gemini API");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("connectingMessage").style.display = "none";
      document.getElementById(
        "geminiResponse"
      ).innerHTML = `<p class="error">Error connecting to the health analysis service: ${error.message}</p>
             <button id="retryButton" class="analyze-report-btn">Retry Analysis</button>`;

      // Add event listener for the retry button
      document
        .getElementById("retryButton")
        .addEventListener("click", function () {
          sendToGeminiAPI(healthData);
        });
    });
}

function displayHealthReportAnimated(healthReport, healthData) {
  const geminiResponse = document.getElementById("geminiResponse");
  geminiResponse.innerHTML = ""; // Clear loading indicator

  // Create sections with proper formatting
  const sections = [
    {
      title: "Overall Assessment",
      content: healthReport.overallAssessment,
      type: "paragraph",
    },
    {
      title: "Potential Risks",
      content: healthReport.potentialRisks,
      type: "list",
    },
    {
      title: "Possible Causes",
      content: healthReport.possibleCauses,
      type: "list",
    },
    {
      title: "Lifestyle Changes",
      content: healthReport.lifestyleChanges,
      type: "list",
    },
    {
      title: "Potential Supplementation Requirements",
      content: healthReport.potentialSupplements,
      type: "list",
    },
    {
      title: "Additional Recommendations",
      content: healthReport.additionalRecommendations,
      type: "list",
    },
  ];

  // Add CSS classes for our health report
  const styleId = "health-report-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            .health-report-title {
                font-size: 1.6em;
                font-weight: bold;
                color: #2c3e50;
                margin-top: 1.5em;
                margin-bottom: 0.7em;
            }
            .health-report-content {
                margin-bottom: 1em;
                line-height: 1.6;
            }
            .health-report-list {
                list-style-type: none;
                padding-left: 0;
                margin-left: 0;
            }
            .health-report-list-item {
                margin-bottom: 1em;
                position: relative;
                padding-left: 1.5em;
                line-height: 1.5;
                text-indent: 0;
                display: block;
            }
            .health-report-list-item::before {
                content: "•";
                color: #3498db;
                position: absolute;
                left: 0;
                top: 0;
            }
            .typing {
                border-right: 2px solid #3498db;
                animation: blink 0.7s step-end infinite;
                white-space: pre-wrap;
            }
            @keyframes blink {
                from, to { border-color: transparent }
                50% { border-color: #3498db; }
            }
        `;
    document.head.appendChild(style);
  }

  // Create container for animated content
  const contentContainer = document.createElement("div");
  contentContainer.className = "health-report-container";
  geminiResponse.appendChild(contentContainer);

  // Type each section one by one
  let sectionIndex = 0;
  let characterIndex = 0;
  let currentElement = null;
  let currentListIndex = 0;
  let currentListContainer = null;

  function typeSection() {
    if (sectionIndex >= sections.length) {
      // All sections typed, add regenerate button
      const regenerateBtn = document.createElement("button");
      regenerateBtn.className = "analyze-report-btn";
      regenerateBtn.textContent = "Regenerate";
      geminiResponse.appendChild(regenerateBtn);

      regenerateBtn.addEventListener("click", function () {
        // Remove all health analysis content completely and generate a new one
        const geminiResponseSection = document.querySelector(
          ".gemini-response-section"
        );
        if (geminiResponseSection) {
          geminiResponseSection.remove();
        }

        // Send request again to regenerate
        sendToGeminiAPI(healthData);
      });

      return;
    }

    const section = sections[sectionIndex];

    if (!currentElement) {
      // Create title element
      const titleElement = document.createElement("h4");
      titleElement.className = "health-report-title";
      titleElement.textContent = section.title;
      contentContainer.appendChild(titleElement);

      // Create content container based on type
      if (section.type === "paragraph") {
        currentElement = document.createElement("p");
        currentElement.className = "health-report-content typing";
        contentContainer.appendChild(currentElement);
      } else if (section.type === "list") {
        // Create a container for this section's list items
        currentListContainer = document.createElement("ul"); // Changed to ul for semantic HTML
        currentListContainer.className = "health-report-list";
        contentContainer.appendChild(currentListContainer);

        // Start with the first list item
        currentElement = null;
        currentListIndex = 0;

        // Create the first list item only if there are items
        if (section.content && section.content.length > 0) {
          currentElement = document.createElement("li");
          currentElement.className = "health-report-list-item typing";
          currentListContainer.appendChild(currentElement);
          characterIndex = 0;
        } else {
          // If no items, move to next section
          sectionIndex++;
          setTimeout(typeSection, 200);
          return;
        }
      }
    }

    if (section.type === "paragraph") {
      // Type paragraph content character by character
      if (characterIndex < section.content.length) {
        currentElement.textContent += section.content.charAt(characterIndex);
        characterIndex++;
        setTimeout(typeSection, 5 + Math.random() * 10); // Faster typing speed
      } else {
        // Move to next section
        currentElement.classList.remove("typing");
        currentElement = null;
        sectionIndex++;
        setTimeout(typeSection, 200);
      }
    } else if (section.type === "list") {
      // Handle list items
      if (currentListIndex < section.content.length) {
        // Type this list item
        if (characterIndex < section.content[currentListIndex].length) {
          currentElement.textContent +=
            section.content[currentListIndex].charAt(characterIndex);
          characterIndex++;
          setTimeout(typeSection, 5 + Math.random() * 10); // Faster typing speed
        } else {
          // Move to next list item
          currentElement.classList.remove("typing");
          currentListIndex++;

          // Create next list item if available
          if (currentListIndex < section.content.length) {
            currentElement = document.createElement("li");
            currentElement.className = "health-report-list-item typing";
            currentListContainer.appendChild(currentElement);
            characterIndex = 0;
          } else {
            // No more list items, prepare to move to next section
            currentElement = null;
            sectionIndex++;
          }

          setTimeout(typeSection, 150);
        }
      }
    }
  }

  // Start the typing animation
  setTimeout(typeSection, 300);
}
