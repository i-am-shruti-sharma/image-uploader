import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { db } from "./../../firebase.config";
import { collection, getDocs,doc,updateDoc,deleteDoc } from "firebase/firestore";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import uploadImg from './../assets/upload.png';
import Snackbar from '@mui/material/Snackbar';
const ImageGallery = ({setActivePage,refresh,setRefresh,setCurrFile,setExpandEdit,setMode}) => {

    const [search,setSearch]=useState('');
    const [sort,setSort]=useState(false);
    const [images,setImages]=useState([[],[],[],[]]);
    const [mainStore,setmainStore]=useState([[],[],[],[]]);
    const [noData,setnoData]=useState(false);
    const [expandEdit,setExpandEditModal]=useState(-1);
    const [alert,setAlert]=useState({
        message:'',
        open:false
    });

    const fetchImages = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'images'));
          var imgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          let imgDummy=[[],[],[],[]];
          
          imgs=imgs.filter((val)=> {return val?.hide !== true})
          imgs.forEach((item, index) => {
            const rowIndex = index % 4; 
            imgDummy[rowIndex].push(item);
          });
          if(!imgDummy[0]?.length && !imgDummy[1]?.length && !imgDummy[2]?.length && !imgDummy[3]?.length){
            setnoData(true);
          }else{
            setnoData(false);
          }
          setImages(imgDummy);
          setmainStore(imgDummy);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
    };
    
    useEffect(() => {
        if(refresh){
            setAlert({
                message:'Updated file successfully!',
                open:true
            });
        }
        fetchImages();
        setRefresh(false);
    }, [refresh])

    useEffect(() => {
        const handler = setTimeout(() => {
            updateSearch(search);
          }, 500);
        return () => {
            clearTimeout(handler);
          };
       
    }, [search])

    const updateSearch=(search)=>{
        if(search?.length == 0){
            setImages(mainStore);
            return;
        }
        else{
            // Flatten the 2D array into a 1D array
            const flatImages = mainStore.flat();

            // Filter images based on the search query
            let imgDummy=[[],[],[],[]];
            const results = flatImages.filter((image) =>
                image?.name?.toLowerCase()?.includes(search?.toLowerCase())
            )
            if(!results?.length){
                setnoData(true);
            }else{
                setnoData(false);
            }
            results.forEach((item, index) => {
                if(!item?.hide){
                    const rowIndex = index % 4; 
                    imgDummy[rowIndex].push(item);
                }
            });
            setImages(imgDummy);
        }
    }
    const handleAddClick=(e)=>{
        e?.preventDefault();
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
          fileInput.click(); // Trigger file input click
        }
    }

    const edit=(file)=>{
        setExpandEdit(true);
        setCurrFile(file);
        setMode('edit');
        setExpandEditModal(-1);
    }

    const hide =async(file)=>{
        try {
            const docRef = doc(db, "images", file?.id); // Reference to the document
            
            await updateDoc(docRef, {
                url: file.url, // Update the file URL
                createdAt: new Date().toLocaleDateString(), // Update created date
                name: file?.name, // Update title
                tags: file?.tags ? file?.tags : [], // Update description
                favourite: file.favourite !== undefined ? file.favourite : false, // Default to false if undefined
                hide: true, 
            });
            setAlert({
                message:'Selected file hidden successfully!',
                open:true
            });
            fetchImages();
            setExpandEditModal(-1);

        } catch (error) {
            setAlert({
                message:'Something went wrong!',
                open:true
            });
        }
    }

    const deleteImg = async (file) => {
        try {
          // Reference the document by its ID
          const docRef = doc(db, "images", file?.id);
      
          // Delete the document
          await deleteDoc(docRef);
          fetchImages();
          console.log("Document successfully deleted!");
          setAlert({
            message:'Selected file deleted successfully!',
            open:true
        })
        setExpandEditModal(-1);

        } catch (error) {
            setAlert({
                message:'Something went wrong!',
                open:true
            });
        }
    };

    const addToFav = async(file)=>{
        try {
            const docRef = doc(db, "images", file?.id); // Reference to the document
            
            await updateDoc(docRef, {
                url: file.url, // Update the file URL
                createdAt: new Date().toLocaleDateString(), // Update created date
                name: file?.name, // Update title
                tags: file?.tags ? file?.tags : [], // Update description
                favourite: file.favourite !== undefined ? !file.favourite : true, // Default to false if undefined
                hide: file.hide !== undefined ? file.hide : false, // Default to false if undefined
            });
            setAlert({
                message:'Added to favourite!',
                open:true
            })
            fetchImages();
        } catch (error) {
            setAlert({
                message:'Something went wrong!',
                open:true
            });
        }
    }
      
  return (
    <>
    <div className='header d-flex j-between'>
        Gallery
    </div>
    <div className='gallery'>
        <div className='filter'>
            <div className='d-flex gap-14'>
                <div className='search-cont'>
                    <input type='text' placeholder='Search Assets' onChange={e=>setSearch(e.target.value)} value={search} maxLength={100} />
                    <SearchIcon sx={{ color: '#90A0B7',fontSize: 24,position:'absolute',top:'7px',right:'5px' }} />
                </div>
                <div className='sort-ddn'>
                    <div className='d-flex' onClick={e=>setSort(!sort)}>
                        Newest First
                        <SwapVertIcon sx={{ color: '#90A0B7',fontSize: 20 }} />
                    </div>
                    {
                        sort ? 
                        <div className='opt'>
                            <div className='d-flex'>
                                <input type='radio'/>
                                Newest First
                            </div>
                            <div className='d-flex'>
                                <input type='radio'/>
                                Oldest First
                            </div>
                            <div className='d-flex'>
                                <input type='radio'/>
                                A-Z
                            </div>
                        </div>
                        :''
                    }
                
                </div>
            </div>
            <button onClick={e=>handleAddClick(e)} className='mt-0 add-btn'>
                <AddOutlinedIcon/>
                <span>Add</span>
            </button>
        </div>

        {
            noData ?
            <div className='no-data'>
                <img src={uploadImg} alt='upload' height={250} width={250}/>
                {
                    search
                    ?
                    <span>No results for the searchterm '{search}'</span>
                    :
                    <span>No Assets yet</span>
                }
            </div>
            :
            <div className='gal-container'>
                <div className='d-flex flex-column'>
                    {images[0].map((item, index) => {
                       return (
                        !item?.hide && (
                            <ImageCard
                            key={index}
                            item={item}
                            expandEdit={expandEdit}
                            setExpandEditModal={setExpandEditModal}
                            edit={edit}
                            hide={hide}
                            deleteImg={deleteImg}
                            addToFav={addToFav}
                            />
                        )
                        );
                    })}
                </div>
                <div className='d-flex flex-column'>
                    {images[1].map((item, index) => {
                       return (
                        !item?.hide && (
                            <ImageCard
                            key={index}
                            item={item}
                            expandEdit={expandEdit}
                            setExpandEditModal={setExpandEditModal}
                            edit={edit}
                            hide={hide}
                            deleteImg={deleteImg}
                            addToFav={addToFav}
                            />
                        )
                        );
                    })}
                </div>
                <div className='d-flex flex-column'>
                    { images[2].map((item, index) => {
                        return (
                        !item?.hide && (
                            <ImageCard
                            key={index}
                            item={item}
                            expandEdit={expandEdit}
                            setExpandEditModal={setExpandEditModal}
                            edit={edit}
                            hide={hide}
                            deleteImg={deleteImg}
                            addToFav={addToFav}
                            />
                        )
                        );
                    })}
                </div>
                <div className='d-flex flex-column'>
                    {
                        images[3].map((item, index) => {
                            return (
                            !item?.hide && (
                                <ImageCard
                                key={index}
                                item={item}
                                expandEdit={expandEdit}
                                setExpandEditModal={setExpandEditModal}
                                edit={edit}
                                hide={hide}
                                deleteImg={deleteImg}
                                addToFav={addToFav}
                                />
                            )
                            );
                        })
                    }
                </div>
            </div>
        }
       
    </div>
        <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        message={alert.message}
        onClose={e=>setAlert({open:false,message:''})} // Handles closing of the Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
        />
    </>
  )
}

