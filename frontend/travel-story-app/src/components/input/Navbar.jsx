import React from 'react'
import ProfileInfo from '../Cards/ProfileInfo';
import LOGO from "../../assets/image/logo.svg"; 
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = ({userInfo,
  searchQuery,setSearchQuery,onSearchNote,handleClearSearch}) => {

  const isToken=localStorage.getItem("token");
  const navigate=useNavigate();

  const onLogout=()=>{
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch=()=>{
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch=()=>{
    handleClearSearch();
    setSearchQuery("");
  };


  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow top-0 z-10">
      <img src={LOGO} alt="travel story" className='h-20'/>
      {isToken &&(
         <>
         <SearchBar
          value={searchQuery} 
          onChange={({target})=>{
          setSearchQuery(target.value);
         }} 
         handleSearch={handleSearch}
         onClearSearch={onClearSearch}
         />
         <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
         </> 
      )}
    </div>
  );
};

export default Navbar