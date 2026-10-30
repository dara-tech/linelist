import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Search, X, Check, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { MODAL } from '../../lib/overlayUi';

const INDENT_PX = 18;

const OrgUnitTreeNode = ({
  node,
  selectedId,
  expanded,
  onToggleExpand,
  onPick,
  depth = 0,
}) => {
  const hasChildren = (node.children || []).length > 0;
  const isExpanded = expanded.has(node.key);
  const isSelected = selectedId === node.key;

  return (
    <div className="select-none">
      <div
        className={cn(
          'group flex min-h-[34px] py-1 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[13px] leading-normal transition-colors',
          isSelected
            ? 'bg-sky-50 font-semibold text-[var(--app-header-bar-bg)]'
            : 'text-slate-700 hover:bg-slate-100/80'
        )}
        style={{ paddingLeft: `${depth * INDENT_PX + 8}px` }}
        onClick={() => onPick(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.key);
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-200/70 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'បង្រួម' : 'ពង្រីក'}
          >
            <ChevronRight
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-150',
                isExpanded && 'rotate-90 text-slate-600'
              )}
            />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}

        <span className="truncate flex-1 font-sans text-xs leading-normal py-0.5">
          {node.name}
        </span>

        {node.type === 'site' && (
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            [{node.id}]
          </span>
        )}

        {isSelected && (
          <Check className="h-3.5 w-3.5 text-[var(--app-header-bar-bg)] shrink-0" />
        )}
      </div>

      {hasChildren && isExpanded ? (
        <div role="group" className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <OrgUnitTreeNode
              key={child.key}
              node={child}
              selectedId={selectedId}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onPick={onPick}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export function OrgUnitTreeModal({
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
  const [expanded, setExpanded] = useState(() => new Set(['national', 'p-1', 'p-2', 'p-3', 'p-12']));
  
  // Draft node selection
  const [draftNode, setDraftNode] = useState(null);

  // Initialize draft when modal opens
  useEffect(() => {
    if (isOpen) {
      if (selectedSiteCode) {
        setDraftNode({ key: `site-${selectedSiteCode}`, type: 'site', siteCode: selectedSiteCode, provinceId: selectedProvinceId, odCode: selectedOdCode });
      } else if (selectedOdCode) {
        setDraftNode({ key: `od-${selectedOdCode}`, type: 'od', odCode: selectedOdCode, provinceId: selectedProvinceId });
      } else if (selectedProvinceId) {
        setDraftNode({ key: `p-${selectedProvinceId}`, type: 'province', provinceId: selectedProvinceId });
      } else {
        setDraftNode(null);
      }
    }
  }, [isOpen, selectedSiteCode, selectedOdCode, selectedProvinceId]);

  // Build tree hierarchy
  const treeData = useMemo(() => {
    const provinceNodes = provinces.map((p) => {
      const provinceOds = ods.filter((o) => String(o.province_id) === String(p.id));
      const odNodes = provinceOds.map((o) => {
        const odSites = sites.filter((s) => String(s.od_code) === String(o.od_code));
        return {
          key: `od-${o.od_code}`,
          id: o.od_code,
          name: o.name_kh || o.name_en,
          type: 'od',
          provinceId: p.id,
          odCode: o.od_code,
          children: odSites.map((s) => ({
            key: `site-${s.site_code}`,
            id: s.site_code,
            name: s.site_name,
            type: 'site',
            provinceId: p.id,
            odCode: o.od_code,
            siteCode: s.site_code,
          })),
        };
      });

      return {
        key: `p-${p.id}`,
        id: p.id,
        name: p.province_kh || p.province_en,
        type: 'province',
        provinceId: p.id,
        children: odNodes,
      };
    });

    return [
      {
        key: 'national',
        id: 'national',
        name: 'ទូទាំងប្រទេសកម្ពុជា',
        type: 'national',
        children: provinceNodes,
      },
    ];
  }, [provinces, ods, sites]);

  // Search filter
  const filteredSites = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.trim().toLowerCase();
    return sites.filter(
      (s) =>
        (s.site_name && s.site_name.toLowerCase().includes(q)) ||
        (s.site_code && s.site_code.toLowerCase().includes(q)) ||
        (s.od_name && s.od_name.toLowerCase().includes(q))
    );
  }, [sites, search]);

  const toggleExpand = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handlePick = (node) => {
    setDraftNode(node);
  };

  const handleApply = () => {
    if (!draftNode || draftNode.type === 'national') {
      onSelectOrgUnit('', '', '', 'គ្រប់ទីតាំង');
    } else if (draftNode.type === 'province') {
      onSelectOrgUnit(draftNode.provinceId, '', '', draftNode.name);
    } else if (draftNode.type === 'od') {
      onSelectOrgUnit(draftNode.provinceId, draftNode.odCode, '', draftNode.name);
    } else if (draftNode.type === 'site') {
      onSelectOrgUnit(draftNode.provinceId, draftNode.odCode, draftNode.siteCode, draftNode.name);
    }
    onClose();
  };

  const draftLabel = useMemo(() => {
    if (!draftNode) return 'គ្រប់ទីតាំង (ទូទាំងប្រទេស)';
    if (draftNode.type === 'site') {
      const foundSite = sites.find((s) => String(s.site_code) === String(draftNode.siteCode));
      return foundSite ? `${foundSite.site_name} [${foundSite.site_code}]` : draftNode.name;
    }
    if (draftNode.type === 'od') {
      const foundOd = ods.find((o) => String(o.od_code) === String(draftNode.odCode));
      return foundOd ? `ស្រុកប្រតិបត្តិ៖ ${foundOd.name_kh || foundOd.name_en}` : draftNode.name;
    }
    if (draftNode.type === 'province') {
      const foundProv = provinces.find((p) => String(p.id) === String(draftNode.provinceId));
      return foundProv ? `ខេត្ត៖ ${foundProv.province_kh || foundProv.province_en}` : draftNode.name;
    }
    return draftNode.name || 'គ្រប់ទីតាំង';
  }, [draftNode, sites, ods, provinces]);

  if (typeof document === 'undefined' || !isOpen) return null;

  return createPortal(
    <div className={MODAL.backdrop} onClick={onClose}>
      <div
        className={cn(MODAL.panelLg, 'max-w-lg')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={MODAL.header}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--app-header-bar-bg)] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                ជ្រើសរើសទីតាំងផ្តល់សេវា
              </h3>
              <p className="text-[12px] text-slate-500 leading-tight">
                ជ្រើសរើសតាមឋានានុក្រម ថ្នាក់ជាតិ &bull; ខេត្ត &bull; ស្រុកប្រតិបត្តិ &bull; មណ្ឌលសុខភាព
              </p>
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

        {/* Search Bar */}
        <div className="px-5 pt-3 pb-2">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 z-10" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះមណ្ឌល ឬលេខកូដ..."
              style={{ paddingLeft: '34px' }}
              className="h-9 pr-8 rounded-xl border-slate-200 bg-slate-50/50 text-[13px] transition-all focus:bg-white focus:border-[var(--app-header-bar-bg)] focus:ring-2 focus:ring-[var(--app-header-bar-bg)]/20"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors z-10"
                aria-label="លុបការស្វែងរក"
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Tree Scroll List */}
        <div className="px-5 pb-3">
          <div className="min-h-[220px] max-h-[340px] overflow-auto rounded-xl border border-slate-200/80 bg-slate-50/40 p-1.5 custom-scrollbar">
            {filteredSites ? (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 px-2 pb-1">
                  លទ្ធផលស្វែងរក ({filteredSites.length} មណ្ឌល)៖
                </div>
                {filteredSites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 text-xs">
                    គ្មានមណ្ឌលត្រូវនឹងការស្វែងរក
                  </div>
                ) : (
                  filteredSites.map((site) => {
                    const isSelected = draftNode?.siteCode === site.site_code;
                    return (
                      <button
                        key={site.site_code}
                        type="button"
                        onClick={() =>
                          setDraftNode({
                            key: `site-${site.site_code}`,
                            id: site.site_code,
                            name: site.site_name,
                            type: 'site',
                            provinceId: site.province_id,
                            odCode: site.od_code,
                            siteCode: site.site_code,
                          })
                        }
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer',
                          isSelected
                            ? 'bg-sky-50 text-[var(--app-header-bar-bg)] font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80'
                        )}
                      >
                        <div>
                          <div className="font-medium text-[13px]">{site.site_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            កូដ៖ [{site.site_code}] &bull; ស្រុកប្រតិបត្តិ៖ {site.od_name || site.od_code}
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[var(--app-header-bar-bg)] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-0.5">
                {treeData.map((node) => (
                  <OrgUnitTreeNode
                    key={node.key}
                    node={node}
                    selectedId={draftNode?.key}
                    expanded={expanded}
                    onToggleExpand={toggleExpand}
                    onPick={handlePick}
                    depth={0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={MODAL.footer}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-600 m-0">
              <span className="font-medium text-slate-400">បានជ្រើសរើស៖ </span>
              <span className="font-semibold text-[var(--app-header-bar-bg)]">
                {draftLabel}
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              onClick={() => {
                onSelectOrgUnit('', '', '', 'គ្រប់ទីតាំង');
                onClose();
              }}
            >
              គ្រប់មណ្ឌល (ទូទាំងប្រទេស)
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              បោះបង់
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-lg bg-[var(--app-header-bar-bg)] px-4 text-xs font-semibold text-white hover:bg-[var(--app-header-bar-bg-hover)] shadow-xs transition-colors cursor-pointer"
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
export default OrgUnitTreeModal;
