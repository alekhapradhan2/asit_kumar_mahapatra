'use client';
import { useParams } from 'next/navigation';
import ECourtsCasePage from '@/components/shared/ECourtsCasePage';

export default function ClientECourtsCaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  return (
    <ECourtsCasePage
      caseId={caseId}
      backUrl={`/client/cases/${caseId}`}
      backLabel="Back to Case Timeline"
      userRole="CLIENT"
    />
  );
}
