/* usecase.js – Marine Radar System Use Case Diagram (interactive)
   ── EDIT ACTORS / USE_CASES / ASSOCIATIONS / UC_RELATIONSHIPS for diagram content.
   ── EDIT DETAILS for click-to-inspect panel content.
   ── Do not edit the renderer below the DETAILS block. */

/* ── ACTORS ───────────────────────────────────────────────────── */
var ACTORS = [
  { id:'oow',       label:'Officer\nof Watch',    x:72,   y:265, side:'left'  },
  { id:'captain',   label:'Ship\nCaptain',         x:72,   y:442, side:'left'  },
  { id:'tech',      label:'Radar\nTechnician',     x:72,   y:618, side:'left'  },
  { id:'ais_net',   label:'AIS\nNetwork',          x:1228, y:222, side:'right' },
  { id:'ecdis_sys', label:'ECDIS\nSystem',         x:1228, y:398, side:'right' },
  { id:'sat_net',   label:'Satellite\nNetwork',    x:1228, y:574, side:'right' }
];

/* ── USE CASES ────────────────────────────────────────────────── */
var USE_CASES = [
  // Core Radar Pipeline (left half of system boundary, centre x≈368)
  { id:'uc_init',     label:'Initialize\nRadar System',        x:368, y:148, group:'core'   },
  { id:'uc_range',    label:'Determine\nTarget Range',         x:368, y:248, group:'core'   },
  { id:'uc_bearing',  label:'Determine\nTarget Bearing',       x:368, y:348, group:'core'   },
  { id:'uc_ppi',      label:'Display\nPPI Plot',               x:368, y:448, group:'core'   },
  { id:'uc_tracking', label:'Track Targets\n(ARPA / EPA)',     x:368, y:548, group:'core'   },
  { id:'uc_alert',    label:'Generate\nCollision Alert',       x:368, y:641, group:'core'   },
  { id:'uc_solas',    label:'Verify SOLAS\nCompliance',        x:368, y:734, group:'core'   },
  { id:'uc_perf',     label:'Perform\nPerformance Test',       x:368, y:827, group:'core'   },
  // Hybrid Navy Integration (right half, centre x≈802)
  { id:'uc_ais',      label:'Ingest\nAIS Data',                x:802, y:170, group:'hybrid' },
  { id:'uc_fusion',   label:'Fuse\nSensor Data',               x:802, y:308, group:'hybrid' },
  { id:'uc_classify', label:'Classify Target\nvia AI / ML',    x:802, y:454, group:'hybrid' },
  { id:'uc_course',   label:'Generate Course\nRecommendation', x:802, y:606, group:'hybrid' },
  { id:'uc_log',      label:'Log Navigation\nIncident',        x:802, y:754, group:'hybrid' }
];

/* ── ACTOR → USE CASE ASSOCIATIONS ───────────────────────────── */
var ASSOCIATIONS = [
  { actor:'oow',       usecase:'uc_init'     },
  { actor:'oow',       usecase:'uc_ppi'      },
  { actor:'oow',       usecase:'uc_tracking' },
  { actor:'captain',   usecase:'uc_course'   },
  { actor:'tech',      usecase:'uc_solas'    },
  { actor:'tech',      usecase:'uc_perf'     },
  { actor:'ais_net',   usecase:'uc_ais'      },
  { actor:'ecdis_sys', usecase:'uc_fusion'   },
  { actor:'sat_net',   usecase:'uc_fusion'   }
];

/* ── USE CASE RELATIONSHIPS ───────────────────────────────────── */
var UC_RELATIONSHIPS = [
  // Core radar
  { from:'uc_tracking', to:'uc_range',    type:'include', label:'«include»', fromDX:-26, toDX:-26 },
  { from:'uc_tracking', to:'uc_bearing',  type:'include', label:'«include»', fromDX: 26, toDX: 26 },
  { from:'uc_alert',    to:'uc_tracking', type:'extend',  label:'«extend»' },
  // Hybrid
  { from:'uc_fusion',   to:'uc_ais',      type:'include', label:'«include»' },
  { from:'uc_course',   to:'uc_fusion',   type:'include', label:'«include»', fromDX:-22, toDX:-22 },
  { from:'uc_course',   to:'uc_classify', type:'include', label:'«include»', fromDX: 22, toDX: 22 },
  { from:'uc_log',      to:'uc_course',   type:'extend',  label:'«extend»' }
];

