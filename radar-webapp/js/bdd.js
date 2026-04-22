/* ============================================================
   bdd.js – Marine Radar System Block Definition Diagram
   ============================================================
   TO MODIFY:
   - Edit BLOCKS to add/change/remove system blocks
   - Edit CONNECTIONS to add/change relationships
   - x, y positions are in pixels from top-left of diagram area
   ============================================================ */

/* ── BLOCK DEFINITIONS ─────────────────────────────────────────
   Each block renders as a UML-style classifier box.
   Fields:
     id         : unique string
     label      : block name (shown in header)
     stereotype : shown above name in «guillemets»
     x, y       : top-left position in diagram space
     w, h       : width and height
     color      : header background colour
     fields     : array of { section, items[] } for compartments
*/
var BLOCKS = [

  // ── TOP-LEVEL SYSTEM ──────────────────────────────────────
  {
    id: 'mrs', label: 'MarineRadarSystem', stereotype: 'block',
    x: 390, y: 10, w: 310, h: 210,
    color: '#1A6EA3',
    fields: [
      { section: 'Values', items: [
        'operatingFrequency : GHz',
        'wavelength : cm',
        'radarType : {X-Band | S-Band}',
        'PRF : 500..4000 pps',
        'scannerRPM : 12..30 RPM',
        'rangeScales : {0.25–24} NM'
      ]},
      { section: 'Operations', items: [
        '+ initialize() : void',
        '+ transmit() : RFPulse',
        '+ receive() : Echo',
        '+ display() : PPIFrame',
        '+ checkSOLAS() : ComplianceStatus'
      ]}
    ]
  },

  // ── TRANSMITTER ───────────────────────────────────────────
  {
    id: 'tx', label: 'Transmitter', stereotype: 'block',
    x: 20, y: 280, w: 270, h: 175,
    color: '#1A6EA3',
    fields: [
      { section: 'Parts', items: [
        '+ delayLine : DelayLine',
        '+ trigger : TriggerUnit',
        '+ modulator : Modulator',
        '+ magnetron : Magnetron'
      ]},
      { section: 'Operations', items: [
        '+ generatePulse() : RFPulse',
        '+ routeToTRSwitch() : void'
      ]}
    ]
  },

  // ── MAGNETRON ─────────────────────────────────────────────
  {
    id: 'mag', label: 'Magnetron', stereotype: 'block',
    x: 20, y: 510, w: 210, h: 110,
    color: '#4A90C4',
    fields: [
      { section: 'Values', items: [
        'outputFrequency : GHz',
        'wavelength : cm'
      ]},
      { section: 'Operations', items: [
        '+ oscillate() : HighFreqRF'
      ]}
    ]
  },

  // ── SCANNER ───────────────────────────────────────────────
  {
    id: 'scan', label: 'Scanner', stereotype: 'block',
    x: 310, y: 280, w: 270, h: 175,
    color: '#2E7D32',
    fields: [
      { section: 'Values', items: [
        'rotationSpeed : 12..30 RPM',
        'beamWidth : degrees',
        'location : MonkeyIsland',
        'PRF : 500..4000 pps'
      ]},
      { section: 'Operations', items: [
        '+ rotateScan() : void',
        '+ transmitPulse() : void',
        '+ receiveEcho() : Echo'
      ]}
    ]
  },

  // ── RECEIVER ──────────────────────────────────────────────
  {
    id: 'rx', label: 'Receiver', stereotype: 'block',
    x: 600, y: 280, w: 270, h: 195,
    color: '#B71C1C',
    fields: [
      { section: 'Parts', items: [
        '+ trCell : TRCell',
        '+ localOscillator : LocalOscillator',
        '+ mixer : Mixer',
        '+ ifAmplifier : IFAmplifier',
        '+ videoAmplifier : VideoAmplifier',
        '+ demodulator : Demodulator'
      ]},
      { section: 'Operations', items: [
        '+ amplifyEcho() : ProcessedSignal',
        '+ smoothSignal() : VideoSignal'
      ]}
    ]
  },

  // ── DISPLAY ───────────────────────────────────────────────
  {
    id: 'disp', label: 'Display', stereotype: 'block',
    x: 890, y: 280, w: 270, h: 195,
    color: '#6A1B9A',
    fields: [
      { section: 'Values', items: [
        'displayType : CRT / RASTER',
        'VRMcount : ≥ 2',
        'parallelIndexLines : ≥ 4',
        'bearingScaleDivision : 30°'
      ]},
      { section: 'Operations', items: [
        '+ renderPPI() : PPIFrame',
        '+ paintTarget() : TargetBlip',
        '+ determineBearing() : degrees',
        '+ determineRange() : NM'
      ]}
    ]
  },

  // ── ARPA ─────────────────────────────────────────────────
  {
    id: 'arpa', label: 'ARPA', stereotype: 'block',
    x: 890, y: 530, w: 185, h: 140,
    color: '#D84315',
    fields: [
      { section: 'Constraints', items: ['[Ships > 3000 GT]', '[SOLAS Ch. V Mandatory]']},
      { section: 'Operations', items: [
        '+ acquireTarget() : Track',
        '+ calculateCPA() : NM',
        '+ calculateTCPA() : min',
        '+ generateAlert() : Alarm'
      ]}
    ]
  },

  // ── EPA ───────────────────────────────────────────────────
  {
    id: 'epa', label: 'ElectronicPlottingAid', stereotype: 'block',
    x: 1090, y: 530, w: 185, h: 120,
    color: '#E65100',
    fields: [
      { section: 'Constraints', items: ['[Ships 300–3000 GT]', '[SOLAS Ch. V Mandatory]']},
      { section: 'Operations', items: [
        '+ plotTarget() : ManualTrack',
        '+ displayVector() : void'
      ]}
    ]
  },

  // ── X-BAND ───────────────────────────────────────────────
  {
    id: 'xband', label: 'XBandRadar', stereotype: 'specialize',
    x: 600, y: 530, w: 260, h: 155,
    color: '#880E4F',
    fields: [
      { section: 'Values', items: [
        'frequency : 9 GHz',
        'wavelength : 3 cm',
        'range : Short (high resolution)',
        'antennaSize : Small'
      ]},
      { section: 'Constraints', items: [
        '[Susceptible to rain attenuation]',
        '[Required: all ships > 300 GT]'
      ]}
    ]
  },

  // ── S-BAND ───────────────────────────────────────────────
  {
    id: 'sband', label: 'SBandRadar', stereotype: 'specialize',
    x: 310, y: 530, w: 260, h: 155,
    color: '#4A148C',
    fields: [
      { section: 'Values', items: [
        'frequency : 3 GHz',
        'wavelength : 10 cm',
        'range : Long',
        'weatherResistance : High'
      ]},
      { section: 'Constraints', items: [
        '[Lower resolution than X-Band]',
        '[Required: ships > 3000 GT]'
      ]}
    ]
  },

  // ── HYBRID NAVY SYSTEM ────────────────────────────────────
  {
    id: 'hns', label: 'HybridNavySystem', stereotype: 'block',
    x: 390, y: 740, w: 320, h: 195,
    color: '#00695C',
    fields: [
      { section: 'Values', items: [
        'integrationMode : SensorFusion',
        'aiEnabled : boolean',
        'autonomyLevel : 0..5'
      ]},
      { section: 'Parts', items: [
        '+ aisReceiver : AISReceiver',
        '+ satelliteFeed : SatelliteDataFeed',
        '+ ecdis : ECDIS',
        '+ uavSensor : UAVSensorFeed',
        '+ fusionEngine : SensorFusionEngine',
        '+ aiClassifier : AITargetClassifier',
        '+ ibs : IntegratedBridgeSystem'
      ]}
    ]
  },

  // ── AIS RECEIVER ─────────────────────────────────────────
  {
    id: 'ais', label: 'AISReceiver', stereotype: 'block',
    x: 20, y: 740, w: 240, h: 120,
    color: '#00796B',
    fields: [
      { section: 'Values', items: [
        'dataFields : {MMSI, Name,',
        '  Position, COG, SOG}'
      ]},
      { section: 'Operations', items: ['+ ingestAIS() : VesselTrack']}
    ]
  },

  // ── SENSOR FUSION ─────────────────────────────────────────
  {
    id: 'sfe', label: 'SensorFusionEngine', stereotype: 'block',
    x: 730, y: 740, w: 225, h: 120,
    color: '#00695C',
    fields: [
      { section: 'Operations', items: [
        '+ fuseRadarAIS() : FusedTrack',
        '+ fuseWithSatellite() : EnhancedTrack',
        '+ fuseWithUAV() : SituationalPicture'
      ]}
    ]
  },

  // ── AI CLASSIFIER ─────────────────────────────────────────
  {
    id: 'aic', label: 'AITargetClassifier', stereotype: 'block',
    x: 730, y: 880, w: 225, h: 120,
    color: '#004D40',
    fields: [
      { section: 'Operations', items: [
        '+ classifyVesselType() : VesselClass',
        '+ detectAnomaly() : Anomaly',
        '+ assessThreatLevel() : ThreatScore'
      ]}
    ]
  },

  // ── IBS ───────────────────────────────────────────────────
  {
    id: 'ibs', label: 'IntegratedBridgeSystem', stereotype: 'block',
    x: 390, y: 960, w: 270, h: 120,
    color: '#004D40',
    fields: [
      { section: 'Operations', items: [
        '+ renderUnifiedPicture() : Display',
        '+ recommendCourse() : COLREGSAdvice',
        '+ logIncident() : EventLog'
      ]}
    ]
  }
];

