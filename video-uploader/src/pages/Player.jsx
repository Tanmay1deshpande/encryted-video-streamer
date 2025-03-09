import React from 'react'
import Navbar from '../components/Navbar'
import VideoPlayer from '../components/VideoPlayer'

const Player = () => {
  return (
    <div>
      <Navbar title="Video Player"></Navbar>
      <VideoPlayer></VideoPlayer>
    </div>
  )
}

export default Player
