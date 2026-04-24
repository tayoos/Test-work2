# Prompt Log – FADS Radar Ingestion SysML Project

All prompts submitted during this session, in order.

---

## Prompt 1

> Create a SysML workflow for Radar ingestion using https://www.merchantnavydecoded.com/marine-radar-the-complete-guide-about-marine-radar/ and create a parallel flow for Hybrid Navy

**What happened:**
Initial request. The web fetch tool attempted to retrieve the article but only returned JavaScript/CSS from the page's lazy-loading infrastructure — the article body did not render. A first pass of PlantUML `.puml` files was generated using domain knowledge of marine radar systems, pending the source content being confirmed.

**Output:** `radar-sysml/radar_ingestion_sysml.puml`, `radar-sysml/radar_bdd_sysml.puml`, `radar-sysml/README.md`

---

## Prompt 2

> i would like you to do it based on the website

**What happened:**
User clarified the diagrams must be grounded in the source article specifically. A `curl` request bypassed the lazy-loading and extracted the full article text. Content from sections §4.1–§8 was used to rebuild the diagrams with direct traceability to the source — including the exact sub-components (delay line, modulator, magnetron, TR cell, local oscillator, IF amplifier, video amplifier, demodulator), operational parameters (PRF 500–4000 pps, 12–30 RPM), accuracy figures (±30 m / 1%, ±1°), and SOLAS/IMO requirements (MSC.192(79)).

**Output:** `.puml` files updated with full source traceability.

---

## Prompt 3

> before you continue not to cut you off it might be best to go with a web app format?

**What happened:**
User raised a format concern mid-build. The environment is defence-facing, meaning PlantUML (requires a JAR or web server to render) and Mermaid (requires CDN) are not appropriate. A clarifying question was asked about what "web app format" meant — single self-contained HTML file or a local multi-file web app.

**Output:** No files changed. Format decision discussion.

---

## Prompt 4

> yes local web app easier to modify

**What happened:**
User confirmed: a local multi-file web app served by Python's built-in `http.server`. Rationale given by user: easier to modify than a single monolithic HTML file. The entire `.puml` approach was superseded. A new `radar-webapp/` directory was built from scratch with:
- Diagram data separated from rendering code in distinct JS files
- Pure vanilla JavaScript SVG renderer (no external libraries, no CDN calls)
- Five swim lane Activity Diagram and Block Definition Diagram rendered entirely in-browser
- `start.sh` / `start.bat` launchers
- `rationale.html` documenting all decisions

**Output:** `radar-webapp/` (index.html, activity.html, bdd.html, rationale.html, css/style.css, js/app.js, js/activity.js, js/bdd.js, start.sh, start.bat)

---

## Prompt 5

> okay update the .md if needed

**What happened:**
The `radar-sysml/README.md` still referenced the old `.puml` files and web-based rendering instructions (VS Code PlantUML extension, `java -jar plantuml.jar`, plantuml.com). These were all invalid for the defence environment. The README was rewritten to:
- Mark the `.puml` files as superseded / reference only
- Document the full project structure including `radar-webapp/`
- Replace rendering instructions with web app run instructions
- Add a how-to-modify guide for both diagrams
- Add the format decision table
- Update the change log

**Output:** `radar-sysml/README.md` (rewritten)

---

## Prompt 6

> can i also create a separate .md of all the prompts used and asked

**What happened:**
This file.

**Output:** `PROMPTS.md`

---

## Prompt 7

> i would like to move further and modify radar-webapp so that it is more of an interactive sysml models rather than static. i would like updates and prompts used to be updated into prompts.md and things done/rationale to be updated into readme.md since we're expanding further

**What happened:**
All three diagram pages received full interactive capability — no external libraries, no CDN, fully offline. A new shared module `js/interact.js` was created to house all interaction logic so it can be reused by both diagram pages without duplication.

**Features added:**

| Feature | Where | How to use |
|---|---|---|
| Click-to-inspect panel | Both diagrams | Click any node (Activity) or block (BDD) — panel slides in from the right with source traceability, values, operations, constraints |
| Hover tooltips | Both diagrams | Hover over any node/block to see its title |
| Zoom in/out | Both diagrams | Mouse wheel or toolbar buttons (+/−/Reset) |
| Drag to pan | Both diagrams | Click and drag the diagram canvas |
| Lane toggle filter | Activity only | Buttons above the diagram — click to fade/restore individual swim lanes |
| Connection highlighting | BDD only | Click a block to dim all unrelated blocks/connections; click again to deselect |

**New file:** `radar-webapp/js/interact.js` — shared tooltip, detail panel, zoom/pan, zoom toolbar wiring

