# encryted-video-streamer

An application used to upload an encrypted video file, playable only while using apache kafka

Data Flow
User Uploads Video:

The user selects a video file from the UI.
The video is encrypted on the frontend before sending it to the backend for storage.
Backend (Flask):

The backend receives the encrypted video and stores it in the server.
The backend also saves the video’s metadata (e.g., name, size, encryption info) in the database.
Once the video is stored, the backend will create a Kafka topic to stream video chunks and publish the metadata.
Kafka Streaming:

Kafka will break the video into chunks and publish these chunks as messages in a Kafka topic.
The frontend will subscribe to the Kafka topic and receive video chunks for playback.
Frontend (React):

The frontend listens to Kafka topics and streams the video chunks for display using a video player.
