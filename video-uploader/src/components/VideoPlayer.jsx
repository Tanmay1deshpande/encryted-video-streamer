import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LOADER } from "../store/actions";

const VideoPlayer = ({ videoId }) => {
  const [videoSrc, setVideoSrc] = useState("");
  const [videoName, setVideoName] = useState("");
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Connect to Kafka stream (websocket or HTTP API)
  //   const kafkaStream = new WebSocket("ws://localhost:9092/video-stream");

  //   kafkaStream.onmessage = (event) => {
  //     // Process each chunk and append to the video source
  //     setVideoSrc((prev) => prev + event.data);
  //   };

  //   return () => kafkaStream.close();
  // }, []);

  // const playVideo = async () => {
  //   await fetch(`http://localhost:5000/stream/${videoName}`);
  //   alert("Video is streaming via Kafka!");
  // };

  const asyncVideoFetch = async () => {
    try {
      dispatch({
        type: LOADER,
        payload: true,
      });
      const response = await axios.get(`http://127.0.0.1:5000/video/${videoId}`);
      console.log("Fetch Response: ", response);

      const filename = response.data.video_name.toLowerCase();
      let mimeType = "video/mp4"; // Default

      if (filename.endsWith(".mkv")) {
        mimeType = "video/x-matroska";
      } else if (filename.endsWith(".flv")) {
        mimeType = "video/x-flv";
      } else if (filename.endsWith(".3gp")) {
        mimeType = "video/3gpp";
      }

      // Convert Base64 to a Blob
      const byteCharacters = atob(response.data.video_data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const videoBlob = new Blob([byteArray], {
        type: mimeType,
      });

      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoSrc(videoUrl);
      setVideoName(response.data.video_name);
      dispatch({
        type: LOADER,
        payload: false,
      });
    } catch (error) {
      console.log("Error while fetching video");
      dispatch({
        type: LOADER,
        payload: false,
      });
    }
  };

  useEffect(() => {
    asyncVideoFetch();
  }, []);

  return (
    <div className=" AllCenteredFlex main_vid_player" style={{ flexDirection: "column" }}>
      <h1>Playing Video: {videoName}</h1>
      <div style={{ width: "60%" }}>
        <video controls loop autoPlay src={videoSrc} width="100%"></video>
      </div>
    </div>
  );
};

export default VideoPlayer;
