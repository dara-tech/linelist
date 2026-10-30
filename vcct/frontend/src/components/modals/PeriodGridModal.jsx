import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { MODAL } from '../../lib/overlayUi';

const MONTH_NAMES = [
  { num: '01', kh: 'មករា' },
  { num: '02', kh: 'កុម្ភៈ' },
  { num: '03', kh: 'មីនា' },
  { num: '04', kh: 'មេសា' },
  { num: '05', kh: 'ឧសភា' },
  { num: '06', kh: 'មិថុនា' },
  { num: '07', kh: 'កក្កដា' },
  { num: '08', kh: 'សីហា' },
  { num: '09', kh: 'កញ្ញា' },
  { num: '10', kh: 'តុលា' },
  { num: '11', kh: 'វិច្ឆិកា' },
  { num: '12', kh: 'ធ្នូ' },
];

const QUARTERS = [
  { id: 'Q1', qNum: 1, kh: 'ត្រីមាសទី ១ (មករា - មីនា)', startM: '01-01', endM: '03-31' },
  { id: 'Q2', qNum: 2, kh: 'ត្រីមាសទី ២ (មេសា - មិថុនា)', startM: '04-01', endM: '06-30' },
  { id: 'Q3', qNum: 3, kh: 'ត្រីមាសទី ៣ (កក្កដា - កញ្ញា)', startM: '07-01', endM: '09-30' },
  { id: 'Q4', qNum: 4, kh: 'ត្រីមាសទី ៤ (តុលា - ធ្នូ)', startM: '10-01', endM: '12-31' },
];

function PeriodChip({ label, active, disabled = false, onToggle, large = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-3 text-left transition-all select-none',
        large ? 'min-h-[48px] py-2.5' : 'min-h-[42px] py-2',
        disabled
          ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 opacity-40 shadow-none'
          : active
          ? 'border-[var(--app-header-bar-bg)] bg-[rgba(44,102,147,0.08)] text-[var(--app-header-bar-bg)] font-semibold shadow-xs cursor-pointer'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
      )}
      onClick={disabled ? undefined : onToggle}
      title={disabled ? 'មិនអាចជ្រើសរើសកាលបរិច្ឆេទទៅអនាគតបានទេ' : label}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
          disabled
            ? 'border-slate-200 bg-slate-100'
            : active
            ? 'border-[var(--app-header-bar-bg)] bg-[var(--app-header-bar-bg)] text-white'
            : 'border-slate-300'
        )}
      >
        {active && !disabled ? <Check className="h-3 w-3 stroke-[3]" /> : null}
      </span>
      <span className={cn(
        'text-[13px] font-medium leading-normal whitespace-nowrap overflow-visible',
        disabled ? 'text-slate-300' : 'text-slate-700'
      )}>
        {label}
      </span>
    </button>
  );
}

