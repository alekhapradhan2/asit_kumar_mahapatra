// ─────────────────────────────────────────────────────────────────────────────
// Official API Provider Placeholder
//
// This provider is a PLACEHOLDER for future official court API integration.
// It is DISABLED by default and will only be enabled when:
//   1. An official government/court API is legally available
//   2. Proper API credentials are obtained through official channels
//   3. The API key is configured in environment variables
//
// Do NOT implement unauthorized scraping or unofficial API access here.
// Do NOT enable this provider without proper legal authorization.
// ─────────────────────────────────────────────────────────────────────────────

import type { CourtDataProvider, SyncResult } from './CourtDataProvider.interface';
import { env } from '../../config/env';

export class OfficialAPIProvider implements CourtDataProvider {
  readonly name = 'ECOURTS_OFFICIAL_API';
  readonly description =
    'Official eCourts / Government Court Data API (requires authorized API key). ' +
    'Only enabled when ECOURTS_API_KEY environment variable is configured.';

  isAvailable(): boolean {
    // Only available when API key is configured AND provider is enabled
    const enabledProviders = env.ENABLED_COURT_PROVIDERS.split(',').map((p) => p.trim());
    return (
      enabledProviders.includes('ECOURTS_API') &&
      Boolean(process.env.ECOURTS_API_KEY)
    );
  }

  async fetchCaseData(externalRef: string, caseId: string): Promise<SyncResult> {
    if (!this.isAvailable()) {
      return {
        success: false,
        hasChanges: false,
        provider: this.name,
        syncedAt: new Date(),
        error: 'OfficialAPIProvider is not configured. Set ECOURTS_API_KEY and enable via ENABLED_COURT_PROVIDERS.',
      };
    }

    // ─── PLACEHOLDER ─────────────────────────────────────────────────────────
    // When an official API becomes available, implement the fetch logic here.
    // Example:
    //   const response = await fetch(`https://api.ecourts.gov.in/v1/cases/${externalRef}`, {
    //     headers: { 'Authorization': `Bearer ${process.env.ECOURTS_API_KEY}` }
    //   });
    //   const data = await response.json();
    //   return { success: true, hasChanges: true, data: this.mapResponse(data), provider: this.name, syncedAt: new Date() };
    // ─────────────────────────────────────────────────────────────────────────

    return {
      success: false,
      hasChanges: false,
      provider: this.name,
      syncedAt: new Date(),
      error: 'Official API integration not yet implemented for this provider.',
    };
  }
}
