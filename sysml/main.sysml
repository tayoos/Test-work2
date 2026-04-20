/**
 * main.sysml
 *
 * SysML v2 Top-Level System Composition
 * Combined Naval Radar & Hybrid Navy System
 *
 * Composes the two top-level activities into a single concurrent system:
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │                  CombinedNavalRadarSystem                       │
 *   │                                                                 │
 *   │   systemFork ──┬──► RadarIngestionActivity ────────┐           │
 *   │                │      (sequential pipeline)        ├─ systemJoin│
 *   │                └──► HybridNavyParallelActivity ────┘           │
 *   │                       (4 parallel branches)                     │
 *   │                                                                 │
 *   │   systemJoin → loop (continuous scan cycle)                     │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Radar Ingestion Activity stages:
 *   1  SystemInitialization      Power-on, band select, self-test
 *   2  PulseTransmission         Trigger → Modulate → Amplify → Radiate
 *   3  EchoReception             LNA → Down-convert → Log-amp → ADC
 *   4  SignalProcessing          STC ║ FTC → CA-CFAR → Doppler MTI
 *   5  PlotExtraction            Threshold → Centroid → Range/Bearing
 *   6  ARPATracking              Assoc → α-β filter → CPA/TCPA
 *   7  AISIntegration            VHF decode → geo-correlate → merge
 *   8  AlertAndOutput            NMEA ║ PPI ║ Alarms (parallel)
 *
 * Hybrid Navy Parallel Activity branches (all run concurrently):
 *   B1 UxVSensorIngestion        USV / UAV / UUV telemetry decode
 *   B2 ElectronicWarfareProcessing  ESM intercept → emitter ID → ECM
 *   B3 AIThreatClassification    CNN-LSTM inference → behaviour analysis
 *   B4 TacticalDataLinkProcessing   Link-16 ingest / contribute
 *       ↓ (all four join)
 *   MultiSensorFusion            Dempster-Shafer weighted evidence fusion
 *   CombatManagementSystem       Threat priority → weapon assignment → ROE
 *   NetworkCentricBroadcast      Fleet ║ ShoreHQ ║ Cloud (parallel)
 */

