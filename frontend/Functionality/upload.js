class FileUploader {
    constructor() {
        this.form = document.getElementById('uploadForm');
        this.input = document.getElementById('reportInput');
        this.button = document.getElementById('analyzeBtn');
        this.statusText = document.getElementById('uploadText');
        this.uploadBox = document.querySelector('.upload-box');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', e => e.preventDefault());
        this.input.addEventListener('change', e => this.handleFileSelect(e));
        this.button.addEventListener('click', e => this.handleUpload(e));
        this.setupDragDrop();
    }

    setupDragDrop() {
        this.uploadBox.addEventListener('dragover', e => {
            e.preventDefault();
            this.uploadBox.style.borderColor = "#5e17eb";
        });

        this.uploadBox.addEventListener('dragleave', () => {
            this.uploadBox.style.borderColor = "rgba(94, 23, 235, 0.5)";
        });

        this.uploadBox.addEventListener('drop', e => {
            e.preventDefault();
            this.uploadBox.style.borderColor = "rgba(94, 23, 235, 0.5)";
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === "application/pdf") {
                this.input.files = files;
                this.handleFileSelect({ target: this.input });
            }
        });
    }

    handleFileSelect(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            this.statusText.textContent = `Selected file: ${fileName}`;
            this.button.disabled = false;
        } else {
            this.statusText.textContent = "Drag & Drop your PDF here or click to upload";
            this.button.disabled = true;
        }
    }

    async handleUpload(e) {
        e.preventDefault();
        const file = this.input.files[0];
        if (!file) return;

        this.button.disabled = true;
        this.button.textContent = "Processing...";
        this.showProgress();

        try {
            const result = await this.uploadFile(file);
            this.saveAndRedirect(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    showProgress() {
        const statusDiv = document.createElement('div');
        statusDiv.innerHTML = `
            <div style="margin-top: 20px; text-align: center;">
                <p id="statusText">Uploading PDF...</p>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                         role="progressbar" style="width: 0%"></div>
                </div>
            </div>
        `;
        this.uploadBox.after(statusDiv);
    }

    uploadFile(file) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100;
                    const progressBar = document.querySelector('.progress-bar');
                    if (progressBar) progressBar.style.width = percent + '%';
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Upload failed'));
            xhr.open('POST', 'http://localhost:5000/upload_report', true);
            xhr.send(formData);
        });
    }

    saveAndRedirect(result) {
        localStorage.setItem('inputType', 'file');
        localStorage.setItem('uploadedParameters', JSON.stringify(result));
        document.location.href = 'result.html';
    }

    handleError(error) {
        console.error('Upload error:', error);
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = "An error occurred. Please try again.";
        }
        this.button.disabled = false;
        this.button.textContent = "Upload & Analyze";
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new FileUploader();
});