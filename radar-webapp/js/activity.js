/* activity.js – Marine Radar Ingestion Activity Diagram (interactive)
   ── EDIT LANES / ROWS to change diagram content.
   ── EDIT DETAILS to change the click-to-inspect panel content.
   ── Do not edit the renderer below the DETAILS block. */

/* ── LANE DEFINITIONS ─────────────────────────────────────────── */
var LANES = [
  { id: 'tx',     label: 'Transmitter Layer',             color: '#DCEEFB', hdrColor: '#1A6EA3', hdrText: '#FFFFFF' },
  { id: 'scan',   label: 'Scanner / Aerial Layer',        color: '#E8F5E9', hdrColor: '#2E7D32', hdrText: '#FFFFFF' },
  { id: 'rx',     label: 'Receiver / Signal Processing',  color: '#FBE9E7', hdrColor: '#B71C1C', hdrText: '#FFFFFF' },
  { id: 'disp',   label: 'Display & Plotting Layer',      color: '#EDE7F6', hdrColor: '#6A1B9A', hdrText: '#FFFFFF' },
  { id: 'hybrid', label: 'Hybrid Navy Integration Layer', color: '#E0F7FA', hdrColor: '#00695C', hdrText: '#FFFFFF' }
];

/* ── ROW DEFINITIONS ──────────────────────────────────────────── */
var ROWS = [
  // TRANSMITTER
  { lane:'tx',     items:[{ id:'start',       type:'start',    label:'START' }] },
  { lane:'tx',     items:[{ id:'power',       type:'process',  label:'Power Supply Initialization', note:'Provides regulated DC to all transmitter sub-units' }] },
  { lane:'tx',     items:[{ id:'trigger',     type:'process',  label:'Delay Line & Trigger Generation' }] },
  { lane:'tx',     items:[{ id:'modulator',   type:'process',  label:'Modulator Activation', note:'Shapes pulse width and timing envelope' }] },
  { lane:'tx',     items:[{ id:'magnetron',   type:'process',  label:'Magnetron\nHigh-Frequency RF Oscillation' }] },
  { lane:'tx',     items:[
    { id:'xband', type:'process', variant:'band', label:'X-Band Radar\n9 GHz / 3 cm\nHigh resolution · Short range\nRequired: ships >300 GT (SOLAS)' },
    { id:'sband', type:'process', variant:'band', label:'S-Band Radar\n3 GHz / 10 cm\nLong range · Weather resistant\nRequired: ships >3000 GT (SOLAS)' }
  ]},
  { lane:'tx',     items:[{ id:'tr_tx',       type:'process',  label:'TR Switch → Transmit Mode\nWaveguide / Coaxial Cable Routing' }] },

  // SCANNER
  { lane:'scan',   items:[{ id:'location',    type:'process',  label:'Scanner Located on Monkey Island\n(Clear of all obstructions)' }] },
  { lane:'scan',   items:[{ id:'pulse_tx',    type:'process',  label:'Directional Pulse Transmission\nPRF: 500 – 4000 pps', note:'One trace created per pulse transmitted' }] },
  { lane:'scan',   items:[{ id:'rotation',    type:'process',  label:'360° Rotational Scan\n12 – 30 RPM · clockwise from above', note:'PRF >> RPM so bearing error is negligible' }] },
  { lane:'scan',   items:[{ id:'echo_rx',     type:'process',  label:'Echo Reception from Targets' }] },
  { lane:'scan',   items:[{ id:'tr_rx',       type:'process',  label:'TR Switch → Receive Mode' }] },

  // RECEIVER
  { lane:'rx',     items:[{ id:'tr_cell',     type:'process',  label:'TR Cell\nProtects receiver during transmission' }] },
  { lane:'rx',     items:[{ id:'lo_mixer',    type:'process',  label:'Local Oscillator + Mixer\nDownconvert to Intermediate Frequency' }] },
  { lane:'rx',     items:[{ id:'if_amp',      type:'process',  label:'IF Amplifier\nAmplify weak echo signals' }] },
  { lane:'rx',     items:[{ id:'video_amp',   type:'process',  label:'Video Amplifier' }] },
  { lane:'rx',     items:[{ id:'demod',       type:'process',  label:'Demodulator\nSignal Smoothing & Conditioning' }] },
  { lane:'rx',     items:[
    { id:'range_det',   type:'process', variant:'measurement', label:'Range Determination\nRange Rings & VRM\nAccuracy: ±30 m or 1% of range scale', note:'Tracing spot speed = ½ speed of radio waves' },
    { id:'bearing_det', type:'process', variant:'measurement', label:'Bearing Determination\nHeading Marker + Bearing Scale\nAccuracy: ±1°' }
  ]},

  // DISPLAY
  { lane:'disp',   items:[{ id:'ppi',         type:'process',  label:"PPI Display (CRT)\nPlan Position Indicator – Bird's Eye View", note:'Trace synchronized with scanner rotation' }] },
  { lane:'disp',   items:[{ id:'target_paint',type:'process',  label:'Target Paint – Bright Spot on Screen' }] },
  { lane:'disp',   items:[{ id:'bearing_scale',type:'process', label:'Bearing Scale (30° numbered · 5° marked)\nMin. 4 Parallel Index Lines (IMO MSC.192)' }] },
  { lane:'disp',   items:[{ id:'tonnage_q',   type:'decision', label:'Ship\n> 3000 GT?' }] },
  { lane:'disp',   items:[
    { id:'arpa', type:'process', variant:'mandatory', label:'ARPA\nAutomatic Radar Plotting Aid\nCPA / TCPA Calculation\nAuto Target Acquisition' },
    { id:'epa',  type:'process', variant:'mandatory', label:'Electronic Plotting Aid\nMandatory 300 – 3000 GT\nSemi-auto Target Tracking' }
  ]},
  { lane:'disp',   items:[{ id:'failure_q',   type:'decision', label:'Sensor /\nSignal Failure?' }] },
  { lane:'disp',   items:[
    { id:'alarm',   type:'process', variant:'alarm', label:'ALARM Triggered\n(IMO MSC.192(79))\nStandby: <5 sec · Cold: <4 min' },
    { id:'ok_perf', type:'process', variant:'ok',    label:'Optimum Performance\nAbsence-of-Target\nIndication Active' }
  ]},
  { lane:'disp',   items:[{ id:'std_out',     type:'process',  label:'Standard Radar\nCollision Avoidance Output\n(OOW Assessment)' }] },

  // HYBRID NAVY
  { lane:'hybrid', items:[{ id:'ais',         type:'process',  label:'AIS Data Ingestion\nMMSI · Name · Position · COG · SOG · Heading', note:'AIS adds vessel identity not available from echo alone' }] },
  { lane:'hybrid', items:[
    { id:'satellite', type:'process', label:'Satellite Data Feed\nVDES / GNSS Augmentation' },
    { id:'ecdis',     type:'process', label:'ECDIS Chart Overlay\nElectronic Navigational Chart' },
    { id:'uav',       type:'process', label:'Drone / UAV Sensor Feed\nBeyond-Horizon Awareness' }
  ]},
  { lane:'hybrid', items:[{ id:'ai_class',    type:'process',  label:'AI / ML Target Classification Engine\nVessel Type · Threat Level · Anomaly Detection' }] },
  { lane:'hybrid', items:[{ id:'fusion',      type:'process',  label:'Sensor Fusion Engine\nRadar + AIS + Satellite + ECDIS + UAV → Unified Track' }] },
  { lane:'hybrid', items:[{ id:'ibs',         type:'process',  label:'Integrated Bridge System (IBS)\nUnified Operational Picture for OOW' }] },
  { lane:'hybrid', items:[{ id:'hybrid_cav',  type:'process',  label:'Hybrid Collision Avoidance DSS\nCOLREGS-aware Course Recommendations' }] },
  { lane:'hybrid', items:[{ id:'final',       type:'process',  label:'Navigation & Safety Output\nCourse Recommendation · Alert · Incident Log' }] },
  { lane:'hybrid', items:[{ id:'end',         type:'end',      label:'END' }] }
];

