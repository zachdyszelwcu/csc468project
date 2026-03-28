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
                console.error(err);
            });
    }

    const canvas = document.getElementById("snapshot");

    if (canvas && video) {
        const ctx = canvas.getContext("2d");

        async function sendFrame() {
            if (!video.videoWidth) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL("image/jpeg");

            try {
                const response = await fetch("http://localhost:5001/detect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ image: imageData })
                });

                const data = await response.json();

                const resultsDiv = document.getElementById("results");

                if (resultsDiv) {
                    resultsDiv.innerHTML = "";

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
                console.error(err);
            }
        }

        setInterval(sendFrame, 500);
    }

});