**Modified files:**
- `radar-webapp/js/activity.js` — added `DETAILS` map per node, wrapped nodes in `<g class="node-group">`, post-render event wiring, lane filter generation
- `radar-webapp/js/bdd.js` — added `DETAILS` map per block, wrapped blocks in `<g class="block-group">` and connections in `<g class="conn-group">`, connection highlight/dim logic
- `radar-webapp/css/style.css` — appended styles for tooltip, detail panel, zoom controls, lane filter buttons, and BDD dim/selected/highlighted states
- `radar-webapp/activity.html` — added `#lane-filter` bar, `#diagram-toolbar`, interact.js script tag
- `radar-webapp/bdd.html` — added `#diagram-toolbar`, interact.js script tag

**Output:** Updated `radar-webapp/` (interact.js new; activity.js, bdd.js, style.css, activity.html, bdd.html updated)

---

## Prompt 8

> in addition to this can you add applicable use case diagrams as well as link various diagrams together based on elements existing in the diagrams

**What happened:**
A full SysML Use Case Diagram was added as a new page, and all three diagrams were cross-linked so every element knows about its counterparts in the other diagrams.

**Use Case Diagram (`usecase.html` + `js/usecase.js`):**

6 actors: Officer of Watch, Ship Captain, Radar Technician (left/human) · AIS Network, ECDIS System, Satellite Network (right/external systems)

13 use cases, split into two groups inside the system boundary:

| Group | Use Cases |
|---|---|
| Core Radar Pipeline | Initialize Radar System · Determine Target Range · Determine Target Bearing · Display PPI Plot · Track Targets (ARPA/EPA) · Generate Collision Alert · Verify SOLAS Compliance · Perform Performance Test |
| Hybrid Navy Integration | Ingest AIS Data · Fuse Sensor Data · Classify Target via AI/ML · Generate Course Recommendation · Log Navigation Incident |

UML relationships: «include» (Track Targets → Range/Bearing; Course Rec. → Fusion + Classify; Fusion → AIS) and «extend» (Alert → Tracking; Log → Course Rec.)

**Cross-diagram linking (all three diagrams):**

Every element in every diagram now has a `crossRefs` array in its `DETAILS` entry. Clicking any node opens the detail panel; the "Related" section shows clickable links that navigate to the corresponding element in another diagram.

URL format: `bdd.html?highlight=tx` → navigates to BDD and auto-highlights the Transmitter block with a flash animation and opens its detail panel. Works for all three pages.

| Source element | Links to |
|---|---|
| Activity: Power/Trigger/Modulator/Magnetron | BDD: Transmitter block · Use Case: Initialize Radar |
| Activity: ARPA/EPA nodes | BDD: ARPA/EPA blocks · Use Case: Track Targets |
| Activity: Range Determination | BDD: Display block · Use Case: Determine Target Range |
| BDD: Transmitter block | Activity: Power Supply · Use Case: Initialize Radar |
| BDD: SensorFusionEngine | Activity: Fusion node · Use Case: Fuse Sensor Data |
| Use Case: Track Targets | Activity: ARPA · Activity: EPA · BDD: ARPA block |
| … (full cross-ref table in radar-sysml/README.md) | |

**New files:** `radar-webapp/usecase.html`, `radar-webapp/js/usecase.js`

**Modified files:**
- `js/interact.js` — added crossRefs section to detail panel, added `highlightFromURL()` utility
- `js/activity.js` — appended crossRefs block (38 node mappings), added URL-highlight call
- `js/bdd.js` — appended crossRefs block (15 block mappings), added URL-highlight call
- `css/style.css` — added `.dp-crossref` link style and `@keyframes nodeFlash` / `.highlight-flash`
- `index.html`, `activity.html`, `bdd.html` — updated nav + index home card

**Output:** `usecase.html`, `js/usecase.js` (new); all other webapp files updated

---

## Prompt 9

> in addition to this can you then create requirements diagrams and link them together within the webapp

**What happened:**
A SysML Requirements Diagram was added as a fifth page, and all existing diagrams gained back-links to requirements where applicable.

**Requirements Diagram (`requirements.html` + `js/requirements.js`):**

20 requirements in 4 groups, rendered as a 4-column SVG layout:

| Group | ID | Requirements |
|---|---|---|
| System Performance | REQ-SYS | Cold Start ≤4 min · Standby ≤5 sec · Range ±30 m/1% · Bearing ±1° |
| SOLAS Compliance | REQ-SOL | X-Band Mandatory · Plotting Aid · S-Band+ARPA · Min Display Standards |
| Hybrid Navy Integration | REQ-HYB | AIS Integration · Multi-Sensor Fusion · AI/ML Classification · Collision Avoidance DSS |
| Hardware & Physical | REQ-HW | Scanner Siting · PRF Range · Scan Rate · Receiver Chain Integrity |

Each box shows `«requirement»` or `«requirementGroup»` stereotype, id, name, text, and source section. Containment brackets (left-side vertical line with horizontal stubs) show the SysML containment relationship from group to children.

