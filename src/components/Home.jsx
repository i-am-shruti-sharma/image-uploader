import React from 'react'
import home from './../assets/home.png';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
const Home = ({handleButtonClick}) => {
  return (
    <>
      <div className='home d-flex align-items-center justify-content-center full-height'>
            <div className='d-flex flex-column align-items-center justify-content-center'>
                <img src={home} alt='add assets' width="214" height="258"/>
                <span>Add Assets here</span>
                <button  onClick={handleButtonClick} className='add-btn'>
                    <AddOutlinedIcon/>
                    Add
                </button>
            </div>
        </div>
    </>
  )
}

export default Home