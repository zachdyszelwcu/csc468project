# csc468project

```mermaid
flowchart LR
  A["Web Client"] -->|"HTTP<br/>POST /detect (image)"| B["Detection API<br/>FastAPI + YOLOv8"]