/* ── DETAILS ──────────────────────────────────────────────────── */
var DETAILS = {
  // Actors
  oow:       { title:'Officer of Watch (OOW)',  description:'Primary bridge officer responsible for navigation watch, radar monitoring, and collision avoidance decisions per COLREGS.' },
  captain:   { title:'Ship Captain',             description:'Vessel master who receives course recommendations and authorizes collision avoidance manoeuvres.' },
  tech:      { title:'Radar Technician',         description:'Responsible for performance testing, SOLAS compliance verification, and radar maintenance and calibration.' },
  ais_net:   { title:'AIS Network',              description:'External AIS infrastructure broadcasting vessel identity, position, COG, SOG, and heading from other vessels in the area.' },
  ecdis_sys: { title:'ECDIS System',             description:'Electronic Chart Display and Information System providing real-time electronic navigational chart overlays for sensor fusion.' },
  sat_net:   { title:'Satellite Network',        description:'VDES / GNSS satellite network providing position augmentation and extended data exchange beyond line-of-sight.' },

  // Core use cases
  uc_init:    { title:'Initialize Radar System',       source:'§4.1 + §8 IMO MSC.192(79)', description:'System startup: power supply → delay line → modulator → magnetron → TR switch. Cold start ≤4 min, standby to operational ≤5 sec.', values:['Cold start: ≤4 min','Standby to ready: ≤5 sec'],
    crossRefs:[{ label:'Activity: Power Supply Initialization', page:'activity.html', id:'power'   },{ label:'Block: Transmitter (BDD)',          page:'bdd.html',     id:'tx'      }]},
  uc_range:   { title:'Determine Target Range',        source:'§5.1 + §8 IMO MSC.192(79)', description:'Measures range by timing echo delay. Tracing spot speed = ½ speed of radio waves. Minimum 2 VRMs on display.', values:['Accuracy: ±30 m or 1% of range scale','Minimum 2 VRMs (IMO MSC.192)'],
    crossRefs:[{ label:'Activity: Range Determination',         page:'activity.html', id:'range_det'},{ label:'Block: Display (BDD)',              page:'bdd.html',     id:'disp'    }]},
  uc_bearing: { title:'Determine Target Bearing',      source:'§5.2 + §8 IMO MSC.192(79)', description:'Bearing measured from heading marker. High PRF vs RPM makes angle rotation per pulse negligible. Minimum 4 parallel index lines.', values:['Accuracy: ±1°','Minimum 4 parallel index lines (IMO MSC.192)'],
    crossRefs:[{ label:'Activity: Bearing Determination',       page:'activity.html', id:'bearing_det'},{ label:'Block: Display (BDD)',            page:'bdd.html',     id:'disp'    }]},
  uc_ppi:     { title:"Display PPI Plot",              source:'§4.4 Display', description:"PPI renders a Bird's Eye View on CRT/raster display. One trace per transmitted pulse, synchronized with scanner rotation.",
    crossRefs:[{ label:'Activity: PPI Display',                 page:'activity.html', id:'ppi'     },{ label:'Block: Display (BDD)',              page:'bdd.html',     id:'disp'    }]},
  uc_tracking:{ title:'Track Targets (ARPA / EPA)',    source:'§7 SOLAS Chapter V', description:'ARPA (>3000 GT) auto-acquires targets and calculates CPA/TCPA. EPA (300–3000 GT) provides semi-automatic plotting. Both are SOLAS mandatory.', constraints:['ARPA mandatory: ships > 3000 GT','EPA mandatory: ships 300–3000 GT'], operations:['acquireTarget(): Track','calculateCPA(): NM','calculateTCPA(): min'],
    crossRefs:[{ label:'Activity: ARPA node',                   page:'activity.html', id:'arpa'    },{ label:'Activity: EPA node',                page:'activity.html',id:'epa'     },{ label:'Block: ARPA (BDD)', page:'bdd.html', id:'arpa' }]},
  uc_alert:   { title:'Generate Collision Alert',      source:'§8 IMO MSC.192(79)', description:'Alert raised on sensor/signal failure or CPA/TCPA breach. Must identify the failed sensor (gyro, log, video, sync, or heading).', constraints:['Sensors monitored: gyro, log, video, sync, heading','Any failure must be alarmed (IMO MSC.192)'],
    crossRefs:[{ label:'Activity: ALARM Triggered',             page:'activity.html', id:'alarm'   },{ label:'Block: ARPA (BDD)',                page:'bdd.html',     id:'arpa'    }]},
  uc_solas:   { title:'Verify SOLAS Compliance',       source:'§7–§8 SOLAS + IMO MSC.192(79)', description:'Verifies compliance with SOLAS Chapter V and IMO MSC.192(79): startup times, display requirements, sensor alarm coverage.', constraints:['Cold start: ≤4 min','Standby: ≤5 sec','Min 2 VRMs, 4 index lines'],
    crossRefs:[{ label:'Activity: Bearing Scale & Index Lines', page:'activity.html', id:'bearing_scale'},{ label:'Block: MarineRadarSystem (BDD)',page:'bdd.html',     id:'mrs'     }]},
  uc_perf:    { title:'Perform Performance Test',      source:'§8 IMO MSC.192(79)', description:'Periodic verification: absence-of-target indication, sensor health monitoring, and compliance with IMO operational standards.', operations:['Absence-of-target indication check','Sensor health verification','Range/bearing accuracy test'],
    crossRefs:[{ label:'Activity: Optimum Performance',         page:'activity.html', id:'ok_perf' },{ label:'Block: MarineRadarSystem (BDD)',    page:'bdd.html',     id:'mrs'     }]},

  // Hybrid Navy use cases
  uc_ais:     { title:'Ingest AIS Data',               description:'Receives Automatic Identification System broadcasts providing vessel identity not derivable from radar echo alone.', values:['MMSI, Name, Position','COG (Course Over Ground)','SOG (Speed Over Ground)','True heading'],
    crossRefs:[{ label:'Activity: AIS Data Ingestion',          page:'activity.html', id:'ais'     },{ label:'Block: AISReceiver (BDD)',          page:'bdd.html',     id:'ais'     }]},
  uc_fusion:  { title:'Fuse Sensor Data',              description:'Combines radar tracks, AIS data, ECDIS charts, satellite feeds, and UAV data into a single authoritative situational picture.', operations:['fuseRadarAIS(): FusedTrack','fuseWithSatellite(): EnhancedTrack','fuseWithUAV(): SituationalPicture'],
    crossRefs:[{ label:'Activity: Sensor Fusion Engine',        page:'activity.html', id:'fusion'  },{ label:'Block: SensorFusionEngine (BDD)',   page:'bdd.html',     id:'sfe'     }]},
  uc_classify:{ title:'Classify Target via AI/ML',     description:'Machine learning classifier assigns vessel type, anomaly score, and threat level to each fused track. Feeds into collision avoidance DSS.', operations:['classifyVesselType(): VesselClass','detectAnomaly(): Anomaly','assessThreatLevel(): ThreatScore'],
    crossRefs:[{ label:'Activity: AI/ML Classification Engine', page:'activity.html', id:'ai_class'},{ label:'Block: AITargetClassifier (BDD)',   page:'bdd.html',     id:'aic'     }]},
  uc_course:  { title:'Generate Course Recommendation',description:'COLREGS-aware Decision Support System generates collision avoidance course recommendations based on fused sensor data and AI classification.', operations:['recommendCourse(): COLREGSAdvice','generateAlert(): Alarm'],
    crossRefs:[{ label:'Activity: Hybrid Collision Avoidance DSS',page:'activity.html',id:'hybrid_cav'},{ label:'Block: IntegratedBridgeSystem (BDD)',page:'bdd.html',  id:'ibs'     }]},
  uc_log:     { title:'Log Navigation Incident',       description:'Records navigation events, collision alerts, course deviations, and system anomalies to the voyage data recorder and incident log.', operations:['logIncident(): EventLog'],
    crossRefs:[{ label:'Activity: Navigation & Safety Output',  page:'activity.html', id:'final'   },{ label:'Block: IntegratedBridgeSystem (BDD)',page:'bdd.html',    id:'ibs'     }]}
};

