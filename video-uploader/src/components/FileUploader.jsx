import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "./css/components.css";

const FileUploader = ({ setTime, setFName }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
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

    // Read the file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Split the file into chunks and encrypt them
    const chunks = [];
    for (let i = 0; i < fileBuffer.byteLength; i += chunkSize) {
      const chunk = fileBuffer.slice(i, i + chunkSize);
      const encryptedChunk = await encryptChunk(chunk, key, iv);
      chunks.push(encryptedChunk);
    }

    // Optionally, send these chunks via Kafka to the backend
    sendChunksToKafka(chunks, iv);

    setStatus("File encrypted and ready for transmission!");
  };

  const encryptChunk = async (chunk, key, iv) => {
    // Encrypt a chunk of the file using AES-GCM
    const encryptedChunk = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      chunk
    );
    return encryptedChunk;
  };

  const sendChunksToKafka = async (chunks, iv) => {
    // For each encrypted chunk, send it to the backend via Kafka.
    // Here, you would use your Kafka producer to send each chunk.
    // This could be an HTTP request or direct Kafka producer logic.
    console.log("Total number of chunks: ", chunks.length);
    for (const chunk of chunks) {
      const chunkBase64 = arrayBufferToBase64(chunk);
      const ivBase64 = arrayBufferToBase64(iv);

      // Send this data via your Kafka producer or HTTP request
      // console.log("Sending chunk to Kafka");
      // Your Kafka logic to send the data
    }
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      encryptFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    const currentTimestamp = Date.now();
    setTime(currentTimestamp);
    if (file) {
      setFName(file.name); // Set the file name
    }

    const formData = new FormData();
    formData.append("file", file);

    // Send to backend Flask API
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response: ", response);
      if (response.data.status === "success") {
        console.log("Uploaded successfully");
        alert("Video uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Upload failed");
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
