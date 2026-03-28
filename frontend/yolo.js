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

});
