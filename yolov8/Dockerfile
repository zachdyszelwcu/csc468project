FROM python:alpine

WORKDIR /apps

RUN pip install --no-cache-dir -r requirements.txt
COPY app.py /
COPY yolov8.py /

CMD ["python", "app.py", "worker.py"]

EXPOSE 5000
