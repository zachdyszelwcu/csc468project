from ultralytics import YOLO
import cv2

model = YOLO("yolov8s.pt")

def get_camera():
    for i in range(5):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f"Using camera index {i}")
            return cap
    print("No camera found")
    return None

def generate_frames():
    cap = get_camera()

    if cap is None:
        return

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)

        annotated_frame = results[0].plot()

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
