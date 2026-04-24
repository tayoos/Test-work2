/* requirements.js – Marine Radar System Requirements Diagram (interactive)
   ── EDIT REQS to change diagram content.
   ── EDIT DETAILS to change click-to-inspect panel content.
   ── Do not edit the renderer below the DETAILS block. */

/* ── REQUIREMENTS DATA ────────────────────────────────────────── */
var REQS = [
  {
    id:'req_sys', reqId:'REQ-SYS', name:'System Performance',
    color:'#1A6EA3',
    children:[
      { id:'req_sys_01', reqId:'REQ-SYS-01', name:'Cold Start ≤ 4 min',
        text:'System shall reach operational state from cold start within 4 minutes.',
        source:'§4.1 + §8 IMO MSC.192(79)' },
      { id:'req_sys_02', reqId:'REQ-SYS-02', name:'Standby Switching ≤ 5 sec',
        text:'System shall switch from standby to fully operational within 5 seconds.',
        source:'§8 IMO MSC.192(79)' },
      { id:'req_sys_03', reqId:'REQ-SYS-03', name:'Range Accuracy ±30 m / 1%',
        text:'Range measurement shall not exceed ±30 m or 1% of range scale, whichever is greater.',
        source:'§5.1 + §8 IMO MSC.192(79)' },
      { id:'req_sys_04', reqId:'REQ-SYS-04', name:'Bearing Accuracy ±1°',
        text:'Bearing measurement shall not exceed ±1° relative to true north.',
        source:'§5.2 + §8 IMO MSC.192(79)' }
    ]
  },
  {
    id:'req_sol', reqId:'REQ-SOL', name:'SOLAS Compliance',
    color:'#B71C1C',
    children:[
      { id:'req_sol_01', reqId:'REQ-SOL-01', name:'X-Band Radar Mandatory',
        text:'Ships > 300 GT shall carry a 9 GHz (3 cm) X-Band radar meeting IMO performance standards.',
        source:'§6.1 + §7 SOLAS Ch.V' },
      { id:'req_sol_02', reqId:'REQ-SOL-02', name:'Plotting Aid Required',
        text:'Ships 300–3000 GT shall have EPA. Ships > 3000 GT shall have ARPA.',
        source:'§7 SOLAS Ch.V' },
      { id:'req_sol_03', reqId:'REQ-SOL-03', name:'S-Band + ARPA (> 3000 GT)',
        text:'Ships > 3000 GT shall carry an additional 3 GHz S-Band radar with ARPA.',
        source:'§6.2 + §7 SOLAS Ch.V' },
      { id:'req_sol_04', reqId:'REQ-SOL-04', name:'Min Display Standards',
        text:'Display shall provide ≥ 2 VRMs, ≥ 4 parallel index lines, and a 360° bearing scale.',
        source:'§8 IMO MSC.192(79)' }
    ]
  },
  {
    id:'req_hyb', reqId:'REQ-HYB', name:'Hybrid Navy Integration',
    color:'#00695C',
    children:[
      { id:'req_hyb_01', reqId:'REQ-HYB-01', name:'AIS Integration',
        text:'System shall ingest AIS broadcasts providing MMSI, name, COG, SOG, and heading.',
        source:'Hybrid Navy Design' },
      { id:'req_hyb_02', reqId:'REQ-HYB-02', name:'Multi-Sensor Fusion',
        text:'System shall fuse radar, AIS, ECDIS, satellite, and UAV data into a single authoritative track.',
        source:'Hybrid Navy Design' },
      { id:'req_hyb_03', reqId:'REQ-HYB-03', name:'AI / ML Target Classification',
        text:'System shall classify vessel type, detect anomalies, and score threat level using ML.',
        source:'Hybrid Navy Design' },
      { id:'req_hyb_04', reqId:'REQ-HYB-04', name:'Collision Avoidance DSS',
        text:'System shall generate COLREGS-aware course recommendations via integrated Decision Support System.',
        source:'Hybrid Navy Design' }
    ]
  },
  {
    id:'req_hw', reqId:'REQ-HW', name:'Hardware & Physical',
    color:'#E65100',
    children:[
      { id:'req_hw_01', reqId:'REQ-HW-01', name:'Scanner Siting',
        text:'Scanner shall be sited on Monkey Island, clear of obstructions, rotating clockwise at 12–30 RPM.',
        source:'§4.2 Scanner' },
      { id:'req_hw_02', reqId:'REQ-HW-02', name:'PRF Range',
        text:'Pulse Repetition Frequency shall be within 500–4000 pps, commensurate with selected range scale.',
        source:'§4.2 Scanner' },
      { id:'req_hw_03', reqId:'REQ-HW-03', name:'Scan Rate',
        text:'Scanner shall rotate at constant speed within 12–30 RPM.',
        source:'§4.2 Scanner' },
      { id:'req_hw_04', reqId:'REQ-HW-04', name:'Receiver Chain Integrity',
        text:'Receiver chain (TR Cell → LO/Mixer → IF Amp → Video Amp → Demod) shall maintain signal integrity.',
        source:'§4.3 Receiver' }
    ]
  }
];

