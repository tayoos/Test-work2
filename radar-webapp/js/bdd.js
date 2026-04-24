/* bdd.js – Marine Radar System Block Definition Diagram (interactive)
   ── EDIT BLOCKS / CONNECTIONS to change diagram content.
   ── EDIT DETAILS to change click-to-inspect panel content.
   ── Do not edit the renderer below the DETAILS block. */

/* ── BLOCK DEFINITIONS ────────────────────────────────────────── */
var BLOCKS = [
  { id:'mrs',   label:'MarineRadarSystem',      stereotype:'block',
    x:390,  y:10,  w:310, h:210, color:'#1A6EA3',
    fields:[
      { section:'Values', items:['operatingFrequency : GHz','wavelength : cm','radarType : {X-Band | S-Band}','PRF : 500..4000 pps','scannerRPM : 12..30 RPM','rangeScales : {0.25–24} NM'] },
      { section:'Operations', items:['+ initialize() : void','+ transmit() : RFPulse','+ receive() : Echo','+ display() : PPIFrame','+ checkSOLAS() : ComplianceStatus'] }
    ]
  },
  { id:'tx',    label:'Transmitter',             stereotype:'block',
    x:20,   y:280, w:270, h:175, color:'#1A6EA3',
    fields:[
      { section:'Parts', items:['+ delayLine : DelayLine','+ trigger : TriggerUnit','+ modulator : Modulator','+ magnetron : Magnetron'] },
      { section:'Operations', items:['+ generatePulse() : RFPulse','+ routeToTRSwitch() : void'] }
    ]
  },
  { id:'mag',   label:'Magnetron',               stereotype:'block',
    x:20,   y:510, w:210, h:110, color:'#4A90C4',
    fields:[
      { section:'Values', items:['outputFrequency : GHz','wavelength : cm'] },
      { section:'Operations', items:['+ oscillate() : HighFreqRF'] }
    ]
  },
  { id:'scan',  label:'Scanner',                 stereotype:'block',
    x:310,  y:280, w:270, h:175, color:'#2E7D32',
    fields:[
      { section:'Values', items:['rotationSpeed : 12..30 RPM','beamWidth : degrees','location : MonkeyIsland','PRF : 500..4000 pps'] },
      { section:'Operations', items:['+ rotateScan() : void','+ transmitPulse() : void','+ receiveEcho() : Echo'] }
    ]
  },
  { id:'rx',    label:'Receiver',                stereotype:'block',
    x:600,  y:280, w:270, h:195, color:'#B71C1C',
    fields:[
      { section:'Parts', items:['+ trCell : TRCell','+ localOscillator : LocalOscillator','+ mixer : Mixer','+ ifAmplifier : IFAmplifier','+ videoAmplifier : VideoAmplifier','+ demodulator : Demodulator'] },
      { section:'Operations', items:['+ amplifyEcho() : ProcessedSignal','+ smoothSignal() : VideoSignal'] }
    ]
  },
  { id:'disp',  label:'Display',                 stereotype:'block',
    x:890,  y:280, w:270, h:195, color:'#6A1B9A',
    fields:[
      { section:'Values', items:['displayType : CRT / RASTER','VRMcount : ≥ 2','parallelIndexLines : ≥ 4','bearingScaleDivision : 30°'] },
      { section:'Operations', items:['+ renderPPI() : PPIFrame','+ paintTarget() : TargetBlip','+ determineBearing() : degrees','+ determineRange() : NM'] }
    ]
  },
  { id:'arpa',  label:'ARPA',                    stereotype:'block',
    x:890,  y:530, w:185, h:140, color:'#D84315',
    fields:[
      { section:'Constraints', items:['[Ships > 3000 GT]','[SOLAS Ch. V Mandatory]'] },
      { section:'Operations', items:['+ acquireTarget() : Track','+ calculateCPA() : NM','+ calculateTCPA() : min','+ generateAlert() : Alarm'] }
    ]
  },
  { id:'epa',   label:'ElectronicPlottingAid',   stereotype:'block',
    x:1090, y:530, w:185, h:120, color:'#E65100',
    fields:[
      { section:'Constraints', items:['[Ships 300–3000 GT]','[SOLAS Ch. V Mandatory]'] },
      { section:'Operations', items:['+ plotTarget() : ManualTrack','+ displayVector() : void'] }
    ]
  },
  { id:'xband', label:'XBandRadar',              stereotype:'specialize',
    x:600,  y:530, w:260, h:155, color:'#880E4F',
    fields:[
      { section:'Values', items:['frequency : 9 GHz','wavelength : 3 cm','range : Short (high resolution)','antennaSize : Small'] },
      { section:'Constraints', items:['[Susceptible to rain attenuation]','[Required: all ships > 300 GT]'] }
    ]
  },
  { id:'sband', label:'SBandRadar',              stereotype:'specialize',
    x:310,  y:530, w:260, h:155, color:'#4A148C',
    fields:[
      { section:'Values', items:['frequency : 3 GHz','wavelength : 10 cm','range : Long','weatherResistance : High'] },
      { section:'Constraints', items:['[Lower resolution than X-Band]','[Required: ships > 3000 GT]'] }
    ]
  },
  { id:'hns',   label:'HybridNavySystem',        stereotype:'block',
    x:390,  y:740, w:320, h:195, color:'#00695C',
    fields:[
      { section:'Values', items:['integrationMode : SensorFusion','aiEnabled : boolean','autonomyLevel : 0..5'] },
      { section:'Parts', items:['+ aisReceiver : AISReceiver','+ satelliteFeed : SatelliteDataFeed','+ ecdis : ECDIS','+ uavSensor : UAVSensorFeed','+ fusionEngine : SensorFusionEngine','+ aiClassifier : AITargetClassifier','+ ibs : IntegratedBridgeSystem'] }
    ]
  },
  { id:'ais',   label:'AISReceiver',             stereotype:'block',
    x:20,   y:740, w:240, h:120, color:'#00796B',
    fields:[
      { section:'Values', items:['dataFields : {MMSI, Name,','  Position, COG, SOG}'] },
      { section:'Operations', items:['+ ingestAIS() : VesselTrack'] }
    ]
  },
  { id:'sfe',   label:'SensorFusionEngine',      stereotype:'block',
    x:730,  y:740, w:225, h:120, color:'#00695C',
    fields:[
      { section:'Operations', items:['+ fuseRadarAIS() : FusedTrack','+ fuseWithSatellite() : EnhancedTrack','+ fuseWithUAV() : SituationalPicture'] }
    ]
  },
  { id:'aic',   label:'AITargetClassifier',      stereotype:'block',
    x:730,  y:880, w:225, h:120, color:'#004D40',
    fields:[
      { section:'Operations', items:['+ classifyVesselType() : VesselClass','+ detectAnomaly() : Anomaly','+ assessThreatLevel() : ThreatScore'] }
    ]
  },
  { id:'ibs',   label:'IntegratedBridgeSystem',  stereotype:'block',
    x:390,  y:960, w:270, h:120, color:'#004D40',
    fields:[
      { section:'Operations', items:['+ renderUnifiedPicture() : Display','+ recommendCourse() : COLREGSAdvice','+ logIncident() : EventLog'] }
    ]
  }
];

