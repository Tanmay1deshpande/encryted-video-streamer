import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const socket = io("http://localhost:5000");

  socket.on("video_chunk", (chunkData) => {
    // Handle video chunk data and render it
  });

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
