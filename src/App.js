import React, {useEffect, useRef} from 'react';
import './App.css';
import * as tf from "@tensorflow/tfjs"
//import * as facemesh from "@tensorflow-models/facemesh" 
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection" 

import '@mediapipe/face_mesh';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';

import Webcam from "react-webcam"
import {drawMesh} from "./utilities"

function App() {

const webcamRef= useRef(null)
const canvasRef = useRef(null)

//Load Facemesh
const runFacemesh = async () =>{
const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'tfjs',
};
const net = await faceLandmarksDetection.createDetector(model, detectorConfig);
  setInterval(() => {
    detect(net);
  }, 10);
}

//Detech function
const detect = async (net) => {
  if(typeof webcamRef.current !== "undefined" &&
  webcamRef.current !== null &&
  webcamRef.current.video.readyState === 4){// Checking cam is not unfefined or null and it is recieving data (readState === 4)
    //Get video properties
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    //Set video widths
    webcamRef.current.video.width=videoWidth;
    webcamRef.current.video.height=videoHeight;

    //Set canvas witdh
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    //Make detections
    //const face = await net.estimateFaces(video);
    const estimationConfig = {flipHorizontal: false};
    const face = await net.estimateFaces(video,estimationConfig);
    console.log("Face: ",face)
    
    //Get canvas context for drawing
    const ctx = canvasRef.current.getContext("2d");
    requestAnimationFrame(() => {drawMesh(face[0], ctx)});
  }
}

useEffect(()=>{runFacemesh()}, []);

return (
  <div className="App">
    <header className="App-header">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
    </header>
  </div>
);
}

export default App;
