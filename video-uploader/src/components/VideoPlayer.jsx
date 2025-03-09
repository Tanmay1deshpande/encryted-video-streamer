import React, { useState, useEffect } from "react";

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    // Connect to Kafka stream (websocket or HTTP API)
    const kafkaStream = new WebSocket("ws://localhost:9092/video-stream");

    kafkaStream.onmessage = (event) => {
      // Process each chunk and append to the video source
      setVideoSrc((prev) => prev + event.data);
    };

    return () => kafkaStream.close();
  }, []);

  return (
    <div>
      <video controls src={videoSrc}></video>;
    </div>
  );
};

export default VideoPlayer;
