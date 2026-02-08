# csc468project



```mermaid
flowchart LR
    A("Frontend<br>(Web Client)") -- POST /detect
image payload --> B("Detection API<br>(FastAPI + YOLOv8)")

    style A color:#FFFFFF,fill:#424242,stroke:#616161
    style B color:#FFFFFF,fill:#424242,stroke:#616161