/* ── DETAILS ──────────────────────────────────────────────────── */
var DETAILS = {
  req_sys: {
    title:'REQ-SYS: System Performance', stereotype:'requirementGroup',
    source:'§5, §8 IMO MSC.192(79)',
    description:'Group of system-level performance requirements for the marine radar. Covers startup timing, range accuracy, and bearing accuracy derived directly from IMO MSC.192(79).',
    crossRefs:[
      { label:'Activity: Power Supply Init',        page:'activity.html', id:'power'   },
      { label:'Block: MarineRadarSystem (BDD)',      page:'bdd.html',      id:'mrs'     },
      { label:'Use Case: Initialize Radar System',  page:'usecase.html',  id:'uc_init' }
    ]
  },
  req_sys_01: {
    title:'REQ-SYS-01: Cold Start ≤ 4 min', stereotype:'requirement',
    source:'§8 IMO MSC.192(79)',
    description:'System shall reach operational state from cold start within 4 minutes.',
    values:['id = "REQ-SYS-01"', 'text = "Cold start ≤ 4 min"'],
    constraints:['IMO MSC.192(79) mandatory'],
    crossRefs:[
      { label:'Activity: START node',              page:'activity.html', id:'start'   },
      { label:'Activity: ALARM Triggered',         page:'activity.html', id:'alarm'   },
      { label:'Block: MarineRadarSystem (BDD)',     page:'bdd.html',      id:'mrs'     },
      { label:'Use Case: Initialize Radar System', page:'usecase.html',  id:'uc_init' },
      { label:'Use Case: Perform Performance Test',page:'usecase.html',  id:'uc_perf' }
    ]
  },
  req_sys_02: {
    title:'REQ-SYS-02: Standby Switching ≤ 5 sec', stereotype:'requirement',
    source:'§8 IMO MSC.192(79)',
    description:'System shall switch from standby to fully operational state within 5 seconds.',
    values:['id = "REQ-SYS-02"', 'text = "Standby switching ≤ 5 sec"'],
    constraints:['IMO MSC.192(79) mandatory'],
    crossRefs:[
      { label:'Activity: ALARM Triggered',          page:'activity.html', id:'alarm'   },
      { label:'Block: MarineRadarSystem (BDD)',      page:'bdd.html',      id:'mrs'     },
      { label:'Use Case: Perform Performance Test', page:'usecase.html',  id:'uc_perf' }
    ]
  },
  req_sys_03: {
    title:'REQ-SYS-03: Range Accuracy ±30 m / 1%', stereotype:'requirement',
    source:'§5.1 + §8 IMO MSC.192(79)',
    description:'Range measurement accuracy shall not exceed ±30 m or 1% of range scale, whichever is greater. Tracing spot speed equals half the speed of radio waves.',
    values:['id = "REQ-SYS-03"', 'text = "Range error ≤ ±30 m or 1%"'],
    crossRefs:[
      { label:'Activity: Range Determination',    page:'activity.html', id:'range_det'   },
      { label:'Block: Display (BDD)',              page:'bdd.html',      id:'disp'        },
      { label:'Use Case: Determine Target Range', page:'usecase.html',  id:'uc_range'    }
    ]
  },
  req_sys_04: {
    title:'REQ-SYS-04: Bearing Accuracy ±1°', stereotype:'requirement',
    source:'§5.2 + §8 IMO MSC.192(79)',
    description:'Bearing measurement accuracy shall not exceed ±1° relative to true north. High PRF relative to scanner RPM makes the angle rotated per pulse negligible.',
    values:['id = "REQ-SYS-04"', 'text = "Bearing error ≤ ±1°"'],
    crossRefs:[
      { label:'Activity: Bearing Determination',     page:'activity.html', id:'bearing_det' },
      { label:'Block: Display (BDD)',                page:'bdd.html',      id:'disp'        },
      { label:'Use Case: Determine Target Bearing',  page:'usecase.html',  id:'uc_bearing'  }
    ]
  },

  req_sol: {
    title:'REQ-SOL: SOLAS Compliance', stereotype:'requirementGroup',
    source:'§6–§7 SOLAS Chapter V',
    description:'Group of regulatory compliance requirements derived from SOLAS Chapter V and IMO MSC.192(79). These are mandatory legal obligations for flag-state compliance.',
    crossRefs:[
      { label:'Activity: Tonnage Decision',         page:'activity.html', id:'tonnage_q' },
      { label:'Block: MarineRadarSystem (BDD)',      page:'bdd.html',      id:'mrs'       },
      { label:'Use Case: Verify SOLAS Compliance',  page:'usecase.html',  id:'uc_solas'  }
    ]
  },
  req_sol_01: {
    title:'REQ-SOL-01: X-Band Radar Mandatory', stereotype:'requirement',
    source:'§6.1 + §7 SOLAS Ch.V',
    description:'Ships > 300 GT shall carry a 9 GHz (3 cm wavelength) X-Band radar meeting IMO MSC.192(79) performance standards. X-Band provides high resolution but is susceptible to rain attenuation.',
    values:['id = "REQ-SOL-01"', 'text = "9 GHz X-Band, ships > 300 GT"'],
    constraints:['SOLAS Chapter V mandatory'],
    crossRefs:[
      { label:'Activity: X-Band Radar node',       page:'activity.html', id:'xband'   },
      { label:'Block: X-Band Radar (BDD)',          page:'bdd.html',      id:'xband'   },
      { label:'Use Case: Initialize Radar System',  page:'usecase.html',  id:'uc_init' }
    ]
  },
  req_sol_02: {
    title:'REQ-SOL-02: Plotting Aid Required', stereotype:'requirement',
    source:'§7 SOLAS Ch.V',
    description:'Ships 300–3000 GT shall carry an Electronic Plotting Aid (EPA). Ships > 3000 GT shall carry an Automatic Radar Plotting Aid (ARPA). Both are SOLAS Chapter V mandatory.',
    values:['id = "REQ-SOL-02"', 'text = "EPA (300–3000 GT); ARPA (> 3000 GT)"'],
    constraints:['SOLAS Chapter V mandatory'],
    crossRefs:[
      { label:'Activity: ARPA node',                page:'activity.html', id:'arpa'        },
      { label:'Activity: EPA node',                 page:'activity.html', id:'epa'         },
      { label:'Block: ARPA (BDD)',                  page:'bdd.html',      id:'arpa'        },
      { label:'Block: EPA (BDD)',                   page:'bdd.html',      id:'epa'         },
      { label:'Use Case: Track Targets (ARPA/EPA)', page:'usecase.html',  id:'uc_tracking' }
    ]
  },
  req_sol_03: {
    title:'REQ-SOL-03: S-Band + ARPA (> 3000 GT)', stereotype:'requirement',
    source:'§6.2 + §7 SOLAS Ch.V',
    description:'Ships > 3000 GT shall carry an additional 3 GHz (10 cm wavelength) S-Band radar with ARPA. S-Band provides longer range and greater weather resistance than X-Band.',
    values:['id = "REQ-SOL-03"', 'text = "3 GHz S-Band + ARPA, ships > 3000 GT"'],
    constraints:['SOLAS Chapter V mandatory'],
    crossRefs:[
      { label:'Activity: S-Band Radar node',        page:'activity.html', id:'sband'       },
      { label:'Activity: ARPA node',                page:'activity.html', id:'arpa'        },
      { label:'Block: S-Band Radar (BDD)',           page:'bdd.html',      id:'sband'       },
      { label:'Use Case: Track Targets (ARPA/EPA)', page:'usecase.html',  id:'uc_tracking' }
    ]
  },
  req_sol_04: {
    title:'REQ-SOL-04: Min Display Standards', stereotype:'requirement',
    source:'§8 IMO MSC.192(79)',
    description:'Display shall provide minimum 2 Variable Range Markers (VRMs), minimum 4 electronic parallel index lines, and a full 360° graduated bearing scale (numbered every 30°, marked every 5°).',
    values:['id = "REQ-SOL-04"', 'text = "≥2 VRMs, ≥4 index lines, 360° scale"'],
    constraints:['IMO MSC.192(79) mandatory'],
    crossRefs:[
      { label:'Activity: Bearing Scale & Index Lines', page:'activity.html', id:'bearing_scale' },
      { label:'Block: Display (BDD)',                  page:'bdd.html',      id:'disp'          },
      { label:'Use Case: Verify SOLAS Compliance',     page:'usecase.html',  id:'uc_solas'      }
    ]
  },

  req_hyb: {
    title:'REQ-HYB: Hybrid Navy Integration', stereotype:'requirementGroup',
    source:'Hybrid Navy Design',
    description:'Requirements for the Hybrid Navy parallel integration layer. These run concurrently with the core radar pipeline and specify AIS, satellite, ECDIS, UAV, AI/ML, and collision avoidance integration.',
    crossRefs:[
      { label:'Activity: AIS Data Ingestion',  page:'activity.html', id:'ais'       },
      { label:'Block: HybridNavySystem (BDD)', page:'bdd.html',      id:'hns'       },
      { label:'Use Case: Fuse Sensor Data',    page:'usecase.html',  id:'uc_fusion' }
    ]
  },
  req_hyb_01: {
    title:'REQ-HYB-01: AIS Integration', stereotype:'requirement',
    source:'Hybrid Navy Design',
    description:'System shall ingest AIS broadcasts providing vessel identity information (MMSI, name, COG, SOG, and heading) that cannot be derived from radar echo alone.',
    values:['id = "REQ-HYB-01"', 'text = "AIS ingestion: MMSI, COG, SOG, heading"'],
    crossRefs:[
      { label:'Activity: AIS Data Ingestion',  page:'activity.html', id:'ais'    },
      { label:'Block: AISReceiver (BDD)',       page:'bdd.html',      id:'ais'    },
      { label:'Use Case: Ingest AIS Data',     page:'usecase.html',  id:'uc_ais' }
    ]
  },
  req_hyb_02: {
    title:'REQ-HYB-02: Multi-Sensor Fusion', stereotype:'requirement',
    source:'Hybrid Navy Design',
    description:'System shall fuse radar tracks, AIS data, ECDIS charts, satellite feeds, and UAV imagery into a single authoritative situational picture.',
    values:['id = "REQ-HYB-02"', 'text = "Fuse: radar + AIS + ECDIS + SAT + UAV"'],
    crossRefs:[
      { label:'Activity: Sensor Fusion Engine',   page:'activity.html', id:'fusion'    },
      { label:'Block: SensorFusionEngine (BDD)',   page:'bdd.html',      id:'sfe'       },
      { label:'Use Case: Fuse Sensor Data',        page:'usecase.html',  id:'uc_fusion' }
    ]
  },
  req_hyb_03: {
    title:'REQ-HYB-03: AI / ML Target Classification', stereotype:'requirement',
    source:'Hybrid Navy Design',
    description:'System shall classify vessel type, detect anomalies, and assign threat scores to each fused track using machine learning.',
    values:['id = "REQ-HYB-03"', 'text = "ML: classify, detect anomaly, score threat"'],
    crossRefs:[
      { label:'Activity: AI/ML Classification Engine', page:'activity.html', id:'ai_class'    },
      { label:'Block: AITargetClassifier (BDD)',        page:'bdd.html',      id:'aic'         },
      { label:'Use Case: Classify Target via AI/ML',   page:'usecase.html',  id:'uc_classify' }
    ]
  },
  req_hyb_04: {
    title:'REQ-HYB-04: Collision Avoidance DSS', stereotype:'requirement',
    source:'Hybrid Navy Design',
    description:'System shall generate COLREGS-aware course recommendations via an integrated Decision Support System and present them to the Officer of the Watch via the Integrated Bridge System.',
    values:['id = "REQ-HYB-04"', 'text = "COLREGS DSS course recommendations"'],
    crossRefs:[
      { label:'Activity: Hybrid Collision Avoidance DSS', page:'activity.html', id:'hybrid_cav' },
      { label:'Block: IntegratedBridgeSystem (BDD)',       page:'bdd.html',      id:'ibs'        },
      { label:'Use Case: Generate Course Recommendation', page:'usecase.html',  id:'uc_course'  }
    ]
  },

  req_hw: {
    title:'REQ-HW: Hardware & Physical', stereotype:'requirementGroup',
    source:'§4.2–§4.3',
    description:'Requirements specifying physical hardware characteristics: scanner siting, pulse repetition frequency, scan rate, and receiver chain integrity.',
    crossRefs:[
      { label:'Activity: Scanner Location', page:'activity.html', id:'location' },
      { label:'Block: Scanner (BDD)',        page:'bdd.html',      id:'scan'     },
      { label:'Use Case: Display PPI Plot',  page:'usecase.html',  id:'uc_ppi'   }
    ]
  },
  req_hw_01: {
    title:'REQ-HW-01: Scanner Siting', stereotype:'requirement',
    source:'§4.2 Scanner',
    description:'Scanner shall be sited on Monkey Island, clear of all obstructions, rotating clockwise when viewed from above.',
    values:['id = "REQ-HW-01"', 'text = "Sited on Monkey Island, clear of obstructions"'],
    crossRefs:[
      { label:'Activity: Scanner on Monkey Island', page:'activity.html', id:'location' },
      { label:'Block: Scanner (BDD)',                page:'bdd.html',      id:'scan'     },
      { label:'Use Case: Display PPI Plot',          page:'usecase.html',  id:'uc_ppi'   }
    ]
  },
  req_hw_02: {
    title:'REQ-HW-02: PRF Range', stereotype:'requirement',
    source:'§4.2 Scanner',
    description:'Pulse Repetition Frequency shall be within 500–4000 pps, commensurate with the selected range scale.',
    values:['id = "REQ-HW-02"', 'text = "PRF: 500–4000 pps"'],
    crossRefs:[
      { label:'Activity: Directional Pulse Tx', page:'activity.html', id:'pulse_tx' },
      { label:'Block: Scanner (BDD)',            page:'bdd.html',      id:'scan'     },
      { label:'Use Case: Display PPI Plot',      page:'usecase.html',  id:'uc_ppi'   }
    ]
  },
  req_hw_03: {
    title:'REQ-HW-03: Scan Rate', stereotype:'requirement',
    source:'§4.2 Scanner',
    description:'Scanner shall rotate at constant speed within 12–30 RPM.',
    values:['id = "REQ-HW-03"', 'text = "Scan rate: 12–30 RPM constant"'],
    crossRefs:[
      { label:'Activity: 360° Rotational Scan', page:'activity.html', id:'rotation' },
      { label:'Block: Scanner (BDD)',                 page:'bdd.html',      id:'scan'     },
      { label:'Use Case: Display PPI Plot',           page:'usecase.html',  id:'uc_ppi'   }
    ]
  },
  req_hw_04: {
    title:'REQ-HW-04: Receiver Chain Integrity', stereotype:'requirement',
    source:'§4.3 Receiver',
    description:'Receiver chain (TR Cell → LO/Mixer → IF Amplifier → Video Amplifier → Demodulator) shall maintain signal integrity from echo reception to demodulated video output.',
    values:['id = "REQ-HW-04"', 'text = "Receiver chain: TR Cell → Demod integrity"'],
    crossRefs:[
      { label:'Activity: TR Cell',              page:'activity.html', id:'tr_cell' },
      { label:'Block: Receiver (BDD)',           page:'bdd.html',      id:'rx'      },
      { label:'Use Case: Initialize Radar System', page:'usecase.html', id:'uc_init' }
    ]
  }
};

