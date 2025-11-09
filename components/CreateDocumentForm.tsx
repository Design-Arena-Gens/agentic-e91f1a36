'use client';

import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

import { useDmsStore } from '@/lib/store';
import { DocumentRecord } from '@/lib/types';

const categories = ['Quality', 'Manufacturing', 'Safety', 'Clinical', 'Supply Chain', 'Validation', 'Laboratory', 'Training'];
const securityLevels = ['Confidential', 'Internal', 'Restricted', 'Public'];

export const CreateDocumentForm = () => {
  const {
    state: { documentTypes, workflowTemplates, users, activeUserId },
    dispatch
  } = useDmsStore();

  const activeUser = users.find((user) => user.id === activeUserId);

  const [form, setForm] = useState({
    title: '',
    number: '',
    version: '0.1-draft',
    typeId: documentTypes[0]?.id ?? '',
    workflowId: workflowTemplates[0]?.id ?? '',
    category: categories[0],
    security: securityLevels[0],
    dateOfIssue: '',
    effectiveFrom: '',
    nextIssueDate: '',
    issuerRole: activeUser?.role ?? ''
  });

  const handleChange = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const canSubmit = Boolean(form.title && form.number && form.typeId && form.workflowId);

  const handleSubmit = () => {
    if (!canSubmit || !activeUser) return;
    const id = `doc-${Math.random().toString(36).slice(2, 8)}`;
    const payload: DocumentRecord = {
      id,
      title: form.title,
      number: form.number,
      workflowId: form.workflowId,
      currentStageIndex: 0,
      version: form.version,
      previousVersions: [],
      dateCreated: new Date().toISOString(),
      createdBy: activeUser.name,
      category: form.category as DocumentRecord['category'],
      typeId: form.typeId,
      security: form.security as DocumentRecord['security'],
      dateOfIssue: form.dateOfIssue,
      issuedBy: activeUser.name,
      issuerRole: form.issuerRole || activeUser.role,
      effectiveFrom: form.effectiveFrom,
      nextIssueDate: form.nextIssueDate,
      issuedToSites: [],
      status: 'Draft',
      linkedStandards: ['21 CFR Part 11'],
      tags: [],
      relatedDocuments: [],
      signatures: [],
      lifecycleState: 'Draft',
      contentSummary: 'New controlled document created in DocumentManagement DMS.'
    };

    dispatch({ type: 'CREATE_DOCUMENT', payload });
    setForm({
      title: '',
      number: '',
      version: '0.1-draft',
      typeId: documentTypes[0]?.id ?? '',
      workflowId: workflowTemplates[0]?.id ?? '',
      category: categories[0],
      security: securityLevels[0],
      dateOfIssue: '',
      effectiveFrom: '',
      nextIssueDate: '',
      issuerRole: activeUser.role
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
          <PlusCircle className="h-5 w-5" />
        </span>
        Create Controlled Document
      </header>
      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</span>
          <input
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            placeholder="Document Title"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Document Number</span>
          <input
            value={form.number}
            onChange={(event) => handleChange('number', event.target.value)}
            placeholder="e.g., QMS-SOP-034"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Version</span>
          <input
            value={form.version}
            onChange={(event) => handleChange('version', event.target.value)}
            placeholder="0.1-draft"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Type</span>
          <select
            value={form.typeId}
            onChange={(event) => handleChange('typeId', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow</span>
          <select
            value={form.workflowId}
            onChange={(event) => handleChange('workflowId', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {workflowTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</span>
          <select
            value={form.category}
            onChange={(event) => handleChange('category', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Security</span>
          <select
            value={form.security}
            onChange={(event) => handleChange('security', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {securityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date of Issue</span>
          <input
            type="date"
            value={form.dateOfIssue}
            onChange={(event) => handleChange('dateOfIssue', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Effective From</span>
          <input
            type="date"
            value={form.effectiveFrom}
            onChange={(event) => handleChange('effectiveFrom', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Next Issue Date</span>
          <input
            type="date"
            value={form.nextIssueDate}
            onChange={(event) => handleChange('nextIssueDate', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Issuer Role</span>
          <input
            value={form.issuerRole}
            onChange={(event) => handleChange('issuerRole', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <PlusCircle className="h-4 w-4" /> Register Document
      </button>
    </section>
  );
};
