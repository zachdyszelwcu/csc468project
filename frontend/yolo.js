document.addEventListener("DOMContentLoaded", () => {

    const title = document.querySelector(".Title");
    if (title) {
        const text = title.textContent;
        title.innerHTML = "";

        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;

            const confidence = (0.78 + Math.random() * (0.99 - 0.78)).toFixed(2);
            span.setAttribute("data-label", "Letter " + char + " " + confidence);

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

    const video = document.getElementById("cameraFeed");

    if (video) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(err => {
                console.error("Camera error:", err);
            });
    }

    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            runDetection();
        });
    }

});

async function runDetection() {
    const resultsDiv = document.getElementById("results");

    if (resultsDiv) {
        resultsDiv.innerHTML = "Running detection...";
    }

    try {
        const response = await fetch("http://flask:5000/detect");
        const data = await response.json();

        console.log(data);

        if (resultsDiv) {
            resultsDiv.innerHTML = "";

            if (data.error) {
                resultsDiv.textContent = data.error;
                return;
            }

            if (data.length === 0) {
                resultsDiv.textContent = "No objects detected";
                return;
            }

            data.forEach(item => {
                const p = document.createElement("p");
                p.textContent = `Class: ${item.class} | Confidence: ${item.confidence.toFixed(2)}`;
                resultsDiv.appendChild(p);
            });
        }

    } catch (err) {
        if (resultsDiv) {
            resultsDiv.textContent = "Error connecting to backend";
        }
        console.error(err);
    }
}
