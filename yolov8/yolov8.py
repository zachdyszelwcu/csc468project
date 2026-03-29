from ultralytics import YOLO
import cv2

model = YOLO("yolov8s.pt")

def generate_frames():
    cap = None

    for i in range(5):
        cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
        print("Trying index", i, "Opened:", cap.isOpened())
        if cap.isOpened():
            print("Using camera index:", i)
            break

    if not cap or not cap.isOpened():
        print("ERROR: No camera found")
        return

    try:
        while True:
            success, frame = cap.read()
            print("Frame read:", success)

            if not success:
                continue

            results = model(frame)
            annotated = results[0].plot()

            ret, buffer = cv2.imencode('.jpg', annotated)
            if not ret:
                continue

            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    finally:
        cap.release()
