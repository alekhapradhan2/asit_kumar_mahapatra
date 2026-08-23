// ─────────────────────────────────────────────────────────────────────────────
// Court Data Provider Interface
// 
// All court/government data providers must implement this interface.
// This ensures the system can switch between or combine multiple data sources
// without changing the core business logic.
//
// IMPORTANT: Never implement unauthorized scraping or API access here.
// Only authorized, official, or manually-entered data flows through this layer.
// ─────────────────────────────────────────────────────────────────────────────

export interface CaseExternalData {
  caseNumber?: string;
  cnrNumber?: string;
  currentStatus?: string;
  nextHearingDate?: Date | null;
  lastHearingDate?: Date | null;
  courtName?: string;
  judgeDetails?: string;
  caseStage?: string;
  updates?: Array<{
    date: Date;
    description: string;
    type: string;
  }>;
  rawData?: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  hasChanges: boolean;
  data?: CaseExternalData;
  error?: string;
  provider: string;
  syncedAt: Date;
}

export interface CourtDataProvider {
  /** Unique identifier for this provider */
  readonly name: string;

  /** Human-readable description */
  readonly description: string;

  /** Whether this provider is currently enabled and configured */
  isAvailable(): boolean;

  /**
   * Fetch current case data from the external source.
   * @param externalRef - The case reference used by this provider (e.g., CNR number)
   * @param caseId - Internal case ID for logging
   */
  fetchCaseData(externalRef: string, caseId: string): Promise<SyncResult>;
}
