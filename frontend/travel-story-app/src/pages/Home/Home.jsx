import React from "react";
import Navbar from "../../components/input/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstances";
import {MdAdd} from "react-icons/md";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
Modal.setAppElement("#root");
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory  from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCards from "../../components/Cards/EmptyCards";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage,getEmptyCardImg } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories,setAllStories]=useState([]);
  const [searchQuery,setSearchQuery]=useState('');
  const [filterType,setFilterType]=useState("");
  const [dateRange,setDateRange]=useState({form:null,to:null});

  const[openAddEditModal,setOpenAddEditModal]=useState({
    isShown:false,
    type:"add",
    data:null,
  });

  const [openViewModal,setOpenViewModal]=useState({
    isShown:false,
    data:null,
  });
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      // Check if error.response exists before accessing it
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } else {
        console.error("Error occurred: ", error.message);
      }
    }
  };
  const getAllTravelStories=async()=>{
    try{
      const response = await axiosInstance.get("/get-all-stories");
      if(response.data && response.data.stories){
        setAllStories(response.data.stories);
      }

    }catch(error){
      console.log("An unexpected error occured.Please try again.")
    }
  }

  const handleEdit=(data)=>{
    setOpenAddEditModal({isShown:true,type:"edit",data:data});
  }
  const handleViewStory=(data)=>{
    setOpenViewModal({isShown:true,data});
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
        const response = await axiosInstance.put(
            `/update-is-fav/${storyId}`, 
            { isFavourite: !storyData.isFavourite }
        );

        if (response.data && response.data.story) {
          toast.success(`Story ${!storyData.isFavourite ? "added to" : "removed from"} favourites`);
          if(filterType==="search" && searchQuery){
            onSearchStory(searchQuery);
          } else if(filterType==="data"){
            filterStoriesByDate(dateRange);
          }else{
            getAllTravelStories();
          }
        }
    } catch (error) {
        console.error("Error updating favourite status:", error.response || error.message);
        toast.error("An unexpected error occurred. Please try again.");
    }
};
  const deleteTravelStory = async (data) => {
  const storyId = data._id;

  try {
    const response = await axiosInstance.delete("/delete-story/" + storyId);

    if (response.data && !response.data.error) {
      toast.error("Story Deleted Successfully");
      setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
      getAllTravelStories();
    }
  } catch (error) {
    console.error("Error deleting story:", error);
  }
};

  const onSearchStory = async(query)=>{ 
  try {
    const response = await axiosInstance.get("/search",{
      params:{
        query
      },
    });
    if(response.data && response.data.stories){
      setFilterType("search");
      setAllStories(response.data.stories);
     }
    } catch (error) {
    console.error("Error deleting story",error);
  }
}

const handleClearSearch=()=>{
setFilterType("");
getAllTravelStories();
};

const filterStoriesByDate = async (day) => {
  try {
    const startDate=day.from? moment(day.from).valueOf():null;
    const endDate=day.to? moment(day.to).valueOf():null;
    if(startDate && endDate){
      const response=await axiosInstance.get("/travel-stories/filter",{params:{startDate,endDate},
      });
      if(response.data &&  response.data.stories){
        setFilterType("date");
        setAllStories(response.data.stories);
      }
    }
  } catch (error) {
    console.error("Error filtering stories by date:", error);
  }
};

const handleDayClick = (day) => {
  setDateRange(day);
  filterStoriesByDate(day);
};

const resetFilter=()=>{
  setDateRange({from:null,to:null});
  setFilterType("");
  getAllTravelStories();
};

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
    <Navbar
     userInfo={userInfo} 
     searchQuery={searchQuery}
     setSearchQuery={setSearchQuery}
     onSearchNote={onSearchStory}
     handleClearSearch={handleClearSearch}
     />

    <div className="container mx-auto py-10">
      <FilterInfoTitle filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{
          resetFilter();
        }}
       />
      <div className="flex gap-7">
        <div className="flex-1">
          {allStories.length > 0 ?(
            <div className="grid grid-cols-2 gap-4">
              {allStories.map((item)=>{
                return(
                  <TravelStoryCard 
                  key={item._id}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  story={item.story}
                  visitedDate={item.visitedDate}
                  visitedPlace={item.visitedPlace}
                  isFavourite={item.isFavourite}
                  onEdit={()=>handleEdit(item)}
                  onClick={()=>handleViewStory(item)}
                  onFavouriteClick={()=>updateIsFavourite(item)}
                   />
                );
              })}
              </div>
          ):(
            <EmptyCards 
            imgSrc={getEmptyCardImg(filterType)} 
            message={getEmptyCardMessage(filterType)}/>
          )}
          </div>
          <div className="w-[320px]">
            <div className="bg-white border border-slate-200  shadow-lg shadow-slate-300/50 rounded-lg">
            <div className="p-4">
              <DayPicker captionLayout="dropdown-buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation />
            </div>
            </div>
          </div>
        </div>
      </div>

      <Modal 
      isOpen={openAddEditModal.isShown}
             onRequestClose={()=>{}}
             style={{overlay:{
              backgroundColor:"rgba(0,0,0,0.2)",zIndex:999,
             },
            }}
            appElement={document.getElementById("root")}
            className="model-box">

            <AddEditTravelStory
            type={openAddEditModal.type}
            storyInfo={openAddEditModal.data}
            onClose={()=>{
              setOpenAddEditModal({isShown:false,type:"add",data:null});
            }}
            getAllTravelStories={getAllTravelStories}
            />
      </Modal>
      <Modal 
      isOpen={openViewModal.isShown}
             onRequestClose={()=>{}}
             style={{overlay:{
              backgroundColor:"rgba(0,0,0,0.2)",zIndex:999,
             },
            }}
            appElement={document.getElementById("root")}
            className="model-box">
           
         <ViewTravelStory storyInfo={openViewModal.data||null}  
         onClose={()=>{
          setOpenViewModal((prevState)=>({...prevState,isShown:false}));
         }} 
         onEditClick={()=>{
          setOpenViewModal((prevState)=>({...prevState,isShown:false}));
          handleEdit(openViewModal.data||null)
         }} 
         onDeleteClick={()=>{
          deleteTravelStory(openViewModal.data||null);
         }}/>
      </Modal>
    <button className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-400 hover:bg-cyan-200 fixed right-10 bottom-10" onClick={()=>{
      setOpenAddEditModal({isShown:true,type:"add",data:null});
    }}>
    <MdAdd className="text-[32px] text-white"/>
    </button>
    <ToastContainer />
    </>
  );
};

export default Home;
