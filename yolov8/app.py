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

    if img is None:
        return jsonify({ "image": None })

    img = cv2.resize(img, (640, 480))

    results = model(img, conf=0.3)
    annotated = results[0].plot()

    _, buffer = cv2.imencode('.jpg', annotated)
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    return jsonify({
        "image": img_base64
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
