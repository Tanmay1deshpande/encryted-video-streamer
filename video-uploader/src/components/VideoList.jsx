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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { IconButton, LinearProgress, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LOADER } from "../store/actions";

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

const VideoList = ({ time, fName, triggerReload, setTriggerReload }) => {
  const [videos, setVideos] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [noVidYet, setNoVidYet] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [videoIdDel, setVideoIdDel] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const asyncResponse = async () => {
    try {
      dispatch({
        type: LOADER,
        payload: true,
      });
      const response = await axios.get("http://127.0.0.1:5000/videos");
      console.log("Response: ", response);
      if (response?.data.length > 0) {
        setVideos(response?.data);
        setNoVidYet(false);
        dispatch({
          type: LOADER,
          payload: false,
        });
      } else {
        console.log("No videos available");
        dispatch({
          type: LOADER,
          payload: false,
        });
      }
    } catch (error) {
      console.log("No videos found yet.", error?.response?.data);
      setNoVidYet(true);
      dispatch({
        type: LOADER,
        payload: false,
      });
    }
  };
  // Fetch videos from the backend
  useEffect(() => {
    asyncResponse();
    // console.log("Videos array: ", videos);
  }, [triggerReload]);

  // Function to play video
  const playVideo = (videoId) => {
    navigate(`/videoPlayer/:id=${encodeURIComponent(videoId)}`);
    console.log("Videos array: ", videos);
  };

  const openDeleteModal = (videoId) => {
    console.log("Deleting video with ID: ", videoId);
    setVideoIdDel(videoId);
    setDeleteModal(true);
  };

  const deleteVideo = async () => {
    const deleteURL = `http://127.0.0.1:5000/delete/:id=${encodeURIComponent(videoIdDel)}`;
    setDeleteModal(false);
    try {
      dispatch({
        type: LOADER,
        payload: true,
      });
      const response = await axios.delete(deleteURL);
      console.log("Response: ", response);
      if (response?.data.data == "Delete success") {
        console.log("Video deleted successfully");
        alert("Video deleted successfully");
        setTriggerReload(true);
        dispatch({
          type: LOADER,
          payload: false,
        });
        window.location.reload();
      } else {
        console.log("Unknown error occurred");
        dispatch({
          type: LOADER,
          payload: false,
        });
      }
    } catch (error) {
      console.log("Error while deleting: ", error);
      dispatch({
        type: LOADER,
        payload: false,
      });
    }
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, border: "1px solid #dedede" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
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
                    <TableCell align="right">
                      <IconButton variant="contained" onClick={() => openDeleteModal(video.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center" }}>
                  <h1>No Videos Available</h1>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {fName && time && <p>Newly uploaded file: {fName}</p>}

      <Dialog
        open={deleteModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteModal(false)}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Are you sure you want to delete this video?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Video once deleted cannot be recovered
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button onClick={deleteVideo}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VideoList;
