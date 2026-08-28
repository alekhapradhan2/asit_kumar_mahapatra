'use client';
import { useParams } from 'next/navigation';
import ECourtsCasePage from '@/components/shared/ECourtsCasePage';

export default function AdminECourtsCaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  return (
    <ECourtsCasePage
      caseId={caseId}
      backUrl="/admin/cases"
      backLabel="Back to Cases Management"
      userRole="ADMIN"
    />
  );
}
