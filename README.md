# csc468project

```mermaid
flowchart LR
  A["Web Client (Frontend)"] -->|"POST /detect<br/>image payload"| B["Detection API<br/>(FastAPI + YOLOv8)"]
