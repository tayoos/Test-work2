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

## Requirements Diagram (added 2026-04-23)

**Files:** `radar-webapp/requirements.html` + `radar-webapp/js/requirements.js`

20 requirements in 4 groups, rendered in a 4-column layout:

| Group | Colour | Requirements |
|---|---|---|
| REQ-SYS – System Performance | Blue (#1A6EA3) | Cold Start ≤4 min · Standby ≤5 sec · Range ±30 m/1% · Bearing ±1° |
| REQ-SOL – SOLAS Compliance | Red (#B71C1C) | X-Band Mandatory (>300 GT) · Plotting Aid · S-Band+ARPA (>3000 GT) · Min Display Standards |
| REQ-HYB – Hybrid Navy Integration | Teal (#00695C) | AIS Integration · Multi-Sensor Fusion · AI/ML Classification · Collision Avoidance DSS |
| REQ-HW – Hardware & Physical | Orange (#E65100) | Scanner Siting · PRF 500–4000 pps · Scan Rate 12–30 RPM · Receiver Chain Integrity |

Each `«requirement»` box shows: stereotype header, `id`, `name`, `text`, and source section reference. Parent `«requirementGroup»` boxes sit at the top of each column. A containment bracket (left-side vertical line with horizontal stubs and a filled circle) shows the SysML containment relationship.

All requirements cross-link to their corresponding Activity nodes, BDD blocks, and Use Cases. All three existing diagrams have back-links added to the requirements they satisfy.

---

## Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-04-21 | Initial SysML model created as PlantUML (.puml) files | First pass based on source article |
| 2026-04-21 | Format changed to local web app (HTML/CSS/JS) | Defence environment constraint — no web-based or CDN-dependent tools |
| 2026-04-21 | Web app uses separate files, not single HTML | Easier to modify — diagram data separated from rendering logic |
| 2026-04-23 | Diagrams upgraded from static to fully interactive | Requirement to move beyond static SVG render to explorable SysML model |
| 2026-04-24 | Use Case Diagram added; all three diagrams cross-linked | Requirement to add applicable use case diagrams and link elements across diagrams |
| 2026-04-23 | Requirements Diagram added; all four diagrams gain requirements links | Requirement to add SysML requirements diagrams and link them to all existing diagrams |

---

## Interactive Features (added 2026-04-23)

All interactivity is vanilla JavaScript — no CDN, no external libraries, fully offline.
New shared module: `radar-webapp/js/interact.js`

### Activity Diagram (`activity.html`)

| Feature | How to use |
|---|---|
| Click-to-inspect | Click any node → detail panel slides in from right. Shows source section, description, values, operations, constraints from the source article. |
| Hover tooltip | Hover any node for a quick title tooltip. |
| Zoom in/out | Mouse wheel (zoom toward cursor) or use the + / − / Reset toolbar buttons above the diagram. |
| Drag to pan | Click and drag the diagram canvas to pan around. |
| Lane filter | Toggle buttons above the diagram (one per swim lane) — click to fade/restore that lane's nodes. Useful for focusing on one sub-system. |

### Block Definition Diagram (`bdd.html`)

| Feature | How to use |
|---|---|
| Click-to-inspect | Click any block → detail panel with stereotype, source, values, operations, constraints. |
| Connection highlighting | Clicking a block dims all unrelated blocks and connections; only the selected block and its direct relationships stay visible. Click again (or click the background) to deselect. |
| Hover tooltip | Hover any block for its name. |
| Zoom in/out | Mouse wheel or toolbar buttons. |
| Drag to pan | Click and drag to pan. |

---

## Use Case Diagram (added 2026-04-24)

**File:** `radar-webapp/usecase.html` + `radar-webapp/js/usecase.js`

### Actors

| Actor | Side | Participates in |
|---|---|---|
| Officer of Watch (OOW) | Left | Initialize Radar, Display PPI, Track Targets |
| Ship Captain | Left | Generate Course Recommendation |
| Radar Technician | Left | Verify SOLAS Compliance, Perform Performance Test |
| AIS Network | Right | Ingest AIS Data |
| ECDIS System | Right | Fuse Sensor Data |
| Satellite Network | Right | Fuse Sensor Data |

### Use Cases

| Use Case | Group | «include» | «extend» |
|---|---|---|---|
| Initialize Radar System | Core | — | — |
| Determine Target Range | Core | — | — |
| Determine Target Bearing | Core | — | — |
| Display PPI Plot | Core | — | — |
| Track Targets (ARPA/EPA) | Core | Range, Bearing | — |
| Generate Collision Alert | Core | — | Track Targets |
| Verify SOLAS Compliance | Core | — | — |
| Perform Performance Test | Core | — | — |
| Ingest AIS Data | Hybrid | — | — |
| Fuse Sensor Data | Hybrid | Ingest AIS | — |
| Classify Target via AI/ML | Hybrid | — | — |
| Generate Course Recommendation | Hybrid | Fusion, Classify | — |
| Log Navigation Incident | Hybrid | — | Generate Course |

---

## Cross-Diagram Linking (added 2026-04-24)

Every clickable element in every diagram has a "Related" section in its detail panel with links to corresponding elements in the other two diagrams.

URL format: `bdd.html?highlight=tx` navigates to the BDD and auto-highlights the Transmitter block with a flash animation.

| Activity node | → BDD block | → Use Case |
|---|---|---|
| power / trigger / modulator / magnetron | Transmitter | Initialize Radar |
| location / pulse_tx / rotation / echo_rx | Scanner | — |
| tr_cell / lo_mixer / if_amp / video_amp / demod | Receiver | — |
| range_det | Display | Determine Target Range |
| bearing_det | Display | Determine Target Bearing |
| ppi / target_paint | Display | Display PPI Plot |
| arpa | ARPA | Track Targets |
| epa | Electronic Plotting Aid | Track Targets |
| alarm | Display | Generate Collision Alert |
| ais | AISReceiver | Ingest AIS Data |
| fusion | SensorFusionEngine | Fuse Sensor Data |
| ai_class | AITargetClassifier | Classify Target |
| ibs / hybrid_cav | IntegratedBridgeSystem | Generate Course Rec. |

---

### How to modify the DETAILS panel content

Open `radar-webapp/js/activity.js` and edit the `DETAILS` object near the top of the file.
Each key matches a node `id` from the `ROWS` array. Supported fields:

```javascript
DETAILS['node_id'] = {
  title:       'Display name in the panel',
  stereotype:  'block',             // optional — shown in «guillemets»
  source:      '§4.1 Transmitter',  // optional — source section reference
  description: 'Full description text.',
  values:      ['param1 : type', 'param2 : value'],   // optional array
  operations:  ['doSomething() : ReturnType'],          // optional array
  constraints: ['[Must be ≥ X]'],                      // optional array
  note:        'Verbatim source quote or callout text'  // optional
};
```

Same structure applies to `DETAILS` in `radar-webapp/js/bdd.js` (keyed by block `id`).
