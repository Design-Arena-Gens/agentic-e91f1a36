'use client';

import { nanoid } from 'nanoid';
import { useState } from 'react';

import { useDmsStore } from '@/lib/store';
import { WorkflowStage, WorkflowTemplate } from '@/lib/types';

const defaultStandards = ['21 CFR Part 11', 'ISO 9001', 'ICH Q7', 'GMP'];

interface StageDraft {
  name: string;
  role: string;
  instructions: string;
  requiresSignature: boolean;
}

export const WorkflowDesigner = () => {
  const {
    state: { workflowTemplates },
    dispatch
  } = useDmsStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [standards, setStandards] = useState<string[]>(['21 CFR Part 11']);
  const [stageDraft, setStageDraft] = useState<StageDraft>({
    name: '',
    role: '',
    instructions: '',
    requiresSignature: true
  });
  const [stages, setStages] = useState<WorkflowStage[]>([]);

  const resetDraft = () => {
    setStageDraft({ name: '', role: '', instructions: '', requiresSignature: true });
  };

  const addStage = () => {
    if (!stageDraft.name || !stageDraft.role) return;
    setStages((current) => [
      ...current,
      {
        id: `stage-${nanoid(6)}`,
        name: stageDraft.name,
        role: stageDraft.role,
        instructions: stageDraft.instructions || 'Follow SOP to validate controls.',
        requiresSignature: stageDraft.requiresSignature
      }
    ]);
    resetDraft();
  };

  const removeStage = (id: string) => setStages((current) => current.filter((stage) => stage.id !== id));

  const toggleStandard = (value: string) => {
    setStandards((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const handleCreate = () => {
    if (!name || stages.length === 0) return;
    const template: WorkflowTemplate = {
      id: `wf-${nanoid(6)}`,
      name,
      description: description || 'Custom workflow created in DocumentManagement.',
      compliantStandards: standards,
      stages
    };
    dispatch({ type: 'CREATE_WORKFLOW_TEMPLATE', payload: template });
    setName('');
    setDescription('');
    setStandards(['21 CFR Part 11']);
    setStages([]);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Workflow Automation</p>
          <h3 className="text-lg font-semibold text-slate-900">Configurable Review & Approval</h3>
        </div>
        <span className="text-xs text-slate-500">Templates active: {workflowTemplates.length}</span>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g., QA Double Review"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Define objective and regulatory linkage"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </label>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Standards</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {defaultStandards.map((standard) => {
                const active = standards.includes(standard);
                return (
                  <button
                    key={standard}
                    onClick={() => toggleStandard(standard)}
                    className={`rounded-full border px-3 py-1 ${
                      active
                        ? 'border-primary-200 bg-primary-50 text-primary-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {standard}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Add Stage</p>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <input
                value={stageDraft.name}
                onChange={(event) => setStageDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Stage name"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
              <input
                value={stageDraft.role}
                onChange={(event) => setStageDraft((current) => ({ ...current, role: event.target.value }))}
                placeholder="Responsible role"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
              <textarea
                value={stageDraft.instructions}
                onChange={(event) => setStageDraft((current) => ({ ...current, instructions: event.target.value }))}
                placeholder="Instructions"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={stageDraft.requiresSignature}
                  onChange={(event) =>
                    setStageDraft((current) => ({ ...current, requiresSignature: event.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
                />
                Requires Part 11 signature
              </label>
              <button
                onClick={addStage}
                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow"
              >
                Add Stage
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow Preview</p>
        <ol className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
          {stages.map((stage, index) => (
            <li key={stage.id} className="flex flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-800">
                {index + 1}. {stage.name}
              </p>
              <p className="text-xs text-slate-500">Role: {stage.role}</p>
              <p className="text-xs text-slate-600">{stage.instructions}</p>
              <p className="text-xs text-slate-500">Signature required: {stage.requiresSignature ? 'Yes' : 'No'}</p>
              <button
                onClick={() => removeStage(stage.id)}
                className="self-start rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600"
              >
                Remove stage
              </button>
            </li>
          ))}
          {stages.length === 0 && (
            <li className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
              Add stages to compose the workflow sequence.
            </li>
          )}
        </ol>
      </div>

      <button
        onClick={handleCreate}
        disabled={!name || stages.length === 0}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Publish Workflow Template
      </button>
    </section>
  );
};
