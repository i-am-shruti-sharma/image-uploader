import React, { useEffect, useRef, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import replace from "./../assets/find_replace.svg";
import flip from "./../assets/ri_flip-horizontal-fill.svg";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import { db } from "./../../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// import Cropper from 'react-easy-crop'
import DoneIcon from "@mui/icons-material/Done";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { updateDoc, doc } from "firebase/firestore";
import TagInput from "./TagInput";
const AssetDrawer = ({
  currFile,
  setCurrFile,
  activePage,
  setExpandEdit,
  setRefresh,
  handleUpload,
  handleButtonClick,
  mode,
  setMode,
}) => {
  const [title, setTitle] = useState("Untitled");
  const [expandOptions, setExpandOptions] = useState(false);
  const navigate = useNavigate();
  const [tagList, setTagList] = useState([]); 
  const cropperRef = useRef(null);
  const [flippedX, setFlippedX] = useState(false);
  const [flippedY, setFlippedY] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [cropperKey, setCropperKey] = useState(0); 
  const [edtiId, setEditId] = useState(-1); 
  const [disable,setDisable]=useState({
    uploadBtn:false,
    cropBtn:false
  });
  useEffect(() => {
    if (currFile?.name) {
      setTitle(currFile?.name);
    }
    if (currFile?.tags) {
      setTagList(currFile?.tags);
    }
  }, [currFile]);

  useEffect(() => {
    if (mode == "edit" && currFile?.id) {
      setEditId(currFile?.id);
    }
  }, [mode]);

  // Flip the image horizontally
  const handleFlipHorizontal = () => {
    setFlippedX(!flippedX);
    cropperRef.current.cropper.scaleX(flippedX ? 1 : -1);
  };

  // Flip the image vertically
  const handleFlipVertical = () => {
    setFlippedY(!flippedY);
    cropperRef.current.cropper.scaleY(flippedY ? 1 : -1);
  };

  // Rotate the image
  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360; // Rotate by 90 degrees
    setRotation(newRotation);
    cropperRef.current.cropper.rotateTo(newRotation);
  };

  // Crop and upload the image
  const handleCrop = async (final = false) => {

    if (cropperRef.current) {
        setDisable({
            uploadBtn:false,
            cropBtn:true
        });
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();

      // Convert the canvas to a Blob
      croppedCanvas.toBlob(async (blob) => {
        const formData = new FormData();

        // Append the Blob directly
        formData.append("file", blob);
        formData.append("upload_preset", "img-uploader");

        const uploadUrl =
          "https://api.cloudinary.com/v1_1/doi4m7trz/image/upload";

        try {
          const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            let file = {
              url: data.secure_url,
              createdAt: null,
              name: "",
              tags: [],
              favrourite: false,
              hide: false,
            };
            // Set the updated URL
            setCurrFile(file); // Use `secure_url` for the uploaded image
            toggleGrid();
            setDisable({
                uploadBtn:false,
                cropBtn:false
            });
            if (final == true) {
              uploadFile(data.secure_url);
            }
          } else {
            console.error("Failed to upload image");
            const errorData = await response.json();
            console.error(errorData);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }, "image/png"); // Specify the image type (e.g., "image/png" or "image/jpeg")
    }
  };

  const uploadFile = async (file) => {
    setDisable({
        uploadBtn:true,
        cropBtn:false
    });
    if (mode == "add") {
      await addDoc(collection(db, "images"), {
        url: file ? file : currFile.url,
        createdAt: new Date().toLocaleDateString(),
        name: title,
        tags: tagList,
        favourite:
          currFile.favourite !== undefined ? currFile.favourite : false, // Default to false if undefined
        hide: currFile.hide !== undefined ? currFile.hide : false,
      });
    }
    if (mode == "edit") {
      const docRef = doc(db, "images", edtiId); // Reference to the document

      await updateDoc(docRef, {
        url: file ? file : currFile.url, // Update the file URL
        createdAt: new Date().toLocaleDateString(), // Update created date
        name: title, // Update title
        tags: tagList,
        favourite:
          currFile.favourite !== undefined ? currFile.favourite : false, // Default to false if undefined
        hide: currFile.hide !== undefined ? currFile.hide : false,
      });
      setDisable({
        uploadBtn:false,
        cropBtn:false
        });
      setMode("add");
    }

    setExpandEdit(false);
    setRefresh(true);
    if (activePage == "home") {
      navigate("/gallery");
    }
  };

  const reset = () => {
    handleButtonClick();
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    setCropperKey((prev) => prev + 1);
  };

  return (
    <div
      className="modal"
      data-show="true"
      style={{ display: "flex", opacity: "1" }}
    >
      <div className="modal-dialog" style={{ margin: "0", marginLeft: "auto" }}>
        <div className="modal-content">
          <div className="modal-header j-between">
            Add Asset
            <CloseIcon
              sx={{ color: "#C2CFE0", fontSize: 30, cursor: "pointer" }}
              onClick={(e) => setExpandEdit(false)}
            />
          </div>
          <div className="modal-body">
            <div className="cropper d-flex full-width">
              <div className="img-container">
                {!showGrid && (
                  <div className="edit-ddn">
                    <div
                      className="icon"
                      onClick={(e) => setExpandOptions(!expandOptions)}
                    >
                      {expandOptions ? (
                        <CloseIcon sx={{ color: "#fff", fontSize: 20 }} />
                      ) : (
                        <EditOutlinedIcon
                          sx={{ color: "#fff", fontSize: 20 }}
                        />
                      )}
                    </div>
                    {expandOptions ? (
                      <div className="list">
                        <div className="icon" onClick={toggleGrid}>
                          <CropOutlinedIcon
                            sx={{ color: "#fff", fontSize: 20 }}
                          />
                        </div>
                        <div className="icon" onClick={handleRotate}>
                          <RefreshOutlinedIcon
                            sx={{ color: "#fff", fontSize: 20 }}
                          />
                        </div>
                        <div className="icon" onClick={handleFlipHorizontal}>
                          <img
                            src={flip}
                            alt="replace"
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className="icon" onClick={handleFlipVertical}>
                          <img
                            src={flip}
                            alt="replace"
                            style={{ transform: "rotate(90deg)" }}
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className="icon" onClick={reset}>
                          <img
                            src={replace}
                            alt="replace"
                            width={20}
                            height={20}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                {showGrid && (
                  <div className="edit-ddn white d-flex">
                    <div className="icon" onClick={toggleGrid}>
                      <CloseIcon sx={{ color: "#334D6E", fontSize: 20 }} />
                    </div>
                    <div className="icon" onClick={ e=>{!disable.cropBtn && handleCrop()}}>
                      <DoneIcon sx={{ color: "#334D6E", fontSize: 20 }} />
                    </div>
                  </div>
                )}
                <Cropper
                  key={cropperKey}
                  src={currFile.url}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    height: "100%",
                  }}
                  // Aspect ratio for cropping
                  guides={showGrid}
                  dragMode={showGrid ? "crop" : "none"}
                  ref={cropperRef}
                  cropBoxMovable={showGrid} // Show/hide crop box
                  cropBoxResizable={showGrid}
                  viewMode={showGrid ? 0 : 1}
                  ready={() => {
                    const cropper = cropperRef.current?.cropper;
                    if (cropper) {
                      cropper.clear(); // Clear the crop box initially
                    }
                  }}
                  toggleDragModeOnDblclick={showGrid} // Prevent enabling crop box on double-click
                />
              </div>
              <div className="opts d-flex flex-column justify-content-between">
                <div className="flex-column justify-content-between">
                  <input
                    type="text"
                    value={title}
                    maxLength={100}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TagInput setTagList={setTagList} tagList={tagList} />
                </div>
                <button onClick={(e) => handleCrop(true)} disabled={disable.uploadBtn}>
                  <UploadIcon />
                  Upload Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDrawer;
