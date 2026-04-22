# SysML – Marine Radar Ingestion & Hybrid Navy Workflow

**Source:** Merchant Navy Decoded – Marine Radar: The Complete Guide About Marine Radar

---

## Overview

This project delivers a SysML model of the marine radar ingestion pipeline and a parallel Hybrid Navy
integration flow, structured as a fully offline local web application.

---

## Project Structure

```
FADS/
├── radar-webapp/              ← PRIMARY DELIVERABLE (use this)
│   ├── index.html             · Home page and navigation
│   ├── activity.html          · SysML Activity Diagram (5 swim lanes)
│   ├── bdd.html               · SysML Block Definition Diagram
│   ├── rationale.html         · Full decisions & rationale document
│   ├── css/style.css          · Shared stylesheet
│   ├── js/
│   │   ├── app.js             · Navigation utility
│   │   ├── activity.js        · Activity diagram data + SVG renderer
│   │   └── bdd.js             · BDD data + SVG renderer
│   ├── start.sh               · Mac / Linux launcher
│   └── start.bat              · Windows launcher
│
└── radar-sysml/               ← SUPERSEDED – kept for reference only
    ├── radar_ingestion_sysml.puml
    ├── radar_bdd_sysml.puml
    └── README.md  (this file)
```

> **Note:** The `.puml` files in `radar-sysml/` were the initial output and have been superseded by the
> web app. They are retained for reference. Do not use them as the primary artefact.

---

## How to Run

### Mac / Linux
```bash
cd radar-webapp
./start.sh
```

### Windows
Double-click `radar-webapp/start.bat`

### Manual (any OS with Python 3)
```bash
cd radar-webapp
python3 -m http.server 8080
```

Then open **http://localhost:8080** in any browser. No internet connection required.

---

## How to Modify the Diagrams

All diagram content is defined as plain JavaScript data objects — no rendering code needs to be touched.

### Activity Diagram
Open `radar-webapp/js/activity.js` and edit the arrays at the top of the file:

| Array | What it controls |
|---|---|
| `LANES` | Lane names, background colours, header colours |
| `ROWS` | Every step in the flow — labels, types, lane assignment, annotations |

**To add a step:** insert a new object into `ROWS` with `type: 'process'` and the correct `lane` id.  
**To add a parallel branch:** put multiple node objects in one row's `items[]` array.  
**To add a decision:** use `type: 'decision'`.  
**To rename anything:** change the `label` field. Use `\n` for line breaks within a label.

### Block Definition Diagram
Open `radar-webapp/js/bdd.js` and edit:

| Array | What it controls |
|---|---|
| `BLOCKS` | Block names, stereotypes, positions, compartment content |
| `CONNECTIONS` | Relationships between blocks (type, label) |

---

## Format Decision — Why a Local Web App

| Format | Offline | Editable | No Install | Verdict |
|---|---|---|---|---|
| PlantUML (.puml) | Partial — needs JAR or web server | Yes | No | Rejected — web dependency |
| Mermaid | Partial — needs CDN bundle | Yes | No | Rejected — web dependency |
| Draw.io XML | Yes — needs desktop app | Yes | No | Not selected — requires install |
| Static SVG | Yes | Hard — raw XML | Yes | Not selected — poor modifiability |
| **Local web app** | **Yes — Python built-in** | **Yes — edit JS data** | **Yes** | **Selected** |

Python 3 is pre-installed. `python3 -m http.server` requires no additional packages.
Diagram data is separated from rendering code so non-developers can make changes without
touching the SVG renderer.

---

## Diagram Types

### SysML Activity Diagram (`activity.html`)

Five swim lanes derived directly from the source article's hardware sections:

| Lane | Source Section | Coverage |
|---|---|---|
| Transmitter Layer | §4.1 | Power supply → delay line → modulator → magnetron → TR switch |
| Scanner / Aerial Layer | §4.2 | 12–30 RPM rotation, PRF 500–4000 pps, Monkey Island, echo reception |
| Receiver / Signal Processing | §4.3 | TR cell → LO + Mixer → IF Amp → Video Amp → Demodulator; range & bearing fork |
| Display & Plotting | §4.4, §7, §8 | CRT/PPI, ARPA/EPA decision (SOLAS), sensor failure alarm, standby logic |
| Hybrid Navy Integration | Parallel fork | AIS → Satellite/ECDIS/UAV → AI Classifier → Sensor Fusion → IBS → Collision Avoidance DSS |