export default ImageGallery



const ImageCard = ({item,expandEdit,setExpandEditModal,edit,hide,deleteImg,addToFav}) =>{
    return(
    <div className='img'>
        
        <img src={item?.url} alt={item}/>
        <div className='h'>
            {item?.name ? item?.name : 'Untitled'}
            {
                item?.favourite ?
                <FavoriteIcon sx={{cursor:'pointer'}}  onClick={e=>addToFav(item)}/>
                :
                <FavoriteBorderIcon sx={{cursor:'pointer'}} onClick={e=>addToFav(item)}/>
            }
        </div>

        <div className='b'>
            <div className='round'>
                <div className='icon'>GL</div>
                <div className='tip'>
                    Gokul Lalasan 
                    {/* Since we don't have auth as of now is is hard coded */}
                    <span>{item?.createdAt}</span>
                </div>
            </div>
            <div className='round'>
                <div className='icon' onClick={e=> {setExpandEditModal(expandEdit == item?.id ? -1 : item?.id )}}>
                    <MoreVertIcon/>
                </div>
                {expandEdit == item?.id &&
                <div className='cont'>
                    <div className='item' onClick={e=>edit(item)}>Edit</div>
                    <div className='item' onClick={e=>hide(item)}>Hide</div>
                    <div className='item' style={{color:'#F7685B'}} onClick={e=>deleteImg(item)}>Delete</div>
                </div>
                }
                
            </div>
        </div>
    </div>
    )
}