/* ── DETAILS – click-to-inspect panel content ─────────────────── */
var DETAILS = {
  start:       { title:'System Start',          description:'Marine radar system power-on sequence initiates. Cold start time must not exceed 4 minutes per IMO MSC.192(79).', source:'§8 IMO MSC.192(79)', values:['Cold start: ≤4 min','Standby to operational: ≤5 sec'] },
  power:       { title:'Power Supply Initialization', source:'§4.1 Transmitter', description:'Regulated DC power distributed to all transmitter sub-units: delay line, modulator, magnetron, and TR switch.', values:['Input: Ship main supply (AC/DC)','Output: Regulated DC to transmitter chain'] },
  trigger:     { title:'Delay Line & Trigger Generation', source:'§4.1 Transmitter', description:'Generates the precise trigger pulse that sets the PRF and synchronizes the modulator with the display trace rotation.', values:['PRF range: 500–4000 pps','Synchronizes modulator with scanner rotation'] },
  modulator:   { title:'Modulator Activation', source:'§4.1 Transmitter', description:'Shapes the pulse envelope — controlling pulse width and timing — before sending the high-power burst to the magnetron.', values:['Controls pulse width','Controls pulse timing envelope'] },
  magnetron:   { title:'Magnetron — High-Frequency RF Oscillation', source:'§4.1 Transmitter', description:'Core RF oscillator that produces high-frequency microwave pulses in response to modulator firing.', values:['X-Band: 9 GHz / 3 cm wavelength','S-Band: 3 GHz / 10 cm wavelength'] },
  xband:       { title:'X-Band Radar', source:'§6.1', description:'Operates at 9 GHz (3 cm wavelength). High resolution, short range. Susceptible to rain attenuation. Required for all ships over 300 GT under SOLAS Chapter V.', values:['Frequency: 9 GHz','Wavelength: 3 cm','Range: Short (high resolution)'], constraints:['Required: all ships > 300 GT (SOLAS)','Susceptible to rain attenuation'] },
  sband:       { title:'S-Band Radar', source:'§6.2', description:'Operates at 3 GHz (10 cm wavelength). Longer range and weather resistance at the cost of lower resolution than X-Band.', values:['Frequency: 3 GHz','Wavelength: 10 cm','Range: Long','Weather resistance: High'], constraints:['Required: ships > 3000 GT (SOLAS)','Lower resolution than X-Band'] },
  tr_tx:       { title:'TR Switch — Transmit Mode', source:'§4.1 Transmitter', description:'Routes the high-power RF pulse from the magnetron to the aerial via waveguide or coaxial cable. Isolates the sensitive receiver during transmission.', values:['Routing: Waveguide or coaxial cable','Mode: Transmit — receiver isolated'] },
  location:    { title:'Scanner Location — Monkey Island', source:'§4.2 Scanner', description:'The radar scanner must be located on Monkey Island — the topmost open deck — clear of all obstructions that could cause blind sectors.', note:'Obstruction-free 360° view is mandatory' },
  pulse_tx:    { title:'Directional Pulse Transmission', source:'§4.2 Scanner', description:'Scanner transmits a narrow directional pulse with each PRF trigger. Each pulse creates one radial trace on the PPI display.', values:['PRF: 500–4000 pps','One display trace per pulse'] },
  rotation:    { title:'360° Rotational Scan', source:'§4.2 Scanner', description:'Scanner rotates continuously at 12–30 RPM clockwise. The PRF is orders of magnitude higher than rotation speed so bearing error is negligible.', values:['Rotation: 12–30 RPM clockwise','Bearing error: negligible (PRF >> RPM)'] },
  echo_rx:     { title:'Echo Reception from Targets', source:'§4.2 Scanner', description:'Reflected pulses return to the scanner. Time delay between transmission and reception determines range. Echo strength indicates target size.' },
  tr_rx:       { title:'TR Switch — Receive Mode', source:'§4.2 / §4.3', description:'After each transmitted pulse the TR switch automatically connects the aerial to the receiver chain, protecting it from the next transmit pulse.' },
  tr_cell:     { title:'TR Cell — Receiver Protection', source:'§4.3 Receiver', description:'Gas-filled tube that prevents the high-power transmitted pulse from damaging receiver components. Short-circuits during transmission and recovers in microseconds.', values:['Function: Protects receiver during transmission','Recovery time: microseconds'] },
  lo_mixer:    { title:'Local Oscillator + Mixer', source:'§4.3 Receiver', description:'Local oscillator generates a reference frequency offset from the radar frequency. The mixer combines it with the echo to produce an Intermediate Frequency (IF) signal.', values:['Output: Intermediate Frequency (IF) signal'] },
  if_amp:      { title:'IF Amplifier', source:'§4.3 Receiver', description:'Amplifies the weak intermediate frequency echo signal to a level suitable for video processing. Most receiver gain is provided here.' },
  video_amp:   { title:'Video Amplifier', source:'§4.3 Receiver', description:'Further conditions the detected echo signal before demodulation, optimising it for display processing.' },
  demod:       { title:'Demodulator — Signal Smoothing', source:'§4.3 Receiver', description:'Extracts the video envelope from the IF signal and smooths it out.', note:'Source: "demodulator which smoothens out the signal"' },
  range_det:   { title:'Range Determination', source:'§5.1 + §8 IMO MSC.192(79)', description:'Range measured by timing the delay between pulse transmission and echo reception. Tracing spot speed is half the speed of radio waves.', values:['Accuracy: ±30 m or 1% of range scale (whichever greater)','Tracing spot speed = ½ × speed of radio waves','Minimum 2 VRMs required (IMO MSC.192)'] },
  bearing_det: { title:'Bearing Determination', source:'§5.2 + §8 IMO MSC.192(79)', description:'Bearing measured from the heading marker to the target using the bearing scale. High PRF relative to RPM makes bearing error negligible.', values:['Accuracy: ±1°','Bearing scale: 30° numbered divisions, 5° marked','Minimum 4 parallel index lines required (IMO MSC.192)'] },
  ppi:         { title:'PPI Display (CRT)', source:'§4.4 Display', description:"Plan Position Indicator — Cathode Ray Tube display showing a Bird's Eye View. One radial trace per transmitted pulse, synchronized with scanner rotation.", values:['Type: CRT or RASTER','View: Bird\'s Eye View (top-down)','Trace synchronized with scanner rotation'] },
  target_paint:{ title:'Target Paint', source:'§4.4 Display', description:'When an echo returns, the corresponding PPI trace point brightens — painting the target. Display persistence keeps targets visible between scans.' },
  bearing_scale:{ title:'Bearing Scale & Parallel Index Lines', source:'§8 IMO MSC.192(79)', description:'Bearing scale uses 30° numbered divisions and 5° marks. IMO mandates at least 4 parallel index lines.', constraints:['Minimum 4 parallel index lines (IMO MSC.192)','Bearing scale: 30° numbered, 5° marked'] },
  tonnage_q:   { title:'Decision: Ship > 3000 GT?', source:'§7 SOLAS Chapter V', description:'SOLAS tonnage check determines the minimum plotting aid requirement.', constraints:['Yes (>3000 GT) → ARPA mandatory','No (300–3000 GT) → EPA mandatory'] },
  arpa:        { title:'ARPA — Automatic Radar Plotting Aid', source:'§7 SOLAS Chapter V', description:'Automatically acquires and tracks targets, calculates CPA (Closest Point of Approach) and TCPA (Time to CPA), and generates collision avoidance alerts.', constraints:['Mandatory: ships > 3000 GT','SOLAS Chapter V'], operations:['Auto target acquisition','CPA calculation','TCPA calculation','Collision alert generation'] },
  epa:         { title:'EPA — Electronic Plotting Aid', source:'§7 SOLAS Chapter V', description:'Semi-automatic target tracking for smaller vessels. Satisfies SOLAS requirements for ships between 300 and 3000 GT.', constraints:['Mandatory: ships 300–3000 GT','SOLAS Chapter V'], operations:['Manual/semi-auto target plotting','Vector display'] },
  failure_q:   { title:'Decision: Sensor or Signal Failure?', source:'§8 IMO MSC.192(79)', description:'IMO requires that failure of any sensor or signal in use must trigger an alarm. Monitors gyro, log, video signal, sync, and heading inputs.', constraints:['Sensors monitored: gyro, log, video, sync, heading','Any failure must be alarmed (IMO MSC.192)'] },
  alarm:       { title:'ALARM Triggered', source:'§8 IMO MSC.192(79)', description:'Sensor failure alarm raised. System must indicate which sensor failed.', values:['Cold start: ≤4 min','Standby to ready: ≤5 sec'], constraints:['IMO MSC.192(79) compliance mandatory','Alarm must identify the failed sensor'] },
  ok_perf:     { title:'Optimum Performance', source:'§8 IMO MSC.192(79)', description:'All sensors healthy. System displays absence-of-target indication to confirm correct operation.', operations:['Absence-of-target indication active','All sensor health OK'] },
  std_out:     { title:'Standard Radar — Collision Avoidance Output', description:'Officer of the Watch makes navigation assessment based on PPI display, ARPA/EPA tracks, and bearing/range measurements.', operations:['OOW navigation assessment','COLREGS-based maneuvering decisions'] },
  ais:         { title:'AIS Data Ingestion', description:'Automatic Identification System data provides vessel identity not derivable from radar echo alone.', values:['MMSI (Maritime Mobile Service Identity)','Vessel name','Position (GPS)','COG (Course Over Ground)','SOG (Speed Over Ground)','True heading'], note:'AIS adds identity layer that radar echo cannot provide' },
  satellite:   { title:'Satellite Data Feed', description:'VDES (VHF Data Exchange System) and GNSS augmentation feeds enhance position accuracy beyond standalone GPS.', values:['VDES data exchange','GNSS position augmentation'] },
  ecdis:       { title:'ECDIS Chart Overlay', description:'Electronic Chart Display and Information System overlays real-time electronic navigational charts onto the fused sensor picture.', values:['Real-time ENC (Electronic Navigational Chart)','Hazard and route overlay'] },
  uav:         { title:'Drone / UAV Sensor Feed', description:'Unmanned aerial vehicle feeds extend situational awareness beyond the horizon — covering sea areas beyond radar range.', values:['Beyond-horizon situational awareness','Video + IR sensor feeds'] },
  ai_class:    { title:'AI / ML Target Classification Engine', description:'Machine learning classifier assigns vessel type, threat level, and anomaly scores to each tracked target using fused sensor data.', operations:['Vessel type classification','Anomaly detection','Threat level scoring'] },
  fusion:      { title:'Sensor Fusion Engine', description:'Combines radar tracks, AIS data, satellite feeds, ECDIS, and UAV feeds into a single authoritative track for each contact.', operations:['Radar + AIS correlation','Satellite position augmentation','UAV integration','Unified track output'] },
  ibs:         { title:'Integrated Bridge System (IBS)', description:'Presents a unified operational picture to the Officer of the Watch, integrating all sensor data on a single display system.', operations:['Unified sensor display','Alert management','COLREGS advisory'] },
  hybrid_cav:  { title:'Hybrid Collision Avoidance DSS', description:'COLREGS-aware Decision Support System generates course recommendations based on fused sensor data, AI classification, and international collision regulations.', operations:['COLREGS rule interpretation','Course recommendation generation','Collision avoidance manoeuvre advisory'] },
  final:       { title:'Navigation & Safety Output', description:'Final system output: course recommendation, safety alert, and incident log entry.', operations:['Course recommendation','Safety alert dispatch','Incident log entry'] },
  end:         { title:'System End / Standby', description:'Radar pipeline cycle complete. System returns to standby or continues continuous operation.', values:['Standby recovery: ≤5 sec (IMO MSC.192)'] }
};

