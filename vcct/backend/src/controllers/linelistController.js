import { getDbPool } from '../config/db.js';
import { generateVCCTExcelWorkbook } from '../services/excelService.js';

export async function getVCCTLineList(req, res) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const pool = getDbPool();

    // Query filters
    const conditions = ['1=1'];
    const params = [];

    if (req.query.provinceId) {
      conditions.push('s.province_id = ?');
      params.push(req.query.provinceId);
    }
    if (req.query.odCode) {
      conditions.push('s.od_code = ?');
      params.push(req.query.odCode);
    }
    if (req.query.siteCode) {
      conditions.push('v.site_code = ?');
      params.push(req.query.siteCode);
    }
    if (req.query.dateFrom) {
      conditions.push('v.registration_date >= ?');
      params.push(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      conditions.push('v.registration_date <= ?');
      params.push(req.query.dateTo);
    }
    if (req.query.sex) {
      conditions.push('v.sex = ?');
      params.push(req.query.sex);
    }
    if (req.query.targetGroupId) {
      conditions.push('v.patient_type_id = ?');
      params.push(req.query.targetGroupId);
    }
    if (req.query.hivResult) {
      conditions.push('v.hiv_result = ?');
      params.push(req.query.hivResult);
    }
    if (req.query.unlinkedOnly === 'true') {
      conditions.push('v.hiv_result = 2 AND (v.refer_to_service_id IS NULL OR v.refer_to_service_id != 1)');
    }
    if (req.query.linkedOnly === 'true') {
      conditions.push('v.hiv_result = 2 AND v.refer_to_service_id = 1');
    }
    if (req.query.rtriResult) {
      conditions.push('v.rtri_result_id = ?');
      params.push(req.query.rtriResult);
    }
    if (req.query.search && req.query.search.trim()) {
      const q = `%${req.query.search.trim()}%`;
      conditions.push('(v.pmrs_code LIKE ? OR v.hts_code LIKE ? OR v.uuic LIKE ? OR s.site_name LIKE ?)');
      params.push(q, q, q, q);
    }

    const whereClause = conditions.join(' AND ');

    // 1. Total Count & KPIs (In Cambodia VCCT: 1 = Non-reactive, 2 = Reactive, 3 = Inconclusive)
    const needsSiteJoinInKpi = Boolean(req.query.provinceId || req.query.odCode || (req.query.search && req.query.search.trim()));
    const siteJoinKpi = needsSiteJoinInKpi
      ? 'LEFT JOIN tblsites s ON (v.site_code = s.vcct_site_code OR v.site_code = s.art_site_code)'
      : '';

    const kpiSql = `
      SELECT 
        COUNT(*) AS totalTested,
        SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactiveCount,
        SUM(CASE WHEN v.hiv_result = 1 THEN 1 ELSE 0 END) AS nonReactiveCount,
        SUM(CASE WHEN v.hiv_result = 3 THEN 1 ELSE 0 END) AS inconclusiveCount,
        SUM(CASE WHEN v.rtri_result_id = 1 THEN 1 ELSE 0 END) AS recentCount,
        SUM(CASE WHEN v.rtri_result_id = 2 THEN 1 ELSE 0 END) AS longTermCount,
        SUM(CASE WHEN v.hiv_result = 2 AND v.refer_to_service_id = 1 THEN 1 ELSE 0 END) AS linkedToCareCount
      FROM vccts v
      ${siteJoinKpi}
      WHERE ${whereClause}
    `;

    const [[kpiRow]] = await pool.query(kpiSql, params);

    const total = Number(kpiRow?.totalTested || 0);
    const reactive = Number(kpiRow?.reactiveCount || 0);
    const recent = Number(kpiRow?.recentCount || 0);
    const linked = Number(kpiRow?.linkedToCareCount || 0);
    const unlinked = reactive > linked ? reactive - linked : 0;
    const unlinkedRate = reactive > 0 ? parseFloat(((unlinked / reactive) * 100).toFixed(1)) : 0;

    const kpis = {
      totalTested: total,
      reactiveCount: reactive,
      nonReactiveCount: Number(kpiRow?.nonReactiveCount || 0),
      inconclusiveCount: Number(kpiRow?.inconclusiveCount || 0),
      reactiveRate: total > 0 ? parseFloat(((reactive / total) * 100).toFixed(1)) : 0,
      recentCount: recent,
      longTermCount: Number(kpiRow?.longTermCount || 0),
      recencyRate: reactive > 0 ? parseFloat(((recent / reactive) * 100).toFixed(1)) : 0,
      linkedToCareCount: linked,
      linkageRate: reactive > 0 ? parseFloat(((linked / reactive) * 100).toFixed(1)) : 0,
      unlinkedCount: unlinked,
      unlinkedRate: unlinkedRate,
    };

    // 2. Main Paginated Records
    const offset = (page - 1) * limit;
    const querySql = `
      SELECT 
        v.site_code,
        s.site_name,
        s.od_code,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name,
        s.province_id,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        v.vcct_id,
        v.registration_date,
        v.pmrs_code,
        v.hts_code,
        v.uuic,
        v.idpoor,
        v.sex,
        v.dob,
        TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) AS age,
        v.marital_status_id,
        v.occupation_id,
        occ.Name AS occupation_name,
        v.education_id,
        v.phone_number,
        v.patient_type_id,
        COALESCE(NULLIF(tg.Targroupkh, ''), tg.Targroup, 'ប្រជាជនទូទៅ') AS target_group_name,
        v.history_of_test,
        v.history_of_test_result,
        v.is_agree_test_hiv,
        v.combo_result,
        v.hiv_result,
        v.is_agree_test_rtri,
        v.rtri_result_id,
        v.vl_result,
        v.rita_result,
        v.refer_to_service_id,
        v.refer_to_other,
        v.post_counseling_date,
        v.post_counseling_id,
        ltr.line_control,
        ltr.line_positive,
        ltr.line_longterm,
        ltr.cambo_ag,
        ltr.cambo_ab
      FROM vccts v
      LEFT JOIN tblsites s ON (v.site_code = s.vcct_site_code OR v.site_code = s.art_site_code)
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      LEFT JOIN tbloccupation occ ON v.occupation_id = occ.OcID
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
      ORDER BY v.registration_date DESC, v.vcct_id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(querySql, [...params, limit, offset]);

    return res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      kpis,
      data: rows,
    });
  } catch (err) {
    console.error('getVCCTLineList error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getVCCTRecordDetail(req, res) {
  try {
    const { siteCode, vcctId } = req.params;
    const pool = getDbPool();

    const [record] = await pool.query(
      `SELECT v.*, TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) AS age, s.site_name, od.name_en as od_name, p.province_en as province_name
       FROM vccts v
       LEFT JOIN tblsites s ON (v.site_code = s.vcct_site_code OR v.site_code = s.art_site_code)
       LEFT JOIN tblods od ON s.od_code = od.od_code
       LEFT JOIN tblprovince p ON s.province_id = p.id
       WHERE v.site_code = ? AND v.vcct_id = ?`,
      [siteCode, vcctId]
    );

    if (!record || record.length === 0) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    const [risks] = await pool.query(
      `SELECT * FROM vcct_risks WHERE site_code = ? AND vcct_id = ?`,
      [siteCode, vcctId]
    );

    const [reasons] = await pool.query(
      `SELECT * FROM vcct_reason_to_services WHERE site_code = ? AND vcct_id = ?`,
      [siteCode, vcctId]
    );

    const [testResults] = await pool.query(
      `SELECT * FROM vcct_line_test_results WHERE site_code = ? AND vcct_id = ?`,
      [siteCode, vcctId]
    );

    const [retests] = await pool.query(
      `SELECT * FROM vcct_retests WHERE site_code = ? AND vcct_id = ?`,
      [siteCode, vcctId]
    );

    return res.json({
      success: true,
      data: {
        ...(record[0] || {}),
        risks: risks[0] || {},
        reasons: reasons[0] || {},
        testResults: testResults[0] || {},
        retests: retests || [],
      },
    });
  } catch (err) {
    console.error('getVCCTRecordDetail error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportVCCTExcel(req, res) {
  try {
    const pool = getDbPool();
    const conditions = ['1=1'];
    const params = [];

    if (req.query.provinceId) {
      conditions.push('s.province_id = ?');
      params.push(req.query.provinceId);
    }
    if (req.query.odCode) {
      conditions.push('s.od_code = ?');
      params.push(req.query.odCode);
    }
    if (req.query.siteCode) {
      conditions.push('v.site_code = ?');
      params.push(req.query.siteCode);
    }
    if (req.query.dateFrom) {
      conditions.push('v.registration_date >= ?');
      params.push(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      conditions.push('v.registration_date <= ?');
      params.push(req.query.dateTo);
    }
    if (req.query.targetGroupId) {
      conditions.push('v.patient_type_id = ?');
      params.push(req.query.targetGroupId);
    }
    if (req.query.sex) {
      conditions.push('v.sex = ?');
      params.push(req.query.sex);
    }
    if (req.query.hivResult) {
      conditions.push('v.hiv_result = ?');
      params.push(req.query.hivResult);
    }
    if (req.query.unlinkedOnly === 'true') {
      conditions.push('v.hiv_result = 2 AND (v.refer_to_service_id IS NULL OR v.refer_to_service_id != 1)');
    }
    if (req.query.linkedOnly === 'true') {
      conditions.push('v.hiv_result = 2 AND v.refer_to_service_id = 1');
    }
    if (req.query.rtriResult) {
      conditions.push('v.rtri_result_id = ?');
      params.push(req.query.rtriResult);
    }
    if (req.query.search && req.query.search.trim()) {
      const q = `%${req.query.search.trim()}%`;
      conditions.push('(v.pmrs_code LIKE ? OR v.hts_code LIKE ? OR v.uuic LIKE ? OR s.site_name LIKE ?)');
      params.push(q, q, q, q);
    }

    const whereClause = conditions.join(' AND ');

    const querySql = `
      SELECT 
        v.site_code,
        s.site_name,
        s.od_code,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name,
        s.province_id,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        v.vcct_id,
        v.registration_date,
        v.pmrs_code,
        v.hts_code,
        v.uuic,
        v.sex,
        v.dob,
        TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) AS age,
        COALESCE(NULLIF(tg.Targroupkh, ''), tg.Targroup, 'ប្រជាជនទូទៅ') AS target_group_name,
        v.occupation_id,
        occ.Name AS occupation_name,
        v.history_of_test,
        v.hiv_result,
        v.rtri_result_id,
        v.vl_result,
        v.refer_to_service_id,
        rts.service_kh AS refer_service_name,
        v.post_counseling_date,
        v.post_counseling_id,
        ltr.line_control,
        ltr.line_positive,
        ltr.line_longterm
      FROM vccts v
      LEFT JOIN tblsites s ON (v.site_code = s.vcct_site_code OR v.site_code = s.art_site_code)
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN tblprovince p ON s.province_id = p.id
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      LEFT JOIN tbloccupation occ ON v.occupation_id = occ.OcID
      LEFT JOIN vcct_refer_to_services rts ON v.refer_to_service_id = rts.id
      LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
      WHERE ${whereClause}
      ORDER BY v.registration_date DESC, v.vcct_id DESC
      LIMIT 100000
    `;

    const [rows] = await pool.query(querySql, params);

    const workbook = await generateVCCTExcelWorkbook(rows, {
      provinceName: req.query.provinceName,
      odName: req.query.odName,
      siteName: req.query.siteName,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    });

    const filename = `VCCT_LineList_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('exportVCCTExcel error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
