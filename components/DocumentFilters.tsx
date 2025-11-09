'use client';

import { Filter, Search, Shield } from 'lucide-react';

import { useDmsStore } from '@/lib/store';

const statuses = ['All', 'Draft', 'Under Review', 'Pending QA Approval', 'Pending Release', 'Effective', 'Superseded'];
const securityLevels = ['All', 'Confidential', 'Internal', 'Restricted', 'Public'];

export const DocumentFilters = () => {
  const {
    state: {
      filters: { status, security, search }
    },
    dispatch
  } = useDmsStore();

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={search}
          onChange={(event) => dispatch({ type: 'SET_FILTER', key: 'search', value: event.target.value })}
          placeholder="Search title, number, or tags"
          className="w-full bg-transparent py-2 text-sm text-slate-700 focus:outline-none"
        />
      </div>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
        <Filter className="h-4 w-4 text-slate-400" />
        Status
        <select
          value={status}
          onChange={(event) => dispatch({ type: 'SET_FILTER', key: 'status', value: event.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 focus:border-primary-400 focus:outline-none"
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
        <Shield className="h-4 w-4 text-slate-400" />
        Security
        <select
          value={security}
          onChange={(event) => dispatch({ type: 'SET_FILTER', key: 'security', value: event.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 focus:border-primary-400 focus:outline-none"
        >
          {securityLevels.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
