import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, X, Check, RotateCcw, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { MODAL } from '../../lib/overlayUi';
import { cn } from '../../lib/utils';

export function ColumnConfigModal({
  isOpen,
  onClose,
  columns = [],
  visibleColumns = {},
  onToggleColumn,
  onResetColumns,
  onApplyColumns,
}) {
  // Local draft of visible column map
  const [draftVisible, setDraftVisible] = useState(visibleColumns);

  useEffect(() => {
    if (isOpen) {
      setDraftVisible(visibleColumns);
    }
  }, [isOpen, visibleColumns]);

  const toggleDraft = (id) => {
    setDraftVisible((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const handleApply = () => {
    if (onApplyColumns) {
      onApplyColumns(draftVisible);
    } else {
      // Fallback: update individual toggles
      Object.entries(draftVisible).forEach(([id, val]) => {
        if (visibleColumns[id] !== val) {
          onToggleColumn(id);
        }
      });
    }
    onClose();
  };

  const handleReset = () => {
    onResetColumns();
    const defaults = {};
    columns.forEach((c) => {
      defaults[c.id] = true;
    });
    setDraftVisible(defaults);
  };

  if (typeof document === 'undefined' || !isOpen) return null;

  return createPortal(
    <div className={MODAL.backdrop} onClick={onClose}>
      <div
        className={cn(MODAL.panelMd, 'max-w-md')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header (npdcapture style) */}
        <div className={MODAL.header}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--app-header-bar-bg)] text-white shadow-sm">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                កំណត់បង្ហាញជួរឈរ
              </h3>
              <p className="text-[12px] text-slate-500 leading-tight">
                ជ្រើសរើសជួរឈរដែលត្រូវបង្ហាញក្នុងតារាងទិន្នន័យ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={MODAL.closeBtn}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Column List */}
        <div className="px-5 py-3">
          <div className={cn(MODAL.scrollList, 'max-h-[320px]')}>
            {columns.map((col) => {
              const checked = draftVisible[col.id] !== false;
              return (
                <div
                  key={col.id}
                  onClick={() => toggleDraft(col.id)}
                  className="group flex cursor-pointer items-center justify-between gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100/80 transition-colors select-none"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                    <span
                      className={cn(
                        'truncate text-[13px] font-medium',
                        checked ? 'text-slate-900' : 'text-slate-400'
                      )}
                    >
                      {col.label}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all',
                      checked
                        ? 'border-[var(--app-header-bar-bg)] bg-[var(--app-header-bar-bg)] text-white shadow-xs'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    )}
                  >
                    {checked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={MODAL.footer}>
          <Button
            type="button"
            variant="ghost"
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-2 h-8"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            កំណត់ឡើងវិញ
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 px-3 text-xs text-slate-600 hover:text-slate-900"
            >
              បោះបង់
            </Button>
            <Button
              type="button"
              className="h-8 rounded-lg bg-[var(--app-header-bar-bg)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--app-header-bar-bg-hover)] transition-colors"
              onClick={handleApply}
            >
              យល់ព្រម
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default ColumnConfigModal;
