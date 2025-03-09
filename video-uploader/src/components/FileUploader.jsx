import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "./css/components.css"

const FileUploader = ({setTime, setFName}) => {
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    await axios.post("http://localhost:5000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div>
      <div style={{margin:"20px"}}>
        <input type="file" onChange={handleFileChange} />
        <Button variant="contained" size="large" onClick={handleFileUpload}>Upload Video</Button>
      </div>
    </div>
  );
};

export default FileUploader;
