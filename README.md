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
The web client will be containerized using a Node.js base image (e.g., node:20-alpine) to serve the frontend assets. The detection service will be implemented using FastAPI and containerized with a python base image (e.g., python:3.11-slim) and Uvicorn as the application server. 

Docker will be used for building and running containers during development, and the services will be deployed on a separate CloudLab Nodes to simulate a realistic multi-component cloud environment. The detection API will be exposed over HTTP, and the web client will communicate with it using REST requests.


# Front-end
## Dockerfile ([View File](./frontend/Dockerfile))

# Back-end
## Dockerfile ([View File](./yolov8/Dockerfile))



# Network
## Docker-compose ([View File](docker-compose.yml))
