from flask import Flask, request, send_file
from flask_cors import CORS
from flask import request
import numpy as np
import cv2
from ultralytics import YOLO
import io
import os
from datetime import datetime
import random
import boto3


app = Flask(__name__)
CORS(app)

model = YOLO("yolov8m.pt")


s3 = boto3.client("s3")
BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
print("BUCKET NAME:", BUCKET_NAME)

LAST_IMAGE_BUFFER = None
LAST_FILENAME = None


@app.route("/")
def home():
    return "Backend running"


@app.route("/detect", methods=["POST"])
def detect():
    global LAST_IMAGE_BUFFER, LAST_FILENAME

    file = request.files["image"].read()

    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(img, conf=0.6, iou=0.5)
    annotated = results[0].plot()

    filename = f"detected_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"

    _, buffer = cv2.imencode(".jpg", annotated)

    LAST_IMAGE_BUFFER = buffer
    LAST_FILENAME = filename

    return send_file(io.BytesIO(buffer), mimetype="image/jpeg")

@app.route("/save", methods=["POST"])
def save_to_s3():
    global LAST_IMAGE_BUFFER, LAST_FILENAME

    if LAST_IMAGE_BUFFER is None:
        return {"error": "No image to save"}, 400

    try:
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=LAST_FILENAME,
            Body=LAST_IMAGE_BUFFER.tobytes(),
            ContentType="image/jpeg",
        )

        url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{LAST_FILENAME}"

        return {"message": "Saved to S3", "url": url}

    except Exception as e:
        print("Upload error:", e)
        return {"error": "Upload failed"}, 500
    

@app.route("/gallery", methods=["GET"])
def get_gallery():
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME)

        contents = response.get("Contents", [])
        if not contents:
            return {"images": []}

        files = [obj["Key"] for obj in contents]

        files = sorted(files, reverse=True)

        latest = files[0]
        remaining = files[1:]
        random.shuffle(remaining)

        selected = [latest] + remaining[:5]

        urls = [
            f"https://{BUCKET_NAME}.s3.amazonaws.com/{name}"
            for name in selected
        ]

        return {"images": urls}

    except Exception as e:
        print("Gallery error FULL:", str(e))
        return {"error": str(e)}, 500
    
    
@app.route("/upload", methods=["POST"])
def upload_to_s3():
    if "image" not in request.files:
        return {"error": "No file provided"}, 400

    file = request.files["image"]

    if file.filename == "":
        return {"error": "Empty filename"}, 400

    filename = f"upload_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"

    try:
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            filename,
            ExtraArgs={
                "ContentType": file.content_type,
                "ACL": "public-read"
            }
        )
        url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"

        return {"message": "Upload successful", "url": url}

    except Exception as e:
        print("Upload error:", e)
        return {"error": "Upload failed"}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
    #test