/* ── CONNECTION DEFINITIONS ─────────────────────────────────────
   from, to   : block ids
   type       : 'compose' | 'usage' | 'specialize' | 'flow' | 'parallel'
   label      : optional label on line
   fromPort   : 'top'|'bottom'|'left'|'right' (default auto)
   toPort     : same
*/
var CONNECTIONS = [
  // MarineRadarSystem compositions
  { from: 'mrs', to: 'tx',   type: 'compose',    label: '«part» 1 transmitter' },
  { from: 'mrs', to: 'scan', type: 'compose',    label: '«part» 1 scanner' },
  { from: 'mrs', to: 'rx',   type: 'compose',    label: '«part» 1 receiver' },
  { from: 'mrs', to: 'disp', type: 'compose',    label: '«part» 1 display' },

  // Specializations
  { from: 'xband', to: 'mrs', type: 'specialize', label: '«specialize» X-Band' },
  { from: 'sband', to: 'mrs', type: 'specialize', label: '«specialize» S-Band' },

  // Usage relationships
  { from: 'mrs', to: 'arpa', type: 'usage', label: '«usage» [>3000 GT]' },
  { from: 'mrs', to: 'epa',  type: 'usage', label: '«usage» [300-3000 GT]' },

  // Signal flow
  { from: 'tx',   to: 'scan', type: 'flow', label: 'RF via waveguide' },
  { from: 'scan', to: 'rx',   type: 'flow', label: 'echo via TR switch' },
  { from: 'rx',   to: 'disp', type: 'flow', label: 'video signal' },
  { from: 'disp', to: 'arpa', type: 'flow', label: 'tracked targets' },
  { from: 'tx',   to: 'mag',  type: 'compose', label: '«part»' },

  // Hybrid Navy parallel flow
  { from: 'mrs', to: 'hns',  type: 'parallel', label: '«parallel flow»' },
  { from: 'hns', to: 'ais',  type: 'compose',  label: '«part»' },
  { from: 'hns', to: 'sfe',  type: 'compose',  label: '«part»' },
  { from: 'hns', to: 'aic',  type: 'compose',  label: '«part»' },
  { from: 'hns', to: 'ibs',  type: 'compose',  label: '«part»' },
  { from: 'ais', to: 'sfe',  type: 'flow', label: 'vessel tracks' },
  { from: 'sfe', to: 'aic',  type: 'flow', label: 'fused track' },
  { from: 'aic', to: 'ibs',  type: 'flow', label: 'classified targets' }
];

