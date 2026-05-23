# SysML Visualisation — Radar Ingestion Workflow
 
A proof of concept exploring whether SysML diagrams can be visualised effectively without dedicated modelling tools such as Cameo or Sparx EA, using lightweight alternatives like HTML/JavaScript or PlantUML.
 
---
 
## Purpose
 
This repository is an experiment to answer a simple question: **can you produce meaningful SysML visualisations without a heavyweight modelling tool?**
 
The radar ingestion workflow was used as the subject domain — a well-defined system with clear sub-component decomposition — to test two different rendering approaches and evaluate their practicality, accuracy, and ease of modification.
 
---
 
## What Was Tested
 
### Approach 1 — PlantUML (`.puml`)
Initial diagrams were produced as PlantUML files covering the radar ingestion workflow and a parallel Hybrid Navy flow. This approach was superseded due to rendering constraints in environments without a PlantUML JAR or web server available.
 
The `.puml` files are retained in `radar-sysml/` for reference.
 
### Approach 2 — Local Web App (HTML + Vanilla JS)
A lightweight local web application was built as an alternative, rendering SysML Activity Diagrams and Block Definition Diagrams (BDD) entirely in-browser using vanilla JavaScript SVG — no external libraries, no CDN, no internet connection required.
 
This was the preferred approach for environments where tooling installation is restricted.
 
---
 
## Project Structure
 
```
SysML-Visualisation-Tool-Exclusion/
│
├── radar-webapp/               # HTML/JS web app approach
│   ├── index.html              # Landing page / diagram selector
│   ├── activity.html           # Activity diagram viewer
│   ├── bdd.html                # Block Definition Diagram viewer
│   ├── rationale.html          # Design decision documentation
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── activity.js         # Activity diagram data and renderer
│   │   └── bdd.js              # BDD data and renderer
│   ├── start.sh                # Linux/macOS launcher
│   └── start.bat               # Windows launcher
│
├── radar-sysml/                # PlantUML approach (superseded)
│   ├── radar_ingestion_sysml.puml
│   ├── radar_bdd_sysml.puml
│   └── README.md
│
└── PROMPTS.md                  # Full prompt log from the session
```
 
---
 
## Running the Web App
 
```bash
cd radar-webapp
python3 -m http.server 8080
```
 
Then open `http://localhost:8080` in a browser. Alternatively use `start.sh` (Linux/macOS) or `start.bat` (Windows).
 
---
 
## Subject Domain
 
The radar workflow is grounded in real marine radar specifications including sub-components (magnetron, modulator, TR cell, IF amplifier, etc.), operational parameters (PRF 500–4000 pps, 12–30 RPM), accuracy figures (±30 m / 1%, ±1°), and SOLAS/IMO requirements (MSC.192(79)).
 
All domain knowledge used to populate the diagrams is derived from publicly available sources found via Google — no restricted, classified, or proprietary system information has been used.
 
---
 
## Technologies
 
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![PlantUML](https://img.shields.io/badge/PlantUML-lightgrey?style=flat)
![SysML](https://img.shields.io/badge/SysML-0066CC?style=flat)
 
---
 
## Disclaimer
 
> **All technical information used in this repository — including radar specifications, sub-component details, operational parameters, and regulatory references — is sourced entirely from publicly available information accessible via Google and open web sources. No proprietary, classified, restricted, or confidential information has been used. This repository is a personal learning experiment and does not represent the work, data, or intellectual property of any employer or client.**
 