### SysML Block Definition Diagram (`bdd.html`)

Shows system structure: `MarineRadarSystem` composed of Transmitter, Scanner, Receiver, Display,
with ARPA/EPA usage relationships, X-Band/S-Band specializations, and `HybridNavySystem` connected
via a `«parallel flow»` stereotype.

---

## Source Traceability

| Flow Step | Source Section | Extracted Detail |
|---|---|---|
| Power Supply → Trigger → Modulator → Magnetron | §4.1 Transmitter | Sub-units of the transmitter described verbatim |
| TR Switch (Transmit Mode) → waveguide/coaxial | §4.1 | "fed by a waveguide or a coaxial cable into the transmitter-receiver switch" |
| Scanner · PRF 500–4000 · 12–30 RPM · Monkey Island | §4.2 Scanner | "Pulse Repetition Frequency… constant speed of rotation… located on Monkey Island" |
| TR Cell → LO → Mixer → IF Amp → Video Amp → Demodulator | §4.3 Receiver | Full receiver chain; "demodulator which smoothens out the signal" |
| PPI / CRT · Bird's Eye View · one trace per pulse | §4.4 Display | "Cathode Ray Tube… Bird's Eye View… one radial line (called the trace) is created for every pulse" |
| Range: ±30 m or 1% of range scale | §5.1 + §8 IMO | Tracing spot speed = ½ radio wave speed; IMO MSC.192(79) |
| Bearing: ±1° | §5.2 + §8 IMO | "PRF so high compared to RPM that the angle rotated… is negligible" |
| X-Band: 9 GHz / 3 cm · high resolution · short range | §6.1 | Susceptible to rain attenuation; required ships >300 GT |
| S-Band: 3 GHz / 10 cm · long range · weather resistant | §6.2 | Lower resolution than X-Band; required ships >3000 GT |
| EPA: ships >300 GT | §7 SOLAS Ch.V | 9 GHz + Electronic Plotting Aid |
| ARPA: ships >3000 GT | §7 SOLAS Ch.V | Additional 3 GHz + ARPA |
| Cold start ≤4 min · Standby ≤5 sec · ≥2 VRMs · ≥4 index lines | §8 MSC.192(79) | IMO performance standards verbatim |
| Sensor failure alarm (gyro, log, video, sync, heading) | §8 MSC.192(79) | "Failure of any signal or sensor in use… should be alarmed" |

---

## Hybrid Navy Parallel Flow

Runs in parallel (SysML fork) from the Display & Plotting stage onward.
Modelled as parallel because AIS, satellite, and ECDIS feeds ingest continuously
and independently of radar scan cycles — they cannot wait for the radar pipeline to complete.

| Component | Role |
|---|---|
| AIS Receiver | Vessel identity (MMSI, name, COG, SOG) — unavailable from radar echo alone |
| Satellite Data Feed | VDES / GNSS augmentation for position accuracy |
| ECDIS Overlay | Real-time electronic navigational chart fusion |
| Drone / UAV Feed | Beyond-horizon situational awareness |
| AI / ML Classifier | Vessel type, anomaly detection, threat scoring |
| Sensor Fusion Engine | Unifies radar + AIS + satellite + UAV into a single authoritative track |
| Integrated Bridge System | Unified operational picture for Officer of the Watch |
| Collision Avoidance DSS | COLREGS-aware course recommendations |

Full design rationale for all decisions is documented in `radar-webapp/rationale.html`.

---

## Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-04-21 | Initial SysML model created as PlantUML (.puml) files | First pass based on source article |
| 2026-04-21 | Format changed to local web app (HTML/CSS/JS) | Defence environment constraint — no web-based or CDN-dependent tools |
| 2026-04-21 | Web app uses separate files, not single HTML | Easier to modify — diagram data separated from rendering logic |
