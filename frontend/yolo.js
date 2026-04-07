document.addEventListener("DOMContentLoaded", () => {


    const fileInput = document.getElementById("file-upload");

    if (fileInput) {
        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
    
            if (!file) return;
    
            const validTypes = ["image/jpeg", "image/png"];
    
            if (!validTypes.includes(file.type)) {
                alert("Only JPG and PNG files are allowed.");
                fileInput.value = "";
                return;
            }
    
            // Optional: store file temporarily (so upload.html can use it)
            const reader = new FileReader();
            reader.onload = function (e) {
                localStorage.setItem("uploadedImage", e.target.result);
    
                // Redirect after storing
                window.location.href = "upload.html";
            };
            reader.readAsDataURL(file);
        });
    }

    const title = document.querySelector(".Title");
    if (title) {
        const text = title.textContent;
        title.innerHTML = "";

        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;

            const confidence = (0.78 + Math.random() * (0.99 - 0.78)).toFixed(2);
            span.setAttribute("data-label", "Char '" + char + "' " + confidence);

            title.appendChild(span);
        });
    }

    const cameraBtn = document.getElementById("cameraBtn");
    if (cameraBtn) {
        cameraBtn.addEventListener("click", () => {
            window.location.href = "camera.html";
        });
    }

    const uploadBtn = document.getElementById("photoBtn");
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            window.location.href = "upload.html";
        });
    }

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

});
