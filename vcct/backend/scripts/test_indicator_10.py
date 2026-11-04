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

test_sql = """
SET @EndDate = '2026-06-30';
"""
cursor.execute("SET @EndDate = '2026-06-30'")

sql = """
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
        i.clinicid, 
        i.DafirstVisit,
        i.typepatients, 
        i.TypeofReturn, 
        i.LClinicID, 
        i.SiteNameold, 
        i.DaBirth,
        i.age, 
        i.Sex, 
        i.DaHIV, 
        i.OffIn, 
        a.ART, 
        a.DaArt,
        v.DatVisit, 
        v.ARTnum, 
        v.DaApp
    FROM tblvisit v
    LEFT JOIN tblimain i ON i.site_code = v.site_code AND i.clinicid = v.clinicid
    LEFT JOIN tblart a ON a.site_code = v.site_code AND a.clinicid = v.clinicid
    LEFT JOIN tblexit e ON e.site_code = v.site_code AND e.clinicid = v.clinicid
    WHERE v.id = 1 AND e.Status IS NULL AND a.ART IS NOT NULL
)

SELECT 
    '10. Active ART patients in this quarter' AS Indicator,
    IFNULL(COUNT(*), 0) AS TOTAL,
    IFNULL(SUM(CASE WHEN typepatients = '≤14' AND Sex = 1 THEN 1 ELSE 0 END), 0) AS Male_0_14,
    IFNULL(SUM(CASE WHEN typepatients = '≤14' AND Sex = 0 THEN 1 ELSE 0 END), 0) AS Female_0_14,
    IFNULL(SUM(CASE WHEN typepatients = '15+' AND Sex = 1 THEN 1 ELSE 0 END), 0) AS Male_over_14,
    IFNULL(SUM(CASE WHEN typepatients = '15+' AND Sex = 0 THEN 1 ELSE 0 END), 0) AS Female_over_14
FROM tblactive;
"""

print("[*] Executing Active ART Current Query...")
t0 = time.time()
cursor.execute(sql)
res = cursor.fetchall()
print(f"[+] Query finished in {time.time() - t0:.2f}s:")
print(res)
conn.close()

