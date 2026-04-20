/**
 * radar_system_blocks.sysml
 *
 * SysML v2 Block Definition Model — Marine Radar System
 *
 * Defines all parts, items, interfaces, and attributes used across
 * the radar ingestion workflow and hybrid navy parallel flow.
 *
 * Reference: Marine Radar — Complete Guide (merchantnavydecoded.com)
 */

package RadarSystemBlocks {

    // =========================================================
    //  ATTRIBUTE DEFINITIONS
    // =========================================================

    attribute def Frequency { attribute value : Real; }  // Hz
    attribute def Distance  { attribute value : Real; }  // Nautical Miles
    attribute def Angle     { attribute value : Real; }  // Degrees
    attribute def TimeSec   { attribute value : Real; }  // Seconds

    // =========================================================
    //  ITEM DEFINITIONS  (data flowing through the system)
    // =========================================================

    /** Radar operating configuration selected at startup */
    item def RadarConfiguration {
        attribute band              : String;   // "X-BAND" (9.2–9.5 GHz) | "S-BAND" (2.9–3.1 GHz)
        attribute frequencyHz       : Real;     // Exact carrier frequency
        attribute pulseWidthUs      : Real;     // Pulse width in microseconds (short/medium/long)
        attribute PRF               : Real;     // Pulse Repetition Frequency (Hz)
        attribute peakPowerKW       : Real;     // Magnetron/solid-state peak power
        attribute antennaRPM        : Real;     // Antenna rotation rate (typ. 20–40 RPM)
        attribute rangeScaleNM      : Real;     // Selected range scale (0.125–96 NM)
        attribute tiltDeg           : Real;     // Antenna tilt angle
    }

    /** Raw digitised echo sample from A/D converter */
    item def RawEcho {
        attribute rangeBin          : Integer;  // Sample index → range
        attribute azimuthDeg        : Real;     // Antenna bearing at time of reception
        attribute amplitudeDBm      : Real;     // Received power level (dBm)
        attribute noiseFiguredB     : Real;     // Receiver noise figure
        attribute timestamp         : Real;     // UNIX epoch (ms)
        attribute scanNumber        : Integer;  // Antenna revolution counter
    }

    /** Echo return after digital signal processing and clutter suppression */
    item def FilteredReturn {
        attribute rangeBin          : Integer;
        attribute azimuthDeg        : Real;
        attribute SNR               : Real;     // Signal-to-Noise Ratio (dB)
        attribute clutterSuppressed : Boolean;
        attribute stcApplied        : Boolean;  // Sensitivity Time Control
        attribute ftcApplied        : Boolean;  // Fast Time Constant (rain clutter)
        attribute cfar_threshold    : Real;     // CFAR detection threshold used
    }

    /** Radar detection plot extracted from a filtered return */
    item def RadarPlot {
        attribute plotID            : String;
        attribute rangeNM           : Real;
        attribute bearingDeg        : Real;     // Relative or True depending on setting
        attribute strengthDBm       : Real;
        attribute widthRangeBins    : Integer;  // Radial extent of the echo
        attribute widthAzDeg        : Real;     // Angular width
        attribute qualityScore      : Real;     // 0.0–1.0
        attribute timestamp         : Real;
    }

    /** Confirmed ARPA track with kinematic state */
    item def RadarTrack {
        attribute trackID           : String;
        attribute rangeNM           : Real;
        attribute bearingTrueDeg    : Real;
        attribute speedKts          : Real;
        attribute courseTrueDeg     : Real;
        attribute CPANM             : Real;     // Closest Point of Approach (NM)
        attribute TCPAMin           : Real;     // Time to CPA (minutes)
        attribute BCR               : Real;     // Bow Crossing Range (NM)
        attribute BCT               : Real;     // Bow Crossing Time (min)
        attribute trackAge          : Integer;  // Number of scans tracked
        attribute trackStatus       : String;   // "ACQUIRING" | "TRACKING" | "LOST"
        attribute threatLevel       : String;   // "SAFE" | "CAUTION" | "DANGER"
    }

    /** AIS message decoded from VHF receiver */
    item def AISData {
        attribute MMSI              : String;   // Maritime Mobile Service Identity
        attribute vesselName        : String;
        attribute callSign          : String;
        attribute IMO               : String;
        attribute lat               : Real;     // Decimal degrees
        attribute lon               : Real;
        attribute SOG               : Real;     // Speed over ground (kts)
        attribute COG               : Real;     // Course over ground (deg)
        attribute HDG               : Real;     // Heading (deg)
        attribute navStatus         : String;   // "UNDERWAY" | "ANCHORED" | "MOORED" etc.
        attribute vesselType        : Integer;  // ITU vessel type code
        attribute msgType           : Integer;  // AIS message type (1–27)
        attribute timestamp         : Real;
    }

    /** Radar track correlated with AIS data (if available) */
    item def FusedContact {
        attribute contactID         : String;
        attribute radarTrack        : RadarTrack;
        attribute aisData           : AISData;   // may be null if no AIS match
        attribute identified        : Boolean;
        attribute correlationScore  : Real;      // Association quality 0.0–1.0
        attribute classification    : String;    // "MERCHANT" | "NAVAL" | "FISHING" | "UNKNOWN"
        attribute timestamp         : Real;
    }

    /** Alert or alarm generated by the system */
    item def AlertMessage {
        attribute alertID           : String;
        attribute alertType         : String;   // "CPA" | "TCPA" | "LOST_TRACK" | "NEW_CONTACT" | "GUARD_ZONE"
        attribute targetID          : String;
        attribute severity          : String;   // "WARNING" | "ALARM"
        attribute audioVisual       : Boolean;
        attribute message           : String;
        attribute timestamp         : Real;
    }

    /** NMEA-0183 / IEC 61162-1 sentence for external system output */
    item def NMEASentence {
        attribute talkerID          : String;   // "RA" for radar
        attribute sentenceType      : String;   // "TTM" | "TLL" | "RSD" | "OSD"
        attribute payload           : String;
        attribute checksum          : String;
        attribute timestamp         : Real;
    }

    // =========================================================
    //  PART DEFINITIONS  (hardware/software components)
    // =========================================================

    /** Rotating parabolic or slotted waveguide antenna */
    part def Antenna {
        attribute type              : String = "SLOTTED_WAVEGUIDE";
        attribute rotationRPM       : Real  = 24.0;    // 20–40 RPM typical
        attribute beamwidthHorizDeg : Real  = 1.8;     // Horizontal -3dB beamwidth
        attribute beamwidthVertDeg  : Real  = 20.0;    // Vertical beamwidth
        attribute gainDBi           : Real  = 31.0;
        attribute sidelobe_dB       : Real  = -26.0;
        attribute polarization      : String = "HORIZONTAL";
        attribute lengthM           : Real;            // Physical antenna length
    }

    /** Magnetron or solid-state transceiver */
    part def Transceiver {
        attribute txType            : String;   // "MAGNETRON" | "SOLID_STATE"
        attribute peakPowerKW       : Real;     // Magnetron: 25kW / SS: 0.1–4kW
        attribute noiseFiguredB     : Real;     // Receiver NF (typ. 8–10 dB)
        attribute IFFrequencyMHz    : Real;     // IF centre frequency
        attribute IFBandwidthMHz    : Real;     // IF bandwidth
        attribute duplexerType      : String;   // "FERRITE" | "PIN_DIODE"
        attribute txPulseRiseNs     : Real;     // Pulse rise time (ns)
    }

    /** Digital signal processing unit */
    part def SignalProcessor {
        attribute ADCBits           : Integer = 16;
        attribute samplingRateMHz   : Real;
        attribute FFTSize           : Integer = 1024;
        attribute CFARType          : String;   // "CA-CFAR" | "OS-CFAR" | "GO-CFAR"
        attribute clutterMapSize    : Integer;  // Range-azimuth cells in clutter map
        attribute processingLanes   : Integer = 4; // Parallel DSP lanes
    }

    /** ARPA (Automatic Radar Plotting Aid) per IMO Res. MSC.192(79) */
    part def ARPAProcessor {
        attribute maxTracks         : Integer = 100;
        attribute trackInitPlots    : Integer = 3;    // Plots needed to initialise track
        attribute trackDropFrames   : Integer = 5;    // Missed scans before track drop
        attribute assocGateNM       : Real    = 0.5;  // Association gate radius
        attribute filterType        : String  = "ALPHA_BETA"; // or "KALMAN"
        attribute predictionInterv  : Real;           // Prediction interval (s)
    }

    /** Dual-channel AIS VHF receiver */
    part def AISReceiver {
        attribute ch1FreqMHz        : Real   = 161.975;
        attribute ch2FreqMHz        : Real   = 162.025;
        attribute maxMsgRate        : Integer = 2000;  // messages/min
        attribute sensitivity_dBm   : Real   = -107.0;
        attribute decoderType       : String = "SOTDMA";
    }

    /** Multi-source sensor fusion engine */
    part def FusionEngine {
        attribute method            : String;   // "KALMAN" | "PARTICLE" | "IMM"
        attribute gatingThreshold   : Real;
        attribute maxSensors        : Integer = 8;
        attribute updateRateHz      : Real;
    }

    /** Radar and chart display */
    part def DisplayUnit {
        attribute screenSizeIn      : Real;
        attribute resolutionPx      : String;   // e.g. "1280x1024"
        attribute displayMode       : String;   // "HEAD-UP" | "NORTH-UP" | "COURSE-UP"
        attribute paletteName       : String;   // Color palette
        attribute overlayECDIS      : Boolean = true;
    }

    // =========================================================
    //  INTERFACE DEFINITIONS
    // =========================================================

    interface def RadarSerialInterface {
        attribute protocol          : String;   // "NMEA-0183" | "IEC-61162-450"
        attribute baudRate          : Integer;  // 4800 or 38400 baud
        attribute connector         : String;   // "RS-422" | "RS-232"
    }

    interface def NetworkInterface {
        attribute ipAddress         : String;
        attribute port              : Integer;
        attribute transport         : String;   // "UDP" | "TCP" | "MULTICAST"
        attribute encodingFormat    : String;   // "ASTERIX" | "NMEA" | "JSON"
    }

    interface def DataLinkInterface {
        attribute linkType          : String;   // "LINK-16" | "LINK-11" | "VMF" | "BFT"
        attribute frequencyMHz      : Real;
        attribute dataRateKbps      : Real;
        attribute encryption        : String;   // "KG-175" | "KIV-7" | "NONE"
    }

}
