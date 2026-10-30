import { getDbPool } from '../config/db.js';

export async function getHierarchy(req, res) {
  try {
    const pool = getDbPool();
    const [provinces] = await pool.query('SELECT id, province_en, province_kh FROM tblprovince ORDER BY province_en ASC');
    const [ods] = await pool.query('SELECT od_code, name_en, name_kh, province_id FROM tblods ORDER BY name_en ASC');
    const [sites] = await pool.query(`
      SELECT 
        COALESCE(NULLIF(vcct_site_code, ''), art_site_code) AS site_code, 
        site_name, 
        od_code, 
        province_id 
      FROM tblsites 
      WHERE status_id = 1 
      ORDER BY site_name ASC
    `);

    return res.json({
      success: true,
      data: {
        provinces,
        ods,
        sites: sites.filter(s => s.site_code),
      },
    });
  } catch (err) {
    console.error('getHierarchy error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