/* ── CONNECTION DEFINITIONS ───────────────────────────────────── */
var CONNECTIONS = [
  { from:'mrs',   to:'tx',   type:'compose',    label:'«part» 1 transmitter' },
  { from:'mrs',   to:'scan', type:'compose',    label:'«part» 1 scanner' },
  { from:'mrs',   to:'rx',   type:'compose',    label:'«part» 1 receiver' },
  { from:'mrs',   to:'disp', type:'compose',    label:'«part» 1 display' },
  { from:'xband', to:'mrs',  type:'specialize', label:'«specialize» X-Band' },
  { from:'sband', to:'mrs',  type:'specialize', label:'«specialize» S-Band' },
  { from:'mrs',   to:'arpa', type:'usage',      label:'«usage» [>3000 GT]' },
  { from:'mrs',   to:'epa',  type:'usage',      label:'«usage» [300-3000 GT]' },
  { from:'tx',    to:'scan', type:'flow',       label:'RF via waveguide' },
  { from:'scan',  to:'rx',   type:'flow',       label:'echo via TR switch' },
  { from:'rx',    to:'disp', type:'flow',       label:'video signal' },
  { from:'disp',  to:'arpa', type:'flow',       label:'tracked targets' },
  { from:'tx',    to:'mag',  type:'compose',    label:'«part»' },
  { from:'mrs',   to:'hns',  type:'parallel',   label:'«parallel flow»' },
  { from:'hns',   to:'ais',  type:'compose',    label:'«part»' },
  { from:'hns',   to:'sfe',  type:'compose',    label:'«part»' },
  { from:'hns',   to:'aic',  type:'compose',    label:'«part»' },
  { from:'hns',   to:'ibs',  type:'compose',    label:'«part»' },
  { from:'ais',   to:'sfe',  type:'flow',       label:'vessel tracks' },
  { from:'sfe',   to:'aic',  type:'flow',       label:'fused track' },
  { from:'aic',   to:'ibs',  type:'flow',       label:'classified targets' }
];

