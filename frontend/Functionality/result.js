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

    // Fetch and display results based on input type
    async function fetchResults() {
        const inputType = localStorage.getItem("inputType");

        if (inputType === "file") {
            // Handle file upload
            try {
                console.log("Fetching results from backend for file upload");
                const response = await fetch("http://localhost:5000/upload_report", {
                    method: "POST",
                    body: new FormData(document.getElementById("tempForm")),
                    signal: new AbortController().signal,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                console.log("Response data:", data);

                // Hide connecting message
                document.getElementById("connectingMessage").style.display = "none";

                // Update the analysis content with extracted parameters
                const parametersContent = `
                    <h3>Parameter Analysis</h3>
                    <div class="parameter-row">
                        <span class="parameter-name">Blood Pressure:</span>
                        <span class="parameter-value">${data.bloodPressure || "Not Provided"} mmHg</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Blood Glucose:</span>
                        <span class="parameter-value">${data.glucose || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Hemoglobin:</span>
                        <span class="parameter-value">${data.hemoglobin || "Not Provided"} g/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Total Cholesterol:</span>
                        <span class="parameter-value">${data.cholesterol || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">HDL Cholesterol:</span>
                        <span class="parameter-value">${data.hdl || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">LDL Cholesterol:</span>
                        <span class="parameter-value">${data.ldl || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">White Blood Cell Count:</span>
                        <span class="parameter-value">${data.wbc || "Not Provided"} cells/µL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Platelets:</span>
                        <span class="parameter-value">${data.platelets || "Not Provided"} cells/µL</span>
                    </div>
                `;
                document.getElementById("analysisContent").innerHTML = parametersContent;

                // Display the health analysis
                await displayHealthReportAnimated(data.data || data, {});
            } catch (error) {
                console.error("Fetch error:", error);
                document.getElementById("connectingMessage").style.display = "none";
                document.getElementById("geminiResponse").innerHTML = `
                    <p class="error">Error processing your PDF: ${error.message}</p>
                    <button class="analyze-report-btn" onclick="fetchResults()">Retry Upload</button>
                `;
            }
        } else if (inputType === "manual") {
            // Handle manual entry
            try {
                // Retrieve the health data from localStorage
                const healthData = JSON.parse(localStorage.getItem("manualHealthData"));
                if (!healthData) {
                    throw new Error("No manual health data found.");
                }

                // Display the parameters from the manual entry
                const parametersContent = `
                    <h3>Parameter Analysis</h3>
                    <div class="parameter-row">
                        <span class="parameter-name">Blood Pressure:</span>
                        <span class="parameter-value">${healthData.bloodPressure || "Not Provided"} mmHg</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Blood Glucose:</span>
                        <span class="parameter-value">${healthData.glucose || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Hemoglobin:</span>
                        <span class="parameter-value">${healthData.hemoglobin || "Not Provided"} g/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Total Cholesterol:</span>
                        <span class="parameter-value">${healthData.cholesterol || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">HDL Cholesterol:</span>
                        <span class="parameter-value">${healthData.hdl || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">LDL Cholesterol:</span>
                        <span class="parameter-value">${healthData.ldl || "Not Provided"} mg/dL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">White Blood Cell Count:</span>
                        <span class="parameter-value">${healthData.wbc || "Not Provided"} cells/µL</span>
                    </div>
                    <div class="parameter-row">
                        <span class="parameter-name">Platelets:</span>
                        <span class="parameter-value">${healthData.platelets || "Not Provided"} cells/µL</span>
                    </div>
                `;
                document.getElementById("analysisContent").innerHTML = parametersContent;

                // Fetch the health analysis from the backend
                const response = await fetch("http://localhost:5000/manual_entry", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(healthData),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                console.log("Manual entry response data:", data);

                // Hide connecting message
                document.getElementById("connectingMessage").style.display = "none";

                // Display the health analysis
                await displayHealthReportAnimated(data.data || data, {});
            } catch (error) {
                console.error("Fetch error for manual entry:", error);
                document.getElementById("connectingMessage").style.display = "none";
                document.getElementById("geminiResponse").innerHTML = `
                    <p class="error">Error processing your manual entry: ${error.message}</p>
                    <button class="analyze-report-btn" onclick="fetchResults()">Retry Analysis</button>
                `;
            }
        } else {
            document.getElementById("analysisContent").innerHTML = `
                <p class="error">No input data found. Please upload a PDF or enter data manually from the main page.</p>
            `;
        }
    }

    // Create a temporary form for file uploads
    const form = document.createElement("form");
    form.id = "tempForm";
    form.style.display = "none";
    document.body.appendChild(form);

    // Determine the input type and proceed accordingly
    const inputType = localStorage.getItem("inputType");
    if (inputType === "file") {
        // Retrieve the file data from localStorage
        const fileData = localStorage.getItem("uploadedFile");
        if (fileData) {
            const file = dataURLtoFile(fileData, "uploaded.pdf");
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.name = "file";
            fileInput.files = dataTransfer.files;
            form.appendChild(fileInput);
            fetchResults();
        } else {
            document.getElementById("analysisContent").innerHTML = `
                <p class="error">No file data found. Please upload a PDF from the main page.</p>
            `;
        }
    } else if (inputType === "manual") {
        // For manual entry, just call fetchResults to retrieve the data
        fetchResults();
    } else {
        document.getElementById("analysisContent").innerHTML = `
            <p class="error">No input data found. Please upload a PDF or enter data manually from the main page.</p>
        `;
    }

    // Helper function to convert data URL to File
    function dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    // Clean up localStorage after use
    localStorage.removeItem("uploadedFile");
    localStorage.removeItem("manualHealthData");
    localStorage.removeItem("inputType");

    // Display health report with animation (same as before)
    function displayHealthReportAnimated(healthReport, healthData) {
        const geminiResponse = document.getElementById("geminiResponse");
        geminiResponse.innerHTML = ""; // Clear loading indicator

        // Create sections with proper formatting
        const sections = [
            {
                title: "Overall Assessment",
                content: healthReport.overallAssessment || "No assessment available",
                type: "paragraph",
            },
            {
                title: "Potential Risks",
                content: healthReport.potentialRisks || [],
                type: "list",
            },
            {
                title: "Possible Causes",
                content: healthReport.possibleCauses || [],
                type: "list",
            },
            {
                title: "Lifestyle Changes",
                content: healthReport.lifestyleChanges || [],
                type: "list",
            },
            {
                title: "Potential Supplementation Requirements",
                content: healthReport.potentialSupplements || [],
                type: "list",
            },
            {
                title: "Additional Recommendations",
                content: healthReport.additionalRecommendations || [],
                type: "list",
            },
        ];

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
                    const geminiResponseSection = document.querySelector(".gemini-response-section");
                    if (geminiResponseSection) {
                        geminiResponseSection.remove();
                    }

                    // Add loading state back
                    document.getElementById("analysisContent").innerHTML += `
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

                    // Send request again to regenerate
                    fetchResults();
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
                    currentListContainer = document.createElement("ul");
                    currentListContainer.className = "health-report-list";
                    contentContainer.appendChild(currentListContainer);

                    // Start with the first list item
                    currentElement = null;
                    currentListIndex = 0;

                    // Check if content is a valid array and has items
                    if (Array.isArray(section.content) && section.content.length > 0) {
                        currentElement = document.createElement("li");
                        currentElement.className = "health-report-list-item typing";
                        currentListContainer.appendChild(currentElement);
                        characterIndex = 0;
                    } else {
                        // If no items or invalid data, add a placeholder message
                        const placeholderItem = document.createElement("li");
                        placeholderItem.className = "health-report-list-item";
                        placeholderItem.textContent = "No data available";
                        currentListContainer.appendChild(placeholderItem);

                        // Move to next section
                        sectionIndex++;
                        setTimeout(typeSection, 200);
                        return;
                    }
                }
            }

            if (section.type === "paragraph") {
                // Type paragraph content character by character
                const content = String(section.content || "");
                if (characterIndex < content.length) {
                    currentElement.textContent += content.charAt(characterIndex);
                    characterIndex++;
                    setTimeout(typeSection, 5 + Math.random() * 10);
                } else {
                    // Move to next section
                    currentElement.classList.remove("typing");
                    currentElement = null;
                    sectionIndex++;
                    setTimeout(typeSection, 200);
                }
            } else if (section.type === "list") {
                // Handle list items
                if (Array.isArray(section.content) && currentListIndex < section.content.length) {
                    const item = String(section.content[currentListIndex] || "");
                    
                    // Type this list item
                    if (characterIndex < item.length) {
                        currentElement.textContent += item.charAt(characterIndex);
                        characterIndex++;
                        setTimeout(typeSection, 5 + Math.random() * 10);
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
                } else {
                    // Something's wrong with the data, move to the next section
                    sectionIndex++;
                    setTimeout(typeSection, 200);
                }
            }
        }

        // Start the typing animation
        setTimeout(typeSection, 300);
    }

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
    document.getElementById("downloadPdfBtn").addEventListener("click", function () {
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
        doc.text("Your Health Report Analysis", pageWidth / 2, 20, { align: "center" });

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
                    element.tagName === "H3" ||
                    element.classList.contains("health-report-title")
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
                    const fontSize = element.tagName === "H1" ? 16 : element.tagName === "H2" ? 14 : 12;
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