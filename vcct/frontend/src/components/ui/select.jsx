import React, { useId, useMemo, useState } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * Searchable select (shadcn / npdcapture style combobox): Radix Popover.
 * Props: `value`, `onValueChange`, `options` [{ value, label }], `placeholder`, `disabled`, `className`, `searchable`
 */
export function Select({
  className,
  value,
  onValueChange,
  placeholder = 'ជ្រើសរើស...',
  options = [],
  disabled = false,
  searchPlaceholder = 'ស្វែងរក...',
  searchable = false,
  id,
  triggerId,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const listboxId = useId();
  const buttonId = triggerId || id;

  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value ?? '')),
    [options, value]
  );

  const displayLabel = selected?.label;
  const showPlaceholder = displayLabel == null || displayLabel === '';

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => {
      const l = typeof o.label === 'string' ? o.label.toLowerCase() : String(o.label);
      return l.includes(q);
    });
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
      <PopoverTrigger asChild>
        <button
          id={buttonId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          className={cn(
            'app-filter-control flex h-8 min-h-8 items-center justify-between rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[13px] font-normal text-slate-700 transition-colors outline-none hover:border-slate-300 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
            'focus:border-[var(--app-header-bar-bg)] focus:ring-1 focus:ring-[rgba(44,102,147,0.2)]',
            className
          )}
        >
          <span className="min-w-0 flex-1 truncate pr-2 text-left">
            {showPlaceholder ? (
              <span className="text-slate-400">{placeholder}</span>
            ) : (
              displayLabel
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={listboxId}
        align="start"
        className="z-[300] min-w-[12rem] max-w-[min(100vw-2rem,22rem)] p-1 bg-white border border-slate-200 shadow-xl rounded-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {searchable && options.length > 6 && (
          <div className="relative flex items-center px-2 py-1.5 border-b border-slate-100 mb-1">
            <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="max-h-60 overflow-y-auto overflow-x-hidden space-y-0.5 p-0.5">
          {filteredOptions.length === 0 ? (
            <div className="py-2.5 text-center text-xs text-slate-400">
              រកមិនឃើញជម្រើសឡើយ
            </div>
          ) : (
            filteredOptions.map((option) => {
              const strVal = String(option.value);
              const isSelected = String(value ?? '') === strVal;
              return (
                <button
                  key={strVal}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors',
                    isSelected
                      ? 'bg-sky-50 font-semibold text-[var(--app-header-bar-bg)]'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  )}
                >
                  <span className="min-w-0 flex-1 truncate pr-2">{option.label}</span>
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 text-[var(--app-header-bar-bg)]',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default Select;
