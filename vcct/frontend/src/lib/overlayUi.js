/** Shared overlay surfaces (modals, sheets) from npdcapture — flat, compact DHIS2 light style. */

export const MODAL = {
    backdrop:
        'modal-backdrop fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-[4px] animate-in fade-in duration-150',
    panel:
        'modal-panel relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200',
    panelLg:
        'modal-panel relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200',
    panelMd:
        'modal-panel relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200',
    panel3xl:
        'modal-panel relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200',
    header:
        'relative flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5',
    headerPlain:
        'relative border-b border-slate-100 px-5 py-3.5',
    body: 'px-5 py-4 text-[13px] text-slate-700',
    footer:
        'flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5',
    footerEnd: 'flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5',
    scrollList:
        'max-h-[min(52vh,340px)] overflow-auto rounded-xl border border-slate-200/80 bg-slate-50/40 p-1.5 custom-scrollbar',
    closeBtn:
        'flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors',
    segmentTrack:
        'flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1',
    segmentActive:
        'flex-1 py-1.5 rounded-lg text-xs font-semibold bg-white text-[var(--app-header-bar-bg)] border border-slate-200/80 shadow-xs transition-all',
    segmentIdle:
        'flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 transition-all',
    listRow: 'group flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-slate-100/80',
};
