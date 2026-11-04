import { getDbPool } from '../config/db.js';

// In-memory cache for Active ART calculations (TTL: 15 minutes)
const CACHE_TTL_MS = 15 * 60 * 1000;
const activeArtCache = new Map();
let activeQueryPromise = null;

/**
 * Builds the official Indicator 10 Active ART SQL query based on 10_active_art_current.sql.
 * Combines adult (tblavmain, tblaimain, tblaart, tblavpatientstatus) 
 * and child (tblcvmain, tblcimain, tblcart, tblcvpatientstatus).
 */
export async function getActiveArtDataset(endDate = '2026-06-30') {
  const cached = activeArtCache.get(endDate);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // De-duplicate concurrent queries
  if (activeQueryPromise) {
    return activeQueryPromise;
  }

  activeQueryPromise = (async () => {
    try {
      const pool = getDbPool();

      // Set MySQL session variable
      await pool.query('SET @EndDate = ?', [endDate]);

      const sql = `
        WITH tblvisit AS (
            SELECT 
                site_code,
                clinicid,
                DatVisit,
                ARTnum,
                DaApp,
                vid,
                ROW_NUMBER() OVER (PARTITION BY site_code, clinicid ORDER BY DatVisit DESC) AS id 
            FROM tblavmain 
            WHERE DatVisit <= @EndDate
            
            UNION ALL 
            
            SELECT 
                site_code,
                clinicid,
                DatVisit,
                ARTnum,
                DaApp,
                vid,
                ROW_NUMBER() OVER (PARTITION BY site_code, clinicid ORDER BY DatVisit DESC) AS id 
            FROM tblcvmain 
            WHERE DatVisit <= @EndDate
        ),

        tblimain AS (
            SELECT 
                site_code,
                ClinicID,
                DafirstVisit,
                '15+' AS typepatients,
                TypeofReturn,
                LClinicID,
                SiteNameold,
                DaBirth,
                TIMESTAMPDIFF(year, DaBirth, @EndDate) AS age,
                Sex,
                DaHIV,
                OffIn 
            FROM tblaimain 
            WHERE DafirstVisit <= @EndDate
            
            UNION ALL 
            
            SELECT 
                site_code,
                ClinicID,
                DafirstVisit,
                '≤14' AS typepatients,
                '' AS TypeofReturn,
                LClinicID,
                SiteNameold,
                DaBirth,
                TIMESTAMPDIFF(year, DaBirth, @EndDate) AS age,
                Sex,
                DaTest AS DaHIV,
                OffIn 
            FROM tblcimain 
            WHERE DafirstVisit <= @EndDate
        ),

        tblart AS (
            SELECT 
                site_code,
                ClinicID,
                ART,
                DaArt,
                TIMESTAMPDIFF(month, DaArt, @EndDate) AS nmonthART 
            FROM tblaart 
            WHERE DaArt <= @EndDate
            
            UNION ALL 
            
            SELECT 
                site_code,
                ClinicID,
                ART,
                DaArt,
                TIMESTAMPDIFF(month, DaArt, @EndDate) AS nmonthART 
            FROM tblcart 
            WHERE DaArt <= @EndDate
        ),

        tblexit AS (
            SELECT site_code, ClinicID, Status, Da 
            FROM tblavpatientstatus 
            WHERE da <= @EndDate
            
            UNION ALL 
            
            SELECT site_code, ClinicID, Status, Da 
            FROM tblcvpatientstatus  
            WHERE da <= @EndDate
        ),

        tblactive AS (
            SELECT 
                v.site_code,
                v.clinicid,
                i.Sex,
                i.typepatients
            FROM tblvisit v
            LEFT JOIN tblimain i ON i.site_code = v.site_code AND i.clinicid = v.clinicid
            LEFT JOIN tblart a ON a.site_code = v.site_code AND a.clinicid = v.clinicid
            LEFT JOIN tblexit e ON e.site_code = v.site_code AND e.clinicid = v.clinicid
            WHERE v.id = 1 AND e.Status IS NULL AND a.ART IS NOT NULL
        )

        SELECT 
            v.site_code,
            s.province_id,
            COALESCE(NULLIF(p.province_kh, ''), p.province_en) AS province_name,
            COUNT(*) AS total_active,
            SUM(CASE WHEN v.Sex = 0 THEN 1 ELSE 0 END) AS female_active,
            SUM(CASE WHEN v.Sex = 1 THEN 1 ELSE 0 END) AS male_active,
            SUM(CASE WHEN v.typepatients = '≤14' THEN 1 ELSE 0 END) AS child_active,
            SUM(CASE WHEN v.typepatients = '15+' THEN 1 ELSE 0 END) AS adult_active,
            SUM(CASE WHEN v.typepatients = '≤14' AND v.Sex = 1 THEN 1 ELSE 0 END) AS male_0_14,
            SUM(CASE WHEN v.typepatients = '≤14' AND v.Sex = 0 THEN 1 ELSE 0 END) AS female_0_14,
            SUM(CASE WHEN v.typepatients = '15+' AND v.Sex = 1 THEN 1 ELSE 0 END) AS male_over_14,
            SUM(CASE WHEN v.typepatients = '15+' AND v.Sex = 0 THEN 1 ELSE 0 END) AS female_over_14
        FROM tblactive v
        LEFT JOIN tblsites s ON s.art_site_code COLLATE utf8mb3_general_ci = v.site_code COLLATE utf8mb3_general_ci AND s.status_id = 1
        LEFT JOIN tblprovince p ON s.province_id = p.id
        GROUP BY v.site_code, s.province_id, p.province_kh, p.province_en;
      `;

      const [siteRows] = await pool.query(sql);

      // Aggregate by site and by province
      const siteMap = new Map();
      const provinceMap = new Map();

      let nationalSummary = {
        indicator: '10. Active ART patients in this quarter',
        total: 0,
        male_0_14: 0,
        female_0_14: 0,
        male_over_14: 0,
        female_over_14: 0,
        female_total: 0,
        male_total: 0,
        child_total: 0,
        adult_total: 0,
      };

      siteRows.forEach((r) => {
        const total = Number(r.total_active || 0);
        const female = Number(r.female_active || 0);
        const male = Number(r.male_active || 0);
        const child = Number(r.child_active || 0);
        const adult = Number(r.adult_active || 0);
        const m014 = Number(r.male_0_14 || 0);
        const f014 = Number(r.female_0_14 || 0);
        const m15 = Number(r.male_over_14 || 0);
        const f15 = Number(r.female_over_14 || 0);

        siteMap.set(r.site_code, {
          site_code: r.site_code,
          province_id: r.province_id,
          total_active: total,
          female_active: female,
          male_active: male,
          child_active: child,
          adult_active: adult,
        });

        nationalSummary.total += total;
        nationalSummary.female_total += female;
        nationalSummary.male_total += male;
        nationalSummary.child_total += child;
        nationalSummary.adult_total += adult;
        nationalSummary.male_0_14 += m014;
        nationalSummary.female_0_14 += f014;
        nationalSummary.male_over_14 += m15;
        nationalSummary.female_over_14 += f15;

        if (r.province_id) {
          const pId = Number(r.province_id);
          const existing = provinceMap.get(pId) || {
            province_id: pId,
            province_name: r.province_name,
            plhiv_total: 0,
            plhiv_female: 0,
            plhiv_male: 0,
            plhiv_child: 0,
            plhiv_adult: 0,
            active_art_sites: 0,
          };

          existing.plhiv_total += total;
          existing.plhiv_female += female;
          existing.plhiv_male += male;
          existing.plhiv_child += child;
          existing.plhiv_adult += adult;
          existing.active_art_sites += 1;

          provinceMap.set(pId, existing);
        }
      });

      const result = {
        endDate,
        nationalSummary,
        siteMap,
        provinceMap,
        siteList: siteRows,
      };

      activeArtCache.set(endDate, {
        timestamp: Date.now(),
        data: result,
      });

      return result;
    } finally {
      activeQueryPromise = null;
    }
  })();

  return activeQueryPromise;
}

export async function getActiveArtBySiteMap(endDate) {
  try {
    const data = await getActiveArtDataset(endDate);
    return data.siteMap;
  } catch (err) {
    console.warn('getActiveArtBySiteMap error:', err.message);
    return new Map();
  }
}

export async function getActiveArtByProvinceMap(endDate) {
  try {
    const data = await getActiveArtDataset(endDate);
    return data.provinceMap;
  } catch (err) {
    console.warn('getActiveArtByProvinceMap error:', err.message);
    return new Map();
  }
}

