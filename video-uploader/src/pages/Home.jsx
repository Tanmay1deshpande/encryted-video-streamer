import FileUploader from '../components/FileUploader'
import Navbar from '../components/Navbar';
import VideoList from '../components/VideoList'
import * as React from 'react';

const Home = () => {
  return (
    <>
        <Navbar title="Video Uploader"></Navbar>
        <FileUploader></FileUploader>
        <VideoList></VideoList>
    </>
  )
}

export default Home
