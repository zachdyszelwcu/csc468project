from flask import Flask, request, send_file
from flask_cors import CORS
from flask import request
import numpy as np
import cv2
from ultralytics import YOLO
import io
import os
from datetime import datetime
from minio import Minio
import random


app = Flask(__name__)
CORS(app)

client = Minio(
    "minio:9000",
    access_key="zachminioadmin",
    secret_key="zachminioadmin",
    secure=False
)

SAVE_DIR = "static/gallery"

os.makedirs(SAVE_DIR, exist_ok=True)

model = YOLO("yolov8s.pt")

try:
    if not client.bucket_exists("gallery"):
        client.make_bucket("gallery")
except Exception as e:
    print("MinIO bucket error:", e)

@app.route("/")
def home():
    return "Backend running"

LAST_IMAGE_PATH = None

@app.route("/detect", methods=["POST"])
def detect():
    global LAST_IMAGE_PATH

    file = request.files["image"].read()

    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(img)
    annotated = results[0].plot()

    filename = f"detected_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    filepath = os.path.join(SAVE_DIR, filename)

    cv2.imwrite(filepath, annotated)

    LAST_IMAGE_PATH = filepath

    _, buffer = cv2.imencode(".jpg", annotated)

    return send_file(io.BytesIO(buffer), mimetype="image/jpeg")

@app.route("/image/<filename>")
def get_image(filename):
    try:
        response = client.get_object("gallery", filename)
        return response.read(), 200, {'Content-Type': 'image/jpeg'}
    except Exception as e:
        print("Image fetch error:", e)
        return {"error": "Image not found"}, 404

@app.route("/save", methods=["POST"])
def save_to_minio():
    global LAST_IMAGE_PATH

    if not LAST_IMAGE_PATH:
        return {"error": "No image to save"}, 400

    filename = os.path.basename(LAST_IMAGE_PATH)

    print("Uploading to MinIO:", filename)

    try:
        client.fput_object(
            "gallery",
            filename,
            LAST_IMAGE_PATH
        )
        return {"message": "Saved to MinIO"}

    except Exception as e:
        print("Upload error:", e)
        return {"error": "Upload failed"}, 500
    

@app.route("/gallery", methods=["GET"])
def get_gallery():
    try:
        base_url = request.host_url

        objects = client.list_objects("gallery", recursive=True)
        files = [obj.object_name for obj in objects]

        if not files:
            return {"images": []}

        files.sort(reverse=True)

        latest = files[0]
        remaining = files[1:]
        random.shuffle(remaining)

        selected = [latest] + remaining[:5]

        urls = [
            f"{base_url}image/{name}"
            for name in selected
        ]

        return {"images": urls}

    except Exception as e:
        print("Gallery error:", e)
        return {"error": "Failed to load gallery"}, 500
    
    
@app.route("/upload", methods=["POST"])
def upload_to_minio():
    if "image" not in request.files:
        return {"error": "No file provided"}, 400

    file = request.files["image"]

    if file.filename == "":
        return {"error": "Empty filename"}, 400

    filename = f"upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"

    try:
        client.put_object(
            "gallery",
            filename,
            file.stream,
            length=-1,
            part_size=10*1024*1024,
            content_type=file.content_type
        )

        base_url = request.host_url

        url = f"{base_url}image/{filename}"

        return {"message": "Upload successful", "url": url}  

    except Exception as e:
        print("Upload error:", e)
        return {"error": "Upload failed"}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