/* ── CROSS-DIAGRAM REFERENCES ─────────────────────────────────── */
(function () {
  var X = {
    power:        [{ label:'Block: Transmitter (BDD)',              page:'bdd.html',     id:'tx'          }, { label:'Use Case: Initialize Radar System',  page:'usecase.html', id:'uc_init'     }],
    trigger:      [{ label:'Block: Transmitter (BDD)',              page:'bdd.html',     id:'tx'          }, { label:'Use Case: Initialize Radar System',  page:'usecase.html', id:'uc_init'     }],
    modulator:    [{ label:'Block: Transmitter (BDD)',              page:'bdd.html',     id:'tx'          }, { label:'Use Case: Initialize Radar System',  page:'usecase.html', id:'uc_init'     }],
    magnetron:    [{ label:'Block: Transmitter (BDD)',              page:'bdd.html',     id:'tx'          }, { label:'Use Case: Initialize Radar System',  page:'usecase.html', id:'uc_init'     }],
    xband:        [{ label:'Block: XBandRadar (BDD)',               page:'bdd.html',     id:'xband'       }],
    sband:        [{ label:'Block: SBandRadar (BDD)',               page:'bdd.html',     id:'sband'       }],
    tr_tx:        [{ label:'Block: Transmitter (BDD)',              page:'bdd.html',     id:'tx'          }],
    location:     [{ label:'Block: Scanner (BDD)',                  page:'bdd.html',     id:'scan'        }],
    pulse_tx:     [{ label:'Block: Scanner (BDD)',                  page:'bdd.html',     id:'scan'        }],
    rotation:     [{ label:'Block: Scanner (BDD)',                  page:'bdd.html',     id:'scan'        }],
    echo_rx:      [{ label:'Block: Scanner (BDD)',                  page:'bdd.html',     id:'scan'        }],
    tr_rx:        [{ label:'Block: Scanner (BDD)',                  page:'bdd.html',     id:'scan'        }],
    tr_cell:      [{ label:'Block: Receiver (BDD)',                 page:'bdd.html',     id:'rx'          }],
    lo_mixer:     [{ label:'Block: Receiver (BDD)',                 page:'bdd.html',     id:'rx'          }],
    if_amp:       [{ label:'Block: Receiver (BDD)',                 page:'bdd.html',     id:'rx'          }],
    video_amp:    [{ label:'Block: Receiver (BDD)',                 page:'bdd.html',     id:'rx'          }],
    demod:        [{ label:'Block: Receiver (BDD)',                 page:'bdd.html',     id:'rx'          }],
    range_det:    [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Determine Target Range',   page:'usecase.html', id:'uc_range'    }],
    bearing_det:  [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Determine Target Bearing', page:'usecase.html', id:'uc_bearing'  }],
    ppi:          [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Display PPI Plot',         page:'usecase.html', id:'uc_ppi'      }],
    target_paint: [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Display PPI Plot',         page:'usecase.html', id:'uc_ppi'      }],
    bearing_scale:[{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Verify SOLAS Compliance',  page:'usecase.html', id:'uc_solas'    }],
    arpa:         [{ label:'Block: ARPA (BDD)',                     page:'bdd.html',     id:'arpa'        }, { label:'Use Case: Track Targets (ARPA/EPA)', page:'usecase.html', id:'uc_tracking' }],
    epa:          [{ label:'Block: Electronic Plotting Aid (BDD)',  page:'bdd.html',     id:'epa'         }, { label:'Use Case: Track Targets (ARPA/EPA)', page:'usecase.html', id:'uc_tracking' }],
    failure_q:    [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Generate Collision Alert',  page:'usecase.html', id:'uc_alert'    }],
    alarm:        [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Generate Collision Alert',  page:'usecase.html', id:'uc_alert'    }],
    ok_perf:      [{ label:'Block: Display (BDD)',                  page:'bdd.html',     id:'disp'        }, { label:'Use Case: Perform Performance Test',  page:'usecase.html', id:'uc_perf'     }],
    ais:          [{ label:'Block: AISReceiver (BDD)',              page:'bdd.html',     id:'ais'         }, { label:'Use Case: Ingest AIS Data',           page:'usecase.html', id:'uc_ais'      }],
    satellite:    [{ label:'Block: HybridNavySystem (BDD)',         page:'bdd.html',     id:'hns'         }, { label:'Use Case: Fuse Sensor Data',          page:'usecase.html', id:'uc_fusion'   }],
    ecdis:        [{ label:'Block: HybridNavySystem (BDD)',         page:'bdd.html',     id:'hns'         }, { label:'Use Case: Fuse Sensor Data',          page:'usecase.html', id:'uc_fusion'   }],
    uav:          [{ label:'Block: HybridNavySystem (BDD)',         page:'bdd.html',     id:'hns'         }, { label:'Use Case: Fuse Sensor Data',          page:'usecase.html', id:'uc_fusion'   }],
    fusion:       [{ label:'Block: SensorFusionEngine (BDD)',       page:'bdd.html',     id:'sfe'         }, { label:'Use Case: Fuse Sensor Data',          page:'usecase.html', id:'uc_fusion'   }],
    ai_class:     [{ label:'Block: AITargetClassifier (BDD)',       page:'bdd.html',     id:'aic'         }, { label:'Use Case: Classify Target via AI/ML', page:'usecase.html', id:'uc_classify' }],
    ibs:          [{ label:'Block: IntegratedBridgeSystem (BDD)',   page:'bdd.html',     id:'ibs'         }, { label:'Use Case: Generate Course Rec.',      page:'usecase.html', id:'uc_course'   }],
    hybrid_cav:   [{ label:'Block: IntegratedBridgeSystem (BDD)',   page:'bdd.html',     id:'ibs'         }, { label:'Use Case: Generate Course Rec.',      page:'usecase.html', id:'uc_course'   }],
    final:        [{ label:'Block: IntegratedBridgeSystem (BDD)',   page:'bdd.html',     id:'ibs'         }, { label:'Use Case: Log Navigation Incident',   page:'usecase.html', id:'uc_log'      }]
  };
  for (var id in X) { if (DETAILS[id]) DETAILS[id].crossRefs = X[id]; }
}());

/* ── REQUIREMENTS CROSS-REFERENCES ───────────────────────────── */
(function () {
  var R = {
    start:         [{ label:'Requirement: REQ-SYS-01 Cold Start',          page:'requirements.html', id:'req_sys_01' }],
    alarm:         [{ label:'Requirement: REQ-SYS-01 Cold Start',          page:'requirements.html', id:'req_sys_01' },
                    { label:'Requirement: REQ-SYS-02 Standby Switching',   page:'requirements.html', id:'req_sys_02' }],
    range_det:     [{ label:'Requirement: REQ-SYS-03 Range Accuracy',      page:'requirements.html', id:'req_sys_03' }],
    bearing_det:   [{ label:'Requirement: REQ-SYS-04 Bearing Accuracy',    page:'requirements.html', id:'req_sys_04' }],
    xband:         [{ label:'Requirement: REQ-SOL-01 X-Band Mandatory',    page:'requirements.html', id:'req_sol_01' }],
    sband:         [{ label:'Requirement: REQ-SOL-03 S-Band + ARPA',       page:'requirements.html', id:'req_sol_03' }],
    arpa:          [{ label:'Requirement: REQ-SOL-02 Plotting Aid',        page:'requirements.html', id:'req_sol_02' },
                    { label:'Requirement: REQ-SOL-03 S-Band + ARPA',       page:'requirements.html', id:'req_sol_03' }],
    epa:           [{ label:'Requirement: REQ-SOL-02 Plotting Aid',        page:'requirements.html', id:'req_sol_02' }],
    bearing_scale: [{ label:'Requirement: REQ-SOL-04 Display Standards',   page:'requirements.html', id:'req_sol_04' }],
    ais:           [{ label:'Requirement: REQ-HYB-01 AIS Integration',     page:'requirements.html', id:'req_hyb_01' }],
    fusion:        [{ label:'Requirement: REQ-HYB-02 Sensor Fusion',       page:'requirements.html', id:'req_hyb_02' }],
    ai_class:      [{ label:'Requirement: REQ-HYB-03 AI/ML Classification',page:'requirements.html', id:'req_hyb_03' }],
    hybrid_cav:    [{ label:'Requirement: REQ-HYB-04 Collision Avoidance', page:'requirements.html', id:'req_hyb_04' }],
    location:      [{ label:'Requirement: REQ-HW-01 Scanner Siting',       page:'requirements.html', id:'req_hw_01' }],
    pulse_tx:      [{ label:'Requirement: REQ-HW-02 PRF Range',            page:'requirements.html', id:'req_hw_02' }],
    rotation:      [{ label:'Requirement: REQ-HW-03 Scan Rate',            page:'requirements.html', id:'req_hw_03' }],
    tr_cell:       [{ label:'Requirement: REQ-HW-04 Receiver Chain',       page:'requirements.html', id:'req_hw_04' }]
  };
  for (var id in R) {
    if (DETAILS[id]) DETAILS[id].crossRefs = (DETAILS[id].crossRefs || []).concat(R[id]);
  }
}());

/* ============================================================
   RENDERER — edit LANES / ROWS / DETAILS above, not below.
   ============================================================ */
(function () {
  'use strict';

  var C = {
    svgWidth:      1140,
    laneHdrH:        36,
    laneHdrFontSz:   11,
    laneLeftW:       14,
    nodeW:          320,
    nodeMinH:        52,
    nodeRx:           6,
    nodeFont:        12,
    nodeLineH:       16,
    nodePadX:        12,
    nodePadY:         8,
    startR:          16,
    endR:            16,
    diamondH:        60,
    rowGap:          20,
    laneTopPad:      14,
    laneBotPad:      14,
    arrowSize:        7,
    noteFont:        10,
    noteMaxW:       160,
    parallelGap:     24,
    variant: {
      band:        { fill: '#FFF9E6', stroke: '#E6A817' },
      mandatory:   { fill: '#E8F5E9', stroke: '#388E3C' },
      alarm:       { fill: '#FFEBEE', stroke: '#C62828' },
      ok:          { fill: '#E8F5E9', stroke: '#2E7D32' },
      measurement: { fill: '#F3E5F5', stroke: '#7B1FA2' },
      default:     { fill: '#FFFFFF', stroke: '#2E86AB' }
    }
  };

  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function nodeHeight(node) {
    if (node.type === 'start' || node.type === 'end') return C.startR * 2;
    if (node.type === 'decision') return C.diamondH;
    var lines = (node.label || '').split('\n');
    return Math.max(C.nodeMinH, lines.length * C.nodeLineH + C.nodePadY * 2);
  }

  function rowHeight(row) {
    var h = 0;
    row.items.forEach(function (n) { h = Math.max(h, nodeHeight(n)); });
    return h;
  }

  function getLane(id) {
    for (var i = 0; i < LANES.length; i++) { if (LANES[i].id === id) return LANES[i]; }
    return LANES[0];
  }

  function drawProcess(parent, node, cx, cy, w, h, laneColors) {
    var v = C.variant[node.variant] || (laneColors ? laneColors : C.variant.default);
    el('rect', { x: cx-w/2, y: cy-h/2, width: w, height: h, rx: C.nodeRx, ry: C.nodeRx, fill: v.fill, stroke: v.stroke, 'stroke-width': 1.5 }, parent);
    var lines = (node.label || '').split('\n');
    var totalH = lines.length * C.nodeLineH;
    var sy = cy - totalH/2 + C.nodeLineH/2;
    lines.forEach(function (line, i) {
      el('text', { x: cx, y: sy + i*C.nodeLineH, 'font-family': 'Segoe UI, Arial, sans-serif', 'font-size': C.nodeFont, 'font-weight': i===0?'600':'400', fill: '#1A1A2E', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, parent).textContent = line;
    });
  }

  function drawDiamond(parent, node, cx, cy, w, h) {
    var hw = w/2, hh = h/2;
    var pts = [cx+','+(cy-hh), (cx+hw)+','+cy, cx+','+(cy+hh), (cx-hw)+','+cy].join(' ');
    el('polygon', { points: pts, fill: '#FFF9C4', stroke: '#F9A825', 'stroke-width': 1.5 }, parent);
    var lines = (node.label || '').split('\n');
    var totalH = lines.length * C.nodeLineH;
    var sy = cy - totalH/2 + C.nodeLineH/2;
    lines.forEach(function (line, i) {
      el('text', { x: cx, y: sy + i*C.nodeLineH, 'font-family': 'Segoe UI, Arial, sans-serif', 'font-size': 11, 'font-weight': '600', fill: '#4A3000', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, parent).textContent = line;
    });
  }

  function drawTerminal(parent, node, cx, cy) {
    var isEnd = node.type === 'end';
    el('circle', { cx: cx, cy: cy, r: C.startR, fill: isEnd?'#1A1A2E':'#2E86AB', stroke: isEnd?'#000':'#1A6EA3', 'stroke-width': 2 }, parent);
    if (isEnd) el('circle', { cx: cx, cy: cy, r: C.startR-5, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2 }, parent);
    el('text', { x: cx, y: cy, 'font-family': 'Segoe UI, Arial, sans-serif', 'font-size': 9, 'font-weight': '700', fill: '#FFFFFF', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, parent).textContent = node.label;
  }

  function drawArrow(svg, x1, y1, x2, y2, crossLane) {
    var color = crossLane ? '#888' : '#2E86AB';
    var attrs = { x1:x1, y1:y1, x2:x2, y2:y2, stroke:color, 'stroke-width':1.5, 'marker-end':'url(#arrow)' };
    if (crossLane) attrs['stroke-dasharray'] = '5,3';
    el('line', attrs, svg);
  }

  function drawForkBar(svg, cx, cy, w) {
    el('rect', { x:cx-w/2, y:cy-4, width:w, height:8, fill:'#1A1A2E', rx:2 }, svg);
  }

  function drawNote(svg, text, x, y) {
    var lines = [], words = text.split(' '), current = '';
    words.forEach(function (w) {
      if ((current+' '+w).trim().length > 22) { if (current) lines.push(current.trim()); current = w; }
      else { current = (current+' '+w).trim(); }
    });
    if (current) lines.push(current);
    var noteH = lines.length*14+10, noteW = 140;
    el('rect', { x:x, y:y-5, width:noteW, height:noteH, fill:'#FFFDE7', stroke:'#F0A500', 'stroke-width':1, rx:3, opacity:0.95 }, svg);
    lines.forEach(function (l, i) {
      el('text', { x:x+6, y:y+i*14+7, 'font-family':'Segoe UI, Arial, sans-serif', 'font-size':C.noteFont, fill:'#4A3800', 'dominant-baseline':'middle' }, svg).textContent = l;
    });
  }

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var laneOrder = LANES.map(function (l) { return l.id; });
    var laneRows  = {};
    laneOrder.forEach(function (id) { laneRows[id] = []; });
    ROWS.forEach(function (row) { if (laneRows[row.lane]) laneRows[row.lane].push(row); });

    var laneHeights = {};
    laneOrder.forEach(function (id) {
      var h = C.laneTopPad;
      laneRows[id].forEach(function (row) { h += rowHeight(row) + C.rowGap; });
      laneHeights[id] = Math.max(h + C.laneBotPad, C.laneHdrH + 40);
    });

    var totalH = C.laneHdrH;
    laneOrder.forEach(function (id) { totalH += C.laneHdrH + laneHeights[id]; });
    totalH += 20;

    var svgW = C.svgWidth;
    var svg = el('svg', {
      width: svgW, height: totalH, xmlns: NS,
      viewBox: '0 0 ' + svgW + ' ' + totalH,
      style: 'font-family: Segoe UI, Arial, sans-serif;'
    }, container);

    var defs = el('defs', {}, svg);
    var marker = el('marker', { id:'arrow', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto' }, defs);
    el('path', { d:'M0,0 L0,6 L8,3 z', fill:'#2E86AB' }, marker);

    // Title header
    el('rect', { x:0, y:0, width:svgW, height:C.laneHdrH, fill:'#0D1B2A' }, svg);
    el('text', { x:svgW/2, y:C.laneHdrH/2, 'font-size':13, 'font-weight':'700', fill:'#FFFFFF', 'text-anchor':'middle', 'dominant-baseline':'middle' }, svg).textContent = 'Marine Radar Ingestion — SysML Activity Diagram';
    el('text', { x:svgW/2, y:C.laneHdrH/2+14, 'font-size':9, fill:'#7AAAC0', 'text-anchor':'middle', 'dominant-baseline':'middle' }, svg).textContent = 'Source: Merchant Navy Decoded – The Complete Guide About Marine Radar';

    var laneY  = C.laneHdrH;
    var nodePos = {};
    var prevNodeId = {};

    laneOrder.forEach(function (laneId) {
      var lane = getLane(laneId);
      var lh   = laneHeights[laneId];

      el('rect', { x:0, y:laneY, width:svgW, height:C.laneHdrH, fill:lane.hdrColor }, svg);
      el('text', { x:16, y:laneY+C.laneHdrH/2, 'font-size':C.laneHdrFontSz, 'font-weight':'700', fill:lane.hdrText, 'dominant-baseline':'middle', 'letter-spacing':'0.06em' }, svg).textContent = lane.label;
      el('rect', { x:0, y:laneY+C.laneHdrH, width:svgW, height:lh, fill:lane.color }, svg);
      el('rect', { x:0, y:laneY+C.laneHdrH, width:C.laneLeftW, height:lh, fill:lane.hdrColor, opacity:0.4 }, svg);
      el('line', { x1:0, y1:laneY+C.laneHdrH+lh, x2:svgW, y2:laneY+C.laneHdrH+lh, stroke:lane.hdrColor, 'stroke-width':1.5 }, svg);

      laneY += C.laneHdrH;
      var rowY = laneY + C.laneTopPad;

      laneRows[laneId].forEach(function (row) {
        var rh    = rowHeight(row);
        var rowCY = rowY + rh/2;
        var noteX = C.svgWidth/2 + C.nodeW/2 + 20;
        var n     = row.items.length;

        if (n === 1) {
          var node = row.items[0];
          var cx   = svgW/2;
          var h    = nodeHeight(node);

          // Wrap node in interactive <g>
          var nodeG = el('g', { 'data-id': node.id, 'data-lane': row.lane, 'class': 'node-group' }, svg);

          if (node.type === 'start' || node.type === 'end') {
            drawTerminal(nodeG, node, cx, rowCY);
            nodePos[node.id] = { cx:cx, cy:rowCY, w:C.startR*2, h:C.startR*2, type:node.type };
          } else if (node.type === 'decision') {
            drawDiamond(nodeG, node, cx, rowCY, C.nodeW, h);
            nodePos[node.id] = { cx:cx, cy:rowCY, w:C.nodeW, h:h, type:'decision' };
          } else {
            drawProcess(nodeG, node, cx, rowCY, C.nodeW, h, { fill: lane.color, stroke: lane.hdrColor });
            nodePos[node.id] = { cx:cx, cy:rowCY, w:C.nodeW, h:h, type:'process' };
          }

          // Note stays in svg (not in group)
          if (node.note) {
            drawNote(svg, node.note, noteX, rowCY - 5);
            el('line', { x1:cx+C.nodeW/2, y1:rowCY, x2:noteX-2, y2:rowCY, stroke:'#AAAAAA', 'stroke-width':1, 'stroke-dasharray':'3,2' }, svg);
          }

          if (prevNodeId[laneId]) {
            var prev = nodePos[prevNodeId[laneId]];
            if (prev) drawArrow(svg, cx, prev.cy+prev.h/2, cx, rowCY-h/2-1, false);
          }
          prevNodeId[laneId] = node.id;

        } else {
          // Parallel items
          var totalW   = n*C.nodeW + (n-1)*C.parallelGap;
          var startX   = svgW/2 - totalW/2 + C.nodeW/2;
          var forkBarW = totalW + 40;
          var forkY    = rowCY - rh/2 - 10;
          var joinY    = rowCY + rh/2 + 10;

          drawForkBar(svg, svgW/2, forkY, forkBarW);
          drawForkBar(svg, svgW/2, joinY, forkBarW);

          if (prevNodeId[laneId]) {
            var prevP = nodePos[prevNodeId[laneId]];
            if (prevP) drawArrow(svg, svgW/2, prevP.cy+prevP.h/2, svgW/2, forkY-1, false);
          }

          row.items.forEach(function (node, idx) {
            var cx2 = startX + idx*(C.nodeW+C.parallelGap);
            var h2  = nodeHeight(node);
            var parG = el('g', { 'data-id': node.id, 'data-lane': row.lane, 'class': 'node-group' }, svg);
            drawProcess(parG, node, cx2, rowCY, C.nodeW, h2, { fill: lane.color, stroke: lane.hdrColor });
            nodePos[node.id] = { cx:cx2, cy:rowCY, w:C.nodeW, h:h2, type:'process' };
            drawArrow(svg, cx2, forkY+4, cx2, rowCY-h2/2-1, false);
            el('line', { x1:cx2, y1:rowCY+h2/2, x2:cx2, y2:joinY-4, stroke:'#2E86AB', 'stroke-width':1.5 }, svg);
          });

          var joinId = '_join_'+laneId+'_'+rowY;
          nodePos[joinId] = { cx:svgW/2, cy:joinY, w:forkBarW, h:8, type:'join' };
          prevNodeId[laneId] = joinId;
        }

        rowY += rh + C.rowGap;
      });

      laneY += lh;
    });

    // Cross-lane arrows
    ['tx','scan','rx','disp'].forEach(function (id, i, seq) {
      if (i >= seq.length-1) return;
      var nextId = seq[i+1];
      var lastId = prevNodeId[id];
      var firstId = null;
      for (var r = 0; r < ROWS.length; r++) {
        if (ROWS[r].lane === nextId && ROWS[r].items.length === 1) { firstId = ROWS[r].items[0].id; break; }
      }
      if (lastId && firstId && nodePos[lastId] && nodePos[firstId]) {
        var p1 = nodePos[lastId], p2 = nodePos[firstId];
        drawArrow(svg, p1.cx, p1.cy+p1.h/2, p2.cx, p2.cy-p2.h/2-1, true);
      }
    });

    // Parallel flow arrow: disp → hybrid
    var dispLast   = nodePos['std_out'];
    var hybridFirst = nodePos['ais'];
    if (dispLast && hybridFirst) {
      var ax = C.svgWidth - 60;
      el('polyline', {
        points: [dispLast.cx+','+(dispLast.cy+dispLast.h/2), dispLast.cx+','+(dispLast.cy+dispLast.h/2+20),
                 ax+','+(dispLast.cy+dispLast.h/2+20), ax+','+(hybridFirst.cy-hybridFirst.h/2-20),
                 hybridFirst.cx+','+(hybridFirst.cy-hybridFirst.h/2-20)].join(' '),
        fill:'none', stroke:'#888', 'stroke-width':1.5, 'stroke-dasharray':'6,3', 'marker-end':'url(#arrow)'
      }, svg);
      var midY = (dispLast.cy + hybridFirst.cy) / 2;
      el('text', { x:ax+4, y:midY,    'font-size':9, fill:'#666', 'dominant-baseline':'middle' }, svg).textContent = 'Parallel';
      el('text', { x:ax+4, y:midY+11, 'font-size':9, fill:'#666', 'dominant-baseline':'middle' }, svg).textContent = 'Flow';
    }

    return svg;
  }

  /* ── Boot + interactivity ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    render('activity-svg');

    var container = document.getElementById('activity-svg');
    if (!container || !window.SysMLInteract) return;
    var svgEl = container.querySelector('svg');
    if (!svgEl) return;

    // Zoom / pan
    var zoomCtrl = SysMLInteract.initZoomPan(svgEl);
    SysMLInteract.initZoomToolbar('diagram-toolbar', zoomCtrl);

    // Node hover → floating panel · leave → schedule hide · click → navigate
    var nodeGroups = svgEl.querySelectorAll('.node-group');
    nodeGroups.forEach(function (g) {
      var id  = g.getAttribute('data-id');
      var det = DETAILS[id];
      if (!det) return;
      g.addEventListener('mouseenter', function () { SysMLInteract.showPanel(det); });
      g.addEventListener('mouseleave', SysMLInteract.scheduleHide);
      g.addEventListener('click', function (e) {
        e.stopPropagation();
        if (zoomCtrl && zoomCtrl.wasDragged()) { zoomCtrl.clearDrag(); return; }
        if (det.crossRefs && det.crossRefs.length) {
          window.location.href = det.crossRefs[0].page + '?highlight=' + det.crossRefs[0].id;
        }
      });
    });

    // Click SVG background → close panel
    svgEl.addEventListener('click', function () {
      if (zoomCtrl && zoomCtrl.wasDragged()) { zoomCtrl.clearDrag(); return; }
      SysMLInteract.hidePanel();
    });

    // URL-based highlight (e.g. activity.html?highlight=magnetron)
    SysMLInteract.highlightFromURL(svgEl, function (g) {
      var det = DETAILS[g.getAttribute('data-id')];
      if (det) SysMLInteract.showPanel(det);
    });

    // Link badges — numeric indicator on elements that cross-link to other diagrams
    SysMLInteract.addLinkBadges(svgEl, DETAILS);

    // Lane filter buttons
    var filterBar = document.getElementById('lane-filter');
    if (filterBar) {
      LANES.forEach(function (lane) {
        var btn = document.createElement('button');
        btn.className = 'lane-filter-btn active';
        btn.style.borderColor       = lane.hdrColor;
        btn.style.backgroundColor   = lane.hdrColor;
        btn.style.color             = '#FFFFFF';
        btn.textContent             = lane.label;
        btn.setAttribute('data-lane', lane.id);
        btn.addEventListener('click', function () {
          var isActive = btn.classList.toggle('active');
          btn.style.backgroundColor = isActive ? lane.hdrColor : '#FFFFFF';
          btn.style.color           = isActive ? '#FFFFFF' : lane.hdrColor;
          nodeGroups.forEach(function (ng) {
            if (ng.getAttribute('data-lane') === lane.id) {
              ng.style.opacity       = isActive ? '' : '0.08';
              ng.style.pointerEvents = isActive ? '' : 'none';
            }
          });
        });
        filterBar.appendChild(btn);
      });
    }
  });

}());