**Cross-diagram linking:**

- Each requirement has crossRefs linking to its corresponding Activity nodes, BDD blocks, and Use Cases
- All three existing diagrams have new requirements crossRefs appended via a second IIFE block (using `.concat()` to extend existing `crossRefs` arrays without replacing them)

| Activity node | → Requirement |
|---|---|
| start / alarm | REQ-SYS-01 Cold Start |
| alarm | REQ-SYS-02 Standby Switching |
| range_det | REQ-SYS-03 Range Accuracy |
| bearing_det | REQ-SYS-04 Bearing Accuracy |
| xband | REQ-SOL-01 X-Band Mandatory |
| arpa / epa | REQ-SOL-02 Plotting Aid |
| arpa / sband | REQ-SOL-03 S-Band + ARPA |
| bearing_scale | REQ-SOL-04 Display Standards |
| ais / fusion / ai_class / hybrid_cav | REQ-HYB-01 to REQ-HYB-04 |
| location / pulse_tx / rotation / tr_cell | REQ-HW-01 to REQ-HW-04 |

**New files:** `radar-webapp/requirements.html`, `radar-webapp/js/requirements.js`

**Modified files:**
- `js/activity.js` — appended requirements crossRefs IIFE (17 node mappings)
- `js/bdd.js` — appended requirements crossRefs IIFE (13 block mappings)
- `js/usecase.js` — appended requirements crossRefs IIFE (11 use case mappings)
- `css/style.css` — added `.req-group` and `.req-node` hover/cursor styles
- `index.html` — added Requirements Diagram card and nav link
- `activity.html`, `bdd.html`, `usecase.html`, `rationale.html` — updated nav

**Output:** `requirements.html`, `js/requirements.js` (new); all other webapp files updated

---

## Prompt 10

> additional usecase diagrams should be first and then i like the click and related on elements but it should allow me to just click it and move on to the related if it has one, maybe when you mouse cursor is over the items it shows the details and clicking just takes it to a related model? any form of icons to know if it has a sub diagram would be good and any color coding in the diagram would be an added value

**What happened:**
Four improvements applied across the entire webapp:

**1 — Nav reorder (Use Case first):**
All 6 pages now order nav: Home | Use Case Diagram | Requirements Diagram | Activity Diagram | Block Diagram | Decisions & Rationale. Use Case and Requirements are presented first as high-level overviews before the detailed flow/structure diagrams.

**2 — Interaction model (hover = details, click = navigate):**
Previously: hover showed a title tooltip; click opened the detail panel.
Now: hover on any element immediately opens the detail panel showing full source, description, values, constraints, and related links. Click navigates directly to the first cross-diagram link (e.g., clicking a Use Case node jumps to its Activity counterpart with `?highlight=` auto-focus). Elements with no crossRefs do nothing on click (panel already shown by hover).

BDD-specific: hovering a block now both shows its connection graph (dims all unrelated blocks/connections) AND opens the detail panel. Moving to a different block instantly updates both. Mouse-leave restores the normal view.

**3 — Link-count badge icons:**
Every element that has crossRefs now displays a small blue pill badge at its top-right corner showing the number of linked diagrams (e.g., "3" means 3 related elements across other diagrams). Rendered via `SysMLInteract.addLinkBadges(svgEl, DETAILS)` called after render in each diagram's DOMContentLoaded. Badge has `pointer-events:none` so it never blocks hover/click on the element beneath.

**4 — Color coding:**
- **Activity Diagram**: Default process nodes are now filled with their swim lane's background color (+ lane header color as stroke) instead of plain white. Variant-typed nodes (band, mandatory, alarm, measurement) keep their own distinct colors. Each lane's nodes are now visually tied to their lane color.
- **Requirements Diagram**: Child `«requirement»` boxes now use a tinted fill matching their group color (REQ-SYS = light blue, REQ-SOL = light red, REQ-HYB = light teal, REQ-HW = light orange) instead of generic white. Parent group boxes keep their solid colored header.

**Modified files:**
- `js/interact.js` — added `addLinkBadges()`, exported it
- `js/activity.js` — `drawProcess` accepts optional `laneColors`; default nodes use lane color; boot: hover→panel, click→navigate, addLinkBadges
- `js/bdd.js` — boot: hover→applyHighlight+panel, mouseleave→clearHighlight, click→navigate, addLinkBadges
- `js/usecase.js` — boot: hover→panel, click→navigate, addLinkBadges
- `js/requirements.js` — child fill uses GROUP_TINTS; boot: hover→panel, click→navigate, addLinkBadges
- `css/style.css` — added `.link-badge`, `.uc-node`, `.actor-group` cursor styles
- All 6 HTML pages — nav reordered (Use Case first)

**Output:** All existing files updated; no new files
