# Project Details
This project will demonstrate a cloud deployed perception system in which a web-based client interacts with a containerized object detection service. The emphasis is on infrastructure design and deployment practices, using containerization to package services and CloudLab to simulate a realistic distributed environment.

# Visual
```mermaid
---
config:
  theme: neutral
---
flowchart LR
  A("Browser<br/>(Client)") -->|"HTTP<br/>localhost:8081"| B("Frontend Container<br/>(Node.js / Express)")

  B -->|"REST API<br/>POST /detect"| C("Backend Container<br/>(Flask + YOLOv8)")

  subgraph DN["Docker Network (Bridge)"]
    B
    C
  end

  style DN color:#000000,fill:#D6D6D6,stroke:#BBDEFB
  style A color:#FFFFFF,fill:#424242,stroke:#C8E6C9
  style B color:#FFFFFF,fill:#424242,stroke:#BBDEFB
  style C color:#FFFFFF,fill:#424242,stroke:#FFCDD2
```


# Proposal
The web client will be containerized using a Node.js base image (node:18-alpine) to serve the frontend assets through an Express server. The detection service will be implemented using Flask and containerized with a python base image (python:3.10-slim). The backend will use the YOLOv8 model to process images and return detected results.

Docker will be used for building and running containers during development, and the services will be deployed on a separate CloudLab Nodes to simulate a realistic multi-component cloud environment. The detection API will be exposed over HTTP on port 5002, and the web client will communicate with it using REST requests (POST /detect) by sending image data and recieving processed images in response.


# Frontend Dockerfile ([View File](./frontend/Dockerfile))

### FROM node:18-alpine
Using a Node.js image
I chose this image because it is a lightweight, ready-to-depoly image to host the frontend

### WORKDIR /apps
Changes the directory to /apps inside of the newly created container

### COPY package.json .
Copies package.json into the container
This contains all dependencies needed

### RUN npm install
Installs all dependencies listed in package.json

### COPY . .
Copies all files into the container

### EXPOSE 3000
Exposes port 3000 (this is where the frontend runs inside the container)

### CMD ["node", "server.js"]
Runs the Node.js server using server.js
This starts the Express server that serves the frontend


# Backend Dockerfile ([View File](./yolov8/Dockerfile))
### FROM python:3.10-slim
Using a python image
I chose this because it supports the backend and provides compatibility with the required libraries

### WORKDIR /app
Changes the directory to /app inside of the newly created container

### COPY . .
Copies all files into the container

### RUN apt-get update && apt-get install -y \ libgl1 \ libglib2.0-0
Updates packages and installs required system libraries
These are needed for OpenCV and YOLO to run properly
-y auto says yes to any confirmations

### RUN pip install --no-cache-dir -r requirements.txt
Installs all Python libraries needed for the backend. 
--no-cache-dir ensures pip does not store downloaded packages in cache
-r is requirements and tells pip to install packages from requirements.txt

### CMD ["python", "app.py"]
Runs the backend using app.py
The backend listens on port 5002


# Network Docker-compose ([View File](docker-compose.yml))
The backend (Flask) runs on port 5002

The frontend runs on port 3000 and is exposed to the browser at 8081

The containers communicate using a Docker bridge network

### depends_on: - flask
Makes sure that the backend starts before the frontend

### Communication
Docker automatically provides DNS resolution, allowing containers to communicate using service names instead of IP addresses

SO instead of using IP addresses the containers communicate by their service names

### Flow of requests
Browser -> localhost:8081 -> frontend (Node.js)

frontend -> flask:5002 -> backend (Flask)

backend -> returns processed image -> frontend -> browser
