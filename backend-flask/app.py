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


# App setup
app = Flask(__name__)
CORS(app, origins=["*"]) 


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# MySQL Connection
conn = pymysql.connect(host="localhost", user="root", password="Dtanmay17@", database="video_db")
cursor = conn.cursor()

KEY = get_random_bytes(32)  # AES-256 requires a 32-byte key
BLOCK_SIZE = AES.block_size  # AES block size (16 bytes)

AES_KEY = "kafka_did_not_work_key"
cipher = AESCipher(AES_KEY)



@app.route("/upload", methods=["POST"])
@cross_origin(origin='*')
def upload_video():
    try:
        video = request.files['video']  
        video_name = request.form['video_name']  
        video_data = video.read()  

        query = "INSERT INTO videos (video_name, video_data) VALUES (%s, %s)"
        cursor.execute(query, (video_name, video_data))
        conn.commit()

        return jsonify({"message": "Upload successful"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
   

@app.route("/video/:id=<int:video_id>", methods=["GET"])
@cross_origin(origin='*')
def get_video(video_id):
    print("Video ID: ", video_id)
    try:
        cursor.execute("SELECT video_data, video_name FROM videos WHERE id = %s", (video_id))
        result = cursor.fetchone()
        # print("Result: ", result)
        oneVideo = {
                "video_data": base64.b64encode(result[0]).decode("utf-8"),
                "video_name": result[1]
            }
        

        return jsonify(oneVideo), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/videos", methods=["GET"])
@cross_origin(origin='*')
def get_videos():
    try:
        cursor.execute("SELECT id, video_name, video_data, upload_time FROM videos")
        rows = cursor.fetchall()
        videos = []

        for row in rows:

            id, video_name, video_data, upload_time = row  # Unpack row values

            if upload_time is None:
                formatted_time = None

            elif isinstance(upload_time, bytes):
                upload_time = upload_time.decode("utf-8")  # Convert bytes to string
                upload_time = datetime.strptime(upload_time, "%Y-%m-%d %H:%M:%S")  # Convert to datetime
                formatted_time = upload_time.strftime("%Y-%m-%d %H:%M:%S")
            else:
                formatted_time = upload_time.strftime("%Y-%m-%d %H:%M:%S")

            video_data_base64 = base64.b64encode(video_data).decode("utf-8")

            videos.append({
                "id": id,
                "video_name": video_name,
                # "video_data": video_data_base64,
                "upload_time": formatted_time
            })

        return jsonify(videos)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
