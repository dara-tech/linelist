import React from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function FilterPanel({
  filters,
  onChangeFilter,
  onResetFilters,
  provinces = [],
  ods = [],
  sites = [],
  targetGroups = [],
}) {
  const filteredOds = filters.provinceId
    ? ods.filter((o) => String(o.province_id) === String(filters.provinceId))
    : ods;

  const filteredSites = filters.odCode
    ? sites.filter((s) => String(s.od_code) === String(filters.odCode))
    : filters.provinceId
    ? sites.filter((s) => String(s.province_id) === String(filters.provinceId))
    : sites;

  return (
    <div className="mx-6 my-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Province */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Province
          </label>
          <select
            value={filters.provinceId || ''}
            onChange={(e) => {
              onChangeFilter('provinceId', e.target.value);
              onChangeFilter('odCode', '');
              onChangeFilter('siteCode', '');
            }}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Provinces</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.province_en}
              </option>
            ))}
          </select>
        </div>

        {/* OD */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Operational District
          </label>
          <select
            value={filters.odCode || ''}
            onChange={(e) => {
              onChangeFilter('odCode', e.target.value);
              onChangeFilter('siteCode', '');
            }}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All ODs</option>
            {filteredOds.map((o) => (
              <option key={o.od_code} value={o.od_code}>
                {o.name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Site */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Facility / Site
          </label>
          <select
            value={filters.siteCode || ''}
            onChange={(e) => onChangeFilter('siteCode', e.target.value)}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Facilities</option>
            {filteredSites.map((s) => (
              <option key={s.site_code} value={s.site_code}>
                {s.site_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onChangeFilter('dateFrom', e.target.value)}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Date To
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onChangeFilter('dateTo', e.target.value)}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* HIV Result */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            HIV Result
          </label>
          <select
            value={filters.hivResult || ''}
            onChange={(e) => onChangeFilter('hivResult', e.target.value)}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Results</option>
            <option value="1">Reactive</option>
            <option value="2">Non-reactive</option>
            <option value="3">Inconclusive</option>
          </select>
        </div>
      </div>

      {/* Row 2: Target Population, Sex, Search */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-2.5 pt-2.5 border-t border-slate-800">
        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Key Population
          </label>
          <select
            value={filters.targetGroupId || ''}
            onChange={(e) => onChangeFilter('targetGroupId', e.target.value)}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Groups</option>
            {targetGroups.map((tg) => (
              <option key={tg.Tid} value={tg.Tid}>
                {tg.Targroup}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Sex
          </label>
          <select
            value={filters.sex || ''}
            onChange={(e) => onChangeFilter('sex', e.target.value)}
            className="w-full h-8 rounded border border-slate-700 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Genders</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">TG</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-[11px] font-medium text-slate-400 mb-1 block">
            Search Identifier
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-500" />
            <Input
              placeholder="Filter by PMRS, HTS code, UUIC, or Site..."
              value={filters.search || ''}
              onChange={(e) => onChangeFilter('search', e.target.value)}
              className="h-8 pl-7 text-xs bg-slate-900 border-slate-700 rounded"
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="w-full h-8 text-xs border-slate-700 hover:bg-slate-800 text-slate-300 gap-1 rounded"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