/* ── DETAILS – click-to-inspect panel content ─────────────────── */
var DETAILS = {
  mrs:  { title:'MarineRadarSystem', stereotype:'block', source:'§4 – Full System', description:'Top-level SysML block representing the complete marine radar system as defined by IMO MSC.192(79) and SOLAS Chapter V.', values:['operatingFrequency: GHz','wavelength: cm','radarType: {X-Band | S-Band}','PRF: 500..4000 pps','scannerRPM: 12..30 RPM','rangeScales: 0.25–24 NM'], operations:['initialize()','transmit(): RFPulse','receive(): Echo','display(): PPIFrame','checkSOLAS(): ComplianceStatus'] },
  tx:   { title:'Transmitter', stereotype:'block', source:'§4.1 Transmitter', description:'Generates high-power RF pulses. Comprises a delay line, trigger unit, modulator, and magnetron.', operations:['generatePulse(): RFPulse','routeToTRSwitch(): void'] },
  mag:  { title:'Magnetron', stereotype:'block', source:'§4.1 Transmitter', description:'Core high-frequency microwave oscillator that produces RF pulses at either 9 GHz (X-Band) or 3 GHz (S-Band).', values:['outputFrequency: 9 GHz (X-Band) / 3 GHz (S-Band)','wavelength: 3 cm / 10 cm'], operations:['oscillate(): HighFreqRF'] },
  scan: { title:'Scanner', stereotype:'block', source:'§4.2 Scanner', description:'Transmits and receives radar pulses. Located on Monkey Island for 360° unobstructed coverage.', values:['rotationSpeed: 12..30 RPM','location: Monkey Island','PRF: 500..4000 pps'], operations:['rotateScan(): void','transmitPulse(): void','receiveEcho(): Echo'] },
  rx:   { title:'Receiver', stereotype:'block', source:'§4.3 Receiver', description:'Processes weak echo signals: TR cell → local oscillator + mixer → IF amplifier → video amplifier → demodulator.', operations:['amplifyEcho(): ProcessedSignal','smoothSignal(): VideoSignal'] },
  disp: { title:'Display', stereotype:'block', source:'§4.4 Display', description:"PPI (Plan Position Indicator) display renders targets in a bird's-eye view. IMO mandates ≥2 VRMs and ≥4 parallel index lines.", values:['displayType: CRT / RASTER','VRMcount: ≥2','parallelIndexLines: ≥4','bearingScaleDivision: 30°'], operations:['renderPPI(): PPIFrame','paintTarget(): TargetBlip','determineBearing(): degrees','determineRange(): NM'] },
  arpa: { title:'ARPA', stereotype:'block', source:'§7 SOLAS Chapter V', description:'Automatic Radar Plotting Aid. Mandatory on ships > 3000 GT. Automatically acquires targets and calculates CPA/TCPA.', constraints:['Ships > 3000 GT — SOLAS Ch. V Mandatory'], operations:['acquireTarget(): Track','calculateCPA(): NM','calculateTCPA(): min','generateAlert(): Alarm'] },
  epa:  { title:'Electronic Plotting Aid', stereotype:'block', source:'§7 SOLAS Chapter V', description:'Semi-automatic plotting aid. Mandatory on ships 300–3000 GT.', constraints:['Ships 300–3000 GT — SOLAS Ch. V Mandatory'], operations:['plotTarget(): ManualTrack','displayVector(): void'] },
  xband:{ title:'XBandRadar', stereotype:'specialize', source:'§6.1', description:'X-Band specialization. 9 GHz / 3 cm wavelength. High resolution, short range. Required for all ships >300 GT under SOLAS.', values:['frequency: 9 GHz','wavelength: 3 cm','range: Short (high resolution)'], constraints:['Susceptible to rain attenuation','Required: all ships > 300 GT'] },
  sband:{ title:'SBandRadar', stereotype:'specialize', source:'§6.2', description:'S-Band specialization. 3 GHz / 10 cm wavelength. Long range, weather resistant, lower resolution than X-Band.', values:['frequency: 3 GHz','wavelength: 10 cm','weatherResistance: High'], constraints:['Lower resolution than X-Band','Required: ships > 3000 GT'] },
  hns:  { title:'HybridNavySystem', stereotype:'block', source:'Hybrid Navy Design', description:'Runs in parallel with the radar pipeline, fusing AIS, satellite, ECDIS, UAV, and AI classification data into a unified operational picture.', values:['integrationMode: SensorFusion','aiEnabled: boolean','autonomyLevel: 0..5'] },
  ais:  { title:'AISReceiver', stereotype:'block', source:'Hybrid Navy Design', description:'Ingests Automatic Identification System data providing vessel identity unavailable from radar echo alone.', values:['dataFields: MMSI, Name, Position, COG, SOG'], operations:['ingestAIS(): VesselTrack'] },
  sfe:  { title:'SensorFusionEngine', stereotype:'block', source:'Hybrid Navy Design', description:'Fuses all sensor streams into a single authoritative track: radar + AIS + satellite + UAV.', operations:['fuseRadarAIS(): FusedTrack','fuseWithSatellite(): EnhancedTrack','fuseWithUAV(): SituationalPicture'] },
  aic:  { title:'AITargetClassifier', stereotype:'block', source:'Hybrid Navy Design', description:'Machine learning classifier assigns vessel type, anomaly score, and threat level to each fused track.', operations:['classifyVesselType(): VesselClass','detectAnomaly(): Anomaly','assessThreatLevel(): ThreatScore'] },
  ibs:  { title:'IntegratedBridgeSystem', stereotype:'block', source:'Hybrid Navy Design', description:'Unified bridge display presenting the complete fused picture to the Officer of the Watch with COLREGS-aware course recommendations.', operations:['renderUnifiedPicture(): Display','recommendCourse(): COLREGSAdvice','logIncident(): EventLog'] }
};

/* ── CROSS-DIAGRAM REFERENCES ─────────────────────────────────── */
(function () {
  var X = {
    mrs:  [{ label:'Use Case: Initialize Radar System',     page:'usecase.html', id:'uc_init'     }, { label:'Use Case: Verify SOLAS Compliance',     page:'usecase.html', id:'uc_solas'    }],
    tx:   [{ label:'Activity: Power Supply Initialization', page:'activity.html',id:'power'       }, { label:'Use Case: Initialize Radar System',     page:'usecase.html', id:'uc_init'     }],
    mag:  [{ label:'Activity: Magnetron RF Oscillation',    page:'activity.html',id:'magnetron'   }, { label:'Use Case: Initialize Radar System',     page:'usecase.html', id:'uc_init'     }],
    scan: [{ label:'Activity: Directional Pulse Tx',        page:'activity.html',id:'pulse_tx'    }, { label:'Use Case: Display PPI Plot',            page:'usecase.html', id:'uc_ppi'      }],
    rx:   [{ label:'Activity: Demodulator',                 page:'activity.html',id:'demod'       }],
    disp: [{ label:'Activity: PPI Display',                 page:'activity.html',id:'ppi'         }, { label:'Use Case: Display PPI Plot',            page:'usecase.html', id:'uc_ppi'      }],
    arpa: [{ label:'Activity: ARPA node',                   page:'activity.html',id:'arpa'        }, { label:'Use Case: Track Targets (ARPA/EPA)',    page:'usecase.html', id:'uc_tracking' }],
    epa:  [{ label:'Activity: EPA node',                    page:'activity.html',id:'epa'         }, { label:'Use Case: Track Targets (ARPA/EPA)',    page:'usecase.html', id:'uc_tracking' }],
    xband:[{ label:'Activity: X-Band Radar node',           page:'activity.html',id:'xband'       }],
    sband:[{ label:'Activity: S-Band Radar node',           page:'activity.html',id:'sband'       }],
    hns:  [{ label:'Activity: AIS Data Ingestion',          page:'activity.html',id:'ais'         }, { label:'Use Case: Fuse Sensor Data',            page:'usecase.html', id:'uc_fusion'   }],
    ais:  [{ label:'Activity: AIS Data Ingestion',          page:'activity.html',id:'ais'         }, { label:'Use Case: Ingest AIS Data',             page:'usecase.html', id:'uc_ais'      }],
    sfe:  [{ label:'Activity: Sensor Fusion Engine',        page:'activity.html',id:'fusion'      }, { label:'Use Case: Fuse Sensor Data',            page:'usecase.html', id:'uc_fusion'   }],
    aic:  [{ label:'Activity: AI/ML Classification',        page:'activity.html',id:'ai_class'    }, { label:'Use Case: Classify Target via AI/ML',  page:'usecase.html', id:'uc_classify' }],
    ibs:  [{ label:'Activity: Integrated Bridge System',    page:'activity.html',id:'ibs'         }, { label:'Use Case: Generate Course Rec.',        page:'usecase.html', id:'uc_course'   }]
  };
  for (var id in X) { if (DETAILS[id]) DETAILS[id].crossRefs = X[id]; }
}());

