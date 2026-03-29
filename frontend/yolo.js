document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const output = document.getElementById("output");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        });

    const ctx = canvas.getContext("2d");

    async function processFrame() {
        if (!video.videoWidth) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg");

        try {
            const response = await fetch("/detect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ image: imageData })
            });

            const data = await response.json();

            if (data.image) {
                output.src = "data:image/jpeg;base64," + data.image;
            }

        } catch (err) {
            console.error(err);
        }
    }

    video.addEventListener("loadeddata", () => {
        setInterval(processFrame, 500);
    });

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

});
