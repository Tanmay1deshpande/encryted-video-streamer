import FileUploader from '../components/FileUploader'
import Navbar from '../components/Navbar';
import VideoList from '../components/VideoList'
import React from 'react';
import './CSS/Pages.css'

const Home = () => {
  const [timestamp, setTimestamp] = React.useState(null);
  const [fileName, setFileName] = React.useState('');
  return (
    <>
        <Navbar title="Video Uploader"></Navbar>
        <div className="AllCenteredFlex home_main">
          <FileUploader setTime={(x) => setTimestamp(x)} setFName={(x) => setFileName(x)}></FileUploader>
          <VideoList time={timestamp} fName={fileName}></VideoList>
        </div>
    </>
  )
}

export default Home
