# Project Details


# Visual
```mermaid
---
config:
  theme: neutral
---
flowchart LR
  A("Web Client") -->|"HTTP (REST)<br/>POST /detect<br/>image payload"| B("Detection API<br/>(FastAPI + YOLOv8)")

  style A color:#FFFFFF,fill:#424242,stroke:#C8E6C9
  style B color:#FFFFFF,fill:#424242,stroke:#FFCDD2
  linkStyle 0 stroke:#FFFFFF
