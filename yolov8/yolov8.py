from ultralytics import YOLO
import cv2

model = YOLO("yolov8s.pt")

def generate_frames():
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("ERROR: Camera not opening")
        return

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)
        annotated = results[0].plot()

        _, buffer = cv2.imencode('.jpg', annotated)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