/* ============================================================
   RENDERER – do not need to edit below for content changes
   ============================================================ */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  // Find block centre port positions
  function getPort(block, side) {
    var cx = block.x + block.w / 2;
    var cy = block.y + block.h / 2;
    if (side === 'top')    return { x: cx, y: block.y };
    if (side === 'bottom') return { x: cx, y: block.y + block.h };
    if (side === 'left')   return { x: block.x, y: cy };
    if (side === 'right')  return { x: block.x + block.w, y: cy };
    return { x: cx, y: cy };
  }

  // Auto-pick ports based on relative positions
  function autoPorts(a, b) {
    var acx = a.x + a.w / 2, acy = a.y + a.h / 2;
    var bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
    var dx = bcx - acx, dy = bcy - acy;
    if (Math.abs(dy) > Math.abs(dx)) {
      return dy > 0
        ? { from: 'bottom', to: 'top' }
        : { from: 'top', to: 'bottom' };
    } else {
      return dx > 0
        ? { from: 'right', to: 'left' }
        : { from: 'left', to: 'right' };
    }
  }

  var BLOCK_SECTION_H  = 18;
  var BLOCK_HEADER_H   = 44;
  var BLOCK_FONT_SZ    = 10;
  var BLOCK_NAME_SZ    = 11;
  var BLOCK_SECTION_SZ = 9;
  var BLOCK_ITEM_H     = 14;

  function drawBlock(svg, block) {
    var x = block.x, y = block.y, w = block.w;

    // Border
    el('rect', { x: x, y: y, width: w, height: block.h,
      fill: '#FFFFFF', stroke: '#B0BEC5', 'stroke-width': 1.5, rx: 4 }, svg);

    // Header
    el('rect', { x: x, y: y, width: w, height: BLOCK_HEADER_H,
      fill: block.color, rx: 4 }, svg);
    el('rect', { x: x, y: y + BLOCK_HEADER_H - 4, width: w, height: 4,
      fill: block.color }, svg); // square bottom of header

    // Stereotype
    el('text', {
      x: x + w / 2, y: y + 13,
      'font-size': BLOCK_SECTION_SZ, fill: 'rgba(255,255,255,0.85)',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-family': 'Segoe UI, Arial, sans-serif'
    }, svg).textContent = '\u00AB' + block.stereotype + '\u00BB';

    // Block name
    el('text', {
      x: x + w / 2, y: y + 30,
      'font-size': BLOCK_NAME_SZ, fill: '#FFFFFF', 'font-weight': '700',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-family': 'Segoe UI, Arial, sans-serif'
    }, svg).textContent = block.label;

    // Compartments
    var curY = y + BLOCK_HEADER_H;
    (block.fields || []).forEach(function (section) {
      // Section header
      el('rect', { x: x, y: curY, width: w, height: BLOCK_SECTION_H,
        fill: 'rgba(0,0,0,0.06)' }, svg);
      el('line', { x1: x, y1: curY, x2: x + w, y2: curY,
        stroke: '#B0BEC5', 'stroke-width': 1 }, svg);
      el('text', {
        x: x + 6, y: curY + BLOCK_SECTION_H / 2,
        'font-size': BLOCK_SECTION_SZ, fill: '#444',
        'font-weight': '600', 'font-style': 'italic',
        'dominant-baseline': 'middle',
        'font-family': 'Segoe UI, Arial, sans-serif'
      }, svg).textContent = section.section;
      curY += BLOCK_SECTION_H;

      section.items.forEach(function (item) {
        el('text', {
          x: x + 8, y: curY + BLOCK_ITEM_H / 2,
          'font-size': BLOCK_FONT_SZ, fill: '#222',
          'dominant-baseline': 'middle',
          'font-family': 'Consolas, monospace'
        }, svg).textContent = item;
        curY += BLOCK_ITEM_H;
      });
    });
  }

  function drawConnection(svg, conn, blockMap, markers) {
    var a = blockMap[conn.from], b = blockMap[conn.to];
    if (!a || !b) return;

    var ports = autoPorts(a, b);
    var p1 = getPort(a, conn.fromPort || ports.from);
    var p2 = getPort(b, conn.toPort || ports.to);

    var stroke, dash, markerEnd, markerStart;
    if (conn.type === 'compose')    { stroke = '#1A6EA3'; markerEnd = 'url(#diamond)'; }
    else if (conn.type === 'usage') { stroke = '#E65100'; dash = '5,3'; markerEnd = 'url(#arrow-open)'; }
    else if (conn.type === 'specialize') { stroke = '#6A1B9A'; markerEnd = 'url(#triangle)'; }
    else if (conn.type === 'flow')  { stroke = '#2E86AB'; markerEnd = 'url(#arrow-solid)'; }
    else if (conn.type === 'parallel') { stroke = '#00695C'; dash = '8,4'; markerEnd = 'url(#arrow-solid)'; }
    else { stroke = '#888'; markerEnd = 'url(#arrow-solid)'; }

    var lineAttrs = {
      x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
      stroke: stroke, 'stroke-width': 1.5,
      'marker-end': markerEnd
    };
    if (markerStart) lineAttrs['marker-start'] = markerStart;
    if (dash) lineAttrs['stroke-dasharray'] = dash;
    el('line', lineAttrs, svg);

    // Label
    if (conn.label) {
      var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      el('rect', { x: mx - 2, y: my - 7, width: conn.label.length * 5.5 + 6, height: 13,
        fill: 'rgba(255,255,255,0.85)', rx: 2 }, svg);
      el('text', {
        x: mx + 1, y: my,
        'font-size': 8.5, fill: '#333',
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        'font-family': 'Segoe UI, Arial, sans-serif'
      }, svg).textContent = conn.label;
    }
  }

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    // Calculate bounding box
    var maxX = 0, maxY = 0;
    BLOCKS.forEach(function (b) {
      maxX = Math.max(maxX, b.x + b.w);
      maxY = Math.max(maxY, b.y + b.h);
    });
    var pad = 30;
    var svgW = maxX + pad * 2;
    var svgH = maxY + pad * 2;

    var svg = el('svg', {
      width: svgW, height: svgH + 80,
      xmlns: NS,
      viewBox: (-pad) + ' ' + (-pad) + ' ' + svgW + ' ' + (svgH + 80)
    }, container);

    // Markers
    var defs = el('defs', {}, svg);

    // Filled arrow
    var m1 = el('marker', { id: 'arrow-solid', markerWidth: 8, markerHeight: 8,
      refX: 6, refY: 3, orient: 'auto' }, defs);
    el('path', { d: 'M0,0 L0,6 L8,3 z', fill: '#2E86AB' }, m1);

    // Open arrow
    var m2 = el('marker', { id: 'arrow-open', markerWidth: 8, markerHeight: 8,
      refX: 6, refY: 3, orient: 'auto' }, defs);
    el('path', { d: 'M0,0 L8,3 L0,6', fill: 'none', stroke: '#E65100', 'stroke-width': 1.5 }, m2);

    // Diamond (composition)
    var m3 = el('marker', { id: 'diamond', markerWidth: 10, markerHeight: 10,
      refX: 5, refY: 5, orient: 'auto' }, defs);
    el('polygon', { points: '0,5 5,0 10,5 5,10', fill: '#1A6EA3' }, m3);

    // Triangle (generalization)
    var m4 = el('marker', { id: 'triangle', markerWidth: 10, markerHeight: 10,
      refX: 8, refY: 5, orient: 'auto' }, defs);
    el('polygon', { points: '0,0 10,5 0,10', fill: 'none', stroke: '#6A1B9A', 'stroke-width': 1.5 }, m4);

    // Title
    el('rect', { x: -pad, y: -pad, width: svgW, height: 36,
      fill: '#0D1B2A' }, svg);
    el('text', {
      x: svgW / 2 - pad, y: -pad + 18,
      'font-size': 13, 'font-weight': '700', fill: '#FFFFFF',
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-family': 'Segoe UI, Arial, sans-serif'
    }, svg).textContent = 'Marine Radar System — SysML Block Definition Diagram (BDD)';

    // Build lookup
    var blockMap = {};
    BLOCKS.forEach(function (b) { blockMap[b.id] = b; });

    // Draw connections first (behind blocks)
    CONNECTIONS.forEach(function (c) { drawConnection(svg, c, blockMap); });

    // Draw blocks
    BLOCKS.forEach(function (b) { drawBlock(svg, b); });

    // Legend
    var lx = -pad + 10, ly = maxY + 20;
    var items = [
      { color: '#1A6EA3', dash: '',    label: 'Composition (filled diamond)' },
      { color: '#6A1B9A', dash: '',    label: 'Generalization / Specialization' },
      { color: '#2E86AB', dash: '',    label: 'Signal Flow' },
      { color: '#E65100', dash: '5,3', label: 'Usage' },
      { color: '#00695C', dash: '8,4', label: 'Parallel Flow (Hybrid Navy)' }
    ];
    items.forEach(function (item, i) {
      var ix = lx + i * 230;
      el('line', { x1: ix, y1: ly + 8, x2: ix + 30, y2: ly + 8,
        stroke: item.color, 'stroke-width': 2,
        'stroke-dasharray': item.dash || null }, svg);
      el('text', { x: ix + 36, y: ly + 8,
        'font-size': 9, fill: '#444', 'dominant-baseline': 'middle',
        'font-family': 'Segoe UI, Arial, sans-serif'
      }, svg).textContent = item.label;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    render('bdd-svg');
  });

})();
