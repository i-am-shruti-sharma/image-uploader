import { useEffect, useRef, useState } from 'react';
import './App.css'
import Home from './components/Home'
import AssetDrawer from './components/AssetDrawer';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGallery from './components/ImageGallery';
import axios from 'axios';

import { Cloudinary } from 'cloudinary-core';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

function App() {
  const [currFile,setCurrFile]=useState({
    url:null,
    createdAt: null,
    name:'',
    tags:[],
    favrourite:false,
    hide:false,
    id:null
  });
  const [activePage,setActivePage]=useState('home');
  const [expandEdit,setExpandEdit]=useState(false);
  const [refresh,setRefresh]=useState(false);
  const [mode,setMode]=useState('add');
  const [alert, setAlert] = useState({
    message: "",
    open: false,
  });
    // Handle file selection
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        handleUpload(file);
        event.target.value=null;
        // setCurrFile(file);
      }
    };
    const handleUpload = async (image) => {
      if (!image) return;
      setAlert({
        message:"Image is uploading.. It may take some time!",
        open:true
      });
      const cld = new Cloudinary({ cloud_name: 'doi4m7trz' });
  
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'img-uploader'); // Replace with your preset
  
      // The URL for Cloudinary upload API
      const uploadUrl = 'https://api.cloudinary.com/v1_1/doi4m7trz/image/upload';
  
      // Upload image using fetch
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
  
      // Parse the response and handle the image URL
      const data = await response.json();
      const imgUrl = data.secure_url;  // This is the URL of the uploaded image
      let file={
        url:imgUrl,
        createdAt: null,
        name:'',
        tags:[],
        favrourite:false,
        hide:false,
      }
      setCurrFile(file);
      setExpandEdit(true);
    };

    const handleButtonClick = () => {
      // fileInputRef.current.click();
      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.click(); // Trigger file input click
      }
    };

  return (
    <>
      <input       
      type="file"
      id="fileInput"
      style={{ display: 'none' }}
      accept="image/*"
      onChange={handleFileChange}/>

      {expandEdit && (
          <AssetDrawer
          currFile={currFile}
          activePage={activePage}
          setExpandEdit={setExpandEdit}
          setRefresh={setRefresh}
          setCurrFile={setCurrFile}
          handleUpload={handleUpload}
          handleButtonClick={handleButtonClick}
          setMode={setMode}
          mode={mode}
        />
      )}


        {/* Redirect to the default route if `activePage` changes */}
        <Routes>
          {/* Home Route */}
          <Route
            path="/home"
            element={
              <Home setCurrFile={setCurrFile} setActivePage={setActivePage} handleButtonClick={handleButtonClick} />
            }
          />
         
          {/* Gallery Route */}
          <Route
            path="/gallery"
            element={<ImageGallery setMode={setMode} setCurrFile={setCurrFile} setExpandEdit={setExpandEdit} setActivePage={setActivePage} refresh={refresh} setRefresh={setRefresh}/>}
          />

          {/* Default Redirect to Home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
       <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        message={alert.message}
        onClose={(e) => setAlert({ open: false, message: "" })} 
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </>
  )
}

export default App
