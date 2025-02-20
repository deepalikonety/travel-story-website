import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstances';

const SignUp = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const navigate =useNavigate()
  const handleSignUp = async(e) =>{
    e.preventDefault();
    if(!name){
      setError("Please enter your name.");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }
    setError("");
    try{
      const response=await axiosInstance.post("/create-account",{
        fullName:name,
        email:email,
        password:password,
      });
      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error){
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ){
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occured.Please try again later");
      }
      
    }
  };


  return (
    <div className="h-screen bg-cyan-200 overflow-hidden relative">
      <div className='login-ui-box left-30 bottom-60 '/>
      <div className='login-ui-box bg-cyan-100 right-10 top-60 '/>

      <div className='container h-screen flex items-center justify-center px-60 mx-auto'>
        <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-30 z-50'>

          <div className='bg-gradient-to-r from-pink-200 to-blue-300'>
            <h4 className='text-4xl text-center text-blue-800 md:text-3xl font-semibold leading-[58px]'>
              Join the adventure now.
            </h4>
            <p className='text-[15px] text-center text-pink-500 font-semibold leading-6 pr-7 mt-4'>
              Create an account now to start documenting your travels and preserving your memories..
            </p>
          </div>
        </div>
        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7'>SignUp</h4>

            <input type="text"  placeholder="Full Name" className="input-box"  value={name} onChange={({ target }) => setName(target.value)} />

            <input type="text"  placeholder="Email" className="input-box"  value={email} onChange={({ target }) => setEmail(target.value)} />


            <PasswordInput  value={password} onChange={({ target }) => setPassword(target.value)} />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type="submit" className='btn-primary'>
              CREATE ACCOUNT 
            </button>
            <p className='text-xs text-slate-500 text-center my-4'>OR</p>
            <button type="submit" className="btn-primary btn-light" onClick={()=>{ navigate("/login");}}>LOGIN </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp;