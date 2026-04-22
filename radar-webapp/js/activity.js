/* ============================================================
   activity.js – Marine Radar Ingestion Activity Diagram
   ============================================================
   TO MODIFY THE DIAGRAM:
   - Edit LANES to change layer names or colours
   - Edit ROWS to add, remove, or rename steps
     · type: "process" | "decision" | "start" | "end" | "note"
     · lane: must match an id in LANES
     · parallel items: put multiple objects in one row's items[]
   - Connections are drawn automatically top-to-bottom.
     For cross-lane connections the renderer adds a lane-crossing arrow.
   ============================================================ */

/* ── LANE DEFINITIONS ──────────────────────────────────────────
   id         : unique identifier (used in ROWS)
   label      : display name shown in the lane header
   color      : background fill of the lane
   hdrColor   : header bar colour
   hdrText    : header text colour
*/
var LANES = [
  { id: 'tx',     label: 'TRANSMITTER LAYER',                  color: '#DCEEFB', hdrColor: '#1A6EA3', hdrText: '#FFFFFF' },
  { id: 'scan',   label: 'SCANNER / AERIAL LAYER',             color: '#E8F5E9', hdrColor: '#2E7D32', hdrText: '#FFFFFF' },
  { id: 'rx',     label: 'RECEIVER / SIGNAL PROCESSING LAYER', color: '#FBE9E7', hdrColor: '#B71C1C', hdrText: '#FFFFFF' },
  { id: 'disp',   label: 'DISPLAY & PLOTTING LAYER',           color: '#EDE7F6', hdrColor: '#6A1B9A', hdrText: '#FFFFFF' },
  { id: 'hybrid', label: 'HYBRID NAVY INTEGRATION LAYER',      color: '#E0F7FA', hdrColor: '#00695C', hdrText: '#FFFFFF' }
];

