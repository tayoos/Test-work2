/**
 * radar_ingestion_workflow.sysml
 *
 * SysML v2 Activity Model — Marine Radar Ingestion Workflow
 *
 * Models the end-to-end ingestion pipeline from system power-on through
 * antenna rotation, pulse transmission, echo reception, digital signal
 * processing, ARPA tracking, AIS fusion, and output/alerting.
 *
 * Pipeline stages (sequential with internal parallelism):
 *   1. System Initialization
 *   2. Pulse Transmission
 *   3. Echo Reception
 *   4. Signal Processing          ← parallel sea/rain clutter branches
 *   5. Plot Extraction
 *   6. ARPA Tracking
 *   7. AIS Integration
 *   8. Alert & Output             ← parallel output branches
 *
 * Reference: Marine Radar — Complete Guide (merchantnavydecoded.com)
 */

package RadarIngestionWorkflow {

    import RadarSystemBlocks::*;

    // =========================================================
    //  STAGE 1 — SYSTEM INITIALIZATION
    // =========================================================

    /**
     * Powers on hardware, validates self-test, selects operating band,
     * and configures antenna rotation speed before the first scan.
     */
    action def SystemInitialization {
        out config      : RadarConfiguration;
        out initOK      : Boolean;

        // Sub-actions executed sequentially
        action powerOnTransceiver {
            doc /* Energise magnetron/solid-state PA; allow warm-up (~2 min magnetron) */
            out txReady : Boolean;
        }

        action startAntennaRotation {
            doc /* Drive antenna motor to operating RPM; verify via tachometer feedback */
            out antReady : Boolean;
        }

        action selectFrequencyBand {
            doc /* Operator selects X-band (9 GHz, short range detail) or
                   S-band (3 GHz, long range / heavy rain penetration) */
            in  band       : String;
            out freqConfig : RadarConfiguration;
        }

        action setPulseMode {
            doc /* Short pulse → fine range resolution; long pulse → weak target detection */
            in  rangeScaleNM  : Real;
            out pulseConfig   : RadarConfiguration;
        }

        action performSelfTest {
            doc /* Built-in test: echo box, receiver sensitivity, display check */
            out testPassed : Boolean;
        }

        // Sequential control flow
        then powerOnTransceiver;
        then startAntennaRotation;
        then selectFrequencyBand;
        then setPulseMode;
        then performSelfTest;

        // Propagate final config
        flow from selectFrequencyBand.freqConfig to setPulseMode.rangeScaleNM;
    }

    // =========================================================
    //  STAGE 2 — PULSE TRANSMISSION
    // =========================================================

    /**
     * Generates and radiates each RF pulse.  Triggered once per PRF period
     * (typ. every 0.5–3 ms).  Duplexer switches antenna from Tx → Rx mode
     * immediately after pulse ends.
     */
    action def PulseTransmission {
        in  config      : RadarConfiguration;

        action generateTrigger {
            doc /* Timer fires at PRF rate; synchronises all downstream processing */
            out trigger : Boolean;
        }

        action modulatePulse {
            doc /* Shape RF burst: simple rectangular pulse or frequency-modulated (FMCW) */
            in  trigger        : Boolean;
            out modulatedPulse : Boolean;
        }

        action powerAmplify {
            doc /* Magnetron: cavity oscillator driven to peak power (10–120 kW)
                   Solid-state: wideband PA chain, coherent Doppler capable */
            in  modulatedPulse : Boolean;
            out amplifiedPulse : Boolean;
        }

        action switchDuplexer {
            doc /* Ferrite or PIN-diode duplexer isolates receiver during Tx burst */
            in  amplifiedPulse : Boolean;
        }

        action radiateViaCoupler {
            doc /* Rotary joint couples waveguide to spinning antenna */
        }

        then generateTrigger;
        then modulatePulse;
        then powerAmplify;
        then switchDuplexer;
        then radiateViateViaCouple;     // alias: radiateViaCoupler
    }

    // =========================================================
    //  STAGE 3 — ECHO RECEPTION
    // =========================================================

    /**
     * Receives reflected echoes from targets and converts to digital samples.
     * Listening window opens immediately after Tx pulse ends (tx blanking).
     */
    action def EchoReception {
        out rawEcho : RawEcho;

        action txBlankingGate {
            doc /* Mute receiver for duration of own-ship transmitted pulse to prevent saturation */
            out gateOpen : Boolean;
        }

        action lowNoiseAmplify {
            doc /* LNA: typically 8–10 dB noise figure; sets system sensitivity floor */
            in  gateOpen       : Boolean;
            out rfAmplified    : Boolean;
        }

        action downConvertToIF {
            doc /* Superheterodyne mixer: RF → IF (typ. 60 MHz centre) */
            in  rfAmplified    : Boolean;
            out ifSignal       : Boolean;
        }

        action logAmplify {
            doc /* Logarithmic amplifier compresses dynamic range (80 dB) to manageable levels */
            in  ifSignal       : Boolean;
            out logCompressed  : Boolean;
        }

        action analogToDigitalConvert {
            doc /* ADC: 16-bit @ 60–200 MSps; each sample corresponds to one range bin (~7.5 m) */
            in  logCompressed  : Boolean;
            out rawEcho        : RawEcho;
        }

        then txBlankingGate;
        then lowNoiseAmplify;
        then downConvertToIF;
        then logAmplify;
        then analogToDigitalConvert;

        flow from analogToDigitalConvert.rawEcho to rawEcho;
    }

    // =========================================================
    //  STAGE 4 — SIGNAL PROCESSING  (with parallel clutter branches)
    // =========================================================

    /**
     * Applies digital signal processing to suppress clutter (sea and rain),
     * detect real targets above a CFAR threshold, and extract Doppler velocity.
     *
     * Parallel branches:
     *   Branch A — Sea Clutter Suppression (STC + CFAR)
     *   Branch B — Rain Clutter Suppression (FTC / Doppler filtering)
     * Both branches feed a join node before target detection.
     */
    action def SignalProcessing {
        in  rawEcho        : RawEcho;
        out filteredReturn : FilteredReturn;

        action rangeGating {
            doc /* Divide PRI into equal-width range bins; discard bins inside min range */
            in  rawEcho    : RawEcho;
            out gatedData  : RawEcho;
        }

        // === PARALLEL FORK: clutter suppression runs on both paths simultaneously ===
        fork clutterFork;

        //  ── Branch A: Sea Clutter ──────────────────────────────────────────────
        action applySTC {
            doc /* Sensitivity Time Control: reduces receiver gain at short ranges
                   to suppress sea clutter returns proportional to range^4 */
            in  gatedData     : RawEcho;
            out stcCorrected  : FilteredReturn;
        }

        action seaClutterCFAR {
            doc /* OS-CFAR (Order-Statistic) adaptive threshold over sea clutter:
                   compares cell under test to ordered range neighbours */
            in  stcCorrected  : FilteredReturn;
            out seaDetections : FilteredReturn;
        }

        //  ── Branch B: Rain Clutter ─────────────────────────────────────────────
        action applyFTC {
            doc /* Fast Time Constant / high-pass differentiator reduces slowly-varying
                   rain clutter while preserving sharp target leading edges */
            in  gatedData     : RawEcho;
            out ftcCorrected  : FilteredReturn;
        }

        action rainClutterDoppler {
            doc /* MTI (Moving Target Indication) canceller: two-pulse subtraction removes
                   stationary/slow rain clutter; passes moving targets */
            in  ftcCorrected  : FilteredReturn;
            out rainFiltered  : FilteredReturn;
        }

        // === JOIN: merge both clutter-suppressed paths ========================
        join clutterJoin;

        action cfar_detection {
            doc /* CA-CFAR (Cell-Averaging) final detection over combined returns;
                   maintains constant false alarm rate across varying noise floors */
            out detections : FilteredReturn;
        }

        action dopplerProcessing {
            doc /* FFT-based Doppler analysis (solid-state radar): extract radial velocity
                   for each range-azimuth cell — enables target vs clutter discrimination */
            in  detections     : FilteredReturn;
            out filteredReturn : FilteredReturn;
        }

        // Control flow
        then rangeGating;
        then clutterFork;

        flow from clutterFork      to applySTC;
        flow from clutterFork      to applyFTC;
        flow from applySTC         to seaClutterCFAR;
        flow from applyFTC         to rainClutterDoppler;
        flow from seaClutterCFAR   to clutterJoin;
        flow from rainClutterDoppler to clutterJoin;

        then cfar_detection;
        then dopplerProcessing;

        flow from dopplerProcessing.filteredReturn to filteredReturn;
    }

    // =========================================================
    //  STAGE 5 — PLOT EXTRACTION
    // =========================================================

    /**
     * Converts raw detections into discrete radar plots with computed
     * range, bearing, and quality metrics for ARPA input.
     */
    action def PlotExtraction {
        in  filteredReturn : FilteredReturn;
        out plot           : RadarPlot;

        action threshold {
            doc /* Binary threshold on CFAR output to create detection bitmap */
            in  filteredReturn : FilteredReturn;
            out binaryMap      : Boolean;
        }

        action centroid {
            doc /* Centroiding: find geometric centre of each connected echo blob */
            in  binaryMap      : Boolean;
            out centreCell     : Boolean;
        }

        action computeRangeBearing {
            doc /* Convert (range bin, azimuth step) → (range NM, bearing °T) */
            in  centreCell     : Boolean;
            out plotGeometry   : RadarPlot;
        }

        action scoreQuality {
            doc /* Assign quality score 0.0–1.0 based on SNR, size consistency, echo shape */
            in  plotGeometry   : RadarPlot;
            out plot           : RadarPlot;
        }

        then threshold;
        then centroid;
        then computeRangeBearing;
        then scoreQuality;

        flow from scoreQuality.plot to plot;
    }

    // =========================================================
    //  STAGE 6 — ARPA TRACKING
    // =========================================================

    /**
     * IMO-compliant ARPA processor per MSC.192(79).
     * Associates plots to existing tracks and predicts future positions.
     * Computes CPA/TCPA for collision avoidance alerting.
     */
    action def ARPATracking {
        in  plot  : RadarPlot;
        out track : RadarTrack;

        action plotAssociate {
            doc /* Gate-and-nearest-neighbour (GNN) or JPDA association:
                   match incoming plot to predicted track position within gate */
            in  plot              : RadarPlot;
            out associationResult : Boolean;
        }

        action trackInitOrUpdate {
            doc /* New plot outside all gates → initiate tentative track (need 3 hits in 5 scans)
                   Matched plot → update existing confirmed track */
            in  associationResult : Boolean;
            out stateEstimate     : RadarTrack;
        }

        action alphasBetaFilter {
            doc /* α-β (or Kalman) filter smooths position and velocity estimates
                   using weighted combination of prediction and measurement */
            in  stateEstimate : RadarTrack;
            out smoothedTrack : RadarTrack;
        }

        action computeCPATCPA {
            doc /* CPA = min future separation; TCPA = time until CPA.
                   Alert if CPA < operator-set range OR TCPA < operator-set time */
            in  smoothedTrack : RadarTrack;
            out track         : RadarTrack;
        }

        action assessThreatLevel {
            doc /* Classify track threat: SAFE / CAUTION / DANGER
                   based on CPA, TCPA, relative bearing change, BCR, BCT */
            in  track     : RadarTrack;
            out trackOut  : RadarTrack;
        }

        then plotAssociate;
        then trackInitOrUpdate;
        then alphasBetaFilter;
        then computeCPATCPA;
        then assessThreatLevel;

        flow from assessThreatLevel.trackOut to track;
    }

    // =========================================================
    //  STAGE 7 — AIS INTEGRATION
    // =========================================================

    /**
     * Correlates ARPA radar tracks with decoded AIS transponder messages.
     * Produces FusedContact records that combine kinematic radar data with
     * AIS identity information (name, MMSI, vessel type).
     */
    action def AISIntegration {
        in  track        : RadarTrack;
        out fusedContact : FusedContact;

        action receiveAISMessage {
            doc /* AIS dual-channel VHF receiver (ch 87B / 88B); handles all 27 message types */
            out rawAIS : AISData;
        }

        action decodeAISPayload {
            doc /* Decode NMEA !AIVDM sentence: extract position, SOG, COG, MMSI, vessel type */
            in  rawAIS    : AISData;
            out decodedAIS : AISData;
        }

        action geoCorrelate {
            doc /* Convert AIS lat/lon to same reference frame as radar (range/bearing).
                   Apply time-alignment to compensate AIS update latency (2–180 s) */
            in  decodedAIS    : AISData;
            in  radarTrack    : RadarTrack;
            out correlScore   : Real;
        }

        action mergeContact {
            doc /* If correlation score > threshold: merge AIS identity onto radar track.
                   If no AIS match: track remains UNKNOWN classification */
            in  correlScore   : Real;
            in  track         : RadarTrack;
            in  decodedAIS    : AISData;
            out fusedContact  : FusedContact;
        }

        then receiveAISMessage;
        then decodeAISPayload;
        then geoCorrelate;
        then mergeContact;

        flow from mergeContact.fusedContact to fusedContact;
    }

    // =========================================================
    //  STAGE 8 — ALERT GENERATION & OUTPUT  (parallel output branches)
    // =========================================================

    /**
     * Evaluates each fused contact against operator-configured alert thresholds,
     * then fans out to three parallel output paths:
     *   Path 1 — NMEA sentence broadcast (serial / LAN)
     *   Path 2 — Display update (PPI refresh)
     *   Path 3 — Alert/alarm queue (audio-visual, logging)
     */
    action def AlertAndOutput {
        in  fusedContact : FusedContact;
        out alert        : AlertMessage;
        out nmea         : NMEASentence;

        action evaluateAlertThresholds {
            doc /* Compare CPA/TCPA against operator limits; check guard zone penetration */
            in  fusedContact    : FusedContact;
            out alertCondition  : AlertMessage;
        }

        // === PARALLEL FORK: three independent output paths ====================
        fork outputFork;

        //  ── Path 1: NMEA Output ───────────────────────────────────────────────
        action formatNMEA {
            doc /* Encode RATLL (target lat/lon), RATTM (tracked target message),
                   RARSD (radar system data) per IEC 61162-1 / NMEA-0183 */
            out nmeaSentence : NMEASentence;
        }

        action broadcastNMEA {
            doc /* Transmit NMEA sentences via RS-422 serial and/or UDP multicast
                   to connected ECDIS, VDR, and integrated bridge systems */
            in  nmeaSentence : NMEASentence;
        }

        //  ── Path 2: Display Refresh ───────────────────────────────────────────
        action renderPPI {
            doc /* Update Plan-Position Indicator: paint echo returns, draw ARPA vectors,
                   overlay AIS symbols, display CPA/TCPA readout */
        }

        action overlayECDIS {
            doc /* Fuse radar video onto electronic chart for ECDIS radar overlay mode */
        }

        //  ── Path 3: Alert Queue ───────────────────────────────────────────────
        action triggerAudioVisual {
            doc /* Activate audible alarm and flashing visual indicator for DANGER tracks */
            in  alertCondition : AlertMessage;
        }

        action logToVDR {
            doc /* Write event to Voyage Data Recorder buffer for post-incident replay */
            in  alertCondition : AlertMessage;
        }

        // === JOIN: all output paths complete before next cycle ================
        join outputJoin;

        // Control flow
        then evaluateAlertThresholds;
        then outputFork;

        flow from outputFork                         to formatNMEA;
        flow from outputFork                         to renderPPI;
        flow from outputFork                         to triggerAudioVisual;

        flow from formatNMEA                         to broadcastNMEA;
        flow from broadcastNMEA                      to outputJoin;
        flow from renderPPI                          to overlayECDIS;
        flow from overlayECDIS                       to outputJoin;
        flow from triggerAudioVisual                 to logToVDR;
        flow from logToVDR                           to outputJoin;

        then outputJoin;

        flow from formatNMEA.nmeaSentence            to nmea;
        flow from evaluateAlertThresholds.alertCondition to alert;
    }

    // =========================================================
    //  TOP-LEVEL RADAR INGESTION ACTIVITY
    // =========================================================

    /**
     * Continuous radar ingestion pipeline.
     * Stages 2–8 execute once per antenna revolution (1.5–3 s cycle time).
     * Stage 1 executes only at startup.
     *
     *   init → tx → rx → sigProc → plotExt → arpa → ais → output → (loop to tx)
     */
    activity RadarIngestionActivity {

        out finalContact : FusedContact;
        out finalAlert   : AlertMessage;

        // Stage instances
        action init     : SystemInitialization;
        action tx       : PulseTransmission;
        action rx       : EchoReception;
        action sigProc  : SignalProcessing;
        action plotExt  : PlotExtraction;
        action arpa     : ARPATracking;
        action ais      : AISIntegration;
        action output   : AlertAndOutput;

        // Data flows between stages
        flow from init.config               to tx.config;
        flow from rx.rawEcho                to sigProc.rawEcho;
        flow from sigProc.filteredReturn    to plotExt.filteredReturn;
        flow from plotExt.plot              to arpa.plot;
        flow from arpa.track                to ais.track;
        flow from ais.fusedContact          to output.fusedContact;
        flow from ais.fusedContact          to finalContact;
        flow from output.alert              to finalAlert;

        // Sequential control flow (one-time init, then continuous scan loop)
        then init;
        then tx;    // ← loop point: every PRF period
        then rx;
        then sigProc;
        then plotExt;
        then arpa;
        then ais;
        then output;
        then tx;    // continuous scan cycle repeats from Tx stage
    }

}
