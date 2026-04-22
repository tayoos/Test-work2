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
