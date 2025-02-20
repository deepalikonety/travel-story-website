import React from 'react'
import {MdAdd,MdDeleteOutline,MdUpdate, MdClose } from 'react-icons/md'
import DataSelector from '../../components/input/DataSelector';
import TagInput from '../../components/input/TagInput';
import ImageSelector from '../../components/input/ImageSelector';
import { useState } from 'react';
import uploadImage from '../../utils/uploadImage';
import { toast } from "react-toastify";
import axiosInstance from '../../utils/axiosinstances';
import moment from 'moment';
import axios from 'axios';

const AddEditTravelStory = ({storyInfo,type,onClose,getAllTravelStories,}) => {
  const [title,setTitle]=useState(storyInfo?.title||"");
  const [storyImg,setstoryImg]=useState(storyInfo?.imageUrl||null);
  const [story,setstory]=useState(storyInfo?.story||"");
  const [visitedPlace,setVisitedPlace]=useState(storyInfo?.visitedPlace||[]);
  const [visitedDate,setVisitedDate]=useState(storyInfo?.visitedDate||null);

  const[error,setError]=useState("");

  const addNewTravelStory=async()=>{
    try{
      let imageUrl="";

      if(storyImg){
        const imgUploadRes=await uploadImage(storyImg);

        imageUrl=imgUploadRes.imageUrl||"";
      }
      const response=await axiosInstance.post("/add-story",{
        title,
        story,
        imageUrl:imageUrl||"",
        visitedPlace,
        visitedDate:visitedDate
        ? moment (visitedDate).valueOf()
        :moment().valueOf(),
      });
      if(response.data && response.data.story){
        toast.success("Added Story Successfully");
        getAllTravelStories();
        onClose();

      }
    }catch (error) {
     if(
      error.response &&
      error.response.data &&
      error.response.data.message
     ){
      setError(error.response.data.message);
     }else{
      setError("An unexpected error occurred.Please try again later.")
     }
    }
  }
  const updateTravelStory=async()=>{
    const storyId=storyInfo._id;

    try{
      let imageUrl="";
      let postData={
        title,
        story,
        imageUrl:storyInfo.imageUrl||"",
        visitedPlace,
        visitedDate:visitedDate
        ? moment (visitedDate).valueOf()
        :moment().valueOf(),
      };
      if(typeof storyImg==="object"){
        const imgUploadRes=await uploadImage(storyImg);
        imageUrl=imgUploadRes.imageUrl||"";

        postData={
          ...postData,
          imageUrl:imageUrl,
        };
      }
      const response=await axiosInstance.put("/edit-story/"+storyId,postData);
      if(response.data && response.data.story){
        toast.success("Updated Story Successfully");
        getAllTravelStories();
        onClose();

      }
    }catch (error) {
     if(
      error.response &&
      error.response.data &&
      error.response.data.message
     ){
      setError(error.response.data.message);
     }else{
      setError("An unexpected error occurred.Please try again later.")
     }
    }
  }

  const handleAddUpdateClick = () => {
    console.log("Input Data:", { title, storyImg, story, visitedPlace, visitedDate });

    let errorMessage = "";
    if (!title) {
        errorMessage = "Please enter the title.";
    }
    if (!story) {
        errorMessage += (errorMessage ? " & " : "") + "Please enter the story.";
    }
    if (errorMessage) {
        setError(errorMessage);
        return; 
    }
    setError(""); 

    if (type === "edit") {
        updateTravelStory();
    } else {
        addNewTravelStory();
    }
};

  const handleDeleteStoryImg=async()=>{
   const deleteImgRes=await axiosInstance.delete("/delete-image",{
    params:{
      imageUrl:storyInfo.imageUrl,
    },
   })
   if(deleteImgRes.data){
    const storyId=storyInfo._id;
    let postData={
      title,
      story,
      visitedDate:moment().valueOf(),
      visitedPlace,
      imageUrl:"",
    };
    const response=await axiosInstance.put("/edit-story/"+storyId,postData);
    setstoryImg(null);
   }
  };
  return (
    <div className="relative">
      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
          {type ==="add" ? "Add Story" :"Update Story"}
        </h5>

        <div>
          <div className='flex items-center gap-3  p-2 rounded-l-lg'>
            {type === 'add' ? (
              <button className='btn-small' onClick={handleAddUpdateClick}>
               <MdAdd className="text-lg" />Add Story
              </button>
              ) : (
                <>
              <button className='btn-small' onClick={handleAddUpdateClick}>
              <MdUpdate className="text-lg" />Update Story
              </button>
                </> )}
             <button className='' onClick={onClose}>
             <MdClose className='text-xl text-slate-400' />
             </button> 
           </div>
           {error &&(
            <p className="text-red-400 text-xs pt-2 text-right">{error}</p>
            )}
        </div>
      </div>

      <div>
        <div className='flex-1 flex flex-col gap-2 pt-4'>
          <label className='input-label'>
          Title
          </label>
          <input type="text" 
          className="text-2xl text-slate-950 outline-none" 
          placeholder='A Beautiful trip to Kashmir.'
          value={title}
          onChange={({target})=>setTitle(target.value)} />

          <div className='my-3'>
            <DataSelector date={visitedDate} setDate={setVisitedDate} />
          </div>
          <ImageSelector image={storyImg} setImage={setstoryImg} handleDeleteImg={handleDeleteStoryImg}  />


          <div className='flex flex-col gap-2 mt-4'>
              <label className='input-label'>Story</label>
              <textarea type="text" className='text-sm text-slate-850 outline-none bg-slate-200 p-2 rounded'
              placeholder='Your Story'
              rows={10}
              value={story}
              onChange={({target})=>setstory(target.value)} />
          </div>

          <div className="pt-3">
              <label className='input-label'> Visited Locations</label>
              <TagInput 
                tags={visitedPlace}
                setTags={setVisitedPlace} 
              />
          </div>
        </div>
      </div>
    </div>

  );
};

export default AddEditTravelStory