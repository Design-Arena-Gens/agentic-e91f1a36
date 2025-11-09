'use client';

import { ActivitySquare, BookOpenCheck, Clock } from 'lucide-react';

import { useDmsStore } from '@/lib/store';
import { formatDisplayDate } from '@/lib/utils';

export const AuditTrail = () => {
  const {
    state: { auditTrail }
  } = useDmsStore();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
            <ActivitySquare className="h-5 w-5" />
          </span>
          Audit Trail
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Part 11 compliant entries
        </span>
      </header>

      <ol className="mt-4 space-y-4">
        {auditTrail.slice(0, 8).map((entry) => (
          <li key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${entry.signatureCaptured ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <div className="h-full w-px flex-1 bg-slate-200" />
            </div>
            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-600">
                <span className="text-slate-700">{entry.action}</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="h-3.5 w-3.5" /> {formatDisplayDate(entry.timestamp)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {entry.actor} • {entry.actorRole} • Target: {entry.target}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                {Object.entries(entry.context).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
                    <dt className="text-[10px] uppercase tracking-wide text-slate-400">{key}</dt>
                    <dd className="text-xs font-semibold text-slate-700">{String(value)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.regulatoryMapping.map((reg) => (
                  <span key={reg} className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary-700">
                    <BookOpenCheck className="h-3 w-3" />
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
        {auditTrail.length === 0 && (
          <li className="text-sm text-slate-500">Audit trail will populate as actions are recorded.</li>
        )}
      </ol>
    </section>
  );
};
