'use client';

import { CheckCircle2, Shield } from 'lucide-react';

import { useDmsStore } from '@/lib/store';

const frameworks = [
  {
    id: '21cfr11',
    label: '21 CFR Part 11',
    controls: ['Electronic Signatures', 'Audit Trails', 'Access Controls']
  },
  {
    id: 'iso9001',
    label: 'ISO 9001',
    controls: ['Documented Information', 'Change Control', 'Training Records']
  },
  {
    id: 'ichq7',
    label: 'ICH Q7',
    controls: ['Master Formula', 'Production & Control', 'Distribution']
  }
];

export const ComplianceSnapshot = () => {
  const {
    state: { documents }
  } = useDmsStore();

  const effectiveDocuments = documents.filter((doc) => doc.status === 'Effective').length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
          <Shield className="h-5 w-5" />
        </span>
        Regulatory Alignment
      </header>
      <p className="mt-2 text-sm text-slate-500">
        Tracking core compliance pillars across FDA, ISO and GMP frameworks. Effective documents in system: {effectiveDocuments}.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {frameworks.map((framework) => (
          <div key={framework.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">{framework.label}</p>
            <ul className="mt-2 space-y-2 text-xs text-slate-600">
              {framework.controls.map((control) => (
                <li key={control} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {control}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
