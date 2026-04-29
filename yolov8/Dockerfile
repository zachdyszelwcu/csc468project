FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN curl -L -o /app/yolov8m.pt \
    https://github.com/ultralytics/assets/releases/download/v8.4.0/yolov8m.pt

COPY . .

RUN useradd -m -u 1000 appuser

ENV HOME=/home/appuser
ENV TORCH_HOME=/home/appuser/.cache/torch
ENV YOLO_CONFIG_DIR=/home/appuser/.config/Ultralytics
ENV MPLCONFIGDIR=/home/appuser/.config/matplotlib

RUN mkdir -p /home/appuser/.cache/torch \
    /home/appuser/.config/Ultralytics \
    /home/appuser/.config/matplotlib \
    /tmp \
    && chown -R appuser:appuser /home/appuser \
    && chown -R appuser:appuser /app \
    && chown -R appuser:appuser /tmp

USER appuser

EXPOSE 5002

CMD ["python", "app.py"]
