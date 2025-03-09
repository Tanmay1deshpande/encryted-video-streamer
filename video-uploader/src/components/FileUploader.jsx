import React, { useState } from "react";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
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
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload Video</button>
      </div>
    </div>
  );
};

export default FileUploader;
