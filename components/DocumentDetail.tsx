'use client';

import {
  BadgeCheck,
  CalendarCheck2,
  ClipboardSignature,
  Flag,
  Layers3,
  Lock,
  PenLine,
  ShieldCheck,
  TimerReset
} from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';

import { useDmsStore } from '@/lib/store';
import { ElectronicSignature, WorkflowTemplate } from '@/lib/types';
import {
  enrichDocument,
  formatDisplayDate,
  lifecycleColor,
  resolveStandardStyle,
  statusBadgeStyles
} from '@/lib/utils';

const computeStatusForStage = (stageIndex: number, stages: number): { status: string; label: string } => {
  if (stageIndex >= stages) return { status: 'Effective', label: 'Workflow Complete' };
  if (stageIndex === 0) return { status: 'Draft', label: 'Drafting' };
  if (stageIndex === stages - 1) return { status: 'Pending Release', label: 'Release Preparation' };
  if (stageIndex === stages - 2) return { status: 'Pending QA Approval', label: 'QA Approval' };
  return { status: 'Under Review', label: 'Review' };
};

const findSignatureForStage = (signatures: ElectronicSignature[], stageId: string) =>
  signatures.find((signature) => signature.stageId === stageId);

export const DocumentDetail = () => {
  const {
    state: { documents, documentTypes, workflowTemplates, highlightedDocumentId, users, activeUserId },
    dispatch
  } = useDmsStore();

  const activeUser = users.find((user) => user.id === activeUserId);

  const selected = useMemo(() => documents.find((doc) => doc.id === highlightedDocumentId) ?? documents[0], [
    documents,
    highlightedDocumentId
  ]);

  const enriched = useMemo(() => enrichDocument(selected, documentTypes, workflowTemplates), [
    selected,
    documentTypes,
    workflowTemplates
  ]);

  const stages = enriched.workflow?.stages ?? [];
  const stageInProgress = enriched.currentStageIndex < stages.length ? stages[enriched.currentStageIndex] : undefined;
  const workflowComplete = enriched.currentStageIndex >= stages.length;

  const [signatureRationale, setSignatureRationale] = useState('');
  const [signaturePin, setSignaturePin] = useState('');
  const [changeSummary, setChangeSummary] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [newEffectiveDate, setNewEffectiveDate] = useState('');

  if (!enriched) {
    return (
      <section className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
        <p className="text-sm text-slate-500">Select a document to review its lifecycle and compliance metadata.</p>
      </section>
    );
  }

  const currentStageSignature = stageInProgress
    ? findSignatureForStage(enriched.signatures, stageInProgress.id)
    : undefined;

  const canCaptureSignature = Boolean(
    stageInProgress &&
      stageInProgress.requiresSignature &&
      activeUser?.canSign &&
      stageInProgress.role === activeUser.role &&
      !currentStageSignature
  );

  const canProgress = Boolean(
    activeUser &&
      stageInProgress &&
      stageInProgress.role === activeUser.role &&
      (!stageInProgress.requiresSignature || Boolean(currentStageSignature))
  );

  const allowArchive = enriched.status === 'Superseded' ? false : Boolean(activeUser?.role === 'System Administrator');

  const handleSignature = () => {
    if (!stageInProgress || !activeUser) return;
    if (signaturePin.trim().length < 6) return;

    dispatch({
      type: 'ADD_SIGNATURE',
      documentId: enriched.id,
      signature: {
        stageId: stageInProgress.id,
        signedBy: activeUser.name,
        signedByRole: activeUser.role,
        rationale: signatureRationale || 'Reviewed and confirmed.',
        signedAt: new Date().toISOString()
      }
    });

    setSignaturePin('');
    setSignatureRationale('');
  };

  const handleProgress = () => {
    if (!activeUser) return;

    const nextStageIndex = stageInProgress ? enriched.currentStageIndex + 1 : enriched.currentStageIndex;
    const statusInfo = computeStatusForStage(nextStageIndex, stages.length);

    dispatch({
      type: 'PROGRESS_WORKFLOW',
      documentId: enriched.id,
      nextStageIndex,
      status: statusInfo.status as typeof enriched.status,
      actor: activeUser.name,
      actorRole: activeUser.role,
      comment: signatureRationale
    });
  };

  const handleArchive = () => {
    if (!activeUser) return;
    dispatch({
      type: 'ARCHIVE_DOCUMENT',
      documentId: enriched.id,
      changeSummary: changeSummary || 'Archived per administrator action',
      actor: activeUser.name,
      actorRole: activeUser.role
    });
    setChangeSummary('');
  };

  const handleCreateVersion = () => {
    if (!activeUser || !newVersion || !newEffectiveDate) return;
    dispatch({
      type: 'ADD_DOCUMENT_VERSION',
      documentId: enriched.id,
      version: {
        version: newVersion,
        effectiveFrom: newEffectiveDate,
        signedOffBy: activeUser.name,
        signedOffRole: activeUser.role,
        changeSummary: changeSummary || 'Version created via DocumentManagement DMS.'
      }
    });
    setNewVersion('');
    setNewEffectiveDate('');
    setChangeSummary('');
  };

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Document Lifecycle</p>
          <h2 className="text-2xl font-semibold text-slate-900">{enriched.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{enriched.number}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[enriched.status] ?? ''}`}
            >
              {enriched.status}
            </span>
            <span className={`font-semibold ${lifecycleColor[enriched.lifecycleState]}`}>Lifecycle: {enriched.lifecycleState}</span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
              Version {enriched.version}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-sm text-slate-500">
          <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            21 CFR Part 11 • ISO 9001 • GMP Ready
          </span>
          <p>Effective from {formatDisplayDate(enriched.effectiveFrom)}</p>
          <p>Next issue {formatDisplayDate(enriched.nextIssueDate)}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <InformationCard title="Metadata" icon={<Layers3 className="h-4 w-4" />}>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm text-slate-600 sm:grid-cols-2">
            <Item label="Document Type" value={enriched.type?.type ?? '—'} />
            <Item label="Category" value={enriched.category} />
            <Item label="Security" value={enriched.security} />
            <Item label="Issued By" value={`${enriched.issuedBy || '—'} ${enriched.issuerRole ? `(${enriched.issuerRole})` : ''}`} />
            <Item label="Created" value={`${formatDisplayDate(enriched.dateCreated)} · ${enriched.createdBy}`} />
            <Item label="Workflow" value={enriched.workflow?.name ?? '—'} />
          </dl>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Linked Standards</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {enriched.linkedStandards.map((standard) => (
                <span key={standard} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${resolveStandardStyle(standard)}`}>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {standard}
                </span>
              ))}
            </div>
          </div>
        </InformationCard>

        <InformationCard title="Workflow Controls" icon={<ClipboardSignature className="h-4 w-4" />}>
          <p className="text-sm text-slate-600">
            {workflowComplete
              ? 'Workflow complete. Document is Effective and available for controlled distribution.'
              : stageInProgress
              ? `${stageInProgress.name} • Role: ${stageInProgress.role}`
              : 'Workflow in configuration. Awaiting next action.'}
          </p>
          {stageInProgress && (
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stage Instructions</p>
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">{stageInProgress.instructions}</p>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Flag className="h-4 w-4 text-primary-600" /> Stage {enriched.currentStageIndex + 1} of {stages.length}
              </p>
            </div>
          )}
          {stageInProgress?.requiresSignature && (
            <p className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              <Lock className="h-4 w-4" /> Electronic signature required per 21 CFR Part 11.
            </p>
          )}

          {stageInProgress && (
            <div className="mt-4 space-y-3">
              <textarea
                value={signatureRationale}
                onChange={(event) => setSignatureRationale(event.target.value)}
                placeholder="Approval rationale / review comment"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              {stageInProgress.requiresSignature && (
                <input
                  type="password"
                  value={signaturePin}
                  onChange={(event) => setSignaturePin(event.target.value)}
                  placeholder="Enter Part 11 compliant passcode (min 6 characters)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSignature}
                  disabled={!canCaptureSignature || signaturePin.trim().length < 6}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <PenLine className="h-4 w-4" /> Capture e-Signature
                </button>
                <button
                  onClick={handleProgress}
                  disabled={!canProgress}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <CalendarCheck2 className="h-4 w-4" /> Advance Workflow
                </button>
              </div>
            </div>
          )}
        </InformationCard>

        <InformationCard title="Version Control" icon={<TimerReset className="h-4 w-4" />}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Current Version</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{enriched.version}</p>
              <p className="text-xs text-slate-500">Effective {formatDisplayDate(enriched.effectiveFrom)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Create New Version</p>
              <input
                value={newVersion}
                onChange={(event) => setNewVersion(event.target.value)}
                placeholder="Version identifier (e.g., 1.2)"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <input
                type="date"
                value={newEffectiveDate}
                onChange={(event) => setNewEffectiveDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <textarea
                value={changeSummary}
                onChange={(event) => setChangeSummary(event.target.value)}
                placeholder="Change summary / impact assessment"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCreateVersion}
                disabled={!newVersion || !newEffectiveDate}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <BadgeCheck className="h-4 w-4" /> Promote Version
              </button>
              <button
                onClick={handleArchive}
                disabled={!allowArchive}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Lock className="h-4 w-4" /> Archive Record
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Version History</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {enriched.previousVersions.map((version) => (
                <li key={version.version} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                    <span>Version {version.version}</span>
                    <span>{formatDisplayDate(version.effectiveFrom)}</span>
                  </div>
                  <p className="text-xs text-slate-500">Signed off by {version.signedOffBy} ({version.signedOffRole})</p>
                  <p className="mt-1 text-xs text-slate-600">{version.changeSummary}</p>
                </li>
              ))}
              {enriched.previousVersions.length === 0 && (
                <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                  No historical versions yet. Promote a version to establish controlled history.
                </li>
              )}
            </ul>
          </div>
        </InformationCard>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Electronic Signatures</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {stages.map((stage, index) => {
            const signature = findSignatureForStage(enriched.signatures, stage.id);
            const isCompleted = index < enriched.currentStageIndex;
            return (
              <div
                key={stage.id}
                className={`flex min-w-[15rem] flex-1 flex-col gap-2 rounded-xl border p-3 text-sm ${
                  signature ? 'border-emerald-200 bg-emerald-50' : isCompleted ? 'border-slate-200 bg-white' : 'border-dashed border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{stage.name}</span>
                  <span className="text-xs text-slate-500">Role: {stage.role}</span>
                </div>
                <p className="text-xs text-slate-500">Requires signature: {stage.requiresSignature ? 'Yes' : 'No'}</p>
                {signature ? (
                  <div className="rounded-lg border border-emerald-200 bg-white p-2 text-xs text-slate-600">
                    <p className="font-semibold text-emerald-600">Signed by {signature.signedBy}</p>
                    <p className="text-slate-500">{signature.signedByRole}</p>
                    <p>{signature.rationale}</p>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-2 text-xs text-slate-500">
                    {!stage.requiresSignature
                      ? 'Stage does not require electronic sign-off.'
                      : 'Awaiting compliant Part 11 signature.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const InformationCard = ({ children, title, icon }: { children: ReactNode; title: string; icon: ReactNode }) => (
  <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
        {icon}
      </span>
      {title}
    </div>
    <div className="mt-4 text-sm text-slate-600">{children}</div>
  </div>
);

const Item = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
    <dd className="text-sm text-slate-700">{value || '—'}</dd>
  </div>
);
