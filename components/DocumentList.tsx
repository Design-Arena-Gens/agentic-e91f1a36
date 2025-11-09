'use client';

import { ArrowRight, FileText, ShieldAlert } from 'lucide-react';

import { useDmsStore } from '@/lib/store';
import { documentMatchesFilter, formatDisplayDate, resolveDocumentType, securityBadgeStyles, statusBadgeStyles } from '@/lib/utils';

export const DocumentList = () => {
  const {
    state: { documents, documentTypes, filters, highlightedDocumentId },
    dispatch
  } = useDmsStore();

  const filtered = documents.filter((doc) => documentMatchesFilter(doc, filters));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Controlled Documents</h2>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versioned records aligned to GMP, ISO 9001, and ICH Q7 requirements
          </p>
        </div>
        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
          {filtered.length} documents
        </span>
      </header>

      <div className="max-h-[420px] overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Document</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Security</th>
              <th className="px-5 py-3 font-medium">Effective From</th>
              <th className="px-5 py-3 font-medium">Next Review</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((doc) => {
              const type = resolveDocumentType(doc, documentTypes);
              const isActive = doc.id === highlightedDocumentId;
              return (
                <tr
                  key={doc.id}
                  className={`transition-colors ${
                    isActive ? 'bg-primary-50/60' : 'hover:bg-slate-50'
                  } cursor-pointer`}
                  onClick={() => dispatch({ type: 'SET_HIGHLIGHTED_DOCUMENT', documentId: doc.id })}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{doc.title}</p>
                        <p className="text-xs text-slate-500">{doc.number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{type?.type ?? '—'}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[doc.status] ?? ''}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        securityBadgeStyles[doc.security] ?? ''
                      }`}
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {doc.security}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{formatDisplayDate(doc.effectiveFrom)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{formatDisplayDate(doc.nextIssueDate)}</td>
                  <td className="px-5 py-4 text-right text-xs font-medium text-primary-600">
                    <span className="inline-flex items-center gap-1">
                      View lifecycle
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                  No documents match the selected filters. Adjust status or security level to expand the view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
