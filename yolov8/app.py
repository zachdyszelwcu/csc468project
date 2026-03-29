from flask import Flask, request, send_file
import numpy as np
import cv2
from ultralytics import YOLO
import io

app = Flask(__name__)

model = YOLO("yolov8s.pt")

@app.route("/")
def home():
    return "Backend running"

@app.route("/detect", methods=["POST"])
def detect():
    file = request.files["image"].read()

    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(img)
    annotated = results[0].plot()

    _, buffer = cv2.imencode(".jpg", annotated)

    return send_file(
        io.BytesIO(buffer),
        mimetype="image/jpeg"
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
