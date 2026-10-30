import React, { useState, useMemo } from 'react';
import { Building2, X, Search, Check, MapPin } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function OrgUnitSelectModal({
  isOpen,
  onClose,
  provinces = [],
  ods = [],
  sites = [],
  selectedProvinceId,
  selectedOdCode,
  selectedSiteCode,
  onSelectOrgUnit,
}) {
  const [search, setSearch] = useState('');
  const [activeProvince, setActiveProvince] = useState(selectedProvinceId || '');
  const [activeOd, setActiveOd] = useState(selectedOdCode || '');

  const filteredOds = useMemo(() => {
    return activeProvince
      ? ods.filter((o) => String(o.province_id) === String(activeProvince))
      : ods;
  }, [ods, activeProvince]);

  const filteredSites = useMemo(() => {
    let list = sites;
    if (activeOd) {
      list = list.filter((s) => String(s.od_code) === String(activeOd));
    } else if (activeProvince) {
      list = list.filter((s) => String(s.province_id) === String(activeProvince));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          (s.site_name && s.site_name.toLowerCase().includes(q)) ||
          (s.site_code && s.site_code.toLowerCase().includes(q))
      );
    }
    return list;
  }, [sites, activeProvince, activeOd, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[var(--app-header-bar-bg)]" />
            <span className="text-sm font-bold text-slate-800">
              ជ្រើសរើសទីតាំង / មណ្ឌលសុខាភិបាល (Organisation Unit)
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cascading selectors & search */}
        <div className="p-3 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50/30">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 mb-0.5 block">ខេត្ត (Province)</label>
            <select
              value={activeProvince}
              onChange={(e) => {
                setActiveProvince(e.target.value);
                setActiveOd('');
              }}
              className="w-full h-8 rounded border border-slate-300 bg-white px-2 text-xs text-slate-800 focus:outline-none focus:border-[var(--app-header-bar-bg)]"
            >
              <option value="">All Provinces (ទូទាំងប្រទេស)</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.province_en} ({p.province_kh})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 mb-0.5 block">ស្រុកប្រតិបត្តិ (OD)</label>
            <select
              value={activeOd}
              onChange={(e) => setActiveOd(e.target.value)}
              className="w-full h-8 rounded border border-slate-300 bg-white px-2 text-xs text-slate-800 focus:outline-none focus:border-[var(--app-header-bar-bg)]"
            >
              <option value="">All ODs (ស្រុកប្រតិបត្តិទាំងអស់)</option>
              {filteredOds.map((o) => (
                <option key={o.od_code} value={o.od_code}>
                  {o.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 mb-0.5 block">ស្វែងរក (Search Site)</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 text-slate-400" />
              <Input
                placeholder="ឈ្មោះមណ្ឌល / Code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-6 text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Facility List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100">
          <button
            onClick={() => {
              onSelectOrgUnit(activeProvince, activeOd, '', 'All Facilities');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
              !selectedSiteCode && !selectedOdCode && !selectedProvinceId
                ? 'bg-[var(--app-header-bar-bg)]/10 text-[var(--app-header-bar-bg)]'
                : 'text-slate-800 hover:bg-slate-100'
            }`}
          >
            <span>All Facilities (ជ្រើសរើសទាំងអស់)</span>
            {!selectedSiteCode && !selectedOdCode && !selectedProvinceId && (
              <Check className="h-4 w-4 text-[var(--app-header-bar-bg)]" />
            )}
          </button>

          {filteredSites.map((site) => {
            const isSelected = String(selectedSiteCode) === String(site.site_code);
            return (
              <button
                key={site.site_code}
                onClick={() => {
                  onSelectOrgUnit(site.province_id, site.od_code, site.site_code, site.site_name);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-[var(--app-header-bar-bg)]/10 text-[var(--app-header-bar-bg)] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-medium">{site.site_name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Code: [{site.site_code}] &bull; OD: {site.od_code}
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-[var(--app-header-bar-bg)] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 text-xs">
          <span className="text-slate-500 text-[11px] font-mono">
            {filteredSites.length} Facilities Available
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