/* ── REQUIREMENTS CROSS-REFERENCES ───────────────────────────── */
(function () {
  var R = {
    uc_init:     [{ label:'Requirement: REQ-SYS-01 Cold Start',          page:'requirements.html', id:'req_sys_01' },
                  { label:'Requirement: REQ-SOL-01 X-Band Mandatory',    page:'requirements.html', id:'req_sol_01' }],
    uc_perf:     [{ label:'Requirement: REQ-SYS-01 Cold Start',          page:'requirements.html', id:'req_sys_01' },
                  { label:'Requirement: REQ-SYS-02 Standby Switching',   page:'requirements.html', id:'req_sys_02' }],
    uc_range:    [{ label:'Requirement: REQ-SYS-03 Range Accuracy',      page:'requirements.html', id:'req_sys_03' }],
    uc_bearing:  [{ label:'Requirement: REQ-SYS-04 Bearing Accuracy',    page:'requirements.html', id:'req_sys_04' }],
    uc_tracking: [{ label:'Requirement: REQ-SOL-02 Plotting Aid',        page:'requirements.html', id:'req_sol_02' },
                  { label:'Requirement: REQ-SOL-03 S-Band + ARPA',       page:'requirements.html', id:'req_sol_03' }],
    uc_solas:    [{ label:'Requirement: REQ-SOL-03 S-Band + ARPA',       page:'requirements.html', id:'req_sol_03' },
                  { label:'Requirement: REQ-SOL-04 Display Standards',   page:'requirements.html', id:'req_sol_04' }],
    uc_ppi:      [{ label:'Requirement: REQ-HW-01 Scanner Siting',       page:'requirements.html', id:'req_hw_01' },
                  { label:'Requirement: REQ-HW-02 PRF Range',            page:'requirements.html', id:'req_hw_02' },
                  { label:'Requirement: REQ-HW-03 Scan Rate',            page:'requirements.html', id:'req_hw_03' }],
    uc_ais:      [{ label:'Requirement: REQ-HYB-01 AIS Integration',     page:'requirements.html', id:'req_hyb_01' }],
    uc_fusion:   [{ label:'Requirement: REQ-HYB-02 Sensor Fusion',       page:'requirements.html', id:'req_hyb_02' }],
    uc_classify: [{ label:'Requirement: REQ-HYB-03 AI/ML Classification',page:'requirements.html', id:'req_hyb_03' }],
    uc_course:   [{ label:'Requirement: REQ-HYB-04 Collision Avoidance', page:'requirements.html', id:'req_hyb_04' }]
  };
  for (var id in R) {
    if (DETAILS[id]) DETAILS[id].crossRefs = (DETAILS[id].crossRefs || []).concat(R[id]);
  }
}());