/* ── REQUIREMENTS CROSS-REFERENCES ───────────────────────────── */
(function () {
  var R = {
    mrs:  [{ label:'Requirement: REQ-SYS-01 Cold Start',          page:'requirements.html', id:'req_sys_01' },
           { label:'Requirement: REQ-SYS-02 Standby Switching',   page:'requirements.html', id:'req_sys_02' }],
    disp: [{ label:'Requirement: REQ-SYS-03 Range Accuracy',      page:'requirements.html', id:'req_sys_03' },
           { label:'Requirement: REQ-SYS-04 Bearing Accuracy',    page:'requirements.html', id:'req_sys_04' },
           { label:'Requirement: REQ-SOL-04 Display Standards',   page:'requirements.html', id:'req_sol_04' }],
    xband:[{ label:'Requirement: REQ-SOL-01 X-Band Mandatory',    page:'requirements.html', id:'req_sol_01' }],
    sband:[{ label:'Requirement: REQ-SOL-03 S-Band + ARPA',       page:'requirements.html', id:'req_sol_03' }],
    arpa: [{ label:'Requirement: REQ-SOL-02 Plotting Aid',        page:'requirements.html', id:'req_sol_02' },
           { label:'Requirement: REQ-SOL-03 S-Band + ARPA',       page:'requirements.html', id:'req_sol_03' }],
    epa:  [{ label:'Requirement: REQ-SOL-02 Plotting Aid',        page:'requirements.html', id:'req_sol_02' }],
    scan: [{ label:'Requirement: REQ-HW-01 Scanner Siting',       page:'requirements.html', id:'req_hw_01' },
           { label:'Requirement: REQ-HW-02 PRF Range',            page:'requirements.html', id:'req_hw_02' },
           { label:'Requirement: REQ-HW-03 Scan Rate',            page:'requirements.html', id:'req_hw_03' }],
    rx:   [{ label:'Requirement: REQ-HW-04 Receiver Chain',       page:'requirements.html', id:'req_hw_04' }],
    ais:  [{ label:'Requirement: REQ-HYB-01 AIS Integration',     page:'requirements.html', id:'req_hyb_01' }],
    sfe:  [{ label:'Requirement: REQ-HYB-02 Sensor Fusion',       page:'requirements.html', id:'req_hyb_02' }],
    aic:  [{ label:'Requirement: REQ-HYB-03 AI/ML Classification',page:'requirements.html', id:'req_hyb_03' }],
    ibs:  [{ label:'Requirement: REQ-HYB-04 Collision Avoidance', page:'requirements.html', id:'req_hyb_04' }]
  };
  for (var id in R) {
    if (DETAILS[id]) DETAILS[id].crossRefs = (DETAILS[id].crossRefs || []).concat(R[id]);
  }
}());

