import pyodbc
import os
import os.path

conn = pyodbc.connect("driver={SQL Server};server=10.55.100.14;database=DB_BAK;uid=glh;pwd=123456.com")
cur = conn.cursor()
cur.execute("select top 10 * from visit_rec")
print(cur.fetchall())
cur.close()
conn.close()

