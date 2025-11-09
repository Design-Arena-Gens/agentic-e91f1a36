import { AuditTrail } from '@/components/AuditTrail';
import { ComplianceSnapshot } from '@/components/ComplianceSnapshot';
import { CreateDocumentForm } from '@/components/CreateDocumentForm';
import { DocumentDetail } from '@/components/DocumentDetail';
import { DocumentFilters } from '@/components/DocumentFilters';
import { DocumentList } from '@/components/DocumentList';
import { TopNav } from '@/components/TopNav';
import { WorkflowDesigner } from '@/components/WorkflowDesigner';

export default function Home() {
  return (
    <main className="space-y-6 pb-10">
      <TopNav />
      <DocumentFilters />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CreateDocumentForm />
          <div className="mt-6">
            <ComplianceSnapshot />
          </div>
          <div className="mt-6">
            <WorkflowDesigner />
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <DocumentList />
          <DocumentDetail />
          <AuditTrail />
        </div>
      </div>
    </main>
  );
}
