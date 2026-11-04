import { getDbPool } from '../config/db.js';
import ExcelJS from 'exceljs';
import {
  getActiveArtDataset,
  getActiveArtByProvinceMap,
  getActiveArtBySiteMap
} from '../services/activeArtService.js';

function resolvePeriodDates(query) {
  let quarter = query.quarter || '2';
  let year = query.year || '2026';
  let dateFrom = query.dateFrom;
  let dateTo = query.dateTo;

  if (!dateFrom || !dateTo) {
    if (quarter === '1') {
      dateFrom = `${year}-01-01`;
      dateTo = `${year}-03-31`;
    } else if (quarter === '2') {
      dateFrom = `${year}-04-01`;
      dateTo = `${year}-06-30`;
    } else if (quarter === '3') {
      dateFrom = `${year}-07-01`;
      dateTo = `${year}-09-30`;
    } else if (quarter === '4') {
      dateFrom = `${year}-10-01`;
      dateTo = `${year}-12-31`;
    } else {
      dateFrom = `${year}-04-01`;
      dateTo = `${year}-06-30`;
    }
  } else {
    const m = dateFrom.match(/^(\d{4})-(\d{2})/);
    if (m) {
      year = m[1];
      const monthNum = parseInt(m[2], 10);
      if (monthNum >= 1 && monthNum <= 3) quarter = '1';
      else if (monthNum >= 4 && monthNum <= 6) quarter = '2';
      else if (monthNum >= 7 && monthNum <= 9) quarter = '3';
      else if (monthNum >= 10 && monthNum <= 12) quarter = '4';
    }
  }

  return { quarter, year, dateFrom, dateTo };
}

async function queryDynamicProvincialReport(dateFrom, dateTo) {
  let provincesData = [];
  try {
    const pool = getDbPool();

    // 1. Dynamic VCCT counts by province for the selected dates
    const [dynamicVcctRows] = await pool.query(
      `
      SELECT 
        p.id AS province_id,
        p.province_kh,
        p.province_en,
        COUNT(DISTINCT CASE WHEN s.vcct_site_code IS NOT NULL AND s.vcct_site_code != '' THEN s.vcct_site_code END) AS vcct_sites,
        SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_total,
        SUM(CASE WHEN v.hiv_result = 2 AND (v.sex = 0 OR v.sex = 2) THEN 1 ELSE 0 END) AS reactive_female
      FROM tblprovince p
      LEFT JOIN tblsites s ON s.province_id = p.id AND s.status_id = 1
      LEFT JOIN vccts v ON (v.site_code = s.vcct_site_code OR v.site_code = s.art_site_code) AND v.registration_date >= ? AND v.registration_date <= ?
      GROUP BY p.id, p.province_kh, p.province_en
      ORDER BY p.id ASC
      `,
      [dateFrom, dateTo]
    );

    // 2. Dynamic Active ART by Province (following official Indicator 10 logic)
    let artProvMap = new Map();
    try {
      artProvMap = await getActiveArtByProvinceMap(dateTo);
    } catch (artErr) {
      console.warn('Note: getActiveArtByProvinceMap error:', artErr.message);
    }

    if (dynamicVcctRows && dynamicVcctRows.length > 0) {
      provincesData = dynamicVcctRows.map((r, idx) => {
        const dynamicArt = artProvMap.get(r.province_id);

        const dynamicPlhivTotal = dynamicArt ? dynamicArt.plhiv_total : 0;
        const dynamicPlhivFemale = dynamicArt ? dynamicArt.plhiv_female : 0;
        const dynamicPlhivMale = dynamicArt ? dynamicArt.plhiv_male : 0;
        const dynamicPlhivChild = dynamicArt ? dynamicArt.plhiv_child : 0;
        const dynamicArtSites = dynamicArt ? dynamicArt.active_art_sites : 0;

        return {
          no: idx + 1,
          province_id: r.province_id,
          province_kh: r.province_kh,
          province_en: r.province_en,
          art_sites: dynamicArtSites,
          plhiv_total: dynamicPlhivTotal,
          plhiv_female: dynamicPlhivFemale,
          plhiv_male: dynamicPlhivMale,
          plhiv_child: dynamicPlhivChild,
          vcct_sites: Number(r.vcct_sites || 0),
          reactive_total: Number(r.reactive_total || 0),
          reactive_female: Number(r.reactive_female || 0),
        };
      });
    }
  } catch (dbErr) {
    console.error('queryDynamicProvincialReport error:', dbErr.message);
  }
  return provincesData;
}

