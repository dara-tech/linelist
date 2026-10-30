import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  BarChart2,
  PieChart as PieIcon,
  GitCommit,
  Layers,
  ArrowUpDown,
  TrendingUp,
  Percent,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  LabelList,
} from 'recharts';
import { fetchAnalysisMetrics } from '../../lib/api';
import { Loading, LoadingMark } from '../ui/loading';

// Meaningful, clinical acronym-aware label formatter that never truncates words with "..."
function formatTargetGroupName(name) {
  if (!name) return 'ប្រជាជនទូទៅ';
  const str = String(name).trim();
  const lower = str.toLowerCase();
  
  if (str.includes('ទូទៅ') || lower.includes('genpop')) {
    return 'ប្រជាជនទូទៅ';
  }
  if (str.includes('ផ្ទៃពោះ') || str.includes('សម្រាល') || lower.includes('anc')) {
    return 'ស្ត្រីមានផ្ទៃពោះ';
  }
  if (str.includes('ស្រឡាញ់') || str.includes('រួមភេទ') || lower.includes('msm')) {
    return 'បុរសរួមភេទ (MSM)';
  }
  if (str.includes('ស្រី') && (str.includes('សេវា') || str.includes('កម្សាន្ត') || lower.includes('few') || lower.includes('ew'))) {
    return 'ស្រីសេវាកម្សាន្ត (FEW)';
  }
  if (str.includes('បំប្លែងភេទ') || lower.includes('tg')) {
    return 'ក្រុមបំប្លែងភេទ (TG)';
  }
  if (str.includes('ចាក់') || lower.includes('pwid')) {
    return 'អ្នកចាក់ថ្នាំ (PWID)';
  }
  if ((str.includes('ប្រើ') || str.includes('ញៀន')) && !str.includes('ចាក់') || lower.includes('pwud')) {
    return 'អ្នកប្រើថ្នាំ (PWUD)';
  }
  if ((str.includes('បុរស') || str.includes('បុរស់')) && (str.includes('សេវា') || str.includes('កម្សាន្ត') || lower.includes('mew'))) {
    return 'បុរសសេវាកម្សាន្ត (MEW)';
  }
  if (str.includes('ដៃគូ') || lower.includes('partner')) {
    return 'ដៃគូអ្នកផ្ទុក (Partner)';
  }
  return str;
}

// Curated high-aesthetic color palette for Key Populations
const POPULATION_COLORS = [
  { fill: '#3b82f6', gradStart: '#60a5fa', gradEnd: '#2563eb' }, // Blue (General)
  { fill: '#8b5cf6', gradStart: '#a78bfa', gradEnd: '#7c3aed' }, // Violet (MSM)
  { fill: '#ec4899', gradStart: '#f472b6', gradEnd: '#db2777' }, // Pink (Transgender)
  { fill: '#f59e0b', gradStart: '#fbbf24', gradEnd: '#d97706' }, // Amber (EW)
  { fill: '#ef4444', gradStart: '#f87171', gradEnd: '#dc2626' }, // Red (PWID/Drug)
  { fill: '#10b981', gradStart: '#34d399', gradEnd: '#059669' }, // Emerald (ANC)
  { fill: '#06b6d4', gradStart: '#22d3ee', gradEnd: '#0891b2' }, // Cyan (Partners)
  { fill: '#6366f1', gradStart: '#818cf8', gradEnd: '#4f46e5' }, // Indigo
  { fill: '#64748b', gradStart: '#94a3b8', gradEnd: '#475569' }, // Slate
];

