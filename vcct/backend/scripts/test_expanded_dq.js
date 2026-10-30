import { getDbPool } from '../src/config/db.js';

async function testFacility() {
  const pool = getDbPool();
  const start = Date.now();
  const [rows] = await pool.query(`
    SELECT
      v.site_code,
      COALESCE(s.site_name, v.site_code) AS site_name,
      COALESCE(NULLIF(p.province_kh, ''), p.province_en, 'មិនស្គាល់') AS province_name,
      COALESCE(NULLIF(od.name_kh, ''), od.name_en, 'មិនស្គាល់') AS od_name,
      COUNT(*) AS total_tested,
      SUM(CASE WHEN v.uuic IS NULL OR TRIM(v.uuic) = '' THEN 1 ELSE 0 END) AS missing_uuic,
      SUM(CASE WHEN v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date THEN 1 ELSE 0 END) AS counseling_before_reg,
      SUM(CASE WHEN v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0) THEN 1 ELSE 0 END) AS reactive_missing_rtri,
      SUM(CASE 
        WHEN (v.uuic IS NULL OR TRIM(v.uuic) = '')
          OR (v.dob IS NULL OR YEAR(v.dob) < 1920 OR v.dob > v.registration_date OR TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) > 105)
          OR (v.patient_type_id IS NULL OR v.patient_type_id = 0)
          OR (v.hiv_result = 1 AND v.refer_to_service_id = 1)
          OR (v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL))
          OR ((v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2))
          OR ((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))
          OR (v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date)
          OR (v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0))
          OR ((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))
        THEN 1 ELSE 0 END) AS total_issues
    FROM vccts v
    LEFT JOIN tblsites s ON v.site_code = s.vcct_site_code
    LEFT JOIN tblprovince p ON s.province_id = p.id
    LEFT JOIN tblods od ON s.od_code = od.od_code
    LEFT JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id
    WHERE v.registration_date >= '2026-10-01' AND v.registration_date <= '2026-10-31'
    GROUP BY v.site_code, s.site_name, p.province_kh, p.province_en, od.name_kh, od.name_en
    HAVING total_issues > 0
    ORDER BY total_issues DESC
    LIMIT 5
  `);
  console.log('Facility query took:', Date.now() - start, 'ms');
  console.table(rows);
  process.exit(0);
}

testFacility();
