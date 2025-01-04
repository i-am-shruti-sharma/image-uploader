import React, { useRef } from 'react'
import home from './../assets/home.png';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
const Home = ({setCurrFile}) => {
  const fileInputRef = useRef(null);
    // Trigger the hidden file input when the button is clicked
    const handleButtonClick = () => {
      fileInputRef.current.click();
    };
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCurrFile(file);
    }
  };
  return (
    <>
      <input       
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      accept="image/*"
      onChange={handleFileChange}/>

      <div className='home d-flex align-items-center justify-content-center full-height'>
            <div className='d-flex flex-column align-items-center justify-content-center'>
                <img src={home} alt='add assets' width="214" height="258"/>
                <span>Add Assets here</span>
                <button  onClick={handleButtonClick}>
                    <AddOutlinedIcon/>
                    Add
                </button>
            </div>
        </div>
    </>
  )
}

export default Home