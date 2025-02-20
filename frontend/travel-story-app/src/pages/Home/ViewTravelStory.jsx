import React from 'react';
import { GrMapLocation } from 'react-icons/gr';
import { MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md';
import moment from 'moment'; 

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  return (
    <div className="relative">
      <div className='flex items-center justify-end'>
        <div>
          <div className='flex items-center gap-3 p-2 rounded-l-lg'>
            <button className='btn-small' onClick={onEditClick}>
              <MdUpdate className="text-lg" /> Update Story
            </button> 

            <button className='btn-small btn-delete' onClick={onDeleteClick}>
              <MdDeleteOutline className="text-lg" /> Delete Story
            </button>  

            <button className='' onClick={onClose}>
              <MdClose className='text-xl text-slate-400' />
            </button> 
          </div>
        </div>
      </div>

      <div>
        <div className='flex-1 flex flex-col gap-2 py-4'>
          <h1 className='text-2xl text-slate-800'>
            {storyInfo&&storyInfo.title} 
          </h1>

          <div className='flex items-center justify-between gap-3'>
            <span className="text-xs text-slate-450">
              {storyInfo?.visitedDate 
                ? moment(storyInfo.visitedDate).format("Do MMM YYYY") 
                : "Date not available"}
            </span>

            <div className='inline-flex items-center gap-2 text-[13px] text-cyan-500 bg-cyan-100/40 rounded px-2 py-1'>
              <GrMapLocation className='text-sm' />
              {storyInfo && storyInfo
              .visitedPlace.map((item, index) => 
                  storyInfo.visitedPlace.length==index+1 ? `${item}` : `${item}, ` )}
            </div>
          </div>
          <img src={storyInfo && storyInfo.imageUrl}
          alt="Selected"
          className='w-full h-[300px] object-cover rounded-lg'/>

          <div className='mt-4'>
            <p className='text-sm text-slate-800 leading-6 text-justify whitespace-pre-line'>{storyInfo.story}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
