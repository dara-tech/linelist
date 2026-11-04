import mysql.connector
import time

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
    site_code,
    COUNT(*) AS total_active,
    SUM(CASE WHEN Sex = 0 THEN 1 ELSE 0 END) AS female_active,
    SUM(CASE WHEN Sex = 1 THEN 1 ELSE 0 END) AS male_active,
    SUM(CASE WHEN typepatients = '≤14' THEN 1 ELSE 0 END) AS child_active,
    SUM(CASE WHEN typepatients = '15+' THEN 1 ELSE 0 END) AS adult_active
FROM tblactive
GROUP BY site_code
ORDER BY total_active DESC
LIMIT 10;
"""

cursor.execute("SET @EndDate = '2026-06-30'")
t0 = time.time()
cursor.execute(sql.split("SET @EndDate = '2026-06-30';\n")[1])
rows = cursor.fetchall()
print(f"Top 10 sites ({time.time() - t0:.2f}s):")
for r in rows:
    print(r)
conn.close()

