import React from "react";
import Navbar from "../components/Navbar";
import VideoPlayer from "../components/VideoPlayer";
import { useParams } from "react-router-dom";

const Player = () => {
  const { id } = useParams();
  return (
    <div>
      <Navbar title="Video Player" navigationBtn="Uploader"></Navbar>
      <VideoPlayer videoId={id}></VideoPlayer>
    </div>
  );
};

export default Player;
