import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
} from 'lucide-react';

export function KPISummary({ 
  kpis, 
  filters = {}, 
  onChangeFilter, 
  onBatchChangeFilter, 
  onResetPresets 
}) {
  const [showCascade, setShowCascade] = useState(false);

  if (!kpis) return null;

  const total = kpis.totalTested || 0;
  const reactive = kpis.reactiveCount || 0;
  const linked = kpis.linkedToCareCount || 0;
  const unlinked = kpis.unlinkedCount !== undefined ? kpis.unlinkedCount : (reactive > linked ? reactive - linked : 0);
  const recent = kpis.recentCount || 0;

  const reactiveRate = kpis.reactiveRate || (total > 0 ? ((reactive / total) * 100).toFixed(1) : 0);
  const linkageRate = kpis.linkageRate || (reactive > 0 ? ((linked / reactive) * 100).toFixed(1) : 0);
  const unlinkedRate = kpis.unlinkedRate || (reactive > 0 ? ((unlinked / reactive) * 100).toFixed(1) : 0);
  const recencyRate = kpis.recencyRate || (reactive > 0 ? ((recent / reactive) * 100).toFixed(1) : 0);

  // Active status checks
  const isLinkedActive = filters?.linkedOnly === 'true';
  const isUnlinkedActive = filters?.unlinkedOnly === 'true';
  const isRecentActive = filters?.rtriResult === '1';
  const isReactiveActive = filters?.hivResult === '2' && !filters?.unlinkedOnly && !filters?.linkedOnly && !filters?.rtriResult;
  const isAllActive = !filters?.hivResult && !filters?.unlinkedOnly && !filters?.linkedOnly && !filters?.rtriResult;

  const applyPreset = (newPreset) => {
    if (onBatchChangeFilter) {
      onBatchChangeFilter(newPreset);
    } else if (onChangeFilter) {
      Object.entries(newPreset).forEach(([k, v]) => onChangeFilter(k, v));
    }
  };

  return (
    <div className="px-4 pt-2.5 pb-1">
      {/* 5 Consistent Pulse KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* 1. Total Tested */}
        <button
          type="button"
          onClick={() => {
            if (onResetPresets) {
              onResetPresets();
            } else {
              applyPreset({
                hivResult: '',
                unlinkedOnly: '',
                linkedOnly: '',
                rtriResult: '',
              });
            }
          }}
          className={`group flex flex-col justify-between h-[76px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
            isAllActive
              ? 'border-sky-400 bg-sky-50/20 ring-2 ring-sky-500/20 shadow-xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-sky-50 text-sky-600">
                <Users className="h-3 w-3" />
              </span>
              ធ្វើតេស្តសរុប
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
              100%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
              {total.toLocaleString()}
            </span>
          </div>
        </button>

        {/* 2. HIV Positives (Yield %) */}
        <button
          type="button"
          onClick={() => {
            applyPreset({
              hivResult: isReactiveActive ? '' : '2',
              unlinkedOnly: '',
              linkedOnly: '',
              rtriResult: '',
            });
          }}
          className={`group flex flex-col justify-between h-[76px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
            isReactiveActive
              ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-xs'
              : 'border-slate-200/90 bg-white hover:border-rose-200 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                <Activity className="h-3 w-3" />
              </span>
              វិជ្ជមាន
            </span>
            <span className="text-[10.5px] font-bold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              Yield {reactiveRate}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-rose-600">
              {reactive.toLocaleString()}
            </span>
          </div>
        </button>

        {/* 3. Linked to ART (Linkage %) */}
        <button
          type="button"
          onClick={() => {
            applyPreset({
              linkedOnly: isLinkedActive ? '' : 'true',
              hivResult: isLinkedActive ? '' : '2',
              unlinkedOnly: '',
              rtriResult: '',
            });
          }}
          className={`group flex flex-col justify-between h-[76px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
            isLinkedActive
              ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
              : 'border-slate-200/90 bg-white hover:border-emerald-200 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
              </span>
              បញ្ជូនទៅ ART
            </span>
            <span className="text-[10.5px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {linkageRate}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-emerald-600">
              {linked.toLocaleString()}
            </span>
          </div>
        </button>

        {/* 4. Unlinked Positives */}
        <button
          type="button"
          onClick={() => {
            applyPreset({
              unlinkedOnly: isUnlinkedActive ? '' : 'true',
              hivResult: isUnlinkedActive ? '' : '2',
              linkedOnly: '',
              rtriResult: '',
            });
          }}
          className={`group flex flex-col justify-between h-[76px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
            isUnlinkedActive
              ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
              : 'border-slate-200/90 bg-white hover:border-amber-200 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <AlertTriangle className="h-3 w-3" />
              </span>
              មិនទាន់បញ្ជូន ART
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200">
              {unlinkedRate}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-amber-600">
              {unlinked.toLocaleString()}
            </span>
          </div>
        </button>

        {/* 5. Recency (Recent Infections - RTRI) */}
        <button
          type="button"
          onClick={() => {
            applyPreset({
              rtriResult: isRecentActive ? '' : '1',
              hivResult: isRecentActive ? '' : '2',
              unlinkedOnly: '',
              linkedOnly: '',
            });
          }}
          className={`group flex flex-col justify-between h-[76px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
            isRecentActive
              ? 'border-purple-400 bg-purple-50/40 ring-2 ring-purple-500/20 shadow-xs'
              : 'border-slate-200/90 bg-white hover:border-purple-200 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-purple-50 text-purple-600">
                <Clock className="h-3 w-3" />
              </span>
              ឆ្លងថ្មី
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              {recencyRate}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-purple-600">
              {recent.toLocaleString()}
            </span>
          </div>
        </button>
      </div>

      {/* Cascade Visualizer Toggle */}
      <div className="mt-1.5 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowCascade((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100/80 px-2.5 py-1 rounded-md border border-sky-200/60 transition-all cursor-pointer shadow-2xs"
        >
          <span>លំហូរ Cascade</span>
          {showCascade ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Collapsible Visual Cascade Banner */}
      {showCascade && (
        <div className="mt-2 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>លំហូរតេស្ត និងព្យាបាល (Cascade)</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              ភ្ជាប់ ART {linkageRate}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {/* Step 1: Tested */}
            <button
              type="button"
              onClick={() => {
                if (onResetPresets) {
                  onResetPresets();
                } else {
                  applyPreset({
                    hivResult: '',
                    unlinkedOnly: '',
                    linkedOnly: '',
                    rtriResult: '',
                  });
                }
              }}
              className={`h-[72px] rounded-xl p-2.5 text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isAllActive
                  ? 'bg-sky-50/60 border-sky-400 ring-2 ring-sky-400/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between w-full h-4.5">
                <span className="text-[10.5px] text-slate-500 font-semibold flex items-center gap-1">
                  <span className="h-4 w-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                  ធ្វើតេស្តសរុប
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/60 text-slate-700">100%</span>
              </div>
              <div className="my-auto text-lg font-bold font-mono text-slate-900">{total.toLocaleString()}</div>
            </button>

            {/* Step 2: Positive */}
            <button
              type="button"
              onClick={() => {
                applyPreset({
                  hivResult: isReactiveActive ? '' : '2',
                  unlinkedOnly: '',
                  linkedOnly: '',
                  rtriResult: '',
                });
              }}
              className={`h-[72px] rounded-xl p-2.5 text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isReactiveActive
                  ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/20 shadow-xs'
                  : 'bg-rose-50/30 border-rose-200/70 hover:border-rose-300 hover:bg-rose-50/60'
              }`}
            >
              <div className="flex items-center justify-between w-full h-4.5">
                <span className="text-[10.5px] text-rose-700 font-semibold flex items-center gap-1">
                  <span className="h-4 w-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                  រកឃើញវិជ្ជមាន
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">Yield {reactiveRate}%</span>
              </div>
              <div className="my-auto text-lg font-bold font-mono text-rose-600">{reactive.toLocaleString()}</div>
            </button>

            {/* Step 3: Linked */}
            <button
              type="button"
              onClick={() => {
                applyPreset({
                  linkedOnly: isLinkedActive ? '' : 'true',
                  hivResult: isLinkedActive ? '' : '2',
                  unlinkedOnly: '',
                  rtriResult: '',
                });
              }}
              className={`h-[72px] rounded-xl p-2.5 text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isLinkedActive
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                  : 'bg-emerald-50/30 border-emerald-200/70 hover:border-emerald-300 hover:bg-emerald-50/60'
              }`}
            >
              <div className="flex items-center justify-between w-full h-4.5">
                <span className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">3</span>
                  បានបញ្ជូន ART
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">{linkageRate}%</span>
              </div>
              <div className="my-auto text-lg font-bold font-mono text-emerald-600">{linked.toLocaleString()}</div>
            </button>

            {/* Step 4: Drop-off Gap */}
            <button
              type="button"
              onClick={() => {
                applyPreset({
                  unlinkedOnly: isUnlinkedActive ? '' : 'true',
                  hivResult: isUnlinkedActive ? '' : '2',
                  linkedOnly: '',
                  rtriResult: '',
                });
              }}
              className={`h-[72px] rounded-xl p-2.5 text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isUnlinkedActive
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-amber-50/30 border-amber-200/70 hover:border-amber-300 hover:bg-amber-50/60'
              }`}
            >
              <div className="flex items-center justify-between w-full h-4.5">
                <span className="text-[10.5px] text-amber-700 font-semibold flex items-center gap-1">
                  <span className="h-4 w-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-mono">4</span>
                  នៅសល់មិនទាន់បញ្ជូន
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700">{unlinkedRate}%</span>
              </div>
              <div className="my-auto text-lg font-bold font-mono text-amber-600">{unlinked.toLocaleString()}</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KPISummary;
