FROM python:3.10-slim

WORKDIR /apps


RUN apt-get update && apt-get install -y \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py /
COPY yolov8.py /

EXPOSE 5000

CMD ["python", "app.py", "yolov8.py"]
