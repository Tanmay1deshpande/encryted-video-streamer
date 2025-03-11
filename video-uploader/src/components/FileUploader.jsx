import React, { useState } from "react";
import axios from "axios";
import { Button, LinearProgress } from "@mui/material";
import "./css/components.css";
import { useDispatch, useSelector } from "react-redux";
import { LOADER } from "../store/actions";

const FileUploader = ({ setTime, setFName, triggerReload }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  const chunkSize = 16 * 1024;

  const encryptFile = async (file) => {
    // Generate encryption key using AES-GCM
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // Whether the key is extractable
      ["encrypt", "decrypt"]
    );

    // Generate random IV for encryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const fileBuffer = await file.arrayBuffer();

    // Split the file into chunks and encrypt them
    const chunks = [];
    for (let i = 0; i < fileBuffer.byteLength; i += chunkSize) {
      const chunk = fileBuffer.slice(i, i + chunkSize);
      const encryptedChunk = await encryptChunk(chunk, key, iv);
      chunks.push(encryptedChunk);
    }

    sendChunksToKafka(chunks, iv);

    setStatus("File encrypted and ready for transmission!");
  };

  const encryptChunk = async (chunk, key, iv) => {
    // Encrypt a chunk of the file using AES-GCM
    const encryptedChunk = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
    return encryptedChunk;
  };

  const sendChunksToKafka = async (chunks, iv) => {
    console.log("Total number of chunks: ", chunks.length);
    for (const chunk of chunks) {
      const chunkBase64 = arrayBufferToBase64(chunk);
      const ivBase64 = arrayBufferToBase64(iv);

      // console.log("Sending chunk to Kafka");
    }
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      // encryptFile(e.target.files[0]);//Send chunks of the video
    }
  };

  const handleFileUpload = async () => {
    const currentTimestamp = Date.now();
    setTime(currentTimestamp);
    if (file) {
      setFName(file.name);
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("video_name", file.name);

    try {
      dispatch({
        type: LOADER,
        payload: true,
      });
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response: ", response);
      if (response.data.message === "Upload successful") {
        console.log("Uploaded successfully");
        alert("Video uploaded successfully");
        dispatch({
          type: LOADER,
          payload: false,
        });
        triggerReload(true);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Upload failed");
      dispatch({
        type: LOADER,
        payload: false,
      });
    }
  };

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <input type="file" onChange={handleFileChange} />
        <Button variant="contained" size="large" onClick={handleFileUpload}>
          Upload Video
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