export function PeriodGridModal({
  isOpen,
  onClose,
  dateFrom,
  dateTo,
  onSelectPeriod,
}) {
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1; // 1 to 12
  const currentQuarterNum = Math.ceil(currentMonthNum / 3); // 1 to 4
  const todayIso = useMemo(() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [now]);

  const [browseYear, setBrowseYear] = useState(currentYear);
  const [periodKind, setPeriodKind] = useState('month'); // 'month' | 'quarter' | 'year' | 'custom'
  
  // Draft dates
  const [draftStart, setDraftStart] = useState(dateFrom || '');
  const [draftEnd, setDraftEnd] = useState(dateTo || '');
  const [draftLabel, setDraftLabel] = useState('');

  // Future check helpers
  const isMonthInFuture = (monthNumStr) => {
    const m = parseInt(monthNumStr, 10);
    if (browseYear > currentYear) return true;
    if (browseYear === currentYear && m > currentMonthNum) return true;
    return false;
  };

  const isQuarterInFuture = (quarterNum) => {
    if (browseYear > currentYear) return true;
    if (browseYear === currentYear && quarterNum > currentQuarterNum) return true;
    return false;
  };

  const isYearInFuture = (y) => {
    return y > currentYear;
  };

  // Sync draft when opened
  useEffect(() => {
    if (isOpen) {
      setDraftStart(dateFrom || '');
      setDraftEnd(dateTo || '');
      if (dateFrom && dateTo) {
        setDraftLabel(`${dateFrom} ដល់ ${dateTo}`);
        const y = parseInt(dateFrom.substring(0, 4), 10);
        if (y && !isNaN(y) && y <= currentYear) setBrowseYear(y);
        else setBrowseYear(currentYear);
      } else {
        setBrowseYear(currentYear);
        setDraftLabel('គ្រប់កាលបរិច្ឆេទ');
      }
    }
  }, [isOpen, dateFrom, dateTo, currentYear]);

  const availableYears = useMemo(() => {
    const list = [];
    for (let y = currentYear; y >= currentYear - 8; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  const kindTabs = [
    { id: 'quarter', label: 'ត្រីមាស' },
    { id: 'month', label: 'ខែ' },
    { id: 'year', label: 'ឆ្នាំ' },
    { id: 'custom', label: 'កំណត់ចន្លោះថ្ងៃ' },
  ];

  const handleSelectQuarter = (q) => {
    if (isQuarterInFuture(q.qNum)) return;
    const qStart = `${browseYear}-${q.startM}`;
    const qEnd = `${browseYear}-${q.endM}`;
    setDraftStart(qStart);
    setDraftEnd(qEnd);
    setDraftLabel(`${q.kh} ឆ្នាំ ${browseYear}`);
  };

  const handleSelectMonth = (m) => {
    if (isMonthInFuture(m.num)) return;
    const daysInMonth = new Date(browseYear, parseInt(m.num, 10), 0).getDate();
    const mStart = `${browseYear}-${m.num}-01`;
    const mEnd = `${browseYear}-${m.num}-${String(daysInMonth).padStart(2, '0')}`;
    setDraftStart(mStart);
    setDraftEnd(mEnd);
    setDraftLabel(`ខែ${m.kh} ឆ្នាំ ${browseYear}`);
  };

  const handleSelectYear = (y) => {
    if (isYearInFuture(y)) return;
    const yStart = `${y}-01-01`;
    const yEnd = `${y}-12-31`;
    setDraftStart(yStart);
    setDraftEnd(yEnd);
    setDraftLabel(`ឆ្នាំ ${y}`);
  };

  const handleApply = () => {
    onSelectPeriod(draftStart, draftEnd, draftLabel);
    onClose();
  };

  const handleClear = () => {
    onSelectPeriod('', '', 'គ្រប់កាលបរិច្ឆេទ');
    onClose();
  };

  const customValid = Boolean(draftStart && draftEnd && draftStart <= draftEnd && draftEnd <= todayIso);
  const showYearNav = periodKind === 'month' || periodKind === 'quarter';

  if (typeof document === 'undefined' || !isOpen) return null;

  return createPortal(
    <div className={MODAL.backdrop} onClick={onClose}>
      <div
        className={cn(MODAL.panel, 'max-w-lg')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={MODAL.header}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--app-header-bar-bg)] text-white shadow-sm">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-slate-900 leading-snug">
                ជ្រើសរើសកាលបរិច្ឆេទ
              </div>
              <div className="mt-0.5 text-xs text-slate-500 leading-normal">
                ជ្រើសរើសត្រីមាស ខែ ឆ្នាំ ឬកំណត់ចន្លោះកាលបរិច្ឆេទជាក់លាក់
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={MODAL.closeBtn}
            aria-label="បិទ"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
          {/* Kind Tabs */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {kindTabs.map((tab) => {
              const active = periodKind === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPeriodKind(tab.id)}
                  className={cn(
                    'inline-flex h-8 items-center justify-center rounded-lg border px-3.5 py-1 text-[13px] font-medium transition-all cursor-pointer leading-normal',
                    active
                      ? 'border-[var(--app-header-bar-bg)] bg-[var(--app-header-bar-bg)] text-white shadow-sm font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Year Navigation */}
          {showYearNav ? (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-2">
              <button
                type="button"
                onClick={() => setBrowseYear((y) => Math.max(currentYear - 10, y - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="ឆ្នាំមុន"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center py-0.5">
                <div className="text-base font-bold text-slate-900 leading-normal">
                  ឆ្នាំ <span className="font-mono">{browseYear}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBrowseYear((y) => Math.min(currentYear, y + 1))}
                disabled={browseYear >= currentYear}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="ឆ្នាំបន្ទាប់ (មិនអាចជ្រើសរើសឆ្នាំទៅអនាគតបានទេ)"
                title={browseYear >= currentYear ? 'មិនអាចជ្រើសរើសឆ្នាំទៅអនាគតបានទេ' : 'ឆ្នាំបន្ទាប់'}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {/* Quarters grid */}
          {periodKind === 'quarter' && (
            <div className="grid grid-cols-2 gap-2.5">
              {QUARTERS.map((q) => {
                const qStart = `${browseYear}-${q.startM}`;
                const qEnd = `${browseYear}-${q.endM}`;
                const active = draftStart === qStart && draftEnd === qEnd;
                const disabled = isQuarterInFuture(q.qNum);
                return (
                  <PeriodChip
                    key={q.id}
                    label={q.kh}
                    active={active}
                    disabled={disabled}
                    onToggle={() => handleSelectQuarter(q)}
                    large
                  />
                );
              })}
            </div>
          )}

          {/* Months grid */}
          {periodKind === 'month' && (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {MONTH_NAMES.map((m) => {
                const daysInMonth = new Date(browseYear, parseInt(m.num, 10), 0).getDate();
                const mStart = `${browseYear}-${m.num}-01`;
                const mEnd = `${browseYear}-${m.num}-${String(daysInMonth).padStart(2, '0')}`;
                const active = draftStart === mStart && draftEnd === mEnd;
                const disabled = isMonthInFuture(m.num);
                return (
                  <PeriodChip
                    key={m.num}
                    label={m.kh}
                    active={active}
                    disabled={disabled}
                    onToggle={() => handleSelectMonth(m)}
                  />
                );
              })}
            </div>
          )}

          {/* Years grid */}
          {periodKind === 'year' && (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {availableYears.map((y) => {
                const yStart = `${y}-01-01`;
                const yEnd = `${y}-12-31`;
                const active = draftStart === yStart && draftEnd === yEnd;
                const disabled = isYearInFuture(y);
                return (
                  <PeriodChip
                    key={y}
                    label={`ឆ្នាំ ${y}`}
                    active={active}
                    disabled={disabled}
                    onToggle={() => handleSelectYear(y)}
                  />
                );
              })}
            </div>
          )}

          {/* Custom Date Range */}
          {periodKind === 'custom' && (
            <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <div className="text-xs font-semibold text-slate-700 leading-normal">
                ជ្រើសរើសចន្លោះកាលបរិច្ឆេទ (មិនអាចជ្រើសរើសថ្ងៃទៅអនាគតបានទេ)
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 leading-normal">
                    ចាប់ពីថ្ងៃ
                  </label>
                  <input
                    type="date"
                    max={todayIso}
                    value={draftStart}
                    onChange={(e) => {
                      setDraftStart(e.target.value);
                      if (draftEnd) setDraftLabel(`${e.target.value} ដល់ ${draftEnd}`);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-mono focus:border-[var(--app-header-bar-bg)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 leading-normal">
                    ដល់ថ្ងៃ
                  </label>
                  <input
                    type="date"
                    max={todayIso}
                    value={draftEnd}
                    onChange={(e) => {
                      setDraftEnd(e.target.value);
                      if (draftStart) setDraftLabel(`${draftStart} ដល់ ${e.target.value}`);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-mono focus:border-[var(--app-header-bar-bg)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={MODAL.footer}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            សម្អាត
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              បោះបង់
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleApply}
              disabled={periodKind === 'custom' && !customValid}
              className="bg-[var(--app-header-bar-bg)] hover:bg-[var(--app-header-bar-bg-hover)] text-white text-xs font-semibold px-4 cursor-pointer"
            >
              ជ្រើសរើស
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default PeriodGridModal;