/* ============================================================
   RENDERER — edit REQS / DETAILS above, not below.
   ============================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* Layout constants */
  /* Light tint for each group color (used as child box fill) */
  var GROUP_TINTS = {
    '#1A6EA3': '#EEF5FB',
    '#B71C1C': '#FFF0F0',
    '#00695C': '#E6F4F2',
    '#E65100': '#FBF0EB'
  };

  var COL_X    = [40,  350, 660, 970];
  var BOX_W    = 270;
  var TITLE_H  = 32;
  var PAR_Y    = TITLE_H + 4;
  var PAR_H    = 88;
  var CHILD_Y0 = PAR_Y + PAR_H + 18;
  var CHILD_H  = 108;
  var CHILD_GAP = 10;
  var SVG_W    = COL_X[3] + BOX_W + 20;
  var SVG_H    = CHILD_Y0 + 4 * (CHILD_H + CHILD_GAP) - CHILD_GAP + 24;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) {
      if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, String(attrs[k]));
    });
    if (parent) parent.appendChild(e);
    return e;
  }

  function wrapText(text, maxChars) {
    var words = text.split(' ');
    var lines = [], cur = '';
    words.forEach(function (w) {
      var candidate = cur ? cur + ' ' + w : w;
      if (candidate.length <= maxChars) {
        cur = candidate;
      } else {
        if (cur) lines.push(cur);
        cur = w;
      }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function drawParentBox(svg, gi, group) {
    var cx = COL_X[gi];
    var g = el('g', { 'data-id': group.id, 'class': 'req-group' }, svg);

    /* border */
    el('rect', { x:cx, y:PAR_Y, width:BOX_W, height:PAR_H, rx:4,
      fill:'#F5F5F5', stroke:group.color, 'stroke-width':2 }, g);
    /* header — colored bar */
    el('rect', { x:cx, y:PAR_Y, width:BOX_W, height:22, rx:4, fill:group.color }, g);
    el('rect', { x:cx, y:PAR_Y+16, width:BOX_W, height:6, fill:group.color }, g);
    /* stereotype text */
    el('text', { x:cx+BOX_W/2, y:PAR_Y+11,
      'text-anchor':'middle', 'dominant-baseline':'middle',
      'font-size':10, 'font-style':'italic', fill:'#FFFFFF',
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = '«requirementGroup»';
    /* ID */
    el('text', { x:cx+10, y:PAR_Y+37,
      'font-size':13, 'font-weight':'bold', fill:group.color,
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = group.reqId;
    /* Name */
    el('text', { x:cx+10, y:PAR_Y+56,
      'font-size':12, 'font-weight':'700', fill:'#1A1A2E',
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = group.name;
    /* Source hint */
    var det = DETAILS[group.id];
    if (det && det.source) {
      el('text', { x:cx+10, y:PAR_Y+PAR_H-10,
        'font-size':9, 'font-style':'italic', fill:'#888',
        'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = 'Source: ' + det.source;
    }
    return g;
  }

  function drawContainmentBracket(svg, gi, group) {
    var cx = COL_X[gi];
    var bx = cx - 11;  /* bracket x — sits between columns */
    var topY  = PAR_Y + PAR_H;
    var lastChildMidY = CHILD_Y0 + 3 * (CHILD_H + CHILD_GAP) + CHILD_H / 2;

    /* vertical line */
    el('line', { x1:bx, y1:topY, x2:bx, y2:lastChildMidY,
      stroke:group.color, 'stroke-width':2, 'stroke-opacity':0.55 }, svg);
    /* small filled circle at top of bracket */
    el('circle', { cx:bx, cy:topY+5, r:4,
      fill:group.color, 'fill-opacity':0.55 }, svg);
    /* horizontal stubs for each child */
    group.children.forEach(function (child, ci) {
      var childY    = CHILD_Y0 + ci * (CHILD_H + CHILD_GAP);
      var childMidY = childY + CHILD_H / 2;
      el('line', { x1:bx, y1:childMidY, x2:cx, y2:childMidY,
        stroke:group.color, 'stroke-width':2, 'stroke-opacity':0.55 }, svg);
    });
  }

  function drawChildBox(svg, gi, ci, group, child) {
    var cx    = COL_X[gi];
    var cy    = CHILD_Y0 + ci * (CHILD_H + CHILD_GAP);
    var color = group.color;
    var g = el('g', { 'data-id': child.id, 'class': 'req-node' }, svg);

    /* border — tinted fill matching group color */
    var tint = GROUP_TINTS[color] || '#FEFEFE';
    el('rect', { x:cx, y:cy, width:BOX_W, height:CHILD_H, rx:3,
      fill:tint, stroke:color, 'stroke-width':1.5 }, g);
    /* header strip */
    el('rect', { x:cx, y:cy, width:BOX_W, height:20, rx:3, fill:color }, g);
    el('rect', { x:cx, y:cy+14, width:BOX_W, height:6, fill:color }, g);
    /* stereotype */
    el('text', { x:cx+BOX_W/2, y:cy+10,
      'text-anchor':'middle', 'dominant-baseline':'middle',
      'font-size':9, 'font-style':'italic', fill:'#FFFFFF',
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = '«requirement»';
    /* ID */
    el('text', { x:cx+8, y:cy+31,
      'font-size':10, 'font-weight':'bold', fill:color,
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = child.reqId;
    /* Name */
    el('text', { x:cx+8, y:cy+44,
      'font-size':11, 'font-weight':'600', fill:'#1A1A2E',
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = child.name;
    /* divider */
    el('line', { x1:cx+8, y1:cy+52, x2:cx+BOX_W-8, y2:cy+52,
      stroke:'#DDD', 'stroke-width':1 }, g);
    /* text — wrapped up to 3 lines */
    var lines = wrapText(child.text, 37);
    var ty = cy + 65;
    lines.slice(0, 3).forEach(function (line) {
      el('text', { x:cx+8, y:ty, 'font-size':10, fill:'#444',
        'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = line;
      ty += 13;
    });
    /* source */
    el('text', { x:cx+8, y:cy+CHILD_H-8,
      'font-size':9, 'font-style':'italic', fill:'#999',
      'font-family':'Segoe UI, Arial, sans-serif' }, g).textContent = child.source;
  }

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return null;

    var svg = el('svg', {
      width: '100%',
      viewBox: '0 0 ' + SVG_W + ' ' + SVG_H,
      preserveAspectRatio: 'xMidYMid meet'
    }, container);

    /* title bar */
    el('rect', { x:0, y:0, width:SVG_W, height:TITLE_H, fill:'#0D1B2A' }, svg);
    el('text', { x:SVG_W/2, y:TITLE_H/2,
      'text-anchor':'middle', 'dominant-baseline':'middle',
      'font-size':13, 'font-weight':'700', fill:'#FFFFFF',
      'font-family':'Segoe UI, Arial, sans-serif' }, svg).textContent =
      'Marine Radar System — SysML Requirements Diagram';

    /* column group headers (label above each column) */
    REQS.forEach(function (group, gi) {
      drawParentBox(svg, gi, group);
      drawContainmentBracket(svg, gi, group);
      group.children.forEach(function (child, ci) {
        drawChildBox(svg, gi, ci, group, child);
      });
    });

    return svg;
  }

  /* ── Boot + interactivity ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    render('requirements-svg');

    var container = document.getElementById('requirements-svg');
    if (!container || !window.SysMLInteract) return;
    var svgEl = container.querySelector('svg');
    if (!svgEl) return;

    var zoomCtrl = SysMLInteract.initZoomPan(svgEl);
    SysMLInteract.initZoomToolbar('diagram-toolbar', zoomCtrl);

    svgEl.querySelectorAll('.req-group, .req-node').forEach(function (g) {
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

    /* URL-based highlight (e.g. requirements.html?highlight=req_sys_03) */
    SysMLInteract.highlightFromURL(svgEl, function (g) {
      var det = DETAILS[g.getAttribute('data-id')];
      if (det) SysMLInteract.showPanel(det);
    });

    /* Link badges */
    SysMLInteract.addLinkBadges(svgEl, DETAILS);
  });

}());
