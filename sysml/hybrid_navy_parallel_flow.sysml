/**
 * hybrid_navy_parallel_flow.sysml
 *
 * SysML v2 Activity Model — Hybrid Navy Parallel Processing Flow
 *
 * Runs CONCURRENTLY with RadarIngestionActivity (forked at the system level).
 * Augments the raw radar/AIS picture with capabilities characteristic of a
 * modern "Hybrid Navy": unmanned platforms, electronic warfare, AI threat
 * classification, tactical data links, and network-centric dissemination.
 *
 * Parallel branches inside HybridNavyParallelActivity:
 *   Branch 1 — UxV (Unmanned Vehicle) Sensor Ingestion
 *   Branch 2 — Electronic Warfare / ESM Processing
 *   Branch 3 — AI / ML Threat Classification
 *   Branch 4 — Tactical Data Link (Link-16 / Link-11) Processing
 *
 * All four branches feed into:
 *   → Multi-Sensor Fusion
 *   → Combat Management System Integration
 *   → Network-Centric Broadcast (fleet + cloud relay)
 */

package HybridNavyParallelFlow {

    import RadarSystemBlocks::*;
    import RadarIngestionWorkflow::*;

    // =========================================================
    //  HYBRID NAVY ITEM DEFINITIONS
    // =========================================================

    /** Composite tactical picture aggregated from all sensors */
    item def TacticalPicture {
        attribute pictureID         : String;
        attribute ownshipMMSI       : String;
        attribute contacts          : FusedContact;   // collection
        attribute threatSummary     : String;
        attribute dominanceFactor   : Real;            // 0.0–1.0 situational dominance
        attribute classification    : String;          // NATO security classification
        attribute timestamp         : Real;
    }

    /** Telemetry and sensor payload from an Unmanned Vehicle */
    item def UxVTelemetry {
        attribute uxvID             : String;
        attribute uxvType           : String;  // "USV" | "UAV" | "UUV"
        attribute posLat            : Real;
        attribute posLon            : Real;
        attribute altOrDepthM       : Real;
        attribute headingDeg        : Real;
        attribute speedKts          : Real;
        attribute batteryPct        : Real;
        attribute sensorMode        : String;  // "RADAR" | "EO-IR" | "SONAR" | "PASSIVE"
        attribute sensorPayload     : String;  // JSON-encoded sensor readings
        attribute linkQuality       : Real;    // 0.0–1.0
        attribute timestamp         : Real;
    }

    /** Electronic Support Measures (ESM) intercept record */
    item def ESMIntercept {
        attribute interceptID       : String;
        attribute emitterFreqHz     : Real;
        attribute emitterPRF        : Real;     // Pulse repetition frequency
        attribute emitterPulseWidth : Real;     // µs
        attribute bearingDeg        : Real;
        attribute emitterType       : String;   // "NAVAL_RADAR" | "AIR_SEARCH" | "FIRE_CONTROL" etc.
        attribute platformType      : String;   // Estimated platform
        attribute threatLevel       : String;   // "BENIGN" | "SUSPECT" | "HOSTILE"
        attribute libraryMatch      : String;   // Emitter library ID
        attribute confidence        : Real;     // 0.0–1.0
        attribute timestamp         : Real;
    }

    /** AI/ML threat classification result */
    item def AIClassificationResult {
        attribute contactID         : String;
        attribute predictedClass    : String;   // "MERCHANT" | "WARSHIP" | "SUBMARINE" | "FAST_ATTACK" | "UXV"
        attribute confidence        : Real;     // 0.0–1.0
        attribute featureVector     : String;   // Serialised feature vector
        attribute modelVersion      : String;   // ML model version used
        attribute inferenceTimeMs   : Real;
        attribute alternativeClasses : String;  // Top-3 alternatives (JSON)
        attribute timestamp         : Real;
    }

    /** Tactical Data Link message (Link-16 J-series) */
    item def TacticalDataLinkMessage {
        attribute messageID         : String;
        attribute linkType          : String;   // "LINK-16" | "LINK-11" | "VMF"
        attribute jSeries           : String;   // e.g. "J3.0" (Air/Surface Track)
        attribute trackID           : String;
        attribute posLat            : Real;
        attribute posLon            : Real;
        attribute altFt             : Real;
        attribute speedKts          : Real;
        attribute courseDeg         : Real;
        attribute iff               : String;   // "FRIEND" | "UNKNOWN" | "HOSTILE"
        attribute networkParticipant : String;
        attribute encrypted         : Boolean;
        attribute timestamp         : Real;
    }

    /** Multi-sensor fused common operational picture entry */
    item def FusedCOPEntry {
        attribute entryID           : String;
        attribute radarContact      : FusedContact;
        attribute uxvData           : UxVTelemetry;
        attribute esmIntercept      : ESMIntercept;
        attribute aiClassification  : AIClassificationResult;
        attribute tdlCorrelation    : TacticalDataLinkMessage;
        attribute fusionConfidence  : Real;     // 0.0–1.0
        attribute recommendedAction : String;
        attribute timestamp         : Real;
    }

    /** Combat Management System engagement directive */
    item def CMSDirective {
        attribute directiveID       : String;
        attribute directiveType     : String;   // "TRACK" | "ENGAGE" | "EVADE" | "MONITOR"
        attribute targetContactID   : String;
        attribute weaponSystem      : String;   // "CIWS" | "SSM" | "TORPEDO" | "NONE"
        attribute engagementRange   : Real;
        attribute authorisedBy      : String;
        attribute priority          : Integer;  // 1 (highest) – 5 (lowest)
        attribute timestamp         : Real;
    }

    /** Network-centric fleet/shore broadcast packet */
    item def FleetBroadcastPacket {
        attribute packetID          : String;
        attribute sourceUnit        : String;   // Originating vessel/unit
        attribute destination       : String;   // "FLEET" | "SHORE_HQ" | "CLOUD" | "ALL"
        attribute payloadType       : String;   // "COP" | "DIRECTIVE" | "ALERT" | "STATUS"
        attribute payload           : FusedCOPEntry;
        attribute classification    : String;
        attribute encrypted         : Boolean;
        attribute ttlSeconds        : Integer;  // Time-to-live
        attribute timestamp         : Real;
    }

    // =========================================================
    //  BRANCH 1 — UxV SENSOR INGESTION
    // =========================================================

    /**
     * Receives telemetry from USVs, UAVs, and UUVs operating in coordination
     * with the parent vessel.  Extracts, validates, and georeferences sensor
     * payloads for downstream fusion.
     */
    action def UxVSensorIngestion {
        in  uxvTelemetry    : UxVTelemetry;
        out processedUxV    : UxVTelemetry;

        action receiveUxVHeartbeat {
            doc /* C2 link (RF / satellite): receive periodic telemetry frames
                   from all registered UxV units (USV: datalink; UAV: BLOS satellite;
                   UUV: acoustic modem) */
            out rawTelemetry : UxVTelemetry;
        }

        action validateLinkQuality {
            doc /* Check link budget; flag degraded or lost contacts for re-routing */
            in  rawTelemetry  : UxVTelemetry;
            out linkOK        : Boolean;
        }

        action decompressPayload {
            doc /* Decompress / decode sensor payload (JPEG for EO-IR,
                   ASTERIX for UxV radar, proprietary for sonar) */
            in  rawTelemetry  : UxVTelemetry;
            out decompressed  : UxVTelemetry;
        }

        action georeferenceUxV {
            doc /* Transform UxV-local sensor coordinates to Earth-centred
                   reference frame using UxV GPS and attitude data */
            in  decompressed  : UxVTelemetry;
            out processedUxV  : UxVTelemetry;
        }

        action ingestSensorReadings {
            doc /* Parse sensor-type-specific readings:
                   EO-IR → object detection bounding boxes
                   Sonar → contact bearings and frequencies
                   Radar → mini-plot extracts */
            in  processedUxV  : UxVTelemetry;
            out finalUxV      : UxVTelemetry;
        }

        then receiveUxVHeartbeat;
        then validateLinkQuality;
        then decompressPayload;
        then georeferenceUxV;
        then ingestSensorReadings;

        flow from ingestSensorReadings.finalUxV to processedUxV;
    }

    // =========================================================
    //  BRANCH 2 — ELECTRONIC WARFARE / ESM PROCESSING
    // =========================================================

    /**
     * Processes intercepts from the Electronic Support Measures receiver.
     * Identifies emitter types, matches against threat library, and generates
     * electronic warfare recommendations.
     */
    action def ElectronicWarfareProcessing {
        out ewIntercept : ESMIntercept;

        action collectESMSamples {
            doc /* Wide-band ESM receiver scans 0.5–18 GHz; records emitter
                   frequency, PRF, pulse width, bearing via DF antenna array */
            out rawESM : ESMIntercept;
        }

        action deinterleave {
            doc /* Separate overlapping pulse trains from multiple emitters
                   using pulse descriptor word (PDW) clustering */
            in  rawESM        : ESMIntercept;
            out sortedPulses  : ESMIntercept;
        }

        action emitterParameterExtract {
            doc /* Measure: scan period, pulse repetition interval (PRI),
                   RF, pulse-width; build emitter descriptor */
            in  sortedPulses  : ESMIntercept;
            out emitterDesc   : ESMIntercept;
        }

        action libraryLookup {
            doc /* Match emitter descriptor against onboard threat library
                   (NATO EW databases); assign platform/weapon system type */
            in  emitterDesc   : ESMIntercept;
            out matchedEmitter : ESMIntercept;
        }

        action ewThreatClassify {
            doc /* Assign threat level: fire control radar → HOSTILE;
                   navigation radar → BENIGN; unknown parameters → SUSPECT */
            in  matchedEmitter : ESMIntercept;
            out ewIntercept    : ESMIntercept;
        }

        action generateECMRecommendation {
            doc /* For hostile emitters: recommend jamming mode, chaff release,
                   course alteration, or emissions control (EMCON) */
            in  ewIntercept : ESMIntercept;
        }

        then collectESMSamples;
        then deinterleave;
        then emitterParameterExtract;
        then libraryLookup;
        then ewThreatClassify;
        then generateECMRecommendation;

        flow from ewThreatClassify.ewIntercept to ewIntercept;
    }

    // =========================================================
    //  BRANCH 3 — AI / ML THREAT CLASSIFICATION
    // =========================================================

    /**
     * Deep-learning pipeline that classifies fused contacts using features
     * derived from radar signature, AIS history, behavioural pattern, and
     * geographic context.
     */
    action def AIThreatClassification {
        in  fusedContact    : FusedContact;
        out aiResult        : AIClassificationResult;

        action extractFeatures {
            doc /* Build feature vector: radar cross-section history, speed/course variance,
                   AIS gap analysis, transponder spoofing indicators, loitering score */
            in  fusedContact   : FusedContact;
            out featureVector  : AIClassificationResult;
        }

        action normaliseFeatures {
            doc /* Z-score normalisation / min-max scaling aligned with training distribution */
            in  featureVector  : AIClassificationResult;
            out normVector     : AIClassificationResult;
        }

        action runMLInference {
            doc /* Forward pass through quantised CNN-LSTM hybrid model trained on
                   AIS/radar labelled vessel dataset (>10M tracks).
                   Output: probability distribution over vessel classes */
            in  normVector     : AIClassificationResult;
            out rawInference   : AIClassificationResult;
        }

        action applyConfidenceThreshold {
            doc /* If max class probability < 0.6 → classify as UNKNOWN.
                   Dual-threshold approach: Accept / Reject / Escalate */
            in  rawInference   : AIClassificationResult;
            out thresholdedResult : AIClassificationResult;
        }

        action behaviourPatternAnalysis {
            doc /* Cross-reference with historical behaviour: AIS dark periods,
                   rendezvous patterns, restricted area intrusions */
            in  thresholdedResult : AIClassificationResult;
            out aiResult          : AIClassificationResult;
        }

        then extractFeatures;
        then normaliseFeatures;
        then runMLInference;
        then applyConfidenceThreshold;
        then behaviourPatternAnalysis;

        flow from behaviourPatternAnalysis.aiResult to aiResult;
    }

    // =========================================================
    //  BRANCH 4 — TACTICAL DATA LINK PROCESSING
    // =========================================================

    /**
     * Ingests and transmits tracks via NATO tactical data links (Link-16/Link-11).
     * Correlates link picture with organic radar picture for a combined recognised
     * maritime picture (RMP) spanning the entire battlegroup.
     */
    action def TacticalDataLinkProcessing {
        in  radarTrack  : RadarTrack;
        out tdlMessage  : TacticalDataLinkMessage;

        action receiveNetworkPicture {
            doc /* Receive J-series messages from Link-16 network (MIDS-LVT terminal):
                   J3.0 (Surface Track), J3.2 (Air Track), J7.0 (Electronic Warfare) */
            out inboundMsg : TacticalDataLinkMessage;
        }

        action decodeTDLMessage {
            doc /* Decode J-series fixed/variable-length words;
                   extract track state vectors, IFF codes, engagement status */
            in  inboundMsg    : TacticalDataLinkMessage;
            out decodedTrack  : TacticalDataLinkMessage;
        }

        action correlateTDLToRadar {
            doc /* Associate TDL track to organic radar track using gated
                   nearest-neighbour; resolve ambiguities via IFF/MMSI */
            in  decodedTrack  : TacticalDataLinkMessage;
            in  radarTrack    : RadarTrack;
            out correlatedMsg : TacticalDataLinkMessage;
        }

        action formatOutboundJ3 {
            doc /* Format own-ship radar contacts as J3.0 Surface Track words
                   for contribution to network picture */
            in  radarTrack  : RadarTrack;
            out outboundJ3  : TacticalDataLinkMessage;
        }

        action encryptAndTransmit {
            doc /* Apply TSEC KG-175D encryption; transmit via MIDS-LVT
                   radio frequency burst (969 MHz, TDMA) */
            in  outboundJ3  : TacticalDataLinkMessage;
            out tdlMessage  : TacticalDataLinkMessage;
        }

        then receiveNetworkPicture;
        then decodeTDLMessage;
        then correlateTDLToRadar;
        then formatOutboundJ3;
        then encryptAndTransmit;

        flow from encryptAndTransmit.tdlMessage to tdlMessage;
    }

    // =========================================================
    //  MULTI-SENSOR FUSION
    // =========================================================

    /**
     * Fuses all four parallel branch outputs with the organic radar/AIS contact
     * to produce a high-confidence Common Operational Picture (COP) entry.
     */
    action def MultiSensorFusion {
        in  radarContact  : FusedContact;
        in  uxvData       : UxVTelemetry;
        in  ewIntercept   : ESMIntercept;
        in  aiResult      : AIClassificationResult;
        in  tdlMessage    : TacticalDataLinkMessage;
        out copEntry      : FusedCOPEntry;

        action timeSynchronise {
            doc /* Align all sensor timestamps to GPS-disciplined UTC reference;
                   compensate propagation delays and processing latencies */
        }

        action coordinateTransform {
            doc /* Project all data sources into WGS-84 / MGRS common reference frame */
        }

        action weightedEvidenceFusion {
            doc /* Dempster-Shafer or Bayesian evidence fusion:
                   weight each source by its declared confidence and staleness */
        }

        action buildCOPEntry {
            doc /* Assemble FusedCOPEntry merging all weighted source contributions;
                   compute aggregate fusion confidence score */
            out copEntry : FusedCOPEntry;
        }

        then timeSynchronise;
        then coordinateTransform;
        then weightedEvidenceFusion;
        then buildCOPEntry;

        flow from buildCOPEntry.copEntry to copEntry;
    }

    // =========================================================
    //  COMBAT MANAGEMENT SYSTEM INTEGRATION
    // =========================================================

    /**
     * Presents the fused COP to the ship's Combat Management System.
     * CMS performs threat prioritisation, weapon assignment, and generates
     * engagement directives subject to operator authorisation.
     */
    action def CombatManagementSystemIntegration {
        in  copEntry    : FusedCOPEntry;
        out directive   : CMSDirective;

        action updateThreatTrack {
            doc /* Insert / update COP entry in CMS track database;
                   recompute threat priority queue */
            in  copEntry : FusedCOPEntry;
        }

        action weaponAssignmentOptimise {
            doc /* Hungarian-algorithm weapon-target assignment:
                   match available weapons to prioritised threat list */
            out assignments : CMSDirective;
        }

        action checkEngagementRules {
            doc /* Validate ROE (Rules of Engagement); confirm human-in-the-loop
                   authorisation for kinetic engagements */
            in  assignments : CMSDirective;
            out approvedDirective : CMSDirective;
        }

        action issueDirective {
            doc /* Transmit directive to weapon systems, EW suite, and helm;
                   log to CMS audit trail */
            in  approvedDirective : CMSDirective;
            out directive         : CMSDirective;
        }

        then updateThreatTrack;
        then weaponAssignmentOptimise;
        then checkEngagementRules;
        then issueDirective;

        flow from issueDirective.directive to directive;
    }

    // =========================================================
    //  NETWORK-CENTRIC BROADCAST  (parallel broadcast paths)
    // =========================================================

    /**
     * Disseminates the COP and CMS directives across three parallel channels:
     *   Channel A — Fleet tactical LAN (SATCOM / HF / UHF)
     *   Channel B — Shore HQ via SATCOM
     *   Channel C — Maritime cloud relay (VDES / 5G-maritime)
     */
    action def NetworkCentricBroadcast {
        in  copEntry  : FusedCOPEntry;
        in  directive : CMSDirective;
        out packet    : FleetBroadcastPacket;

        action encapsulatePayload {
            doc /* Serialise COP entry and CMS directive into broadcast packet;
                   apply security marking, TTL, and routing header */
            in  copEntry  : FusedCOPEntry;
            in  directive : CMSDirective;
            out rawPacket : FleetBroadcastPacket;
        }

        // === PARALLEL FORK: three simultaneous broadcast channels =============
        fork broadcastFork;

        //  ── Channel A: Fleet Tactical LAN ─────────────────────────────────────
        action broadcastToFleet {
            doc /* Transmit via Link-16 / UHF SATCOM to all task-group participants;
                   use multicast addressing for efficiency */
            in  rawPacket : FleetBroadcastPacket;
            out ackFleet  : Boolean;
        }

        //  ── Channel B: Shore HQ SATCOM ─────────────────────────────────────────
        action relayToShoreHQ {
            doc /* Route via SHF/EHF SATCOM (INMARSAT-C / Iridium backup);
                   apply additional classification encryption layer */
            in  rawPacket : FleetBroadcastPacket;
            out ackShore  : Boolean;
        }

        //  ── Channel C: Maritime Cloud ──────────────────────────────────────────
        action relayToCloud {
            doc /* Transmit over VDES (VHF Data Exchange System) or 5G-maritime
                   to cloud analytics platform for AI model retraining pipeline */
            in  rawPacket  : FleetBroadcastPacket;
            out ackCloud   : Boolean;
        }

        // === JOIN: wait for all acknowledgements ==============================
        join broadcastJoin;

        action confirmDelivery {
            doc /* Log delivery confirmations; re-queue failed broadcasts
                   using exponential-backoff retry (max 3 attempts) */
            out packet : FleetBroadcastPacket;
        }

        // Control flow
        then encapsulatePayload;
        then broadcastFork;

        flow from broadcastFork            to broadcastToFleet;
        flow from broadcastFork            to relayToShoreHQ;
        flow from broadcastFork            to relayToCloud;

        flow from broadcastToFleet.ackFleet  to broadcastJoin;
        flow from relayToShoreHQ.ackShore   to broadcastJoin;
        flow from relayToCloud.ackCloud     to broadcastJoin;

        then broadcastJoin;
        then confirmDelivery;

        flow from confirmDelivery.packet to packet;
    }

    // =========================================================
    //  TOP-LEVEL HYBRID NAVY PARALLEL ACTIVITY
    // =========================================================

    /**
     * Orchestrates all four Hybrid Navy branches in parallel, fuses their
     * outputs, integrates with CMS, and disseminates the result fleet-wide.
     *
     * This activity is forked from CombinedNavalRadarSystem alongside
     * RadarIngestionActivity — the two run concurrently every scan cycle.
     *
     * Internal parallel structure:
     *
     *   radarContact (in) ─┬─→ [UxV Ingest]     ─┐
     *                      ├─→ [EW Processing]   ─┤
     *                      ├─→ [AI Classify]     ─┤→ [MultiSensorFusion]
     *                      └─→ [TDL Processing]  ─┘         ↓
     *                                                [CMS Integration]
     *                                                        ↓
     *                                          [Network-Centric Broadcast]
     */
    activity HybridNavyParallelActivity {

        in  radarContact  : FusedContact;      // Received from RadarIngestionActivity
        out broadcastPkt  : FleetBroadcastPacket;
        out cmsDirective  : CMSDirective;

        // === PARALLEL FORK: all four branches start simultaneously ============
        fork hybridFork;

        // Branch instances
        action uxvIngest    : UxVSensorIngestion;
        action ewProcess    : ElectronicWarfareProcessing;
        action aiClassify   : AIThreatClassification;
        action tdlProcess   : TacticalDataLinkProcessing;

        // === JOIN: wait for all four branches before fusion ===================
        join hybridJoin;

        // Downstream sequential stages
        action multiSensorFuse  : MultiSensorFusion;
        action cmsIntegrate     : CombatManagementSystemIntegration;
        action netBroadcast     : NetworkCentricBroadcast;

        // Input data flows to parallel branches
        flow from radarContact          to aiClassify.fusedContact;
        flow from radarContact          to tdlProcess.radarTrack;

        // Control flow: fork → four parallel branches
        then hybridFork;
        flow from hybridFork            to uxvIngest;
        flow from hybridFork            to ewProcess;
        flow from hybridFork            to aiClassify;
        flow from hybridFork            to tdlProcess;

        // Data flows from branches to join
        flow from uxvIngest.processedUxV        to hybridJoin;
        flow from ewProcess.ewIntercept          to hybridJoin;
        flow from aiClassify.aiResult            to hybridJoin;
        flow from tdlProcess.tdlMessage          to hybridJoin;

        then hybridJoin;
        then multiSensorFuse;

        // Feed fusion engine
        flow from radarContact                  to multiSensorFuse.radarContact;
        flow from uxvIngest.processedUxV        to multiSensorFuse.uxvData;
        flow from ewProcess.ewIntercept          to multiSensorFuse.ewIntercept;
        flow from aiClassify.aiResult            to multiSensorFuse.aiResult;
        flow from tdlProcess.tdlMessage          to multiSensorFuse.tdlMessage;

        then cmsIntegrate;

        flow from multiSensorFuse.copEntry       to cmsIntegrate.copEntry;

        then netBroadcast;

        flow from multiSensorFuse.copEntry       to netBroadcast.copEntry;
        flow from cmsIntegrate.directive         to netBroadcast.directive;
        flow from netBroadcast.packet            to broadcastPkt;
        flow from cmsIntegrate.directive         to cmsDirective;
    }

}
