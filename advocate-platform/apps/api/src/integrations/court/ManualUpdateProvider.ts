// ─────────────────────────────────────────────────────────────────────────────
// Manual Update Provider
//
// The default provider — always available.
// "Sync" here means the Advocate manually enters official court data.
// All data entered through this provider is labeled as ADVOCATE_UPDATE or
// ADMIN_UPDATE (never falsely labeled as OFFICIAL_COURT_DATA).
//
// This is the ONLY active provider until an authorized official API is
// configured and enabled via environment variables.
// ─────────────────────────────────────────────────────────────────────────────

import type { CourtDataProvider, SyncResult } from './CourtDataProvider.interface';

export class ManualUpdateProvider implements CourtDataProvider {
  readonly name = 'MANUAL';
  readonly description =
    'Manual data entry by Advocate — no automated external sync. ' +
    'Updates are entered directly through the Admin Portal.';

  isAvailable(): boolean {
    // Always available
    return true;
  }

  async fetchCaseData(_externalRef: string, _caseId: string): Promise<SyncResult> {
    // Manual provider does not fetch external data.
    // Data is pushed by the admin, not pulled from an external source.
    return {
      success: true,
      hasChanges: false,
      provider: this.name,
      syncedAt: new Date(),
      data: undefined,
      error: 'Manual provider: no automated sync. Please update case data through the Admin Portal.',
    };
  }
}
