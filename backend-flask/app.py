from flask import Flask
from flask import Blueprint, request, jsonify
from kafka import KafkaProducer
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import json

# App setup
app = Flask(__name__)
CORS(app) 

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',  # Kafka broker address
    value_serializer=lambda v: json.dumps(v).encode('utf-8')  # Serialize JSON messages
)

@app.route('/upload', methods=['POST'])
def upload_video():
    file = request.files['file']
    video_name = file.filename
    video_size = len(file.read())
    
    message = {
        'video_name': video_name,
        'video_size': video_size,
        'status': 'uploaded'
    }

    producer.send('video_upload', message)
    producer.flush()

    return jsonify({"message": "Video uploaded successfully!"})

# Route for sending Kafka message
@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()  # Get data sent from the frontend
    message = data.get("message")
    
    # Send message to Kafka topic
    # producer.send('send_msg_first', {'message': message})
    # producer.flush()  # Make sure the message is sent
    
    return jsonify({"status": "Message sent to Kafka"})

# Route for streaming video
@app.route('/video_chunks')
def stream_video():
    # Logic to stream video chunks via Kafka (You can use socketio to send chunks)
    return jsonify({"status": "streaming started"})

# Route for video metadata
@app.route('/video_metadata', methods=['GET'])
def get_video_metadata():
    # Just an example endpoint to retrieve video metadata (or other info)
    return jsonify({'status': 'success', 'data': 'your_metadata_here'})

# Other routes (e.g., index, todo)
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the app!"})


if __name__ == "__main__":
    app.run(debug=True)
