'use client';

import { ListChecks, ShieldCheck, UserCircle2, Workflow } from 'lucide-react';
import { useMemo } from 'react';

import { useDmsStore } from '@/lib/store';
import { statusBadgeStyles } from '@/lib/utils';

export const TopNav = () => {
  const {
    state: { users, activeUserId, documents },
    dispatch
  } = useDmsStore();

  const metrics = useMemo(() => {
    const total = documents.length;
    const effective = documents.filter((doc) => doc.status === 'Effective').length;
    const underReview = documents.filter((doc) => doc.status === 'Under Review').length;
    const superseded = documents.filter((doc) => doc.status === 'Superseded').length;

    return {
      total,
      effective,
      underReview,
      superseded,
      complianceScore: Math.min(100, Math.round(((effective + underReview) / Math.max(total, 1)) * 100))
    };
  }, [documents]);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Pharma DMS</p>
          <h1 className="text-xl font-semibold text-slate-900">DocumentManagement Compliance Hub</h1>
          <p className="text-sm text-slate-500">21 CFR Part 11 aligned electronic record & signature control</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
          <ListChecks className="h-5 w-5 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Effective Docs</p>
            <p className="text-sm font-semibold text-slate-800">
              {metrics.effective} of {metrics.total}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2">
          <Workflow className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-xs text-primary-600">In Workflow</p>
            <p className="text-sm font-semibold text-primary-700">{metrics.underReview}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-600">Compliance Readiness</p>
            <p className="text-sm font-semibold text-emerald-700">{metrics.complianceScore}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <UserCircle2 className="h-8 w-8 text-primary-600" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Acting As</p>
            <select
              value={activeUserId}
              onChange={(event) => dispatch({ type: 'SET_ACTIVE_USER', userId: event.target.value })}
              className="w-48 rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export const StatusPill = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[status] ?? ''}`}>
    {status}
  </span>
);
