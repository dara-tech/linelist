import { getDbPool } from '../config/db.js';
import { GENDER_MAP, HIV_RESULT_MAP, RTRI_RESULT_MAP, RISK_LABELS, REASON_LABELS, MARITAL_STATUS_MAP } from '../config/constants.js';

export async function getMetadata(req, res) {
  try {
    const pool = getDbPool();
    const [targetGroups] = await pool.query('SELECT Tid, Targroup, Targroupkh, Status FROM tbltargroup WHERE Status = 1 ORDER BY Tid ASC');
    const [patientTypes] = await pool.query('SELECT id, type_en, type_kh FROM vcct_patient_types ORDER BY id ASC');
    const [hivResults] = await pool.query('SELECT id, result_en, result_kh FROM vcct_hiv_results ORDER BY id ASC');

    return res.json({
      success: true,
      data: {
        targetGroups,
        patientTypes,
        hivResults,
        genderMap: GENDER_MAP,
        hivResultMap: HIV_RESULT_MAP,
        rtriResultMap: RTRI_RESULT_MAP,
        maritalStatusMap: MARITAL_STATUS_MAP,
        riskLabels: RISK_LABELS,
        reasonLabels: REASON_LABELS,
      },
    });
  } catch (err) {
    console.error('getMetadata error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
