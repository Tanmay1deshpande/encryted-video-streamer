from flask import Flask, Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import os
# from kafka_service import send_video_to_kafka
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import pymysql
import io
from encryption.aes_cipher import AESCipher
import database
import base64
from datetime import datetime
import psycopg2


# App setup
app = Flask(__name__)
CORS(app, origins=["*"]) 


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# MySQL Connection
conn = pymysql.connect(host="localhost", user="root", password="Dtanmay17@", database="video_db")
cursor = conn.cursor()

#MySQL Aiven Hosted DB server connection: 
# timeout = 10
# conn = pymysql.connect(
#   charset="utf8mb4",
#   connect_timeout=timeout,
#   cursorclass=pymysql.cursors.DictCursor,
#   db="defaultdb_1ycj",
#   host="mysql-dtanmay17-personal-projects-dtanmay17.d.aivencloud.com",
#   password="cWppaEkh9rUbpBT508BW9Til7dGlkcZS",
#   read_timeout=timeout,
#   port=5432,
#   user="adminy",
#   write_timeout=timeout,
# ) 

# Render PostgresSQL database connection 
# DATABASE_URL = "postgresql://adminy:cWppaEkh9rUbpBT508BW9Til7dGlkcZS@dpg-cv7ia2qn91rc73e4h8rg-a.singapore-postgres.render.com/defaultdb_1ycj"
# conn = psycopg2.connect(DATABASE_URL)
# cursor = conn.cursor()

KEY = get_random_bytes(32)  # AES-256 requires a 32-byte key
BLOCK_SIZE = AES.block_size  # AES block size (16 bytes)

AES_KEY = "kafka_did_not_work_key"
cipher = AESCipher(AES_KEY)


#Upload a video
@app.route("/upload", methods=["POST"])
@cross_origin(origin='*')
def upload_video():
    try:
        video = request.files['video']  
        video_name = request.form['video_name']  
        video_data = video.read()  

        query = "INSERT INTO videos (video_name, video_data) VALUES (%s, %s)"
        cursor.execute(query, (video_name, psycopg2.Binary(video_data)))
        conn.commit()

        return jsonify({"message": "Upload successful"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
   

#Return a single video for playing
@app.route("/video/:id=<int:video_id>", methods=["GET"])
@cross_origin(origin='*')
def get_video(video_id):
    print("Video ID: ", video_id)
    try:
        cursor.execute("SELECT video_data, video_name FROM videos WHERE id = %s", (video_id))
        result = cursor.fetchone()
        print("Result: ", result[1])
        oneVideo = {
                "video_data": base64.b64encode(result[0]).decode("utf-8"),
                "video_name": result[1]
            }
        

        return jsonify(oneVideo), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Delete Video by ID
@app.route("/delete/:id=<int:video_id>", methods=["DELETE"])
@cross_origin(origin='*')
def delete_video(video_id):
    print("Video ID: ", video_id)
    try:
        cursor.execute("DELETE FROM videos where id = %s",(video_id))
        conn.commit()

        return jsonify({"data":"Delete success"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get all the videos 
@app.route("/videos", methods=["GET"])
@cross_origin(origin='*')
def get_videos():
    try:
        cursor.execute("SELECT id, video_name, upload_time FROM videos")
        rows = cursor.fetchall()
        videos = []

        for row in rows:

            id, video_name, upload_time = row  # Unpack row values

            if upload_time is None:
                formatted_time = None

            elif isinstance(upload_time, bytes):
                upload_time = upload_time.decode("utf-8")  # Convert bytes to string
                upload_time = datetime.strptime(upload_time, "%Y-%m-%d %H:%M:%S")  # Convert to datetime
                formatted_time = upload_time.strftime("%Y-%m-%d %H:%M:%S")
            elif isinstance(upload_time, str):
                print("Upload time from DB: ",upload_time)
                formatted_time = upload_time
            else:
                formatted_time = upload_time.strftime("%Y-%m-%d %H:%M:%S")

            videos.append({
                "id": id,
                "video_name": video_name,
                "upload_time": formatted_time
            })

        return jsonify(videos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route("/test", methods=["GET"])
@cross_origin(origin='*')
def test():
    try:
        cursor.execute("SELECT id, video_name, video_data, upload_time FROM videos")
        rows = cursor.fetchall()

        result = [
            {
                "id": row[0],
                "video_name": row[1],
                # "video_data": base64.b64encode(row[2]).decode("utf-8") if row[2] else None,  # Fix variable name
                "upload_time": row[2].strftime("%Y-%m-%d %H:%M:%S") if row[3] else None  # Handle None case
            }
            for row in rows
        ]
        print("RESULT: ",rows,"post-query")

        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 600
    

@app.route("/test2", methods=["GET"])
@cross_origin(origins='*')
def create_db():
    try:
        # cursor.execute("CREATE TABLE videos (id SERIAL PRIMARY KEY, video_name VARCHAR(255) NOT NULL, video_data BYTEA NOT NULL, upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP )")
        # cursor.execute("CREATE TABLE mytest (id INTEGER PRIMARY KEY)")
        # cursor.execute("INSERT INTO mytest (id) VALUES (1), (2)")
        # cursor.execute("SELECT * FROM mytest")
        # cursor.execute("ROLLBACK")
        cursor.execute("ROLLBACK")
        # db_version = cursor.fetchone()
        # print("PostgreSQL version:", db_version[0])

        return jsonify({"message": "ROLLBACK!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 600

##############################################Previous Code Version###############################################
# @app.route("/uploadFinal", methods=["POST"])
# def upload_video():
#     file = request.files["video"]
#     file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
#     # Encrypt and save
#     encrypted_path = file_path + ".enc"
#     encrypt_file(file_path, encrypted_path)
    
#     cursor.execute("INSERT INTO videos (filename, path) VALUES (%s, %s)", (file.filename, encrypted_path))
#     db.commit()

#     return jsonify({"message": "Video uploaded successfully!", "filename": file.filename})

# @app.route("/stream/<filename>", methods=["GET"])
# def stream_video(filename):
#     cursor.execute("SELECT path FROM videos WHERE filename = %s", (filename,))
#     result = cursor.fetchone()
#     if not result:
#         return jsonify({"error": "Video not found"}), 404

#     encrypted_path = result[0]
#     decrypted_path = encrypted_path.replace(".enc", ".mp4")
    
#     decrypt_file(encrypted_path, decrypted_path)
    
#     send_video_to_kafka(decrypted_path)
#     return jsonify({"message": "Streaming started via Kafka!"})


# @app.route("/videos", methods=["GET"])
# def get_videos():
#     cursor.execute("SELECT filename, uploaded_at FROM videos ORDER BY uploaded_at DESC")
#     videos = [{"title": row[0], "timestamp": row[1]} for row in cursor.fetchall()]
#     return jsonify(videos)


@app.route('/')
def index():
    return jsonify({"message": "Welcome to the app!"})


if __name__ == "__main__":
    app.run(debug=True)