package CombinedNavalRadarSystem {

    import RadarSystemBlocks::*;
    import RadarIngestionWorkflow::*;
    import HybridNavyParallelFlow::*;

    // =========================================================
    //  SYSTEM-LEVEL BLOCK
    // =========================================================

    /**
     * Physical block representing the complete integrated sensor suite
     * aboard a Hybrid Navy surface combatant.
     */
    part def NavalSensorSuite {

        // ── Radar subsystem ────────────────────────────────────────────────
        part xBandAntenna       : Antenna {
            attribute rotationRPM   = 24.0;
            attribute beamwidthHorizDeg = 1.8;
        }
        part sBandAntenna       : Antenna {
            attribute rotationRPM   = 15.0;   // S-band rotates slower
            attribute beamwidthHorizDeg = 4.0;
        }
        part transceiver        : Transceiver;
        part signalProcessor    : SignalProcessor;
        part arpaProcessor      : ARPAProcessor;
        part aisReceiver        : AISReceiver;
        part fusionEngine       : FusionEngine;
        part display            : DisplayUnit;

        // ── Hybrid Navy subsystem ──────────────────────────────────────────
        part uxvControlStation  : UxVControlBlock;
        part esmReceiver        : ESMReceiverBlock;
        part aiProcessor        : AIProcessorBlock;
        part tdlTerminal        : TDLTerminalBlock;
        part cmsUnit            : CMSBlock;
        part satcomTerminal     : SATCOMBlock;
    }

    // Supporting block definitions for Hybrid Navy hardware
    part def UxVControlBlock {
        attribute maxUxVUnits   : Integer = 8;
        attribute linkType      : String  = "RF_DATALINK";
        attribute encryptionType : String = "AES-256";
    }

    part def ESMReceiverBlock {
        attribute freqCovGHz    : String = "0.5-18";
        attribute dfAccuracyDeg : Real   = 2.0;
        attribute sensitivity_dBm : Real = -90.0;
    }

    part def AIProcessorBlock {
        attribute gpuCores      : Integer = 5120;
        attribute tflops        : Real    = 40.0;
        attribute modelFormat   : String  = "ONNX";
        attribute inferenceMs   : Real    = 50.0;
    }

    part def TDLTerminalBlock {
        attribute terminalType  : String = "MIDS-LVT";
        attribute frequencyMHz  : Real   = 969.0;
        attribute encryption    : String = "KG-175D";
    }

    part def CMSBlock {
        attribute cmsVersion    : String;
        attribute maxTracks     : Integer = 2000;
        attribute humanInLoop   : Boolean = true;
    }

    part def SATCOMBlock {
        attribute bands         : String = "SHF/EHF/L";
        attribute backupPath    : String = "IRIDIUM";
        attribute dataRateKbps  : Real   = 2048.0;
    }

    // =========================================================
    //  TOP-LEVEL COMBINED ACTIVITY
    // =========================================================

    /**
     * CombinedNavalRadarSystem is the root activity.
     *
     * Execution model:
     *   • On startup:  systemFork forks two concurrent streams.
     *   • RadarIngestionActivity runs its one-time init then loops
     *     through stages 2–8 every antenna revolution (~2 s).
     *   • HybridNavyParallelActivity receives FusedContact output
     *     from the radar pipeline and processes it in 4 parallel
     *     branches, then fuses, submits to CMS, and broadcasts.
     *   • systemJoin synchronises both activities at the end of each
     *     combined cycle before restarting.
     *
     * Timing (typical values):
     *   Antenna revolution period:      2.5 s  (24 RPM)
     *   Radar stages 2–8 latency:      ~200 ms
     *   Hybrid branch processing:      ~300 ms (GPU-accelerated AI)
     *   CMS directive generation:      ~100 ms
     *   Network broadcast:             ~500 ms (fleet SATCOM round-trip)
     *   Total combined cycle time:     ~2.5 s  (antenna-limited)
     */
    activity CombinedNavalRadarSystemActivity {

        // System inputs
        in  operatorConfig      : RadarConfiguration;

        // System outputs
        out radarContact        : FusedContact;
        out broadcastPacket     : FleetBroadcastPacket;
        out engagementDirective : CMSDirective;

        // ── Stream A: Radar Ingestion ──────────────────────────────────────
        action radarIngestion   : RadarIngestionActivity;

        // ── Stream B: Hybrid Navy Processing ──────────────────────────────
        action hybridNavy       : HybridNavyParallelActivity;

        // Fork and Join control nodes
        fork  systemFork;
        join  systemJoin;

        // Data flows
        flow from operatorConfig                to radarIngestion;
        flow from radarIngestion.finalContact   to hybridNavy.radarContact;
        flow from radarIngestion.finalContact   to radarContact;
        flow from hybridNavy.broadcastPkt       to broadcastPacket;
        flow from hybridNavy.cmsDirective       to engagementDirective;

        // Control flow: fork both activities, join when both complete
        then systemFork;
        flow from systemFork to radarIngestion;
        flow from systemFork to hybridNavy;
        flow from radarIngestion to systemJoin;
        flow from hybridNavy     to systemJoin;
        then systemJoin;

        // Continuous operational loop
        then systemFork;
    }

    // =========================================================
    //  INTERFACE CONNECTIONS
    // =========================================================

    /**
     * Defines how the NavalSensorSuite hardware components connect to the
     * logical activities in the system.
     */
    connection def RadarToSignalProcessorConn {
        end antennaPort     : Antenna;
        end transceiverPort : Transceiver;
    }

    connection def SignalProcessorToARPAConn {
        end dspPort  : SignalProcessor;
        end arpaPort : ARPAProcessor;
    }

    connection def ARPAToFusionConn {
        end arpaPort    : ARPAProcessor;
        end aisPort     : AISReceiver;
        end fusionPort  : FusionEngine;
    }

    connection def FusionToDisplayConn {
        end fusionPort  : FusionEngine;
        end displayPort : DisplayUnit;
        attribute interface : NetworkInterface;
    }

    connection def FusionToCMSConn {
        end fusionPort : FusionEngine;
        end cmsPort    : CMSBlock;
        attribute interface : NetworkInterface {
            attribute transport = "UDP";
            attribute encodingFormat = "ASTERIX";
        }
    }

    connection def CMSToTDLConn {
        end cmsPort : CMSBlock;
        end tdlPort : TDLTerminalBlock;
        attribute interface : DataLinkInterface {
            attribute linkType = "LINK-16";
        }
    }

}
