import {
  PanelLeftClose,
  PanelLeftOpen,
  Database,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { NAV_ITEMS } from '../../config/nav';
import nchadsLogo from '../../assets/nchads-logo.png';

export function Sidebar({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
}) {
  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col self-stretch border-r border-slate-200 bg-white transition-[width] duration-200 ease-out select-none',
        isCollapsed ? 'w-14 p-1.5' : 'w-60 p-2'
      )}
    >
      {/* App Branding */}
      <div className={cn('flex items-center pb-2 border-b border-slate-100', isCollapsed ? 'justify-center' : 'justify-between px-1.5')}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={nchadsLogo}
              alt="NCHADS Logo"
              className="h-7 w-7 object-contain shrink-0 drop-shadow-2xs"
            />
            <span className="text-[13px] font-bold text-slate-800 tracking-tight truncate">
              កម្មវិធីពិនិត្យបញ្ជី VCCT
            </span>
          </div>
        ) : (
          <img
            src={nchadsLogo}
            alt="NCHADS Logo"
            className="h-7 w-7 object-contain drop-shadow-2xs"
          />
        )}
      </div>

      {/* Main Nav Items */}
      <nav className="flex flex-col gap-1 py-2 flex-1" aria-label="VCCT Navigation">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectView(id)}
              title={label}
              className={cn(
                'group flex w-full items-center rounded-lg transition-colors text-left',
                isCollapsed ? 'justify-center p-1.5' : 'gap-2 px-1.5 py-1',
                active
                  ? 'text-[var(--app-header-bar-bg)] font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <span
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-lg transition-colors',
                  isCollapsed ? 'h-8 w-8' : 'h-7 w-7',
                  active
                    ? 'bg-[var(--app-header-bar-bg)]/10 text-[var(--app-header-bar-bg)]'
                    : 'group-hover:bg-slate-100/90'
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 2} />
              </span>
              {!isCollapsed && (
                <span className="truncate text-[13px]">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions: DB status & Collapse Button (from npdcapture) */}
      <div className="mt-auto flex flex-col gap-1 border-t border-slate-200/80 pt-1.5">
        {!isCollapsed && (
          <div className="px-1.5 py-0.5 text-[10px] text-slate-400 flex items-center gap-1.5">
            <Database className="h-3 w-3 text-emerald-600 shrink-0" />
            <span className="truncate">មូលដ្ឋានទិន្នន័យផ្ទាល់</span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            'flex h-8 w-full items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100/90 hover:text-slate-700',
            !isCollapsed && 'justify-start gap-2 px-1.5'
          )}
          title={isCollapsed ? 'ពង្រីករបារចំហៀង' : 'បង្រួមរបារចំហៀង'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" strokeWidth={2} />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="truncate text-xs font-medium text-slate-500">
                បង្រួមរបារចំហៀង
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
