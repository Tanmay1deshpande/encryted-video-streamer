import FileUploader from "../components/FileUploader";
import Navbar from "../components/Navbar";
import VideoList from "../components/VideoList";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CSS/Pages.css";
import { LinearProgress } from "@mui/material";

const Home = () => {
  const [timestamp, setTimestamp] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [reload, setReload] = React.useState(false);
  const { loader } = useSelector((state) => state);

  return (
    <>
      <Navbar title="Video Uploader" navigationBtn="Home"></Navbar>
      {loader && <LinearProgress />}
      <div className="AllCenteredFlex home_main">
        <FileUploader
          setTime={(x) => setTimestamp(x)}
          setFName={(x) => setFileName(x)}
          triggerReload={(x) => setReload(x)}></FileUploader>
        <VideoList
          time={timestamp}
          fName={fileName}
          triggerReload={reload}
          setTriggerReload={(x) => setReload(x)}></VideoList>
      </div>
    </>
  );
};

export default Home;
