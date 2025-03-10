import pymysql
import psycopg2

# timeout = 10
# connection = pymysql.connect(
#   charset="utf8mb4",
#   connect_timeout=timeout,
#   cursorclass=pymysql.cursors.DictCursor,
#   db="defaultdb",
#   host="mysql-dtanmay17-personal-projects-dtanmay17.d.aivencloud.com",
#   password="AVNS_2joGnCioX5xwU--MgbD",
#   read_timeout=timeout,
#   port=13386,
#   user="avnadmin",
#   write_timeout=timeout,
# )

DATABASE_URL = "postgresql://adminy:cWppaEkh9rUbpBT508BW9Til7dGlkcZS@dpg-cv7ia2qn91rc73e4h8rg-a.singapore-postgres.render.com/defaultdb_1ycj"
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()
  
try:
  cursor = conn.cursor()
  cursor.execute("CREATE TABLE videos (id SERIAL PRIMARY KEY, video_name VARCHAR(255) NOT NULL, video_data BYTEA NOT NULL, upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP )")
#  cursor.execute("CREATE TABLE mytest (id INTEGER PRIMARY KEY)")
#   cursor.execute("INSERT INTO mytest (id) VALUES (1), (2)")
#   cursor.execute("SELECT * FROM mytest")
#   print(cursor.fetchall())
except Exception as e:
  print("Except block", str(e))