/* ── ROW DEFINITIONS ───────────────────────────────────────────
   Each object in ROWS is one horizontal row in the diagram.
   items[] holds 1..N nodes rendered side by side in that row.

   Node fields:
     id       : unique string
     type     : 'start' | 'end' | 'process' | 'decision' | 'fork' | 'join' | 'note'
     lane     : lane id (drives background colour of the row)
     label    : text inside the node (use \n for line breaks)
     variant  : optional style hint – 'mandatory' | 'alarm' | 'ok' | 'band' | 'measurement'
     note     : optional annotation string shown to the right
*/
var ROWS = [

  // ── TRANSMITTER ─────────────────────────────────────────────
  {
    lane: 'tx',
    items: [{ id: 'start', type: 'start', label: 'START' }]
  },
  {
    lane: 'tx',
    items: [{ id: 'power', type: 'process', label: 'Power Supply Initialization',
              note: 'Provides regulated DC to all transmitter sub-units' }]
  },
  {
    lane: 'tx',
    items: [{ id: 'trigger', type: 'process', label: 'Delay Line & Trigger Generation' }]
  },
  {
    lane: 'tx',
    items: [{ id: 'modulator', type: 'process', label: 'Modulator Activation',
              note: 'Shapes pulse width and timing envelope' }]
  },
  {
    lane: 'tx',
    items: [{ id: 'magnetron', type: 'process', label: 'Magnetron\nHigh-Frequency RF Oscillation' }]
  },
  {
    lane: 'tx',
    items: [
      { id: 'xband', type: 'process', variant: 'band',
        label: 'X-Band Radar\n9 GHz / 3 cm\nHigh resolution · Short range\nRequired: ships >300 GT (SOLAS)' },
      { id: 'sband', type: 'process', variant: 'band',
        label: 'S-Band Radar\n3 GHz / 10 cm\nLong range · Weather resistant\nRequired: ships >3000 GT (SOLAS)' }
    ]
  },
  {
    lane: 'tx',
    items: [{ id: 'tr_tx', type: 'process', label: 'TR Switch → Transmit Mode\nWaveguide / Coaxial Cable Routing' }]
  },

  // ── SCANNER ─────────────────────────────────────────────────
  {
    lane: 'scan',
    items: [{ id: 'location', type: 'process', label: 'Scanner Located on Monkey Island\n(Clear of all obstructions)' }]
  },
  {
    lane: 'scan',
    items: [{ id: 'pulse_tx', type: 'process', label: 'Directional Pulse Transmission\nPRF: 500 – 4000 pps',
              note: 'One trace created per pulse transmitted' }]
  },
  {
    lane: 'scan',
    items: [{ id: 'rotation', type: 'process', label: '360° Rotational Scan\n12 – 30 RPM · clockwise from above',
              note: 'PRF >> RPM so bearing error is negligible' }]
  },
  {
    lane: 'scan',
    items: [{ id: 'echo_rx', type: 'process', label: 'Echo Reception from Targets' }]
  },
  {
    lane: 'scan',
    items: [{ id: 'tr_rx', type: 'process', label: 'TR Switch → Receive Mode' }]
  },

  // ── RECEIVER ────────────────────────────────────────────────
  {
    lane: 'rx',
    items: [{ id: 'tr_cell', type: 'process', label: 'TR Cell\nProtects receiver during transmission' }]
  },
  {
    lane: 'rx',
    items: [{ id: 'lo_mixer', type: 'process', label: 'Local Oscillator + Mixer\nDownconvert to Intermediate Frequency' }]
  },
  {
    lane: 'rx',
    items: [{ id: 'if_amp', type: 'process', label: 'IF Amplifier\nAmplify weak echo signals' }]
  },
  {
    lane: 'rx',
    items: [{ id: 'video_amp', type: 'process', label: 'Video Amplifier' }]
  },
  {
    lane: 'rx',
    items: [{ id: 'demod', type: 'process', label: 'Demodulator\nSignal Smoothing & Conditioning' }]
  },
  {
    lane: 'rx',
    items: [
      { id: 'range_det', type: 'process', variant: 'measurement',
        label: 'Range Determination\nRange Rings & VRM\nAccuracy: ±30 m or 1% of range scale',
        note: 'Tracing spot speed = ½ speed of radio waves' },
      { id: 'bearing_det', type: 'process', variant: 'measurement',
        label: 'Bearing Determination\nHeading Marker + Bearing Scale\nAccuracy: ±1°' }
    ]
  },

  // ── DISPLAY ─────────────────────────────────────────────────
  {
    lane: 'disp',
    items: [{ id: 'ppi', type: 'process', label: 'PPI Display (CRT)\nPlan Position Indicator – Bird\'s Eye View',
              note: 'Trace synchronized with scanner rotation' }]
  },
  {
    lane: 'disp',
    items: [{ id: 'target_paint', type: 'process', label: 'Target Paint – Bright Spot on Screen' }]
  },
  {
    lane: 'disp',
    items: [{ id: 'bearing_scale', type: 'process', label: 'Bearing Scale (30° numbered · 5° marked)\nMin. 4 Parallel Index Lines (IMO MSC.192)' }]
  },
  {
    lane: 'disp',
    items: [{ id: 'tonnage_q', type: 'decision', label: 'Ship\n> 3000 GT?' }]
  },
  {
    lane: 'disp',
    items: [
      { id: 'arpa', type: 'process', variant: 'mandatory',
        label: 'ARPA\nAutomatic Radar Plotting Aid\nCPA / TCPA Calculation\nAuto Target Acquisition' },
      { id: 'epa', type: 'process', variant: 'mandatory',
        label: 'Electronic Plotting Aid\nMandatory 300 – 3000 GT\nSemi-auto Target Tracking' }
    ]
  },
  {
    lane: 'disp',
    items: [{ id: 'failure_q', type: 'decision', label: 'Sensor /\nSignal Failure?' }]
  },
  {
    lane: 'disp',
    items: [
      { id: 'alarm', type: 'process', variant: 'alarm',
        label: 'ALARM Triggered\n(IMO MSC.192(79))\nStandby: <5 sec · Cold: <4 min' },
      { id: 'ok_perf', type: 'process', variant: 'ok',
        label: 'Optimum Performance\nAbsence-of-Target\nIndication Active' }
    ]
  },

  // ── PARALLEL FORK (Standard vs Hybrid) ──────────────────────
  {
    lane: 'disp',
    items: [{ id: 'std_out', type: 'process', label: 'Standard Radar\nCollision Avoidance Output\n(OOW Assessment)' }]
  },

  // ── HYBRID NAVY ─────────────────────────────────────────────
  {
    lane: 'hybrid',
    items: [{ id: 'ais', type: 'process', label: 'AIS Data Ingestion\nMMSI · Name · Position · COG · SOG · Heading',
              note: 'AIS adds vessel identity not available from echo alone' }]
  },
  {
    lane: 'hybrid',
    items: [
      { id: 'satellite', type: 'process', label: 'Satellite Data Feed\nVDES / GNSS Augmentation' },
      { id: 'ecdis',     type: 'process', label: 'ECDIS Chart Overlay\nElectronic Navigational Chart' },
      { id: 'uav',       type: 'process', label: 'Drone / UAV Sensor Feed\nBeyond-Horizon Awareness' }
    ]
  },
  {
    lane: 'hybrid',
    items: [{ id: 'ai_class', type: 'process', label: 'AI / ML Target Classification Engine\nVessel Type · Threat Level · Anomaly Detection' }]
  },
  {
    lane: 'hybrid',
    items: [{ id: 'fusion', type: 'process', label: 'Sensor Fusion Engine\nRadar + AIS + Satellite + ECDIS + UAV → Unified Track' }]
  },
  {
    lane: 'hybrid',
    items: [{ id: 'ibs', type: 'process', label: 'Integrated Bridge System (IBS)\nUnified Operational Picture for OOW' }]
  },
  {
    lane: 'hybrid',
    items: [{ id: 'hybrid_cav', type: 'process', label: 'Hybrid Collision Avoidance DSS\nCOLREGS-aware Course Recommendations' }]
  },

  // ── FINAL OUTPUT ────────────────────────────────────────────
  {
    lane: 'hybrid',
    items: [{ id: 'final', type: 'process', label: 'Navigation & Safety Output\nCourse Recommendation · Alert · Incident Log' }]
  },
  {
    lane: 'hybrid',
    items: [{ id: 'end', type: 'end', label: 'END' }]
  }
];

