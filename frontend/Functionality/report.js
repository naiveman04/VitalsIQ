// File upload handling
const reportFileInput = document.getElementById("reportInput"); // Renamed for clarity
const uploadStatusText = document.getElementById("uploadText"); // Renamed for clarity
const uploadAnalyzeBtn = document.getElementById("analyzeBtn"); // Renamed for clarity

// Update upload text and button state when a file is selected
reportFileInput.addEventListener("change", function () {
    if (reportFileInput.files.length > 0) {
        const fileName = reportFileInput.files[0].name;
        uploadStatusText.textContent = `Selected file: ${fileName}`;
        uploadAnalyzeBtn.disabled = false;
    } else {
        uploadStatusText.textContent = "Drag & Drop your PDF here or click to upload";
        uploadAnalyzeBtn.disabled = true;
    }
});

// Drag and drop functionality
const uploadArea = document.querySelector(".upload-box"); // Renamed for clarity
uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#5e17eb";
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "rgba(94, 23, 235, 0.5)";
});

uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "rgba(94, 23, 235, 0.5)";
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
        reportFileInput.files = files;
        uploadStatusText.textContent = `Selected file: ${files[0].name}`;
        uploadAnalyzeBtn.disabled = false;
    } else {
        uploadStatusText.textContent = "Please upload a valid PDF file";
        uploadAnalyzeBtn.disabled = true;
    }
});

// Analyze button click handler for PDF upload
uploadAnalyzeBtn.addEventListener("click", async function () {
    const file = reportFileInput.files[0];
    if (file) {
        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Send the file to the backend /upload_report endpoint
            const response = await fetch("http://localhost:5000/upload_report", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to process PDF");
            }

            // Store the analysis result in localStorage
            localStorage.setItem("analysisResult", JSON.stringify(result));
            localStorage.setItem("inputType", "file"); // Indicate that this is a file upload

            // Redirect to result.html
            window.location.href = "result.html";
        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert("An error occurred while uploading your PDF. Please try again.");
        }
    }
});

// Manual entry handling
const healthEntryForm = document.getElementById("manualEntryForm"); // Renamed for clarity
const submitHealthDataBtn = document.getElementById("manualAnalyzeBtn"); // Renamed for clarity

submitHealthDataBtn.addEventListener("click", async function () {
    // Collect form data
    const formData = new FormData(healthEntryForm);
    const healthParameters = {}; // Renamed for clarity

    // Map form inputs to an object
    formData.forEach((value, key) => {
        if (value.trim() !== "") {
            healthParameters[key] = value.trim();
        }
    });

    // Validate that at least one field is filled
    if (Object.keys(healthParameters).length === 0) {
        alert("Please enter at least one health parameter to analyze.");
        return;
    }

    try {
        // Send the manual entry data to the backend /analyze_health_data endpoint
        const response = await fetch("http://localhost:5000/analyze_health_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(healthParameters),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || "Failed to analyze health data");
        }

        // Store the analysis result in localStorage
        localStorage.setItem("analysisResult", JSON.stringify(result));
        localStorage.setItem("inputType", "manual"); // Indicate that this is a manual entry

        // Redirect to result.html
        window.location.href = "result.html";
    } catch (error) {
        console.error("Error submitting health parameters:", error);
        alert("An error occurred while analyzing your data. Please try again.");
    }
});