document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = window.location.origin.replace("8081", "5002");

    const uploadInput = document.getElementById("file-upload");

    if (uploadInput) {
        uploadInput.addEventListener("change", async () => {
            const file = uploadInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await fetch(`${API_BASE}/detect`, {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) {
                    alert("Server error");
                    return;
                }

                const blob = await res.blob();

                const reader = new FileReader();

                reader.onload = function(e) {
                    localStorage.setItem("uploadedImage", e.target.result);
                    console.log("Redirecting...");
                    window.location.href = "upload.html";
                };

                reader.readAsDataURL(blob);
                uploadInput.value = "";

            } catch (err) {
                console.error("Upload failed:", err);
                alert("Upload failed");
            }
        });
    }

    const saveBtn = document.getElementById("saveBtn");

    if (saveBtn) {
        saveBtn.disabled = true;

        saveBtn.addEventListener("click", async () => {
            try {
                const res = await fetch(`${API_BASE}/save`, {
                    method: "POST"
                });

                

                const data = await res.json();

                if (!res.ok) {
                    alert(data.error || "Save failed");
                } else {
                    alert(data.message);
                }

            } catch (err) {
                console.error("Save failed:", err);
                alert("Server error");
            }
        });
        loadGallery();
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

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

async function loadGallery() {
    try {
        const API_BASE = window.location.origin.replace("8081", "5002");

        const res = await fetch(`${API_BASE}/gallery`);
        const data = await res.json();

        if (!res.ok) {
            console.error(data.error);
            return;
        }

        if (!data.images || data.images.length === 0) {
            console.log("No images found");
            return;
        }

        const carousel = document.querySelector(".carousel");
        carousel.innerHTML = "";

        data.images.forEach(url => {
            const cell = document.createElement("div");
            cell.className = "carousel__cell";

            const img = document.createElement("img");
            img.src = url;

            cell.appendChild(img);
            carousel.appendChild(cell);
        });

        initCarousel();

    } catch (err) {
        console.error("Failed to load gallery:", err);
    }
}

function initCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;

    var cells = carousel.querySelectorAll('.carousel__cell');
    var selectedIndex = 0;
    var cellWidth = carousel.offsetWidth;
    var cellHeight = carousel.offsetHeight;
    var isHorizontal = true;
    var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
    var radius, theta;

    function rotateCarousel() {
        var angle = theta * selectedIndex * -1;
        carousel.style.transform =
            'translateZ(' + -radius + 'px) ' +
            rotateFn + '(' + angle + 'deg)';
    }

    var prevButton = document.querySelector('.previous-button');
    if (prevButton) {
        prevButton.onclick = () => {
            selectedIndex--;
            rotateCarousel();
        };
    }

    var nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.onclick = () => {
            selectedIndex++;
            rotateCarousel();
        };
    }

    function changeCarousel() {
        var cellCount = cells.length;
        theta = 360 / cellCount;

        var cellSize = isHorizontal ? cellWidth : cellHeight;
        radius = Math.round((cellSize / 2) / Math.tan(Math.PI / cellCount));

        cells.forEach((cell, i) => {
            var cellAngle = theta * i;

            cell.style.opacity = 1;
            cell.style.transform =
                rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
        });

        rotateCarousel();
    }

    changeCarousel();
}
loadGallery();
});