/* ============================================================
   RENDERER
   You do not need to edit below this line to change diagram content.
   ============================================================ */

(function () {
  'use strict';

  // ── Layout constants ──────────────────────────────────────
  var C = {
    svgWidth:      1140,
    laneHdrH:       36,
    laneHdrFontSz:  11,
    laneLeftW:      14,   // coloured left stripe per lane
    nodeW:         320,
    nodeMinH:       52,
    nodeRx:          6,
    nodeFont:       12,
    nodeLineH:      16,
    nodePadX:       12,
    nodePadY:        8,
    startR:         16,
    endR:           16,
    diamondH:       60,
    rowGap:         20,
    laneTopPad:     14,
    laneBotPad:     14,
    arrowSize:       7,
    noteFont:       10,
    noteMaxW:      160,
    parallelGap:    24,
    // variant colours
    variant: {
      band:        { fill: '#FFF9E6', stroke: '#E6A817' },
      mandatory:   { fill: '#E8F5E9', stroke: '#388E3C' },
      alarm:       { fill: '#FFEBEE', stroke: '#C62828' },
      ok:          { fill: '#E8F5E9', stroke: '#2E7D32' },
      measurement: { fill: '#F3E5F5', stroke: '#7B1FA2' },
      default:     { fill: '#FFFFFF', stroke: '#2E86AB' }
    }
  };

  // ── SVG helpers ──────────────────────────────────────────
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        e.setAttribute(k, attrs[k]);
      }
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function txt(text, attrs, parent) {
    var t = el('text', attrs, parent);
    t.textContent = text;
    return t;
  }

  function wrapText(svgEl, lines, cx, y, fontSize, fill, bold) {
    lines.forEach(function (line) {
      var t = el('text', {
        x: cx, y: y,
        'font-family': 'Segoe UI, Arial, sans-serif',
        'font-size': fontSize,
        'font-weight': bold ? '600' : '400',
        fill: fill || '#1A1A2E',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle'
      }, svgEl);
      t.textContent = line;
      y += C.nodeLineH;
    });
    return y;
  }

  // ── Measure node height from label ───────────────────────
  function nodeHeight(node) {
    if (node.type === 'start' || node.type === 'end') return C.startR * 2;
    if (node.type === 'decision') return C.diamondH;
    var lines = (node.label || '').split('\n');
    return Math.max(C.nodeMinH, lines.length * C.nodeLineH + C.nodePadY * 2);
  }

  // ── Row height = tallest node in items[] ─────────────────
  function rowHeight(row) {
    var h = 0;
    row.items.forEach(function (n) { h = Math.max(h, nodeHeight(n)); });
    return h;
  }

  // ── Lane lookup ──────────────────────────────────────────
  function getLane(id) {
    for (var i = 0; i < LANES.length; i++) {
      if (LANES[i].id === id) return LANES[i];
    }
    return LANES[0];
  }

  // ── Draw a process rectangle ─────────────────────────────
  function drawProcess(svg, node, cx, cy, w, h) {
    var v = C.variant[node.variant] || C.variant.default;
    el('rect', {
      x: cx - w / 2, y: cy - h / 2,
      width: w, height: h,
      rx: C.nodeRx, ry: C.nodeRx,
      fill: v.fill, stroke: v.stroke, 'stroke-width': 1.5
    }, svg);

    var lines = (node.label || '').split('\n');
    var totalH = lines.length * C.nodeLineH;
    var startY = cy - totalH / 2 + C.nodeLineH / 2;
    lines.forEach(function (line, i) {
      el('text', {
        x: cx, y: startY + i * C.nodeLineH,
        'font-family': 'Segoe UI, Arial, sans-serif',
        'font-size': C.nodeFont,
        'font-weight': i === 0 ? '600' : '400',
        fill: '#1A1A2E',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle'
      }, svg).textContent = line;
    });
  }

  // ── Draw a decision diamond ──────────────────────────────
  function drawDiamond(svg, node, cx, cy, w, h) {
    var hw = w / 2, hh = h / 2;
    var pts = [cx + ',' + (cy - hh), (cx + hw) + ',' + cy,
               cx + ',' + (cy + hh), (cx - hw) + ',' + cy].join(' ');
    el('polygon', {
      points: pts,
      fill: '#FFF9C4', stroke: '#F9A825', 'stroke-width': 1.5
    }, svg);

    var lines = (node.label || '').split('\n');
    var totalH = lines.length * C.nodeLineH;
    var startY = cy - totalH / 2 + C.nodeLineH / 2;
    lines.forEach(function (line, i) {
      el('text', {
        x: cx, y: startY + i * C.nodeLineH,
        'font-family': 'Segoe UI, Arial, sans-serif',
        'font-size': 11, 'font-weight': '600',
        fill: '#4A3000', 'text-anchor': 'middle', 'dominant-baseline': 'middle'
      }, svg).textContent = line;
    });
  }

  // ── Draw start/end circle ────────────────────────────────
  function drawTerminal(svg, node, cx, cy) {
    var isEnd = node.type === 'end';
    el('circle', {
      cx: cx, cy: cy, r: C.startR,
      fill: isEnd ? '#1A1A2E' : '#2E86AB',
      stroke: isEnd ? '#000' : '#1A6EA3', 'stroke-width': 2
    }, svg);
    if (isEnd) {
      el('circle', { cx: cx, cy: cy, r: C.startR - 5,
        fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2 }, svg);
    }
    el('text', {
      x: cx, y: cy,
      'font-family': 'Segoe UI, Arial, sans-serif',
      'font-size': 9, 'font-weight': '700',
      fill: '#FFFFFF', 'text-anchor': 'middle', 'dominant-baseline': 'middle'
    }, svg).textContent = node.label;
  }

  // ── Draw an arrow ────────────────────────────────────────
  function drawArrow(svg, x1, y1, x2, y2, crossLane) {
    var color = crossLane ? '#888' : '#2E86AB';
    var dash  = crossLane ? '5,3' : null;
    var attrs = {
      x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: color, 'stroke-width': 1.5,
      'marker-end': 'url(#arrow)'
    };
    if (dash) attrs['stroke-dasharray'] = dash;
    el('line', attrs, svg);
  }

  // ── Draw a fork/join bar ─────────────────────────────────
  function drawForkBar(svg, cx, cy, w) {
    el('rect', {
      x: cx - w / 2, y: cy - 4,
      width: w, height: 8,
      fill: '#1A1A2E', rx: 2
    }, svg);
  }

  // ── Draw a note callout ──────────────────────────────────
  function drawNote(svg, text, x, y) {
    var lines = [];
    var words = text.split(' ');
    var current = '';
    words.forEach(function (w) {
      if ((current + ' ' + w).trim().length > 22) {
        if (current) lines.push(current.trim());
        current = w;
      } else {
        current = (current + ' ' + w).trim();
      }
    });
    if (current) lines.push(current);

    var noteH = lines.length * 14 + 10;
    var noteW = 140;
    el('rect', { x: x, y: y - 5, width: noteW, height: noteH,
      fill: '#FFFDE7', stroke: '#F0A500', 'stroke-width': 1,
      rx: 3, opacity: 0.95 }, svg);
    lines.forEach(function (l, i) {
      el('text', {
        x: x + 6, y: y + i * 14 + 7,
        'font-family': 'Segoe UI, Arial, sans-serif',
        'font-size': C.noteFont, fill: '#4A3800',
        'dominant-baseline': 'middle'
      }, svg).textContent = l;
    });
  }

  // ── Main render function ─────────────────────────────────
  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    // ── 1. Pre-calculate lane heights ─────────────────────
    // Group rows by lane order
    var laneOrder = LANES.map(function (l) { return l.id; });
    var laneRows  = {};
    laneOrder.forEach(function (id) { laneRows[id] = []; });
    ROWS.forEach(function (row) {
      if (laneRows[row.lane]) laneRows[row.lane].push(row);
    });

    var laneHeights = {};
    laneOrder.forEach(function (id) {
      var rows = laneRows[id];
      var h = C.laneTopPad;
      rows.forEach(function (row) { h += rowHeight(row) + C.rowGap; });
      h += C.laneBotPad;
      laneHeights[id] = Math.max(h, C.laneHdrH + 40);
    });

    // Total SVG height
    var totalH = C.laneHdrH; // top header
    laneOrder.forEach(function (id) { totalH += C.laneHdrH + laneHeights[id]; });
    totalH += 20; // bottom pad

    var svgW = C.svgWidth;

    // ── 2. Create SVG ─────────────────────────────────────
    var svg = el('svg', {
      width: svgW, height: totalH,
      xmlns: NS,
      style: 'font-family: Segoe UI, Arial, sans-serif;'
    }, container);

    // Arrow marker
    var defs = el('defs', {}, svg);
    var marker = el('marker', {
      id: 'arrow', markerWidth: 8, markerHeight: 8,
      refX: 6, refY: 3, orient: 'auto'
    }, defs);
    el('path', { d: 'M0,0 L0,6 L8,3 z', fill: '#2E86AB' }, marker);

    // ── 3. Draw title header ───────────────────────────────
    el('rect', { x: 0, y: 0, width: svgW, height: C.laneHdrH,
      fill: '#0D1B2A' }, svg);
    el('text', {
      x: svgW / 2, y: C.laneHdrH / 2,
      'font-size': 13, 'font-weight': '700',
      fill: '#FFFFFF', 'text-anchor': 'middle', 'dominant-baseline': 'middle'
    }, svg).textContent = 'Marine Radar Ingestion — SysML Activity Diagram';
    el('text', {
      x: svgW / 2, y: C.laneHdrH / 2 + 14,
      'font-size': 9, fill: '#7AAAC0',
      'text-anchor': 'middle', 'dominant-baseline': 'middle'
    }, svg).textContent = 'Source: Merchant Navy Decoded – The Complete Guide About Marine Radar';

    // ── 4. Draw lanes + nodes ─────────────────────────────
    var laneY   = C.laneHdrH;  // current Y cursor
    // nodePositions: id → {cx, cy, w, h, type}
    var nodePos = {};

    // We also need to track "previous node" per lane for auto-arrows
    var prevNodeId = {}; // laneId → last single-node id

    laneOrder.forEach(function (laneId) {
      var lane = getLane(laneId);
      var lh   = laneHeights[laneId];

      // Lane header bar
      el('rect', { x: 0, y: laneY, width: svgW, height: C.laneHdrH,
        fill: lane.hdrColor }, svg);
      el('text', {
        x: 16, y: laneY + C.laneHdrH / 2,
        'font-size': C.laneHdrFontSz, 'font-weight': '700',
        fill: lane.hdrText, 'dominant-baseline': 'middle',
        'letter-spacing': '0.06em'
      }, svg).textContent = lane.label;

      // Lane body
      el('rect', { x: 0, y: laneY + C.laneHdrH, width: svgW, height: lh,
        fill: lane.color }, svg);
      // Left stripe
      el('rect', { x: 0, y: laneY + C.laneHdrH, width: C.laneLeftW, height: lh,
        fill: lane.hdrColor, opacity: 0.4 }, svg);
      // Bottom border
      el('line', { x1: 0, y1: laneY + C.laneHdrH + lh,
                   x2: svgW, y2: laneY + C.laneHdrH + lh,
        stroke: lane.hdrColor, 'stroke-width': 1.5 }, svg);

      laneY += C.laneHdrH;

      // ── Place rows within lane ─────────────────────────
      var rowY = laneY + C.laneTopPad;

      laneRows[laneId].forEach(function (row) {
        var rh   = rowHeight(row);
        var rowCY = rowY + rh / 2;
        var n    = row.items.length;
        var noteX = C.svgWidth / 2 + C.nodeW / 2 + 20; // note position (single item)

        if (n === 1) {
          // ── Single item (centred) ──────────────────────
          var node = row.items[0];
          var cx   = svgW / 2;
          var h    = nodeHeight(node);

          if (node.type === 'start' || node.type === 'end') {
            drawTerminal(svg, node, cx, rowCY);
            nodePos[node.id] = { cx: cx, cy: rowCY, w: C.startR * 2, h: C.startR * 2, type: node.type };
          } else if (node.type === 'decision') {
            drawDiamond(svg, node, cx, rowCY, C.nodeW, h);
            nodePos[node.id] = { cx: cx, cy: rowCY, w: C.nodeW, h: h, type: 'decision' };
          } else {
            drawProcess(svg, node, cx, rowCY, C.nodeW, h);
            nodePos[node.id] = { cx: cx, cy: rowCY, w: C.nodeW, h: h, type: 'process' };
          }

          // Note annotation
          if (node.note) {
            drawNote(svg, node.note, noteX, rowCY - 5);
            // dotted line to note
            el('line', {
              x1: cx + C.nodeW / 2, y1: rowCY,
              x2: noteX - 2, y2: rowCY,
              stroke: '#AAAAAA', 'stroke-width': 1,
              'stroke-dasharray': '3,2'
            }, svg);
          }

          // Auto-arrow from previous node in this lane
          if (prevNodeId[laneId]) {
            var prev = nodePos[prevNodeId[laneId]];
            if (prev) {
              var ay1 = prev.cy + prev.h / 2;
              var ay2 = rowCY - h / 2 - 1;
              drawArrow(svg, cx, ay1, cx, ay2, false);
            }
          }
          prevNodeId[laneId] = node.id;

        } else {
          // ── Multiple items (parallel, side by side) ────
          var totalW  = n * C.nodeW + (n - 1) * C.parallelGap;
          var startX  = svgW / 2 - totalW / 2 + C.nodeW / 2;
          var forkBarW = totalW + 40;
          var forkY   = rowCY - rh / 2 - 10;
          var joinY   = rowCY + rh / 2 + 10;

          // Fork bar
          drawForkBar(svg, svgW / 2, forkY, forkBarW);
          // Join bar
          drawForkBar(svg, svgW / 2, joinY, forkBarW);

          // Arrow into fork from previous node
          if (prevNodeId[laneId]) {
            var prevP = nodePos[prevNodeId[laneId]];
            if (prevP) {
              drawArrow(svg, svgW / 2, prevP.cy + prevP.h / 2, svgW / 2, forkY - 1, false);
            }
          }

          row.items.forEach(function (node, idx) {
            var cx2 = startX + idx * (C.nodeW + C.parallelGap);
            var h2  = nodeHeight(node);
            drawProcess(svg, node, cx2, rowCY, C.nodeW, h2);
            nodePos[node.id] = { cx: cx2, cy: rowCY, w: C.nodeW, h: h2, type: 'process' };

            // Arrow from fork bar down to node
            drawArrow(svg, cx2, forkY + 4, cx2, rowCY - h2 / 2 - 1, false);
            // Arrow from node up to join bar
            el('line', {
              x1: cx2, y1: rowCY + h2 / 2,
              x2: cx2, y2: joinY - 4,
              stroke: '#2E86AB', 'stroke-width': 1.5
            }, svg);
          });

          // Virtual join node for next row to connect from
          var joinId = '_join_' + laneId + '_' + rowY;
          nodePos[joinId] = { cx: svgW / 2, cy: joinY, w: forkBarW, h: 8, type: 'join' };
          prevNodeId[laneId] = joinId;
        }

        rowY += rh + C.rowGap;
      });

      laneY += lh;
    });

    // ── 5. Cross-lane arrows (bottom of TX → top of SCAN, etc.) ──
    var seq = ['tx', 'scan', 'rx', 'disp'];
    seq.forEach(function (id, i) {
      if (i >= seq.length - 1) return;
      var nextId = seq[i + 1];
      var lastId = prevNodeId[id];
      var firstId = null;
      // find first node of next lane
      for (var r = 0; r < ROWS.length; r++) {
        if (ROWS[r].lane === nextId && ROWS[r].items.length === 1) {
          firstId = ROWS[r].items[0].id;
          break;
        }
      }
      if (lastId && firstId && nodePos[lastId] && nodePos[firstId]) {
        var p1 = nodePos[lastId];
        var p2 = nodePos[firstId];
        drawArrow(svg, p1.cx, p1.cy + p1.h / 2, p2.cx, p2.cy - p2.h / 2 - 1, true);
      }
    });

    // Cross-lane arrow: disp std_out → hybrid ais
    var dispLast = nodePos['std_out'];
    var hybridFirst = nodePos['ais'];
    if (dispLast && hybridFirst) {
      // draw dashed arrow on right side
      var ax = C.svgWidth - 60;
      el('polyline', {
        points: [
          dispLast.cx + ',' + (dispLast.cy + dispLast.h / 2),
          dispLast.cx + ',' + (dispLast.cy + dispLast.h / 2 + 20),
          ax + ',' + (dispLast.cy + dispLast.h / 2 + 20),
          ax + ',' + (hybridFirst.cy - hybridFirst.h / 2 - 20),
          hybridFirst.cx + ',' + (hybridFirst.cy - hybridFirst.h / 2 - 20)
        ].join(' '),
        fill: 'none', stroke: '#888', 'stroke-width': 1.5,
        'stroke-dasharray': '6,3',
        'marker-end': 'url(#arrow)'
      }, svg);
      // Label
      el('text', {
        x: ax + 4, y: (dispLast.cy + hybridFirst.cy) / 2,
        'font-size': 9, fill: '#666', 'dominant-baseline': 'middle'
      }, svg).textContent = 'Parallel';
      el('text', {
        x: ax + 4, y: (dispLast.cy + hybridFirst.cy) / 2 + 11,
        'font-size': 9, fill: '#666', 'dominant-baseline': 'middle'
      }, svg).textContent = 'Flow';
    }
  }

  // ── Boot ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    render('activity-svg');
  });

})();
