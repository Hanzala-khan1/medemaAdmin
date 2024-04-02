import React, { useEffect, useState } from 'react'
import logo1 from '../../../public/images/logo1.png'
import Image from 'next/image'
import { AiOutlineGooglePlus, } from "react-icons/ai";
import { BsFacebook, BsGoogle, BsApple } from "react-icons/bs";
import { auth } from '@/config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRef } from 'react';


const ForgotPage = () => {
  const MySwal = withReactContent(Swal)
 
  const [formData,setFormData]=useState({
    email:"",
  })
const [email,setEmail]=useState('')
  const handleFormChange=(event)=>{
    const {name,vlaue} =event.target;
    setFormData((e)=>({...e,[name]:vlaue}))
  }
  const resetPassword = async()=>{
    
    console.log(email)
      try{
        const res = await sendPasswordResetEmail(auth,email)
        setEmail("")
        MySwal.fire('Password Reset Link Sent Please Check your Email')
      }catch(error){
        MySwal.fire('Email Not Found Please Check your Email')
        console.log(error)
      }
  }
  return (
    <div className={` parent h-[100vh]  lg:h-[100vh] font-[poppinsregular]`}  >
      <div className='bg-[#1A3578C8] flex items-center  justify-center h-full px-6 py-4'>
        <div className='fixed top-6 left-6 '>
      
          <Image src={logo1} className='h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-16' alt='logo' />
        
        </div>
        <div className='flex justify-center items-start  '>
         
            <div className='  bg-slate-950 bg-opacity-30 w-full sm:w-[430px] rounded-md flex flex-col gap-3 px-8 shadow-sm shadow-black py-8'>
              <h1 className='text-2xl lg:text-3xl font-[barlowregular] text-[#C6ED73]'>Forgot Password</h1>
              <h4 className='text-sm  mb-2 text-gray-300'>Please Enter your email address to reset password.</h4>
              <div className='flex flex-col'>
                <label className='text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2'>Email Address</label>
                <input type='email' name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Enter your email' className='text-xs lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  text-white rounded-md' />
              </div>

              <div className='mt-6'>
                <button className='w-full text-xs lg:text-sm py-3 hover:bg-[#7ba129] bg-[#C6ED73] font-semibold rounded-md' onClick={()=>{if(email!==""){resetPassword()}
              else{
                MySwal.fire('Please Add Email')
              }}}>Forgot Password</button>
              </div>


            </div>
       
        </div>
      </div>
    </div>
  )
}

export default ForgotPage
