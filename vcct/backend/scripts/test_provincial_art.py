import mysql.connector
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

conn = mysql.connector.connect(
    host='mpi.nchads.gov.kh',
    port=3306,
    user='root_dmu',
    password='deV@0926mp!*',
    database='main_dbs'
)
cursor = conn.cursor(dictionary=True)

sql = """
SET @EndDate = '2026-06-30';

WITH tblvisit AS (
    SELECT site_code, clinicid,
           ROW_NUMBER() OVER (PARTITION BY site_code, clinicid ORDER BY DatVisit DESC) AS id 
    FROM tblavmain 
    WHERE DatVisit <= @EndDate
    UNION ALL 
    SELECT site_code, clinicid,
           ROW_NUMBER() OVER (PARTITION BY site_code, clinicid ORDER BY DatVisit DESC) AS id 
    FROM tblcvmain 
    WHERE DatVisit <= @EndDate
),
tblimain AS (
    SELECT site_code, ClinicID, '15+' AS typepatients, Sex
    FROM tblaimain 
    WHERE DafirstVisit <= @EndDate
    UNION ALL 
    SELECT site_code, ClinicID, '≤14' AS typepatients, Sex
    FROM tblcimain 
    WHERE DafirstVisit <= @EndDate
),
tblart AS (
    SELECT site_code, ClinicID, ART, DaArt
    FROM tblaart 
    WHERE DaArt <= @EndDate
    UNION ALL 
    SELECT site_code, ClinicID, ART, DaArt
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
    SELECT v.site_code, v.clinicid, i.Sex, i.typepatients
    FROM tblvisit v
    LEFT JOIN tblimain i ON i.site_code = v.site_code AND i.clinicid = v.clinicid
    LEFT JOIN tblart a ON a.site_code = v.site_code AND a.clinicid = v.clinicid
    LEFT JOIN tblexit e ON e.site_code = v.site_code AND e.clinicid = v.clinicid
    WHERE v.id = 1 AND e.Status IS NULL AND a.ART IS NOT NULL
)
SELECT 
    s.province_id,
    p.province_en,
    COUNT(DISTINCT v.site_code) AS active_art_sites,
    COUNT(*) AS plhiv_total,
    SUM(CASE WHEN v.Sex = 0 THEN 1 ELSE 0 END) AS plhiv_female,
    SUM(CASE WHEN v.Sex = 1 THEN 1 ELSE 0 END) AS plhiv_male,
    SUM(CASE WHEN v.typepatients = '≤14' THEN 1 ELSE 0 END) AS plhiv_child
FROM tblactive v
JOIN tblsites s ON s.art_site_code COLLATE utf8mb3_general_ci = v.site_code COLLATE utf8mb3_general_ci AND s.status_id = 1
JOIN tblprovince p ON s.province_id = p.id
GROUP BY s.province_id, p.province_en
ORDER BY s.province_id;
"""

cursor.execute("SET @EndDate = '2026-06-30'")
t0 = time.time()
cursor.execute(sql.split("SET @EndDate = '2026-06-30';\n")[1])
rows = cursor.fetchall()
print(f"Provincial Active ART ({time.time() - t0:.2f}s):")
total_all = 0
for r in rows:
    total_all += r['plhiv_total']
    print(f"P{r['province_id']:02d} {r['province_en']:<18}: total={r['plhiv_total']:<5} female={r['plhiv_female']:<5} sites={r['active_art_sites']}")
print(f"SUM OF ALL PROVINCES: {total_all}")
conn.close()

