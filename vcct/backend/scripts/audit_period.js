import { getDbPool } from '../src/config/db.js';

async function auditPeriod() {
  const pool = getDbPool();
  const periods = [
    { label: 'October 2026', where: "v.registration_date >= '2026-10-01' AND v.registration_date <= '2026-10-31'" },
    { label: 'Year 2026', where: "v.registration_date >= '2026-01-01' AND v.registration_date <= '2026-12-31'" },
    { label: 'All Time', where: "1=1" }
  ];

  for (const p of periods) {
    console.log(`\n=== AUDIT FOR: ${p.label} ===`);
    const checks = [
      { id: 'missing_uuic', name: 'ខ្វះលេខសម្គាល់បុគ្គល (Missing UUIC)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND (v.uuic IS NULL OR TRIM(v.uuic) = '')` },
      { id: 'invalid_dob_age', name: 'ថ្ងៃខែឆ្នាំកំណើត/អាយុមិនត្រឹមត្រូវ (Invalid DOB / Age)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND (v.dob IS NULL OR YEAR(v.dob) < 1920 OR v.dob > v.registration_date OR TIMESTAMPDIFF(YEAR, v.dob, v.registration_date) > 105)` },
      { id: 'missing_target_group', name: 'ខ្វះការកំណត់ប្រភេទអតិថិជន (Missing Client Type)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND (v.patient_type_id IS NULL OR v.patient_type_id = 0)` },
      { id: 'negative_with_art', name: 'HIV អវិជ្ជមានតែបញ្ជូនទៅ ART (Negative with ART Referral)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.hiv_result = 1 AND v.refer_to_service_id = 1` },
      { id: 'reactive_unlinked', name: 'HIV វិជ្ជមានមិនទាន់បញ្ជូនទៅ ART (Reactive Unlinked)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.hiv_result = 2 AND (v.refer_to_service_id != 1 OR v.refer_to_service_id IS NULL)` },
      { id: 'rtri_on_negative', name: 'តេស្ត RTRI លើករណីអវិជ្ជមាន (RTRI on Negative)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND (v.hiv_result = 1 OR v.hiv_result = 0) AND (v.rtri_result_id = 1 OR v.rtri_result_id = 2)` },
      { id: 'gender_target_conflict', name: 'ភេទមិនត្រូវនឹងប្រភេទអតិថិជន (Gender & Client Type Conflict)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND ((v.sex = 1 AND v.patient_type_id IN (1, 8)) OR (v.sex = 0 AND v.patient_type_id IN (2, 7)))` },
      { id: 'missing_post_counseling', name: 'ខ្វះការប្រឹក្សាក្រោយតេស្ត (Missing Post-Counseling)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND (v.post_counseling_date IS NULL OR YEAR(v.post_counseling_date) < 1920) AND v.hiv_result > 0` },
      { id: 'post_counseling_before_reg', name: 'កាលបរិច្ឆេទប្រឹក្សា មុនថ្ងៃចុះឈ្មោះ (Counseling Before Reg Date)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.post_counseling_date IS NOT NULL AND v.post_counseling_date < v.registration_date` },
      { id: 'duplicate_uuic_same_day', name: 'UUIC ធ្វើតេស្តស្ទួនក្នុងថ្ងៃតែមួយ (Same-Day Duplicate Test)', sql: `SELECT COUNT(*) as c FROM (SELECT v.uuic, v.registration_date, COUNT(*) as cnt FROM vccts v WHERE ${p.where} AND v.uuic IS NOT NULL AND TRIM(v.uuic) != '' GROUP BY v.uuic, v.registration_date HAVING cnt > 1) t` },
      { id: 'duplicate_code_in_site', name: 'លេខកូដ VCCT ជាន់គ្នាក្នុងមូលដ្ឋាន (Duplicate Code in Site)', sql: `SELECT COUNT(*) as c FROM (SELECT v.site_code, v.hts_code, COUNT(*) as cnt FROM vccts v WHERE ${p.where} AND v.hts_code IS NOT NULL AND TRIM(v.hts_code) != '' GROUP BY v.site_code, v.hts_code HAVING cnt > 1) t` },
      { id: 'reactive_missing_rtri', name: 'HIV វិជ្ជមានខ្វះតេស្តឆ្លងថ្មី RTRI (Reactive Missing RTRI)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.hiv_result = 2 AND (v.rtri_result_id IS NULL OR v.rtri_result_id = 0)` },
      { id: 'line_test_inconsistency', name: 'លទ្ធផលតេស្ត ៣ បន្ទាត់មិនស៊ីសង្វាក់ (3-Test Algorithm Conflict)', sql: `SELECT COUNT(*) as c FROM vccts v JOIN vcct_line_test_results ltr ON v.site_code = ltr.site_code AND v.vcct_id = ltr.vcct_id WHERE ${p.where} AND ((ltr.line_control = 0 AND v.hiv_result = 2) OR (ltr.line_control = 1 AND ltr.line_positive = 1 AND ltr.line_longterm = 1 AND v.hiv_result != 2) OR (ltr.line_control = 0 AND (ltr.line_positive = 1 OR ltr.line_longterm = 1)))` },
      { id: 'known_positive_retesting', name: 'ករណីធ្លាប់ដឹងថាវិជ្ជមាន មកធ្វើតេស្តឡើងវិញ (Known Positive Re-testing)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.history_of_test_result = 2` },
      { id: 'inconclusive_results', name: 'លទ្ធផលតេស្តមិនច្បាស់លាស់ ត្រូវតាមដានបន្ត (Inconclusive / Indeterminate)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.hiv_result = 3` },
      { id: 'invalid_phone', name: 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ (Invalid Phone Format)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND v.phone_number IS NOT NULL AND TRIM(v.phone_number) != '' AND (LENGTH(REGEXP_REPLACE(v.phone_number, '[^0-9]', '')) < 8 OR LENGTH(REGEXP_REPLACE(v.phone_number, '[^0-9]', '')) > 12)` },
      { id: 'missing_demographics', name: 'ខ្វះមុខរបរ ឬស្ថានភាពអាពាហ៍ពិពាហ៍ (Missing Occupation/Marital)', sql: `SELECT COUNT(*) as c FROM vccts v WHERE ${p.where} AND ((v.occupation_id IS NULL OR v.occupation_id = 0) OR (v.marital_status_id IS NULL OR v.marital_status_id = 0))` },
    ];

    for (const chk of checks) {
      try {
        const [[r]] = await pool.query(chk.sql);
        console.log(`  - [${r.c}] ${chk.name}`);
      } catch (e) {
        console.log(`  - [ERR: ${e.message}] ${chk.name}`);
      }
    }
  }

  process.exit(0);
}

auditPeriod();