/* ============================================================
   RENDERER — edit above sections, not below.
   ============================================================ */
(function () {
  'use strict';

  var NS     = 'http://www.w3.org/2000/svg';
  var UC_RX  = 108, UC_RY = 33;   // use case ellipse radii
  var HD_R   = 12;                  // actor head radius
  var BODY_H = 22, ARMS_Y = 14, LEG_SP = 14, LEG_H = 20;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function buildUCMap() {
    var m = {};
    USE_CASES.forEach(function (u) { m[u.id] = u; });
    return m;
  }

  function buildActorMap() {
    var m = {};
    ACTORS.forEach(function (a) { m[a.id] = a; });
    return m;
  }

  function drawActor(svg, actor) {
    var g = el('g', { 'data-id': actor.id, 'class': 'actor-group node-group' }, svg);
    var x = actor.x, y = actor.y;
    el('circle', { cx:x, cy:y+HD_R,              r:HD_R,    fill:'#FFFFFF', stroke:'#1A6EA3', 'stroke-width':1.5 }, g);
    el('line',   { x1:x, y1:y+HD_R*2,  x2:x,    y2:y+HD_R*2+BODY_H, stroke:'#1A1A2E', 'stroke-width':1.5 }, g);
    el('line',   { x1:x-16,y1:y+HD_R*2+ARMS_Y,  x2:x+16,  y2:y+HD_R*2+ARMS_Y,  stroke:'#1A1A2E', 'stroke-width':1.5 }, g);
    el('line',   { x1:x, y1:y+HD_R*2+BODY_H,    x2:x-LEG_SP, y2:y+HD_R*2+BODY_H+LEG_H, stroke:'#1A1A2E', 'stroke-width':1.5 }, g);
    el('line',   { x1:x, y1:y+HD_R*2+BODY_H,    x2:x+LEG_SP, y2:y+HD_R*2+BODY_H+LEG_H, stroke:'#1A1A2E', 'stroke-width':1.5 }, g);
    var labelY = y + HD_R*2 + BODY_H + LEG_H + 14;
    actor.label.split('\n').forEach(function (line, i) {
      el('text', { x:x, y:labelY+i*13, 'font-size':10, 'font-weight':i===0?'600':'400', fill:'#1A1A2E', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = line;
    });
    return g;
  }

  function drawUseCase(svg, uc) {
    var g    = el('g', { 'data-id': uc.id, 'class': 'uc-node node-group' }, svg);
    var fill = uc.group === 'hybrid' ? '#E0F7FA' : '#EEF5FB';
    var strk = uc.group === 'hybrid' ? '#00695C'  : '#1A6EA3';
    el('ellipse', { cx:uc.x, cy:uc.y, rx:UC_RX, ry:UC_RY, fill:fill, stroke:strk, 'stroke-width':1.5 }, g);
    var lines  = uc.label.split('\n');
    var totalH = (lines.length - 1) * 14;
    lines.forEach(function (line, i) {
      el('text', { x:uc.x, y:uc.y - totalH/2 + i*14, 'font-size':10, 'font-weight':i===0?'600':'400', fill:'#1A1A2E', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = line;
    });
    return g;
  }

  function actorMidY(actor) { return actor.y + HD_R*2 + BODY_H/2; }

  function drawAssociation(svg, actor, ucId, ucMap) {
    var uc = ucMap[ucId];
    if (!uc) return;
    var ax = actor.x, ay = actorMidY(actor);
    var ex = actor.side === 'left' ? uc.x - UC_RX : uc.x + UC_RX;
    el('line', { x1:ax, y1:ay, x2:ex, y2:uc.y, stroke:'#5A6A7A', 'stroke-width':1.2 }, svg);
  }

  function drawUCRelationship(svg, rel, ucMap) {
    var a = ucMap[rel.from], b = ucMap[rel.to];
    if (!a || !b) return;
    var fdx = rel.fromDX || 0, tdx = rel.toDX || 0;
    var ax = a.x + fdx, bx = b.x + tdx;
    var ay, by;
    if (a.y > b.y) { ay = a.y - UC_RY; by = b.y + UC_RY; }
    else            { ay = a.y + UC_RY; by = b.y - UC_RY; }
    var stroke = rel.type === 'include' ? '#1A6EA3' : '#6A1B9A';
    var markId = 'uc-arrow-' + rel.type;
    el('line', { x1:ax, y1:ay, x2:bx, y2:by, stroke:stroke, 'stroke-width':1.2, 'stroke-dasharray':'5,3', 'marker-end':'url(#'+markId+')' }, svg);
    var mx = (ax+bx)/2, my = (ay+by)/2;
    el('rect', { x:mx-33, y:my-8, width:66, height:14, fill:'rgba(255,255,255,0.92)', rx:2 }, svg);
    el('text', { x:mx, y:my, 'font-size':9, fill:'#333', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-style':'italic', 'font-family':'Segoe UI, Arial, sans-serif' }, svg).textContent = rel.label;
  }

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var svgW = 1300, svgH = 940;
    var svg = el('svg', {
      width: svgW, height: svgH, xmlns: NS,
      viewBox: '0 0 ' + svgW + ' ' + svgH,
      style: 'font-family: Segoe UI, Arial, sans-serif;'
    }, container);

    // Markers
    var defs = el('defs', {}, svg);
    ['include','extend'].forEach(function (type) {
      var col = type === 'include' ? '#1A6EA3' : '#6A1B9A';
      var m   = el('marker', { id:'uc-arrow-'+type, markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto' }, defs);
      el('path', { d:'M0,0 L0,6 L8,3 z', fill:col }, m);
    });

    // Title bar
    el('rect', { x:0, y:0, width:svgW, height:36, fill:'#0D1B2A' }, svg);
    el('text', { x:svgW/2, y:18, 'font-size':13, 'font-weight':'700', fill:'#FFFFFF', 'text-anchor':'middle', 'dominant-baseline':'middle' }, svg).textContent = 'Marine Radar System — SysML Use Case Diagram';

    // System boundary
    var bx=155, by=46, bw=990, bh=854;
    el('rect', { x:bx, y:by, width:bw, height:bh, fill:'rgba(237,247,255,0.35)', stroke:'#1A6EA3', 'stroke-width':2, rx:8 }, svg);
    el('text', { x:bx+bw/2, y:by+18, 'font-size':11, 'font-weight':'700', fill:'#1A6EA3', 'text-anchor':'middle', 'dominant-baseline':'middle' }, svg).textContent = '«system»  MarineRadarSystem';

    // Internal divider: core vs hybrid
    var divX = 632;
    el('line', { x1:divX, y1:by+34, x2:divX, y2:by+bh-10, stroke:'#B0BEC5', 'stroke-width':1, 'stroke-dasharray':'6,4' }, svg);
    el('text', { x:390,  y:by+48, 'font-size':9, fill:'#5A6A7A', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-style':'italic' }, svg).textContent = 'Core Radar Pipeline';
    el('text', { x:802,  y:by+48, 'font-size':9, fill:'#00695C', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-style':'italic' }, svg).textContent = 'Hybrid Navy Integration';

    var ucMap    = buildUCMap();
    var actorMap = buildActorMap();

    // Draw associations and UC relationships (behind shapes)
    ASSOCIATIONS.forEach(function (assoc) {
      drawAssociation(svg, actorMap[assoc.actor], assoc.usecase, ucMap);
    });
    UC_RELATIONSHIPS.forEach(function (rel) {
      drawUCRelationship(svg, rel, ucMap);
    });

    // Draw actors + use cases on top
    ACTORS.forEach(function   (a) { drawActor(svg, a); });
    USE_CASES.forEach(function (u) { drawUseCase(svg, u); });

    return svg;
  }

  /* ── Boot + interactivity ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    render('usecase-svg');

    var container = document.getElementById('usecase-svg');
    if (!container || !window.SysMLInteract) return;
    var svgEl = container.querySelector('svg');
    if (!svgEl) return;

    var zoomCtrl = SysMLInteract.initZoomPan(svgEl);
    SysMLInteract.initZoomToolbar('diagram-toolbar', zoomCtrl);

    svgEl.querySelectorAll('.uc-node, .actor-group').forEach(function (g) {
      var id  = g.getAttribute('data-id');
      var det = DETAILS[id];
      if (!det) return;
      /* hover → show floating panel */
      g.addEventListener('mouseenter', function () { SysMLInteract.showPanel(det); });
      g.addEventListener('mouseleave', SysMLInteract.scheduleHide);
      /* click → navigate to first related diagram */
      g.addEventListener('click', function (e) {
        e.stopPropagation();
        if (zoomCtrl && zoomCtrl.wasDragged()) { zoomCtrl.clearDrag(); return; }
        if (det.crossRefs && det.crossRefs.length) {
          window.location.href = det.crossRefs[0].page + '?highlight=' + det.crossRefs[0].id;
        }
      });
    });

    svgEl.addEventListener('click', function () {
      if (zoomCtrl && zoomCtrl.wasDragged()) { zoomCtrl.clearDrag(); return; }
      SysMLInteract.hidePanel();
    });

    // URL-based highlight (e.g. usecase.html?highlight=uc_tracking)
    SysMLInteract.highlightFromURL(svgEl, function (g) {
      var det = DETAILS[g.getAttribute('data-id')];
      if (det) SysMLInteract.showPanel(det);
    });

    // Link badges
    SysMLInteract.addLinkBadges(svgEl, DETAILS);
  });

}());