/**
 * Pure READ-ONLY: Get ART and VCCT Provincial Summary Report
 */
export async function getArtVcctSummaryReport(req, res) {
  try {
    const { quarter, year, dateFrom, dateTo } = resolvePeriodDates(req.query);
    const provincesData = await queryDynamicProvincialReport(dateFrom, dateTo);

    // Compute Totals
    const totals = provincesData.reduce(
      (acc, cur) => {
        acc.art_sites += cur.art_sites;
        acc.plhiv_total += cur.plhiv_total;
        acc.plhiv_female += cur.plhiv_female;
        acc.vcct_sites += cur.vcct_sites;
        acc.reactive_total += cur.reactive_total;
        acc.reactive_female += cur.reactive_female;
        return acc;
      },
      {
        art_sites: 0,
        plhiv_total: 0,
        plhiv_female: 0,
        vcct_sites: 0,
        reactive_total: 0,
        reactive_female: 0,
      }
    );

    return res.json({
      success: true,
      meta: {
        title_kh: 'តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍/ជំងឺអេដស៍ និងការរាយការណ៍',
        sub_title_kh: `ត្រីមាសទី ${quarter} ឆ្នាំ ${year}`,
        service_types: ['ART', 'VCCT'],
        quarter,
        year,
        dateFrom,
        dateTo,
        generated_at: new Date().toISOString(),
      },
      totals,
      data: provincesData,
    });
  } catch (err) {
    console.error('getArtVcctSummaryReport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Pure READ-ONLY: Export ART and VCCT Summary to formatted Excel (.xlsx)
 */
export async function exportArtVcctReportExcel(req, res) {
  try {
    const { quarter, year, dateFrom, dateTo } = resolvePeriodDates(req.query);
    const provincesData = await queryDynamicProvincialReport(dateFrom, dateTo);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NCHADS HIV Reporting System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(`ART & VCCT Q${quarter} ${year}`, {
      views: [{ showGridLines: true }],
      properties: { defaultRowHeight: 22 },
    });

    // 1. Kingdom of Cambodia Header
    sheet.mergeCells('A1:G1');
    const h1 = sheet.getCell('A1');
    h1.value = 'ព្រះរាជាណាចក្រកម្ពុជា';
    h1.font = { name: 'Khmer OS Muol Light', size: 12, bold: true };
    h1.alignment = { horizontal: 'right', vertical: 'middle' };

    sheet.mergeCells('A2:G2');
    const h2 = sheet.getCell('A2');
    h2.value = 'ជាតិ សាសនា ព្រះមហាក្សត្រ';
    h2.font = { name: 'Khmer OS Muol Light', size: 11, bold: true };
    h2.alignmen


    t = { horizontal: 'right', vertical: 'middle' };

    // 2. Report Title
    sheet.mergeCells('A4:G4');
    const titleCell = sheet.getCell('A4');
    titleCell.value = 'តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍/ជំងឺអេដស៍ និងការរាយការណ៍ (ART & VCCT)';
    titleCell.font = { name: 'Khmer OS Muol Light', size: 13, bold: true, color: { argb: 'FF166534' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(4).height = 28;

    sheet.mergeCells('A5:G5');
    const subTitle = sheet.getCell('A5');
    subTitle.value = `ត្រីមាសទី ${quarter} ឆ្នាំ ${year}`;
    subTitle.font = { name: 'Khmer OS Battambang', size: 11, bold: true, color: { argb: 'FF15803D' } };
    subTitle.alignment = { horizontal: 'center', vertical: 'middle' };

    // 3. Official Green Two-Tier Header
    sheet.mergeCells('A7:A8');
    sheet.getCell('A7').value = 'ល.រ';

    sheet.mergeCells('B7:B8');
    sheet.getCell('B7').value = 'រាជធានី-ខេត្ត';

    sheet.mergeCells('C7:C8');
    sheet.getCell('C7').value = 'ចំនួនសេវា ART';

    sheet.mergeCells('D7:E7');
    sheet.getCell('D7').value = 'ចំនួន PLHIV កំពុងទទួល ART';
    sheet.getCell('D8').value = 'សរុប';
    sheet.getCell('E8').value = 'ស្រី';

    sheet.mergeCells('F7:F8');
    sheet.getCell('F7').value = 'ចំនួនសេវា VCCT';

    sheet.mergeCells('G7:H7');
    sheet.getCell('G7').value = 'ចំនួនអតិថិជនវិជ្ជមានមេរោគអេដស៍';
    sheet.getCell('G8').value = 'សរុប';
    sheet.getCell('H8').value = 'ស្រី';

    // Style Header Cells
    const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    [7, 8].forEach((rowNum) => {
      sheet.getRow(rowNum).height = 26;
      headerCols.forEach((col) => {
        const cell = sheet.getCell(`${col}${rowNum}`);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9EAD3' }, // Official light green from original document
        };
        cell.font = { name: 'Khmer OS Battambang', size: 10, bold: true, color: { argb: 'FF1E3A1E' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF86A789' } },
          left: { style: 'thin', color: { argb: 'FF86A789' } },
          bottom: { style: 'thin', color: { argb: 'FF86A789' } },
          right: { style: 'thin', color: { argb: 'FF86A789' } },
        };
      });
    });

    // 4. Data Rows
    let currentRow = 9;
    provincesData.forEach((item, idx) => {
      const row = sheet.getRow(currentRow);
      row.values = [
        item.no,
        item.province_kh,
        item.art_sites,
        item.plhiv_total,
        item.plhiv_female,
        item.vcct_sites,
        item.reactive_total,
        item.reactive_female,
      ];

      row.height = 20;

      headerCols.forEach((col, cIdx) => {
        const cell = sheet.getCell(`${col}${currentRow}`);
        cell.font = { name: 'Khmer OS Battambang', size: 9.5 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };

        if (cIdx === 0) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else if (cIdx === 1) {
          cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        } else {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        }

        if (idx % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FCF8' },
          };
        }
      });

      currentRow++;
    });

    // 5. Total Row
    const totalRow = sheet.getRow(currentRow);
    totalRow.height = 24;
    totalRow.values = [
      '',
      'សរុប:',
      { formula: `SUM(C9:C${currentRow - 1})` },
      { formula: `SUM(D9:D${currentRow - 1})` },
      { formula: `SUM(E9:E${currentRow - 1})` },
      { formula: `SUM(F9:F${currentRow - 1})` },
      { formula: `SUM(G9:G${currentRow - 1})` },
      { formula: `SUM(H9:H${currentRow - 1})` },
    ];

    headerCols.forEach((col, cIdx) => {
      const cell = sheet.getCell(`${col}${currentRow}`);
      cell.font = { name: 'Khmer OS Battambang', size: 10, bold: true, color: { argb: 'FF0F3818' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F4EA' },
      };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF86A789' } },
        bottom: { style: 'double', color: { argb: 'FF86A789' } },
        left: { style: 'thin', color: { argb: 'FF86A789' } },
        right: { style: 'thin', color: { argb: 'FF86A789' } },
      };

      if (cIdx === 1) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (cIdx > 1) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      }
    });

    // Set Column Widths
    sheet.getColumn('A').width = 6;
    sheet.getColumn('B').width = 24;
    sheet.getColumn('C').width = 16;
    sheet.getColumn('D').width = 18;
    sheet.getColumn('E').width = 16;
    sheet.getColumn('F').width = 16;
    sheet.getColumn('G').width = 18;
    sheet.getColumn('H').width = 16;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="NCHADS_ART_VCCT_Report_Q${quarter}_${year}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('exportArtVcctReportExcel error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Pure READ-ONLY: Dynamic Site-Level / Facility Breakdown Report Query
 */
export async function queryDynamicSiteReport(query = {}) {
  const { quarter, year, dateFrom, dateTo } = resolvePeriodDates(query);
  const pool = getDbPool();

  const siteConditions = ['s.status_id = 1'];
  const siteParams = [];

  if (query.provinceId) {
    siteConditions.push('s.province_id = ?');
    siteParams.push(query.provinceId);
  }
  if (query.odCode) {
    siteConditions.push('s.od_code = ?');
    siteParams.push(query.odCode);
  }
  if (query.siteCode) {
    siteConditions.push('(s.art_site_code = ? OR s.vcct_site_code = ?)');
    siteParams.push(query.siteCode, query.siteCode);
  }

  const siteWhere = siteConditions.join(' AND ');

  // 1. Fetch sites with OD and Province
  const [sites] = await pool.query(
    `
    SELECT 
      s.id,
      s.site_name,
      s.art_site_code,
      s.vcct_site_code,
      s.od_code,
      COALESCE(NULLIF(od.name_kh, ''), od.name_en, s.od_name) AS od_name,
      s.province_id,
      COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name
    FROM tblsites s
    LEFT JOIN tblods od ON s.od_code = od.od_code
    LEFT JOIN tblprovince p ON s.province_id = p.id
    WHERE ${siteWhere}
    ORDER BY p.id ASC, s.od_code ASC, s.site_name ASC
    `,
    siteParams
  );

  // 2. VCCT aggregate by site
  const [vcctRows] = await pool.query(
    `
    SELECT 
      v.site_code,
      COUNT(*) AS total_tested,
      SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_total,
      SUM(CASE WHEN v.hiv_result = 2 AND (v.sex = 0 OR v.sex = 2) THEN 1 ELSE 0 END) AS reactive_female,
      SUM(CASE WHEN v.hiv_result = 2 AND v.refer_to_service_id > 0 THEN 1 ELSE 0 END) AS linked_total
    FROM vccts v
    WHERE v.registration_date >= ? AND v.registration_date <= ?
    GROUP BY v.site_code
    `,
    [dateFrom, dateTo]
  );

  const vcctMap = new Map();
  vcctRows.forEach((r) => {
    vcctMap.set(r.site_code, {
      total_tested: Number(r.total_tested || 0),
      reactive_total: Number(r.reactive_total || 0),
      reactive_female: Number(r.reactive_female || 0),
      linked_total: Number(r.linked_total || 0),
    });
  });

  // 3. ART cohort by site using official Indicator 10 logic
  let artMap = new Map();
  try {
    const siteActiveMap = await getActiveArtBySiteMap(dateTo);
    if (siteActiveMap && siteActiveMap.size > 0) {
      artMap = siteActiveMap;
    }
  } catch (artErr) {
    console.warn('Note: art cohort query warning in site report:', artErr.message);
  }

  const siteList = sites.map((s, idx) => {
    const vcct = vcctMap.get(s.vcct_site_code) || vcctMap.get(s.art_site_code) || {
      total_tested: 0,
      reactive_total: 0,
      reactive_female: 0,
      linked_total: 0,
    };
    const art = artMap.get(s.art_site_code) || {
      total_active: 0,
      female_active: 0,
      male_active: 0,
      child_active: 0,
      adult_active: 0,
    };

    const activePlhiv = Number(art.total_active || 0);
    const femalePlhiv = Number(art.female_active || 0);
    const malePlhiv = Number(art.male_active || 0);
    const childPlhiv = Number(art.child_active || 0);
    const adultPlhiv = Number(art.adult_active || 0);

    const yieldRate = vcct.total_tested > 0
      ? ((vcct.reactive_total / vcct.total_tested) * 100).toFixed(1)
      : '0.0';
    const linkageRate = vcct.reactive_total > 0
      ? ((vcct.linked_total / vcct.reactive_total) * 100).toFixed(1)
      : '0.0';

    return {
      no: idx + 1,
      site_id: s.id,
      site_name: s.site_name,
      art_site_code: s.art_site_code || '-',
      vcct_site_code: s.vcct_site_code || '-',
      has_art: Boolean(s.art_site_code),
      has_vcct: Boolean(s.vcct_site_code),
      od_code: s.od_code,
      od_name: s.od_name || '-',
      province_id: s.province_id,
      province_name: s.province_name,
      plhiv_total: activePlhiv,
      plhiv_female: femalePlhiv,
      plhiv_male: malePlhiv,
      plhiv_child: childPlhiv,
      plhiv_adult: adultPlhiv,
      vcct_tested_total: vcct.total_tested,
      vcct_reactive_total: vcct.reactive_total,
      vcct_reactive_female: vcct.reactive_female,
      vcct_linked_count: vcct.linked_total,
      yield_rate: yieldRate,
      linkage_rate: linkageRate,
    };
  });

  return { siteList, quarter, year, dateFrom, dateTo };
}

/**
 * Pure READ-ONLY: Get ART and VCCT Facility / Site-Level Breakdown Report
 */
export async function getArtVcctSiteReport(req, res) {
  try {
    const { siteList, quarter, year, dateFrom, dateTo } = await queryDynamicSiteReport(req.query);

    const totals = siteList.reduce(
      (acc, cur) => {
        acc.total_sites += 1;
        if (cur.has_art) acc.art_sites += 1;
        if (cur.has_vcct) acc.vcct_sites += 1;
        acc.plhiv_total += cur.plhiv_total;
        acc.plhiv_female += cur.plhiv_female;
        acc.vcct_tested_total += cur.vcct_tested_total;
        acc.vcct_reactive_total += cur.vcct_reactive_total;
        acc.vcct_reactive_female += cur.vcct_reactive_female;
        acc.vcct_linked_count += cur.vcct_linked_count;
        return acc;
      },
      {
        total_sites: 0,
        art_sites: 0,
        vcct_sites: 0,
        plhiv_total: 0,
        plhiv_female: 0,
        vcct_tested_total: 0,
        vcct_reactive_total: 0,
        vcct_reactive_female: 0,
        vcct_linked_count: 0,
      }
    );

    return res.json({
      success: true,
      meta: {
        title_kh: 'តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍/ជំងឺអេដស៍ បំបែកតាមមូលដ្ឋានសុខាភិបាល (ART & VCCT Breakdown by Site)',
        sub_title_kh: `ត្រីមាសទី ${quarter} ឆ្នាំ ${year}`,
        service_types: ['ART', 'VCCT'],
        quarter,
        year,
        dateFrom,
        dateTo,
        generated_at: new Date().toISOString(),
      },
      totals,
      data: siteList,
    });
  } catch (err) {
    console.error('getArtVcctSiteReport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Pure READ-ONLY: Export ART and VCCT Site Breakdown Report to Excel (.xlsx)
 */
export async function exportArtVcctSiteReportExcel(req, res) {
  try {
    const { siteList, quarter, year } = await queryDynamicSiteReport(req.query);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NCHADS HIV Reporting System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(`ART & VCCT Sites Q${quarter} ${year}`, {
      views: [{ showGridLines: true }],
      properties: { defaultRowHeight: 22 },
    });

    // 1. Kingdom of Cambodia Header
    sheet.mergeCells('A1:L1');
    const h1 = sheet.getCell('A1');
    h1.value = 'ព្រះរាជាណាចក្រកម្ពុជា';
    h1.font = { name: 'Khmer OS Muol Light', size: 12, bold: true };
    h1.alignment = { horizontal: 'right', vertical: 'middle' };

    sheet.mergeCells('A2:L2');
    const h2 = sheet.getCell('A2');
    h2.value = 'ជាតិ សាសនា ព្រះមហាក្សត្រ';
    h2.font = { name: 'Khmer OS Muol Light', size: 11, bold: true };
    h2.alignment = { horizontal: 'right', vertical: 'middle' };

    // 2. Report Title
    sheet.mergeCells('A4:L4');
    const titleCell = sheet.getCell('A4');
    titleCell.value = 'តារាងសង្ខេបព័ត៌មានអ្នកផ្ទុកមេរោគអេដស៍/ជំងឺអេដស៍ បំបែកតាមមូលដ្ឋានសុខាភិបាល (ART & VCCT Breakdown by Site)';
    titleCell.font = { name: 'Khmer OS Muol Light', size: 13, bold: true, color: { argb: 'FF166534' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(4).height = 28;

    sheet.mergeCells('A5:L5');
    const subTitle = sheet.getCell('A5');
    subTitle.value = `ត្រីមាសទី ${quarter} ឆ្នាំ ${year}`;
    subTitle.font = { name: 'Khmer OS Battambang', size: 11, bold: true, color: { argb: 'FF15803D' } };
    subTitle.alignment = { horizontal: 'center', vertical: 'middle' };

    // 3. Official Green Two-Tier Header
    sheet.mergeCells('A7:A8');
    sheet.getCell('A7').value = 'ល.រ';

    sheet.mergeCells('B7:B8');
    sheet.getCell('B7').value = 'រាជធានី-ខេត្ត';

    sheet.mergeCells('C7:C8');
    sheet.getCell('C7').value = 'ស្រុកប្រតិបត្តិ (OD)';

    sheet.mergeCells('D7:D8');
    sheet.getCell('D7').value = 'ឈ្មោះមូលដ្ឋានសុខាភិបាល';

    sheet.mergeCells('E7:E8');
    sheet.getCell('E7').value = 'កូដ ART';

    sheet.mergeCells('F7:F8');
    sheet.getCell('F7').value = 'កូដ VCCT';

    sheet.mergeCells('G7:H7');
    sheet.getCell('G7').value = 'PLHIV កំពុងទទួល ART';
    sheet.getCell('G8').value = 'សរុប';
    sheet.getCell('H8').value = 'ស្រី';

    sheet.mergeCells('I7:I8');
    sheet.getCell('I7').value = 'ធ្វើតេស្តសរុប';

    sheet.mergeCells('J7:K7');
    sheet.getCell('J7').value = 'រកឃើញវិជ្ជមាន';
    sheet.getCell('J8').value = 'សរុប';
    sheet.getCell('K8').value = 'ស្រី';

    sheet.mergeCells('L7:L8');
    sheet.getCell('L7').value = 'បញ្ជូនទៅ ART';

    // Style Tier 1 & 2 headers
    const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    [7, 8].forEach((rowNum) => {
      const row = sheet.getRow(rowNum);
      row.height = 24;
      headerCols.forEach((col) => {
        const cell = sheet.getCell(`${col}${rowNum}`);
        cell.font = { name: 'Khmer OS Battambang', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF166534' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF86A789' } },
          bottom: { style: 'thin', color: { argb: 'FF86A789' } },
          left: { style: 'thin', color: { argb: 'FF86A789' } },
          right: { style: 'thin', color: { argb: 'FF86A789' } },
        };
      });
    });

    // 4. Populate Data Rows
    let currentRow = 9;
    siteList.forEach((item, index) => {
      const row = sheet.getRow(currentRow);
      row.height = 20;
      const isEven = index % 2 === 1;

      row.values = [
        item.no,
        item.province_name,
        item.od_name,
        item.site_name,
        item.art_site_code,
        item.vcct_site_code,
        item.plhiv_total,
        item.plhiv_female,
        item.vcct_tested_total,
        item.vcct_reactive_total,
        item.vcct_reactive_female,
        item.vcct_linked_count,
      ];

      headerCols.forEach((col, cIdx) => {
        const cell = sheet.getCell(`${col}${currentRow}`);
        cell.font = { name: 'Khmer OS Battambang', size: 9.5 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };

        if (isEven) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' },
          };
        }

        if (cIdx === 0) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else if (cIdx >= 1 && cIdx <= 3) {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else if (cIdx === 4 || cIdx === 5) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        }
      });

      currentRow++;
    });

    // 5. Total Row
    const totalRow = sheet.getRow(currentRow);
    totalRow.height = 24;
    totalRow.values = [
      '',
      '',
      '',
      'សរុបទាំងអស់ (Total):',
      '',
      '',
      { formula: `SUM(G9:G${currentRow - 1})` },
      { formula: `SUM(H9:H${currentRow - 1})` },
      { formula: `SUM(I9:I${currentRow - 1})` },
      { formula: `SUM(J9:J${currentRow - 1})` },
      { formula: `SUM(K9:K${currentRow - 1})` },
      { formula: `SUM(L9:L${currentRow - 1})` },
    ];

    headerCols.forEach((col, cIdx) => {
      const cell = sheet.getCell(`${col}${currentRow}`);
      cell.font = { name: 'Khmer OS Battambang', size: 10, bold: true, color: { argb: 'FF0F3818' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F4EA' },
      };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF86A789' } },
        bottom: { style: 'double', color: { argb: 'FF86A789' } },
        left: { style: 'thin', color: { argb: 'FF86A789' } },
        right: { style: 'thin', color: { argb: 'FF86A789' } },
      };

      if (cIdx === 3) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (cIdx >= 6) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      }
    });

    // Set Column Widths
    sheet.getColumn('A').width = 6;
    sheet.getColumn('B').width = 18;
    sheet.getColumn('C').width = 20;
    sheet.getColumn('D').width = 28;
    sheet.getColumn('E').width = 12;
    sheet.getColumn('F').width = 14;
    sheet.getColumn('G').width = 16;
    sheet.getColumn('H').width = 14;
    sheet.getColumn('I').width = 15;
    sheet.getColumn('J').width = 15;
    sheet.getColumn('K').width = 13;
    sheet.getColumn('L').width = 15;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="NCHADS_ART_VCCT_Sites_Report_Q${quarter}_${year}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('exportArtVcctSiteReportExcel error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Pure READ-ONLY: Indicator 10 Active ART Patients in Current Quarter
 * Follows 10_active_art_current.sql official definition
 */
export async function getActiveArtReport(req, res) {
  try {
    const { dateTo, quarter, year } = resolvePeriodDates(req.query);
    const data = await getActiveArtDataset(dateTo);
    return res.json({
      success: true,
      data: {
        indicator: data.nationalSummary.indicator,
        period: {
          endDate: data.endDate,
          quarter,
          year,
        },
        summary: data.nationalSummary,
        by_province: Array.from(data.provinceMap.values()),
        by_site: Array.from(data.siteMap.values()),
      },
    });
  } catch (err) {
    console.error('getActiveArtReport error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