/* ============================================================
   RENDERER — edit BLOCKS / CONNECTIONS / DETAILS above, not below.
   ============================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var BLOCK_HEADER_H  = 44;
  var BLOCK_SECTION_H = 18;
  var BLOCK_ITEM_H    = 14;
  var BLOCK_NAME_SZ   = 11;
  var BLOCK_SECTION_SZ = 9;
  var BLOCK_FONT_SZ   = 10;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function getPort(block, side) {
    var cx = block.x + block.w/2, cy = block.y + block.h/2;
    if (side === 'top')    return { x: cx, y: block.y };
    if (side === 'bottom') return { x: cx, y: block.y + block.h };
    if (side === 'left')   return { x: block.x, y: cy };
    if (side === 'right')  return { x: block.x + block.w, y: cy };
    return { x: cx, y: cy };
  }

  function autoPorts(a, b) {
    var dx = (b.x+b.w/2) - (a.x+a.w/2);
    var dy = (b.y+b.h/2) - (a.y+a.h/2);
    if (Math.abs(dy) > Math.abs(dx)) return dy > 0 ? { from:'bottom', to:'top' } : { from:'top', to:'bottom' };
    return dx > 0 ? { from:'right', to:'left' } : { from:'left', to:'right' };
  }

  function drawBlock(svg, block) {
    var g = el('g', { 'data-id': block.id, 'class': 'block-group' }, svg);
    var x = block.x, y = block.y, w = block.w;

    el('rect', { x:x, y:y, width:w, height:block.h, fill:'#FFFFFF', stroke:'#B0BEC5', 'stroke-width':1.5, rx:4 }, g);
    el('rect', { x:x, y:y, width:w, height:BLOCK_HEADER_H, fill:block.color, rx:4 }, g);
    el('rect', { x:x, y:y+BLOCK_HEADER_H-4, width:w, height:4, fill:block.color }, g);

    el('text', { x:x+w/2, y:y+13, 'font-size':BLOCK_SECTION_SZ, fill:'rgba(255,255,255,0.85)', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = '«' + block.stereotype + '»';
    el('text', { x:x+w/2, y:y+30, 'font-size':BLOCK_NAME_SZ, fill:'#FFFFFF', 'font-weight':'700', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = block.label;

    var curY = y + BLOCK_HEADER_H;
    (block.fields || []).forEach(function (section) {
      el('rect', { x:x, y:curY, width:w, height:BLOCK_SECTION_H, fill:'rgba(0,0,0,0.06)' }, g);
      el('line', { x1:x, y1:curY, x2:x+w, y2:curY, stroke:'#B0BEC5', 'stroke-width':1 }, g);
      el('text', { x:x+6, y:curY+BLOCK_SECTION_H/2, 'font-size':BLOCK_SECTION_SZ, fill:'#444', 'font-weight':'600', 'font-style':'italic', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = section.section;
      curY += BLOCK_SECTION_H;
      section.items.forEach(function (item) {
        el('text', { x:x+8, y:curY+BLOCK_ITEM_H/2, 'font-size':BLOCK_FONT_SZ, fill:'#222', 'dominant-baseline':'middle', 'font-family':'Consolas, monospace' }, g).textContent = item;
        curY += BLOCK_ITEM_H;
      });
    });
  }

  function drawConnection(svg, conn, blockMap) {
    var a = blockMap[conn.from], b = blockMap[conn.to];
    if (!a || !b) return;

    var g = el('g', { 'data-from': conn.from, 'data-to': conn.to, 'class': 'conn-group' }, svg);

    var ports = autoPorts(a, b);
    var p1 = getPort(a, conn.fromPort || ports.from);
    var p2 = getPort(b, conn.toPort  || ports.to);

    var stroke, dash, markerEnd;
    if      (conn.type === 'compose')    { stroke = '#1A6EA3'; markerEnd = 'url(#diamond)'; }
    else if (conn.type === 'usage')      { stroke = '#E65100'; dash = '5,3'; markerEnd = 'url(#arrow-open)'; }
    else if (conn.type === 'specialize') { stroke = '#6A1B9A'; markerEnd = 'url(#triangle)'; }
    else if (conn.type === 'flow')       { stroke = '#2E86AB'; markerEnd = 'url(#arrow-solid)'; }
    else if (conn.type === 'parallel')   { stroke = '#00695C'; dash = '8,4'; markerEnd = 'url(#arrow-solid)'; }
    else                                 { stroke = '#888';    markerEnd = 'url(#arrow-solid)'; }

    var lineAttrs = { x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y, stroke:stroke, 'stroke-width':1.5, 'marker-end':markerEnd };
    if (dash) lineAttrs['stroke-dasharray'] = dash;
    el('line', lineAttrs, g);

    if (conn.label) {
      var mx = (p1.x+p2.x)/2, my = (p1.y+p2.y)/2;
      el('rect', { x:mx-2, y:my-7, width:conn.label.length*5.5+6, height:13, fill:'rgba(255,255,255,0.85)', rx:2 }, g);
      el('text', { x:mx+1, y:my, 'font-size':8.5, fill:'#333', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = conn.label;
    }
  }

  function highlightBlock(blockId, svgEl) {
    var blockGroups = svgEl.querySelectorAll('.block-group');
    var connGroups  = svgEl.querySelectorAll('.conn-group');

    var wasSelected = svgEl.querySelector('.block-group.selected');
    if (wasSelected && wasSelected.getAttribute('data-id') === blockId) {
      blockGroups.forEach(function (g) { g.classList.remove('dimmed','selected'); });
      connGroups.forEach(function  (g) { g.classList.remove('dimmed','highlighted'); });
      return;
    }

    blockGroups.forEach(function (g) { g.classList.add('dimmed'); g.classList.remove('selected'); });
    connGroups.forEach(function  (g) { g.classList.add('dimmed'); g.classList.remove('highlighted'); });

    var sel = svgEl.querySelector('.block-group[data-id="' + blockId + '"]');
    if (sel) { sel.classList.remove('dimmed'); sel.classList.add('selected'); }

    CONNECTIONS.forEach(function (c) {
      if (c.from !== blockId && c.to !== blockId) return;
      var cg = svgEl.querySelector('.conn-group[data-from="' + c.from + '"][data-to="' + c.to + '"]');
      if (cg) { cg.classList.remove('dimmed'); cg.classList.add('highlighted'); }
      var otherId = c.from === blockId ? c.to : c.from;
      var og = svgEl.querySelector('.block-group[data-id="' + otherId + '"]');
      if (og) og.classList.remove('dimmed');
    });
  }

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var maxX = 0, maxY = 0;
    BLOCKS.forEach(function (b) { maxX = Math.max(maxX, b.x+b.w); maxY = Math.max(maxY, b.y+b.h); });
    var pad = 30;
    var svgW = maxX + pad*2;
    var svgH = maxY + pad*2;

    var svg = el('svg', {
      width: svgW, height: svgH+80, xmlns: NS,
      viewBox: (-pad)+' '+(-pad)+' '+svgW+' '+(svgH+80)
    }, container);

    var defs = el('defs', {}, svg);
    var m1 = el('marker', { id:'arrow-solid', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto' }, defs);
    el('path', { d:'M0,0 L0,6 L8,3 z', fill:'#2E86AB' }, m1);
    var m2 = el('marker', { id:'arrow-open', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto' }, defs);
    el('path', { d:'M0,0 L8,3 L0,6', fill:'none', stroke:'#E65100', 'stroke-width':1.5 }, m2);
    var m3 = el('marker', { id:'diamond', markerWidth:10, markerHeight:10, refX:5, refY:5, orient:'auto' }, defs);
    el('polygon', { points:'0,5 5,0 10,5 5,10', fill:'#1A6EA3' }, m3);
    var m4 = el('marker', { id:'triangle', markerWidth:10, markerHeight:10, refX:8, refY:5, orient:'auto' }, defs);
    el('polygon', { points:'0,0 10,5 0,10', fill:'none', stroke:'#6A1B9A', 'stroke-width':1.5 }, m4);

    el('rect', { x:-pad, y:-pad, width:svgW, height:36, fill:'#0D1B2A' }, svg);
    el('text', { x:svgW/2-pad, y:-pad+18, 'font-size':13, 'font-weight':'700', fill:'#FFFFFF', 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, svg).textContent = 'Marine Radar System — SysML Block Definition Diagram (BDD)';

    var blockMap = {};
    BLOCKS.forEach(function (b) { blockMap[b.id] = b; });

    // Draw connections behind blocks
    CONNECTIONS.forEach(function (c) { drawConnection(svg, c, blockMap); });
    BLOCKS.forEach(function (b) { drawBlock(svg, b); });

    // Legend
    var lx = -pad+10, ly = maxY+20;
    [
      { color:'#1A6EA3', dash:'',    label:'Composition (filled diamond)' },
      { color:'#6A1B9A', dash:'',    label:'Generalization / Specialization' },
      { color:'#2E86AB', dash:'',    label:'Signal Flow' },
      { color:'#E65100', dash:'5,3', label:'Usage' },
      { color:'#00695C', dash:'8,4', label:'Parallel Flow (Hybrid Navy)' }
    ].forEach(function (item, i) {
      var ix = lx + i*230;
      el('line', { x1:ix, y1:ly+8, x2:ix+30, y2:ly+8, stroke:item.color, 'stroke-width':2, 'stroke-dasharray':item.dash||null }, svg);
      el('text', { x:ix+36, y:ly+8, 'font-size':9, fill:'#444', 'dominant-baseline':'middle', 'font-family':'Segoe UI, Arial, sans-serif' }, svg).textContent = item.label;
    });

    return svg;
  }

  /* ── Boot + interactivity ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    render('bdd-svg');

    var container = document.getElementById('bdd-svg');
    if (!container || !window.SysMLInteract) return;
    var svgEl = container.querySelector('svg');
    if (!svgEl) return;

    var zoomCtrl = SysMLInteract.initZoomPan(svgEl);
    SysMLInteract.initZoomToolbar('diagram-toolbar', zoomCtrl);

    function applyHighlight(blockId) {
      var allBG = svgEl.querySelectorAll('.block-group');
      var allCG = svgEl.querySelectorAll('.conn-group');
      allBG.forEach(function (g) { g.classList.add('dimmed'); g.classList.remove('selected'); });
      allCG.forEach(function (g) { g.classList.add('dimmed'); g.classList.remove('highlighted'); });
      var sel = svgEl.querySelector('.block-group[data-id="' + blockId + '"]');
      if (sel) { sel.classList.remove('dimmed'); sel.classList.add('selected'); }
      CONNECTIONS.forEach(function (c) {
        if (c.from !== blockId && c.to !== blockId) return;
        var cg = svgEl.querySelector('.conn-group[data-from="' + c.from + '"][data-to="' + c.to + '"]');
        if (cg) { cg.classList.remove('dimmed'); cg.classList.add('highlighted'); }
        var otherId = c.from === blockId ? c.to : c.from;
        var og = svgEl.querySelector('.block-group[data-id="' + otherId + '"]');
        if (og) og.classList.remove('dimmed');
      });
    }

    function clearHighlight() {
      svgEl.querySelectorAll('.block-group').forEach(function (g) { g.classList.remove('dimmed','selected'); });
      svgEl.querySelectorAll('.conn-group').forEach(function  (g) { g.classList.remove('dimmed','highlighted'); });
    }

    var blockGroups = svgEl.querySelectorAll('.block-group');
    blockGroups.forEach(function (g) {
      var id  = g.getAttribute('data-id');
      var det = DETAILS[id];
      /* hover → highlight connections + show floating panel */
      g.addEventListener('mouseenter', function () {
        applyHighlight(id);
        if (det) SysMLInteract.showPanel(det);
      });
      /* leave → restore normal state + schedule panel hide */
      g.addEventListener('mouseleave', function () {
        clearHighlight();
        SysMLInteract.scheduleHide();
      });
      /* click → navigate to first cross-diagram link */
      g.addEventListener('click', function (e) {
        e.stopPropagation();
        if (zoomCtrl && zoomCtrl.wasDragged()) { zoomCtrl.clearDrag(); return; }
        if (det && det.crossRefs && det.crossRefs.length) {
          window.location.href = det.crossRefs[0].page + '?highlight=' + det.crossRefs[0].id;
        }
      });
    });

    // URL-based highlight (e.g. bdd.html?highlight=tx)
    SysMLInteract.highlightFromURL(svgEl, function (g) {
      var id = g.getAttribute('data-id');
      applyHighlight(id);
      var det = DETAILS[id];
      if (det) SysMLInteract.showPanel(det);
    });

    // Click background → clear
    svgEl.addEventListener('click', function () {
      if (zoomCtrl && zoomCtrl.wasDragged()) { zoomCtrl.clearDrag(); return; }
      clearHighlight();
      SysMLInteract.hidePanel();
    });

    // Link badges
    SysMLInteract.addLinkBadges(svgEl, DETAILS);
  });

}());
