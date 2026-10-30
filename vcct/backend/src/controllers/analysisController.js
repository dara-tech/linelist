import { getDbPool } from '../config/db.js';

export async function getAnalysisMetrics(req, res) {
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

    const needsSiteJoin = Boolean(req.query.provinceId || req.query.odCode);
    const siteJoin = needsSiteJoin ? 'LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code' : '';
    const whereClause = conditions.join(' AND ');

    // 1. By Target Group (Key Populations)
    const targetGroupSql = `
      SELECT 
        COALESCE(NULLIF(tg.Targroupkh, ''), tg.Targroup, 'ប្រជាជនទូទៅ') AS target_group,
        MAX(tg.Tid) AS target_group_id,
        COUNT(*) AS total_tested,
        SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_count,
        SUM(CASE WHEN v.hiv_result = 1 THEN 1 ELSE 0 END) AS non_reactive_count,
        SUM(CASE WHEN v.rtri_result_id = 1 THEN 1 ELSE 0 END) AS recent_count,
        SUM(CASE WHEN v.hiv_result = 2 AND v.refer_to_service_id > 0 THEN 1 ELSE 0 END) AS linked_count
      FROM vccts v
      ${siteJoin}
      LEFT JOIN tbltargroup tg ON v.patient_type_id = tg.Tid
      WHERE ${whereClause}
      GROUP BY COALESCE(NULLIF(tg.Targroupkh, ''), tg.Targroup, 'ប្រជាជនទូទៅ')
      ORDER BY total_tested DESC
    `;

    // 2. By Age Group & Sex
    const ageSexSql = `
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) < 15 THEN '<15'
          WHEN TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) BETWEEN 15 AND 24 THEN '15-24'
          WHEN TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) BETWEEN 25 AND 49 THEN '25-49'
          WHEN TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) >= 50 THEN '50+'
          ELSE 'Unknown'
        END AS age_group,
        v.sex,
        COUNT(*) AS total_tested,
        SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_count
      FROM vccts v
      ${siteJoin}
      WHERE ${whereClause}
      GROUP BY age_group, v.sex
      ORDER BY age_group ASC, v.sex ASC
    `;

    // 3. By Facility (Top 25 Sites Cross-tab) - Only query when requested or needed
    const siteSql = `
      SELECT 
        v.site_code,
        s.site_name,
        COALESCE(NULLIF(od.name_kh, ''), od.name_en) AS od_name,
        COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
        COUNT(*) AS total_tested,
        SUM(CASE WHEN v.hiv_result = 2 THEN 1 ELSE 0 END) AS reactive_count,
        SUM(CASE WHEN v.rtri_result_id = 1 THEN 1 ELSE 0 END) AS recent_count,
        SUM(CASE WHEN v.hiv_result = 2 AND v.refer_to_service_id > 0 THEN 1 ELSE 0 END) AS linked_count
      FROM vccts v
      LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
      LEFT JOIN tblods od ON s.od_code = od.od_code
      LEFT JOIN tblprovince p ON s.province_id = p.id
      WHERE ${whereClause}
      GROUP BY v.site_code, s.site_name, od.name_kh, od.name_en, p.province_kh, p.province_en
      ORDER BY total_tested DESC
      LIMIT 25
    `;

    const [[byTargetGroup], [byAgeSex], [bySite]] = await Promise.all([
      pool.query(targetGroupSql, params),
      pool.query(ageSexSql, params),
      pool.query(siteSql, params),
    ]);

    return res.json({
      success: true,
      data: {
        byTargetGroup,
        byAgeSex,
        bySite,
      },
    });
  } catch (err) {
    console.error('getAnalysisMetrics error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}




