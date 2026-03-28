from flask import Flask, request, jsonify
import base64
import numpy as np
import cv2
from ultralytics import YOLO

app = Flask(__name__)

model = YOLO("yolov8s.pt")

@app.route("/")
def home():
    return "Backend running"

@app.route("/detect", methods=["POST"])
def detect():
    data = request.json["image"]

    encoded = data.split(",")[1]
    img_bytes = base64.b64decode(encoded)

    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    results = model(img)

    detections = []

    for r in results:
        for box in r.boxes:
            detections.append({
                "class": int(box.cls[0]),
                "confidence": float(box.conf[0])
            })

    return jsonify(detections)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
