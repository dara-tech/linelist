import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

const PRESET_PERIODS = [
  { id: '2026', label: 'Year 2026', dateFrom: '2026-01-01', dateTo: '2026-12-31' },
  { id: '2025', label: 'Year 2025', dateFrom: '2025-01-01', dateTo: '2025-12-31' },
  { id: '2024', label: 'Year 2024', dateFrom: '2024-01-01', dateTo: '2024-12-31' },
  { id: 'Q4-2026', label: 'Q4 2026 (Oct - Dec)', dateFrom: '2026-10-01', dateTo: '2026-12-31' },
  { id: 'Q3-2026', label: 'Q3 2026 (Jul - Sep)', dateFrom: '2026-07-01', dateTo: '2026-09-30' },
  { id: 'Q2-2026', label: 'Q2 2026 (Apr - Jun)', dateFrom: '2026-04-01', dateTo: '2026-06-30' },
  { id: 'Q1-2026', label: 'Q1 2026 (Jan - Mar)', dateFrom: '2026-01-01', dateTo: '2026-03-31' },
  { id: 'THIS_MONTH', label: 'October 2026 (Current)', dateFrom: '2026-10-01', dateTo: '2026-10-31' },
  { id: 'LAST_MONTH', label: 'September 2026', dateFrom: '2026-09-01', dateTo: '2026-09-30' },
];

export function PeriodSelectModal({
  isOpen,
  onClose,
  dateFrom,
  dateTo,
  onSelectPeriod,
}) {
  const [tab, setTab] = useState('presets'); // 'presets' | 'custom'
  const [tempFrom, setTempFrom] = useState(dateFrom || '');
  const [tempTo, setTempTo] = useState(dateTo || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[var(--app-header-bar-bg)]" />
            <span className="text-sm font-bold text-slate-800">
              ជ្រើសរើសកាលបរិច្ឆេទ (Period Selection)
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setTab('presets')}
            className={`pb-2 border-b-2 transition-colors ${
              tab === 'presets'
                ? 'border-[var(--app-header-bar-bg)] text-[var(--app-header-bar-bg)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Periods (ខែ / ត្រីមាស / ឆ្នាំ)
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`pb-2 border-b-2 transition-colors ${
              tab === 'custom'
                ? 'border-[var(--app-header-bar-bg)] text-[var(--app-header-bar-bg)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Custom Range (ចន្លោះថ្ងៃ)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[320px] overflow-y-auto">
          {tab === 'presets' ? (
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => {
                  onSelectPeriod('', '', 'All Time');
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <span>All Time (ទិន្នន័យទាំងអស់)</span>
                {!dateFrom && !dateTo && <Check className="h-4 w-4 text-[var(--app-header-bar-bg)]" />}
              </button>

              {PRESET_PERIODS.map((p) => {
                const isSelected = dateFrom === p.dateFrom && dateTo === p.dateTo;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPeriod(p.dateFrom, p.dateTo, p.label);
                      onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-[var(--app-header-bar-bg)]/10 text-[var(--app-header-bar-bg)] font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{p.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-[var(--app-header-bar-bg)]" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Date From (ចាប់ពីថ្ងៃ)
                </label>
                <input
                  type="date"
                  value={tempFrom}
                  onChange={(e) => setTempFrom(e.target.value)}
                  className="w-full h-8 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:border-[var(--app-header-bar-bg)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                  Date To (ដល់ថ្ងៃ)
                </label>
                <input
                  type="date"
                  value={tempTo}
                  onChange={(e) => setTempTo(e.target.value)}
                  className="w-full h-8 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:border-[var(--app-header-bar-bg)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
            Cancel
          </Button>
          {tab === 'custom' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onSelectPeriod(tempFrom, tempTo, `${tempFrom || 'Start'} → ${tempTo || 'End'}`);
                onClose();
              }}
              className="h-7 text-xs bg-[var(--app-header-bar-bg)] hover:bg-[var(--app-header-bar-bg-hover)] text-white"
            >
              Apply Filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
