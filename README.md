# encryted-video-streamer

An application used to upload an encrypted video file, playable only while using apache kafka

Ideal Data Flow
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

Current Flow:
User uploads a video from React frontend to Flask Backend.
Flask Saves the video to SQL after AES256 encryption.

When user clicks on Play in the frontend, it sends an API call to flask which queries the required data for the video.
Flask sends the base64 encoded data to the frontend
In react, I am decoding th base64 data by converting it to a blob and then making a URL from it.
After passing the URL in the video element, the user can see the video.

Kafka implementation did not work as my device was not compatible with some features of kafka.
However I have written kafka code to completion, could not complete unit testing as kafka servers were not initializing in my project.

Thank you.
