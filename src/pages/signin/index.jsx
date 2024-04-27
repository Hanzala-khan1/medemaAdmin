import React from "react";

import Image from "next/image";
// import { AiOutlineGooglePlus, } from "react-icons/ai";
// import { BsFacebook, BsGoogle, BsApple } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
// import bgImg from '../../../public/images/bg-login2.png'
import logo1 from '../../../public/images/logo1.png'
import { Modal, Button } from "antd";
import { useState } from "react";
import { auth, db } from "@/config/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { collection, doc, getDoc } from "firebase/firestore";
// import { Input } from "antd";
// import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setRole, setToken, setUser } from "@/redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRef, useEffect } from "react";
import { userLogin } from "@/services";
// import { setUser } from "@/redux";
const Index = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(<></>);
  const [showEmail, setShowEmail] = useState(<></>);
  const [showPassword, setShowPassword] = useState(<></>)
  console.log("sign page ................")
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const inputRef = useRef(null)
  useEffect(() => {
    email !== "" ?
      setShowEmail(<span className=" text-white">{inputRef.current.validationMessage?.slice(0, 30)}</span>)
      : setShowEmail(<></>)
  }, [email])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email == "" && password == "") {
        return MySwal.fire('Please fill all Fields')
      }
      if (email == "") {
        return MySwal.fire('Please Enter Email')
      }
      if (password == "") {
        return MySwal.fire('Please Enter password')
      }
      // const handleSignIn = async () => {
      let params = {
        email: email,
        password: password,
      };
      MySwal.showLoading();

      let loginUser = await userLogin(params)

      if (loginUser?.status == 200 && loginUser?.statusText == "OK") {
        console.log("loginUser?.data?.user",setUser(),loginUser?.data?.user)
        console.log("loginUser?.data?.token",setToken(),loginUser?.data?.token)
        console.log("loginUser?.data?.user?.role",loginUser?.data?.user?.role)
        dispatch(setIsLoggedIn(true));
        dispatch(setUser(loginUser?.data?.user));
        dispatch(setToken(loginUser?.data?.token));
        dispatch(setRole(loginUser?.data?.user?.role));
        const user = loginUser.data.user;
        const token = loginUser.data.token;
        const email = loginUser?.data?.user?.email;
        const role = loginUser?.data?.user?.role;
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(loginUser.data.user));
        if (role == "doctor") {
          localStorage.setItem("speciality", role);
        }
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("id", user?.uid);
        MySwal.fire('Loged In')
        router.push("/");
      }
      MySwal.hideLoading();

    } catch (error) {
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: "err?.response?.data",
      });
    }
  };
  const [formData, setFormData] = useState({
    email: "",
  })
  const [email1, setEmail1] = useState('')
  const handleFormChange = (event) => {
    const { name, vlaue } = event.target;
    setFormData((e) => ({ ...e, [name]: vlaue }))
  }
  const resetPassword = async () => {

    try {
      const loginUser = await sendPasswordResetEmail(auth, email)
      setEmail("")
      MySwal.fire('Password Reset Link Sent Please Check your Email')
    } catch (error) {
      MySwal.fire('Email Not Found Please Check your Email')
      console.log(error)
    }
  }
  return (
    <div className={`  h-[115vh]   lg:h-[100vh] font-poppins parent`}
    // style={{
    //   backgroundImage: `url(${'./public/images/bg-login2.png'})`,
    // }}
    >
      <div className=" font-[poppinsregular] flex justify-center items-center  flex-col h-full  py-4">
        <div className='fixed top-6 left-6 '>
          <Image src={logo1} className='h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-16 ' alt='logo' />
        </div>
        <form >
          <div className="flex justify-center items-center -mt-24 flex-1 lg:mt-0  ">
            <div className=" justify-center  bg-slate-950 bg-opacity-30 w-full sm:w-[450px] rounded-md flex flex-col gap-3 px-8 shadow-sm shadow-blue-950 py-6 ">
              <div className="flex justify-between items-center">

                <h1 className=" text-2xl lg:text-3xl font-[barlowregular] text-[#C6ED73]">
                  Log in
                </h1>

              </div>

              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1">
                  Enter Email
                </label>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="text-xs lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  text-white placeholder:text-gray  rounded-md"
                />
                <span className="text-white">{showEmail}</span>

              </div>
              <div className="flex flex-col">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1">
                  Enter Password
                </label>
                <input
                  type="password"
                  minLength='6'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="text-xs lg:text-sm py-2 outline-none bg-transparent placeholder:text-gray  text-white border mt-2 px-4  rounded-md"
                />
                {showPassword}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <input type='checkbox' className='h-4 w-4' />
                  <h2 className='text-xs lg:text-sm text-white  '>Remember me</h2>
                  {show}
                </div>
                <div>
                  <Link href='/forgot'>
                    <Button className="text-xs lg:text-sm bg-transparent outline-none border-0 text-[#C6ED73]">
                      Forgot Password?
                    </Button>
                  </Link>

                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">

                <Button
                  onClick={handleLogin}
                  className=" w-full hover:bg-[#7ba129] text-sm bg-[#C6ED73] font-semibold rounded-md"
                >
                  Log in
                </Button>

              </div>
            </div>
          </div>
        </form>
      </div>
      <Modal
        open={visible}
        title="Forgot Password"
        // onOk={handleOk}
        onCancel={() => { setVisible(false) }}
        footer={false}
        width={600}
        height={800}

      // style={{width:"450px",height:"400px"}}
      >
        <div className={` parent  font-[poppinsregular]`}  >
          <div className='bg-[#1A3578C8] flex items-center  justify-center  px-6 py-4'>
            <div className='fixed top-6 left-6 '>

              <Image src={logo1} className='h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-16' alt='logo' />

            </div>
            <div className='flex justify-center items-start  '>

              <div className='  bg-slate-950 bg-opacity-30 w-full sm:w-[250px] rounded-md flex flex-col gap-3 px-8 shadow-sm shadow-black py-8'>
                <h1 className='text-2xl lg:text-3xl font-[barlowregular] text-[#C6ED73]'>Forgot Password</h1>
                <h4 className='text-sm  mb-2 text-white'>Please Enter your email address to reset password.</h4>
                <div className='flex flex-col'>
                  <label className='text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2'>Email Address</label>
                  <input type='email' name="email" value={email1} onChange={(e) => { setEmail1(e.target.value) }} placeholder='Enter your email' className='text-xs lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  text-white rounded-md' />
                </div>

                <div className='mt-6'>
                  <button className='w-full text-xs lg:text-sm py-3 hover:bg-[#7ba129] bg-[#C6ED73] font-semibold rounded-md' onClick={() => {
                    if (email !== "") { resetPassword() }
                    else {
                      MySwal.fire('Please Add Email')
                    }
                  }}>Forgot Password</button>
                </div>


              </div>

            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
