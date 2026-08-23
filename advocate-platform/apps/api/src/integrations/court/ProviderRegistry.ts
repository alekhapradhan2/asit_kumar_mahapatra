import type { CourtDataProvider } from './CourtDataProvider.interface';
import { ManualUpdateProvider } from './ManualUpdateProvider';
import { OfficialAPIProvider } from './OfficialAPIProvider';
import { prisma } from '../../config/database';

// ─── Registry ─────────────────────────────────────────────────────────────────

const registeredProviders: CourtDataProvider[] = [
  new ManualUpdateProvider(),
  new OfficialAPIProvider(),
  // Add new providers here as they become available
];

export function getAvailableProviders(): CourtDataProvider[] {
  return registeredProviders.filter((p) => p.isAvailable());
}

export function getProvider(name: string): CourtDataProvider | undefined {
  return registeredProviders.find((p) => p.name === name && p.isAvailable());
}

// ─── Sync Service ─────────────────────────────────────────────────────────────

export async function syncCase(caseId: string, providerName?: string): Promise<void> {
  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: { externalRefs: true },
  });

  if (!caseData) throw new Error(`Case ${caseId} not found`);

  // Get the external reference for this case
  const externalRef = caseData.externalRefs.find(
    (r) => !providerName || r.provider === providerName
  );

  const targetRef = externalRef?.externalRef || caseData.cnrNumber;

  if (!targetRef) {
    await logSync(caseId, providerName || 'MANUAL', 'FAILED', null, 'No external reference (CNR number) configured for this case');
    return;
  }

  const provider = providerName
    ? getProvider(providerName)
    : getAvailableProviders()[0];

  if (!provider) {
    await logSync(caseId, providerName || 'UNKNOWN', 'FAILED', null, 'No available provider found');
    return;
  }

  try {
    const result = await provider.fetchCaseData(targetRef, caseId);

    // Update the external reference record
    await prisma.externalCaseRef.upsert({
      where: { id: externalRef?.id || 'new' },
      create: {
        caseId,
        provider: provider.name,
        externalRef: targetRef,
        lastSyncAt: new Date(),
        syncStatus: result.success ? 'SUCCESS' : 'FAILED',
        lastSuccessAt: result.success ? new Date() : undefined,
        lastError: result.error,
        metadata: result.data as any,
      },
      update: {
        lastSyncAt: new Date(),
        syncStatus: result.success ? 'SUCCESS' : 'FAILED',
        lastSuccessAt: result.success ? new Date() : undefined,
        lastError: result.error,
        metadata: result.data as any,
      },
    });

    await logSync(
      caseId,
      provider.name,
      result.success ? 'SUCCESS' : 'FAILED',
      result.data ? (result.data as any) : null,
      result.error
    );

    // If we got official data with changes, create a timeline entry
    if (result.success && result.hasChanges && result.data) {
      await prisma.caseStatusHistory.create({
        data: {
          caseId,
          status: caseData.currentStatus,
          title: 'Official Court Update Received',
          description: `Data synchronized from ${provider.name}`,
          date: new Date(),
          source: 'OFFICIAL_COURT_DATA',
          isClientVisible: true,
          createdBy: 'SYSTEM',
        },
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown sync error';
    await logSync(caseId, provider.name, 'FAILED', null, errorMsg);
  }
}

async function logSync(
  caseId: string,
  provider: string,
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL',
  changes: unknown,
  error?: string
) {
  await prisma.syncLog.create({
    data: {
      caseId,
      provider,
      syncStatus: status,
      changes: changes ? (changes as any) : undefined,
      error,
    },
  });
}