// Modern Glassmorphism Tooltip
function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md text-xs font-sans min-w-[160px] z-50 text-white">
      {label && (
        <div className="font-bold text-slate-100 border-b border-slate-700/80 pb-1.5 mb-2 flex items-center justify-between gap-2">
          <span>{label}</span>
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const isRate = item.name && (item.name.includes('%') || item.name.includes('Yield') || item.dataKey === 'yieldRate');
          return (
            <div key={index} className="flex items-center justify-between gap-3 text-[11.5px]">
              <div className="flex items-center gap-2">
                <span 
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs ring-1 ring-white/20" 
                  style={{ backgroundColor: item.color || item.fill }} 
                />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-white">
                {isRate ? `${item.value}%` : Number(item.value).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 1. Sleek In-Chart Loading Overlay (Frosted glassmorphism over active charts during background refresh)
function ChartLoadingOverlay({ label = 'កំពុងធ្វើបច្ចុប្បន្នភាពក្រាហ្វិក...' }) {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1.5px] rounded-xl flex items-center justify-center z-20 pointer-events-none transition-all duration-300">
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 border border-slate-200/80 shadow-md text-xs font-medium text-slate-700 animate-in fade-in duration-200">
        <LoadingMark className="h-4 w-4 text-sky-600" />
        <span>{label}</span>
      </div>
    </div>
  );
}

// 2. Bar Chart Skeleton (Shimmering bars with floating badge for initial load)
function BarChartSkeleton({ message = 'កំពុងរៀបចំទិន្នន័យក្រាហ្វិក...' }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative p-4">
      <div className="w-full h-full flex items-end justify-between gap-3 px-4 pb-6 pt-4 border-b border-l border-slate-200/60">
        {[65, 30, 85, 45, 70, 25, 40, 20].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              className="w-full max-w-[28px] bg-slate-100/90 rounded-t animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
            />
            <div className="h-2 w-8 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/95 border border-slate-200/80 shadow-md text-xs font-medium text-slate-700">
          <LoadingMark className="h-4 w-4 text-sky-500" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

// 3. Donut Chart Skeleton
function DonutChartSkeleton({ message = 'កំពុងរៀបចំសមាមាត្រ...' }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-between">
      <div className="relative h-[215px] w-full max-w-[270px] mx-auto flex items-center justify-center">
        <div className="h-44 w-44 rounded-full border-[20px] border-slate-100 animate-pulse flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-1">
            <LoadingMark className="h-5 w-5 text-rose-500" />
            <span className="text-[10px] text-slate-400 font-medium">កំពុងគណនា</span>
          </div>
        </div>
      </div>
      <div className="w-full mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-5 bg-slate-100/80 rounded animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// 4. Cascade Stepper Skeleton
function CascadeStepperSkeleton() {
  return (
    <div className="pt-2.5 space-y-2.5">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 animate-pulse">
          <div className="h-8 w-8 rounded-lg bg-slate-200/70 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-200/70 rounded w-1/3" />
            <div className="h-2.5 bg-slate-200/50 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. Demographics Chart Skeleton
function DemographicsChartSkeleton() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative p-4">
      <div className="w-full h-full flex items-end justify-between gap-6 px-6 pb-6 pt-4 border-b border-l border-slate-200/60">
        {[55, 75, 90, 40].map((h, i) => (
          <div key={i} className="flex-1 flex items-end justify-center gap-2 h-full">
            <div className="w-5 bg-blue-100/70 rounded-t animate-pulse" style={{ height: `${h}%` }} />
            <div className="w-5 bg-pink-100/70 rounded-t animate-pulse" style={{ height: `${h * 0.7}%` }} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/95 border border-slate-200/80 shadow-md text-xs font-medium text-slate-700">
          <LoadingMark className="h-4 w-4 text-indigo-500" />
          <span>កំពុងរៀបចំប្រជាសាស្ត្រ...</span>
        </div>
      </div>
    </div>
  );
}

export function GroupDashboard({ filters, onDrillDownToLineList, refreshTrigger = 0 }) {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Distinguish initial cold load from smooth background refetching
  const isInitialLoading = !metrics && isLoading;
  const isRefreshing = !!metrics && isLoading;
  
  // View controls
  const [targetGroupView, setTargetGroupView] = useState('combo'); // 'combo' | 'positives' | 'yieldRanking'
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' | 'asc'
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);
  const [demoView, setDemoView] = useState('tested'); // 'tested' | 'reactive' | 'all'
  const [cascadeMode, setCascadeMode] = useState('funnel'); // 'funnel' | 'chart'

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAnalysisMetrics(filters);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load analysis metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [filters.provinceId, filters.odCode, filters.siteCode, filters.dateFrom, filters.dateTo, refreshTrigger]);

  const byTargetGroup = metrics?.byTargetGroup || [];
  const byAgeSex = metrics?.byAgeSex || [];

  // Aggregated KPIs
  const totalTested = useMemo(() => byTargetGroup.reduce((sum, g) => sum + Number(g.total_tested || 0), 0), [byTargetGroup]);
  const totalReactive = useMemo(() => byTargetGroup.reduce((sum, g) => sum + Number(g.reactive_count || 0), 0), [byTargetGroup]);
  const totalLinked = useMemo(() => byTargetGroup.reduce((sum, g) => sum + Number(g.linked_count || 0), 0), [byTargetGroup]);
  const totalRecent = useMemo(() => byTargetGroup.reduce((sum, g) => sum + Number(g.recent_count || 0), 0), [byTargetGroup]);
  const totalUnlinked = totalReactive > totalLinked ? totalReactive - totalLinked : 0;

  const overallYield = totalTested > 0 ? ((totalReactive / totalTested) * 100).toFixed(1) : 0;
  const overallLinkage = totalReactive > 0 ? ((totalLinked / totalReactive) * 100).toFixed(1) : 0;
  const overallRecency = totalReactive > 0 ? ((totalRecent / totalReactive) * 100).toFixed(1) : 0;

  // 1. Processed Target Group Chart Data
  const targetGroupChartData = useMemo(() => {
    const map = new Map();
    byTargetGroup.forEach((tg) => {
      const name = tg.target_group || 'ប្រជាជនទូទៅ';
      const tested = Number(tg.total_tested || 0);
      const reactive = Number(tg.reactive_count || 0);
      const linked = Number(tg.linked_count || 0);
      const yieldRate = tested > 0 ? Number(((reactive / tested) * 100).toFixed(1)) : 0;

      if (map.has(name)) {
        const item = map.get(name);
        item.តេស្ត += tested;
        item.វិជ្ជមាន += reactive;
        item.linked += linked;
        item.yieldRate = item.តេស្ត > 0 ? Number(((item.វិជ្ជមាន / item.តេស្ត) * 100).toFixed(1)) : 0;
      } else {
        map.set(name, {
          name,
          shortName: formatTargetGroupName(name),
          id: tg.target_group_id,
          តេស្ត: tested,
          វិជ្ជមាន: reactive,
          linked,
          yieldRate,
        });
      }
    });

    const list = Array.from(map.values());
    if (targetGroupView === 'yieldRanking') {
      return list.sort((a, b) => (sortDirection === 'asc' ? a.yieldRate - b.yieldRate : b.yieldRate - a.yieldRate));
    }
    if (targetGroupView === 'positives') {
      return list.sort((a, b) => (sortDirection === 'asc' ? a.វិជ្ជមាន - b.វិជ្ជមាន : b.វិជ្ជមាន - a.វិជ្ជមាន));
    }
    return list.sort((a, b) => {
      if (sortDirection === 'asc') return a.តេស្ត - b.តេស្ត;
      return b.តេស្ត - a.តេស្ត;
    });
  }, [byTargetGroup, sortDirection, targetGroupView]);

  // 2. Positive Share Pie Data
  const positiveSharePieData = useMemo(() => {
    const activeGroups = byTargetGroup
      .filter((tg) => Number(tg.reactive_count || 0) > 0)
      .map((tg, idx) => {
        const count = Number(tg.reactive_count || 0);
        const percent = totalReactive > 0 ? ((count / totalReactive) * 100).toFixed(1) : 0;
        const colorObj = POPULATION_COLORS[idx % POPULATION_COLORS.length];
        const rawName = tg.target_group || 'ប្រជាជនទូទៅ';
        return {
          name: formatTargetGroupName(rawName),
          fullName: rawName,
          value: count,
          percentage: percent,
          color: colorObj.fill,
          gradStart: colorObj.gradStart,
          gradEnd: colorObj.gradEnd,
        };
      })
      .sort((a, b) => b.value - a.value);

    return activeGroups;
  }, [byTargetGroup, totalReactive]);

  // 3. Demographic Age & Sex Chart Data
  const ageSexChartData = useMemo(() => {
    return ['<15', '15-24', '25-49', '50+'].map((group) => {
      const male = byAgeSex.find((d) => d.age_group === group && Number(d.sex) === 1);
      const female = byAgeSex.find((d) => d.age_group === group && Number(d.sex) === 2);
      const mTested = Number(male?.total_tested || 0);
      const fTested = Number(female?.total_tested || 0);
      const mReactive = Number(male?.reactive_count || 0);
      const fReactive = Number(female?.reactive_count || 0);
      const totalGroupTested = mTested + fTested;
      const totalGroupReactive = mReactive + fReactive;

      return {
        ageGroup: `${group} ឆ្នាំ`,
        ប្រុស_តេស្ត: mTested,
        ស្រី_តេស្ត: fTested,
        ប្រុស_វិជ្ជមាន: mReactive,
        ស្រី_វិជ្ជមាន: fReactive,
        totalTested: totalGroupTested,
        totalReactive: totalGroupReactive,
      };
    });
  }, [byAgeSex]);

  // 4. Normalized Cascade Data for relative efficiency
  const cascadeRelativeData = useMemo(() => [
    { stage: '១. ធ្វើតេស្តសរុប', count: totalTested, fill: '#0ea5e9' },
    { stage: '២. វិជ្ជមាន', count: totalReactive, fill: '#f43f5e' },
    { stage: '៣. ភ្ជាប់ ART', count: totalLinked, fill: '#10b981' },
    { stage: '៤. មិនទាន់ភ្ជាប់', count: totalUnlinked, fill: '#f59e0b' },
  ], [totalTested, totalReactive, totalLinked, totalUnlinked]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 relative">
      {/* Subtle top progress bar during background refresh */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 via-rose-500 to-amber-500 animate-pulse z-30" />
      )}

      {/* 1. Full-Width Sticky Sub-Header Bar (Consistent across all pages, no outer padding) */}
      <div className="sticky top-0 z-20 w-full border-b border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-xs shadow-2xs flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center border border-sky-200/50">
            <BarChart2 className="h-4 w-4" />
          </div>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>ផ្ទាំងវិភាគ និងក្រាហ្វិកស្ថិតិអេដស៍</span>
            {isInitialLoading ? (
              <span className="h-5 w-20 bg-slate-200/70 rounded-full animate-pulse inline-block" />
            ) : (
              <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                {byTargetGroup.length} ប្រភេទអតិថិជន
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadMetrics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-xs font-medium shadow-2xs cursor-pointer active:scale-95 disabled:opacity-70"
            title="ទាញទិន្នន័យឡើងវិញ (Refresh)"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
            <span>{isLoading ? 'កំពុងទាញយក...' : 'ផ្ទុកឡើងវិញ'}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Dashboard Body */}
      <div className="flex-1 flex flex-col gap-3.5 px-4 py-3 min-h-0 overflow-y-auto">
        {/* 2. Top Summary Pulse Ribbon (Compact, clean, no sub-labels) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Card 1: Total Tested */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-sky-50 text-sky-600">
                <Users className="h-3 w-3" />
              </span>
              ធ្វើតេស្តសរុប
            </span>
            {isInitialLoading ? (
              <span className="h-4 w-10 bg-slate-100 rounded-full animate-pulse" />
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                100%
              </span>
            )}
          </div>
          {isInitialLoading ? (
            <div className="flex items-baseline justify-between">
              <div className="h-6 w-20 bg-slate-200/70 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
                {totalTested.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">នាក់</span>
            </div>
          )}
        </div>

        {/* Card 2: HIV Reactive (Yield %) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                <Activity className="h-3 w-3" />
              </span>
              វិជ្ជមាន
            </span>
            {isInitialLoading ? (
              <span className="h-4 w-14 bg-rose-50 rounded-full animate-pulse" />
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                Yield {overallYield}%
              </span>
            )}
          </div>
          {isInitialLoading ? (
            <div className="flex items-baseline justify-between">
              <div className="h-6 w-16 bg-rose-100/70 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-rose-600">
                {totalReactive.toLocaleString()}
              </span>
              <span className="text-[11px] text-rose-500 font-medium">ករណី</span>
            </div>
          )}
        </div>

        {/* Card 3: Linked to Care (Linkage %) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
              </span>
              បញ្ជូនទៅ ART
            </span>
            {isInitialLoading ? (
              <span className="h-4 w-12 bg-emerald-50 rounded-full animate-pulse" />
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {overallLinkage}%
              </span>
            )}
          </div>
          {isInitialLoading ? (
            <div className="flex items-baseline justify-between">
              <div className="h-6 w-16 bg-emerald-100/70 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-emerald-600">
                {totalLinked.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">នាក់</span>
            </div>
          )}
        </div>

        {/* Card 4: Recency (RTRI) */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs hover:shadow-xs transition-all h-[76px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs h-5">
            <span className="text-[11.5px] font-medium text-slate-600 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-purple-50 text-purple-600">
                <Clock className="h-3 w-3" />
              </span>
              ឆ្លងថ្មី (RTRI)
            </span>
            {isInitialLoading ? (
              <span className="h-4 w-10 bg-purple-50 rounded-full animate-pulse" />
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                {overallRecency}%
              </span>
            )}
          </div>
          {isInitialLoading ? (
            <div className="flex items-baseline justify-between">
              <div className="h-6 w-14 bg-purple-100/70 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono tracking-tight text-purple-600">
                {totalRecent.toLocaleString()}
              </span>
              <span className="text-[11px] text-purple-500 font-medium">ករណី</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. ROW 1 CHARTS: Key Population & Donut Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Main Key Population Chart (7 Cols on LG) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          {isRefreshing && <ChartLoadingOverlay label="កំពុងធ្វើបច្ចុប្បន្នភាពក្រាហ្វិក..." />}

          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 min-h-[44px]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-slate-800">
                លទ្ធផល និងអត្រាវិជ្ជមានតាមប្រភេទអតិថិជន
              </span>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setTargetGroupView('combo')}
                disabled={isInitialLoading}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  targetGroupView === 'combo'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                រួមបញ្ចូល (Combo)
              </button>
              <button
                type="button"
                onClick={() => setTargetGroupView('positives')}
                disabled={isInitialLoading}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  targetGroupView === 'positives'
                    ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ករណីវិជ្ជមាន
              </button>
              <button
                type="button"
                onClick={() => setTargetGroupView('yieldRanking')}
                disabled={isInitialLoading}
                className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  targetGroupView === 'yieldRanking'
                    ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ចំណាត់ថ្នាក់ Yield %
              </button>
              <button
                type="button"
                onClick={() => setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                disabled={isInitialLoading}
                className="px-1.5 py-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer ml-0.5"
                title={`តម្រៀប: ${sortDirection === 'desc' ? 'ខ្ពស់ ➔ ទាប' : 'ទាប ➔ ខ្ពស់'}`}
              >
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-[360px] w-full pt-3">
            {isInitialLoading ? (
              <BarChartSkeleton message="កំពុងរៀបចំទិន្នន័យក្រាហ្វិក..." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {targetGroupView === 'yieldRanking' ? (
                  /* Horizontal Ranked Bar Chart by Yield % */
                  <BarChart
                    data={targetGroupChartData}
                    layout="vertical"
                    margin={{ top: 8, right: 45, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="yieldRankingGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      unit="%" 
                      domain={[0, 100]}
                      tick={{ fontSize: 10.5, fill: '#64748b' }} 
                    />
                    <YAxis 
                      type="category" 
                      dataKey="shortName" 
                      width={130} 
                      tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} 
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar 
                      dataKey="yieldRate" 
                      name="អត្រាវិជ្ជមាន (Yield %)" 
                      fill="url(#yieldRankingGradient)" 
                      radius={[0, 6, 6, 0]} 
                      maxBarSize={22}
                    >
                      <LabelList 
                        dataKey="yieldRate" 
                        position="right" 
                        offset={8} 
                        style={{ fontSize: 10.5, fill: '#ea580c', fontWeight: 700 }} 
                        formatter={(v) => `${v}%`} 
                      />
                    </Bar>
                  </BarChart>
                ) : targetGroupView === 'positives' ? (
                  /* Dedicated Positives Bar Chart (Scaled to Positives) */
                  <BarChart
                    data={targetGroupChartData}
                    margin={{ top: 18, right: 15, left: -10, bottom: 55 }}
                  >
                    <defs>
                      <linearGradient id="positivesOnlyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortName" 
                      angle={-20} 
                      textAnchor="end" 
                      interval={0} 
                      height={55}
                      tick={{ fontSize: 10.5, fill: '#334155', fontWeight: 500 }} 
                    />
                    <YAxis 
                      tick={{ fontSize: 10.5, fill: '#64748b' }} 
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar 
                      dataKey="វិជ្ជមាន" 
                      name="ករណីវិជ្ជមាន" 
                      fill="url(#positivesOnlyGradient)" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={36}
                    >
                      <LabelList 
                        dataKey="វិជ្ជមាន" 
                        position="top" 
                        offset={6} 
                        style={{ fontSize: 11, fill: '#be123c', fontWeight: 700 }} 
                        formatter={(v) => (v > 0 ? v : '')} 
                      />
                    </Bar>
                  </BarChart>
                ) : (
                  /* Dual-Axis Composed Chart (Volume Bars + Linear Yield % Line) */
                  <ComposedChart
                    data={targetGroupChartData}
                    margin={{ top: 16, right: 15, left: -10, bottom: 55 }}
                  >
                    <defs>
                      <linearGradient id="testedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                      <linearGradient id="reactiveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortName" 
                      angle={-20} 
                      textAnchor="end" 
                      interval={0} 
                      height={55}
                      tick={{ fontSize: 10.5, fill: '#334155', fontWeight: 500 }} 
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 10.5, fill: '#64748b' }} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      unit="%" 
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tick={{ fontSize: 10.5, fill: '#d97706', fontWeight: 600 }} 
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      wrapperStyle={{ fontSize: 11, paddingBottom: 6 }} 
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="តេស្ត" 
                      name="ធ្វើតេស្តសរុប" 
                      fill="url(#testedGradient)" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={28} 
                      minPointSize={2}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="វិជ្ជមាន" 
                      name="រកឃើញវិជ្ជមាន" 
                      fill="url(#reactiveGradient)" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={28} 
                      minPointSize={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="linear" 
                      dataKey="yieldRate" 
                      name="អត្រា Yield (%)" 
                      stroke="#f59e0b" 
                      strokeWidth={2.5}
                      dot={{ r: 4.5, stroke: '#ffffff', strokeWidth: 2, fill: '#f59e0b' }}
                      activeDot={{ r: 6.5, stroke: '#ffffff', strokeWidth: 2, fill: '#d97706' }}
                    >
                      <LabelList 
                        dataKey="yieldRate" 
                        position="top" 
                        offset={8} 
                        style={{ fontSize: 10, fill: '#b45309', fontWeight: 700 }} 
                        formatter={(v) => (v > 0 ? `${v}%` : '')} 
                      />
                    </Line>
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Positive Case Share Donut Chart with Dynamic Center Callout (5 Cols on LG) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          {isRefreshing && <ChartLoadingOverlay label="កំពុងធ្វើបច្ចុប្បន្នភាពសមាមាត្រ..." />}

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 min-h-[44px]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <PieIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-slate-800">
                សមាមាត្រករណីវិជ្ជមាន (Share %)
              </span>
            </div>
            <span className="text-[10.5px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              {isInitialLoading ? '...' : `${totalReactive} ករណី`}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-between w-full pt-1">
            {isInitialLoading ? (
              <DonutChartSkeleton message="កំពុងរៀបចំសមាមាត្រ..." />
            ) : (
              <>
                {/* Perfectly Centered Donut Container */}
                <div className="relative h-[215px] w-full max-w-[270px] mx-auto flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={positiveSharePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        cornerRadius={5}
                        dataKey="value"
                        onMouseEnter={(_, index) => setHoveredDonutSlice(positiveSharePieData[index])}
                        onMouseLeave={() => setHoveredDonutSlice(null)}
                      >
                        {positiveSharePieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            className="transition-all duration-300 hover:opacity-85 cursor-pointer outline-hidden" 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Dynamic Center Callout Overlay (Perfect Center) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
                    <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
                      {hoveredDonutSlice ? hoveredDonutSlice.value : totalReactive}
                    </span>
                    <span className="text-[10.5px] font-medium text-slate-500 max-w-[110px] truncate leading-tight mt-1">
                      {hoveredDonutSlice ? hoveredDonutSlice.name : 'វិជ្ជមានសរុប'}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1 border border-rose-100">
                      {hoveredDonutSlice ? `${hoveredDonutSlice.percentage}%` : '100%'}
                    </span>
                  </div>
                </div>

                {/* Centered Side-by-side Ranked Legend Breakdown */}
                <div className="w-full mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-2.5 gap-y-1">
                  {positiveSharePieData.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDonutSlice(item)}
                      onMouseLeave={() => setHoveredDonutSlice(null)}
                      className={`group flex items-center justify-between p-1 rounded-md border text-xs transition-all cursor-pointer ${
                        hoveredDonutSlice?.name === item.name
                          ? 'border-slate-300 bg-slate-50/90 shadow-2xs'
                          : 'border-transparent hover:border-slate-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span 
                          className="h-2 w-2 rounded-full shrink-0 shadow-2xs" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span className="text-[11px] font-medium text-slate-700 truncate group-hover:text-slate-900">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <span className="text-[11px] font-mono font-bold text-slate-900">
                          {item.value}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. ROW 2 CHARTS: Testing-to-Treatment Linkage Cascade & Age/Sex Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Cascade Linkage Visualizer (6 Cols on LG) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          {isRefreshing && <ChartLoadingOverlay label="កំពុងធ្វើបច្ចុប្បន្នភាពលំហូរ..." />}

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 min-h-[44px]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <GitCommit className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-slate-800">
                លំហូរ Cascade ពីតេស្តដល់ព្យាបាល
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setCascadeMode('funnel')}
                disabled={isInitialLoading}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  cascadeMode === 'funnel'
                    ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                លំហូរ Stepper
              </button>
              <button
                type="button"
                onClick={() => setCascadeMode('chart')}
                disabled={isInitialLoading}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  cascadeMode === 'chart'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ក្រាហ្វិក
              </button>
            </div>
          </div>

          {isInitialLoading ? (
            <CascadeStepperSkeleton />
          ) : cascadeMode === 'funnel' ? (
            /* UNAIDS / PEPFAR Clinical Cascade Stepper */
            <div className="pt-2.5 space-y-2">
              {/* Step 1: Total Tested */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-sky-100 bg-sky-50/40">
                <div className="h-8 w-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                  ១
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">ធ្វើតេស្តសរុប (Clients Tested)</span>
                    <span className="text-sm font-bold font-mono text-sky-700">{totalTested.toLocaleString()}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500">100% នៃអតិថិជនបានពិនិត្យ</div>
                </div>
              </div>

              {/* Conversion Step 1 to 2 */}
              <div className="flex items-center justify-center gap-2 text-[10.5px] font-semibold text-rose-600 py-0.5">
                <ArrowRight className="h-3 w-3" />
                <span>អត្រាវិជ្ជមាន (Yield Rate): {overallYield}%</span>
              </div>

              {/* Step 2: Reactive Positives */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-rose-100 bg-rose-50/40">
                <div className="h-8 w-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                  ២
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">រកឃើញវិជ្ជមាន (HIV Reactive)</span>
                    <span className="text-sm font-bold font-mono text-rose-600">{totalReactive.toLocaleString()}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500">{overallYield}% នៃចំនួនតេស្តសរុប</div>
                </div>
              </div>

              {/* Conversion Step 2 to 3 */}
              <div className="flex items-center justify-center gap-2 text-[10.5px] font-semibold text-emerald-600 py-0.5">
                <ArrowRight className="h-3 w-3" />
                <span>អត្រាភ្ជាប់សេវា ART (Linkage Rate): {overallLinkage}%</span>
              </div>

              {/* Step 3: Linked to Care */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                  ៣
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">បានបញ្ជូន និងភ្ជាប់ ART (Linked)</span>
                    <span className="text-sm font-bold font-mono text-emerald-600">{totalLinked.toLocaleString()}</span>
                  </div>
                  <div className="text-[10.5px] text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span>សម្រេចបាន {overallLinkage}% (គោលដៅ UNAIDS ≥95%)</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Drop-off Gap */}
              {totalUnlinked > 0 ? (
                <div className="flex items-center gap-3 p-2 rounded-xl border border-amber-200 bg-amber-50/50 mt-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 ml-2" />
                  <div className="flex-1 flex items-center justify-between text-xs pr-2">
                    <span className="font-semibold text-amber-800">នៅសល់មិនទាន់បញ្ជូន (Drop-off Gap)៖</span>
                    <span className="font-mono font-bold text-amber-700">{totalUnlinked.toLocaleString()} នាក់</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-xl border border-emerald-100 bg-emerald-50/20 text-[11px] text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-1" />
                  <span>អត្រាភ្ជាប់សេវាសម្រេចបានពេញលេញ 100% គ្មានករណីបាត់បង់ (Zero Gap)!</span>
                </div>
              )}
            </div>
          ) : (
            /* Relative Cascade Bar Chart */
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cascadeRelativeData} margin={{ top: 10, right: 15, left: -5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10.5, fill: '#334155', fontWeight: 500 }} />
                  <YAxis tick={{ fontSize: 10.5, fill: '#64748b' }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="count" name="ចំនួន" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {cascadeRelativeData.map((entry, index) => (
                      <Cell key={`cascade-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Demographic Age & Sex (6 Cols on LG) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          {isRefreshing && <ChartLoadingOverlay label="កំពុងធ្វើបច្ចុប្បន្នភាពប្រជាសាស្ត្រ..." />}

          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 min-h-[44px]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Layers className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-slate-800">
                ការបែងចែកតាមក្រុមអាយុ និងភេទ
              </span>
            </div>

            {/* Demographics View Selector */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setDemoView('tested')}
                disabled={isInitialLoading}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  demoView === 'tested'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                តេស្តសរុប
              </button>
              <button
                type="button"
                onClick={() => setDemoView('reactive')}
                disabled={isInitialLoading}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  demoView === 'reactive'
                    ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ករណីវិជ្ជមាន
              </button>
              <button
                type="button"
                onClick={() => setDemoView('all')}
                disabled={isInitialLoading}
                className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-all cursor-pointer ${
                  demoView === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                រួមគ្នា
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            {isInitialLoading ? (
              <DemographicsChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageSexChartData} margin={{ top: 10, right: 15, left: -5, bottom: 20 }}>
                  <defs>
                    <linearGradient id="maleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="femaleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#db2777" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} />
                  <YAxis tick={{ fontSize: 10.5, fill: '#64748b' }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 6 }} />

                  {demoView === 'tested' && (
                    <>
                      <Bar dataKey="ប្រុស_តេស្ត" name="ប្រុស (តេស្ត)" fill="url(#maleGradient)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="ស្រី_តេស្ត" name="ស្រី (តេស្ត)" fill="url(#femaleGradient)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </>
                  )}

                  {demoView === 'reactive' && (
                    <>
                      <Bar dataKey="ប្រុស_វិជ្ជមាន" name="ប្រុស (វិជ្ជមាន)" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="ស្រី_វិជ្ជមាន" name="ស្រី (វិជ្ជមាន)" fill="#e11d48" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </>
                  )}

                  {demoView === 'all' && (
                    <>
                      <Bar dataKey="ប្រុស_តេស្ត" name="ប្រុស (តេស្ត)" fill="#60a5fa" radius={[3, 3, 0, 0]} maxBarSize={16} />
                      <Bar dataKey="ស្រី_តេស្ត" name="ស្រី (តេស្ត)" fill="#f472b6" radius={[3, 3, 0, 0]} maxBarSize={16} />
                      <Bar dataKey="ប្រុស_វិជ្ជមាន" name="ប្រុស (វិជ្ជមាន)" fill="#1d4ed8" radius={[3, 3, 0, 0]} maxBarSize={14} />
                      <Bar dataKey="ស្រី_វិជ្ជមាន" name="ស្រី (វិជ្ជមាន)" fill="#be185d" radius={[3, 3, 0, 0]} maxBarSize={14} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 5. Minimalist Data Table with Drill-down & Yield Highlights */}
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden relative">
        {isRefreshing && <ChartLoadingOverlay label="កំពុងធ្វើបច្ចុប្បន្នភាពតារាង..." />}

        <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 min-h-[44px]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              តារាងទិន្នន័យតាមប្រភេទអតិថិជនលម្អិត
            </span>
            <span className="text-[11px] text-slate-400">
              {isInitialLoading ? '...' : `(${byTargetGroup.length} ក្រុម)`}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>ចុច</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">មើលបញ្ជី</span>
            <span>ដើម្បីបើក Line List</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200/80 font-semibold">
              <tr>
                <th className="py-2.5 px-4 text-[11px]">ប្រភេទអតិថិជន</th>
                <th className="py-2.5 px-4 text-[11px] text-right">តេស្តសរុប</th>
                <th className="py-2.5 px-4 text-[11px] text-right">វិជ្ជមាន</th>
                <th className="py-2.5 px-4 text-[11px] text-right">Yield (%)</th>
                <th className="py-2.5 px-4 text-[11px] text-right">ឆ្លងថ្មី (RTRI)</th>
                <th className="py-2.5 px-4 text-[11px] text-right">បញ្ជូន ART</th>
                <th className="py-2.5 px-4 text-[11px] text-right">Linkage (%)</th>
                <th className="py-2.5 px-4 text-[11px] text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isInitialLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-2.5 px-4"><div className="h-3.5 bg-slate-200/70 rounded w-28" /></td>
                    <td className="py-2.5 px-4 text-right"><div className="h-3.5 bg-slate-200/70 rounded w-16 ml-auto" /></td>
                    <td className="py-2.5 px-4 text-right"><div className="h-3.5 bg-slate-200/70 rounded w-12 ml-auto" /></td>
                    <td className="py-2.5 px-4 text-right"><div className="h-3.5 bg-slate-200/70 rounded w-10 ml-auto" /></td>
                    <td className="py-2.5 px-4 text-right"><div className="h-3.5 bg-slate-200/70 rounded w-10 ml-auto" /></td>
                    <td className="py-2.5 px-4 text-right"><div className="h-3.5 bg-slate-200/70 rounded w-14 ml-auto" /></td>
                    <td className="py-2.5 px-4 text-right"><div className="h-3.5 bg-slate-200/70 rounded w-12 ml-auto" /></td>
                    <td className="py-2.5 px-4 text-center"><div className="h-6 w-16 bg-slate-200/70 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : (
                byTargetGroup.map((tg, idx) => {
                  const tested = Number(tg.total_tested || 0);
                  const reactive = Number(tg.reactive_count || 0);
                  const recent = Number(tg.recent_count || 0);
                  const linked = Number(tg.linked_count || 0);
                  const yieldRate = tested > 0 ? ((reactive / tested) * 100).toFixed(1) : 0;
                  const linkRate = reactive > 0 ? ((linked / reactive) * 100).toFixed(1) : 0;
                  const isHighYield = Number(yieldRate) >= 10;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800 flex items-center gap-2">
                        <span 
                          className="h-2 w-2 rounded-full shrink-0" 
                          style={{ backgroundColor: POPULATION_COLORS[idx % POPULATION_COLORS.length].fill }} 
                        />
                        <span>{tg.target_group}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                        {tested.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600">
                        {reactive.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded font-semibold text-[11px] ${
                          isHighYield 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80' 
                            : 'text-slate-800'
                        }`}>
                          {yieldRate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-purple-600 font-medium">
                        {recent.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-600">
                        {linked.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded font-semibold text-[11px] ${
                          Number(linkRate) >= 95 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}>
                          {linkRate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {onDrillDownToLineList && tg.target_group_id && (
                          <button
                            type="button"
                            onClick={() => onDrillDownToLineList(tg.target_group_id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer active:scale-95"
                          >
                            <span>មើលបញ្ជី</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}

export default GroupDashboard;
