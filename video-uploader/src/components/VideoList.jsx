import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";
import { LinearProgress } from "@mui/material";

function createData(title, link, timestamp) {
  return { title, link, timestamp };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0),
  createData("Ice cream sandwich", 237, 9.0),
  createData("Eclair", 262, 16.0),
  createData("Cupcake", 305, 3.7),
  createData("Gingerbread", 356, 16.0),
];

const VideoList = ({ time, fName, triggerReload }) => {
  const [videos, setVideos] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [noVidYet, setNoVidYet] = useState(true);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const asyncResponse = async () => {
    try {
      setLoader(true);
      const response = await axios.get("http://127.0.0.1:5000/videos");
      console.log("Response: ", response);
      if (response?.data.length > 0) {
        setVideos(response.data);
        setNoVidYet(false);
        setLoader(false);
      }
    } catch (error) {
      console.log("No videos found yet.", error?.response.data);
      setNoVidYet(true);
      setLoader(false);
    }
  };
  // Fetch videos from the backend
  useEffect(() => {
    asyncResponse();
    console.log("Videos array: ", videos);
  }, [triggerReload]);

  // Function to play video
  const playVideo = (videoId) => {
    navigate(`/videoPlayer/:id=${encodeURIComponent(videoId)}`);
    console.log("Videos array: ", videos);
  };

  return (
    <div>
      {loader && <LinearProgress />}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, border: "1px solid #dedede" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Title</TableCell>
              <TableCell align="right">Timestamp</TableCell>
              <TableCell align="right">Play</TableCell>
            </TableRow>
          </TableHead>
          {!noVidYet && (
            <TableBody>
              {videos &&
                videos.map((video, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {video.video_name || "Dummy Video"}
                    </TableCell>
                    <TableCell align="right">{video.upload_time || "Old"}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" onClick={() => playVideo(video.id)}>
                        ▶ Play
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          )}
          {noVidYet && (
            <TableBody>
              <h1>No Videos Yet</h1>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {fName && time && <p>Newly uploaded file: {fName}</p>}
    </div>
  );
};

export default VideoList;
