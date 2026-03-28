from flask import Flask, Response
from yolov8 import generate_frames

app = Flask(__name__)

@app.route("/")
def home():
    return "Backend running"

@app.route("/video")
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
