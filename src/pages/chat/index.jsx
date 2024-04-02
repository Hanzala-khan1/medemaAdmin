import React, { useState } from "react";
import avatar from "../../../public/images/avatar.png";
import aya from "../../../public/images/aya.png";
import pysio from "../../../public/images/physio.png";
import {Menu,Layout} from "antd";
import meet from "../../../public/images/meet.png";
import { BsThreeDotsVertical,BsArrowLeft } from "react-icons/bs";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "antd";
import Image from "next/image";
import { db, auth } from "@/config/firebase";
import moment from "moment";
import {
  getDocs,
  query,
  docs,
  where,
  collection,
  onSnapshot,
  doc,
  getDoc,
  Timestamp,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const ConversationView = () => {
  const [id, setId] = useState(null);
  const [role, setRole] = useState("");
  const [chats, setChat] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [mIndex, setIndex] = useState(0);
  const [items,setItems]=useState([])
  const [state,setState]=useState(false)
  const { Sider } = Layout;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // setIsLoggedIn(!!user);
      user ? setId(user.uid) : "";
      // console.log(user, "user1");
    });
  }, [id]);
  // const fetchUserRole = async () => {
  //   try {
  //     let resId = auth.currentUser.uid;
  //     setId(resId);
  //     const docRef = doc(db, "users", auth.currentUser.uid);

  //     const docSnap = await getDoc(docRef);
  //     var role = "";
  //     if (docSnap.exists()) {
  //       // console.log("Document data:", docSnap.data());

  //       role = docSnap.data().role;
  //       return role;
  //     } else {
  //       // docSnap.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //     return role;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const userRole = useQuery(["Role"], fetchUserRole, {
  //   staleTime: 60000,
  // });
  // console.log(userRole.data)

  const fetchData = async () => {
    let arr = [];
    const dbRef = query(
      collection(db, "chat-room"),
      where("doctorId", "==", localStorage.getItem("id")|| auth.currentUser.uid)
    );
    try {
      const res = await getDocs(dbRef);
      res.docs.map((doc) => {
        arr.push(doc.data());
      });
      return arr;
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoading, data, error } = useQuery(["Chat-message"], fetchData, {
  staleTime:6000,
  refetchOnWindowFocus:"always"
  });
  console.log(isLoading);
  if (!isLoading) {
    // console.log(data,"data");
    // let timestamp =data[1]?.messages[0]?.sentAt
    // let diff = new Date()-timestamp
    // console.log( moment(new Date(timestamp.seconds*1000), "YYYYMMDD").fromNow())
    
  }
  const [formData, setFormData] = useState({
    message: "",
    sentBy: "patient",
    sentAt:Timestamp.now()
  });
  const handleFormSubmit = async () => {
    // e.preventDefault()
    const newRef = doc(db, "chat-room", data[mIndex].id);
    try {
      const res = await updateDoc(newRef, {
        messages: arrayUnion({
          message: formData.message,
          sentBy: "doctor",
          sentAt:Timestamp.now()
        }),
      });
      setFormData({
        message: "",
        sentBy: "",
        sentAt:Timestamp.now()
      });
      console.log(res, "q");
      // alert("message sent")
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };


  const chat = [
    {
      name: "Mema",
      specialist: "Cardiologist",
      image: aya,
      chats: [
        {
          role: "user",
          text: "Hi there, I want an appointment today",
          time: "12:30",
        },
        {
          role: "admin",
          text: "You can by paying 1500 ",
          time: "12:35",
        },
        {
          role: "user",
          text: "ok",
          time: "12:30",
        },
      ],
    },
    {
      name: "Antony Tidne",
      specialist: "Cardiologist",
      image: pysio,
      chats: [
        {
          role: "user",
          text: "How can i shedule an appointment?",
          time: "12:30",
        },
        {
          role: "admin",
          text: "yes sure, Please share your details.",
          time: "12:35",
        },
        {
          role: "user",
          text: "How can i shedule an appointment?",
          time: "12:40",
        },
      ],
    },
  ];
  const queryClient = useQueryClient();
  const [msg, setmsg] = useState(false);
  const todoMutation = useMutation(handleFormSubmit, {
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries(["Chat-message"]);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });
  return (
    <div className="" >
    <div className="grid grid-cols-1 md:grid-cols-3 mt-6 h-[100vh]">
   
    <div className={` ${state? "col-span-0 hidden ":"col-span-1 block"} md:col-span-1 md:block h-full lg:col-span-1 bg-slate-200 `}>
          <div className="h-[80px] bg-slate-800">
            <div class="flex justify-between items-center  bg-[#1A3578] h-[80px] px-10 rounded-lg">
              <span className="flex gap-6">
                <Image
                  className="h-[40px] w-[40px] lg:h-[60px] lg:w-[60px] object-cover rounded-full"
                  src={data?data[0]?.doctorImage?data[0].doctorImage:avatar :avatar }
                  width={100}
                  height={100}
                  alt=""
                />
                
                <div class="text-white">
                      <span class="block ml-2 text-sm lg:text-base font-bold text-gray-600">
                        {data?data[0]?.doctorName:"NA"}
                      </span>
                      <span class="block ml-2 text-xs font-medium text-gray-400">
                      {data?data[0]?.speciality:"NA"}
                      </span>
                    </div>
         
              </span>
              <span></span>
         
            </div>
          </div>
          <div className="border-r-2 border  pr-4 border-r-black">
          <ul class="overflow-auto overflow-y-scroll flex flex-col  gap-y-2 h-[32rem]">
            
                  {!isLoading
                    ? data.map((doc, index) => {
                        return (
                          <li key={index}>
                          <button
                            onClick={() => {
                              setIndex(index);
                              setState(true);
                            }}
                            
                            class="flex items-center  px-3 py-2 text-sm transition duration-150 ease-in-out  w-full  cursor-pointer hover:bg-gray-100 outline-none border-0 rounded-xl focus:outline-none"
                          >
                      
                            <span className="py-3 bg-red-100 h-12 w-12 rounded-full px-1">
                              {doc?.patientName.slice(0,2)}
                            </span>
                            <div class="w-full pb-2">
                              <div class="flex justify-between ">
                                <span class="block ml-2 text-xs lg:text-base  font-semibold mt-1">
                                  {doc?.patientName}
                                </span>
                              
                              </div>
                              <span class="block ml-2 text-start text-xs lg:text-sm text-gray-400">
                                {doc.messages ? 
                                doc.messages[doc.messages.length-1].message
                                : "NA"}
                              </span>
                              <span class="block ml-2 text-start text-xs  text-gray-400">
                                {doc.messages ? 
                                moment(new Date(doc?.messages[doc.messages.length-1].sentAt?.seconds*1000), "YYYYMMDD").fromNow() !== "Invalid date"?
                                moment(new Date(doc?.messages[doc.messages.length-1].sentAt?.seconds*1000), "YYYYMMDD").fromNow()
                                :""
                             
                                : "NA"}
                              </span>
                            </div>
                          </button>
                          </li>
                        );
                      })
                    : "NA"}
 
              </ul>
          </div>
        </div>
   
    <div className="col-span-2  h-full grid grid-rows-[1fr_4fr_1.5fr]">
<div className="">
{/* <div className="md:hidden  h-6 px-4   mt-1">  
                  <Button onClick={()=>{setState(false)}}><BsArrowLeft/></Button>
                   </div> */}
          <div className=" ">
          <div class=" bg-white shadow-2xl  text-[#1A3578] border-l-4 border-white flex items-center justify-between p-3 border-b border-gray-300 h-[80px] px-8">
                  <div class="flex">
                 <div className="md:hidden  h-6 px-4 -ml-10  mt-1">  
                  <Button onClick={()=>{setState(false)}}><BsArrowLeft/></Button>
                   </div>
           
              
                  <span className="py-3 bg-red-100 h-12 w-12 rounded-full px-1 flex justify-center items-center text-black">
                              {data?data[mIndex]?.patientName.slice(0,2):"NA"}
                            </span>
                    <div class="ml-4">
                      <span class="block ml-2 text-sm lg:text-base font-bold text-gray-600">
                        {data?data[mIndex]?.patientName:"NA"}
                      </span>
                      <span class="block ml-2 text-xs font-medium text-gray-400">
                        Patient
                      </span>
                    </div>

                    <span class="absolute w-3 h-3 rounded-full left-16 top-4     "></span>
                  </div>
                  <div class="flex gap-x-1 md:gap-x-4">
                    <span className="text-xs lg:text-sm ">Meet Now</span>
                    <Image
                      className="h-5 w-5 lg:h-6 lg:w-6"
                      src={meet}
                      alt=""
                    />
                  </div>
                </div>
          </div>
</div>
<div className="">
<div className="overflow-y-scroll h-full "><div class=" w-full p-6 overflow-y-auto  ">
                  <ul class="space-y-3">
                    {isLoading == false
                      ? data[mIndex]?.messages?.map((doc, index) => {
                        let b =moment(new Date(doc?.sentAt?.seconds*1000), "YYYYMMDD").fromNow()
                          return (
                            <>
                              {doc.sentBy == "patient" ? (
                                <li
                                  key={index}
                                  class="flex justify-start gap-x-2"
                                >
                              
                                  <div className="relative max-w-xl px-4 text-end py-2 text-xs lg:text-base text-gray-700  bg-[#C6ED73] rounded shadow">
                                    <span className="block text-start">{doc.message}</span>
                                  <span className="text-xs text-blue-900 px-1 py-1 rounded-lg mt-2 self-end  text-end  text-gray-400">
                                    {b!=="Invalid date"? b :""}
                                  </span>
                                  </div>
                                </li>
                              ) : (
                                <li className="flex justify-end space-x-2">
                                 
                                  <div className="relative flex flex-col max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                                  
                                    <span className="block text-xs lg:text-base">
                                      {doc.message}
                                  
                                    </span>
                                    <span className=" self-end text-blue-900 mt-2 text-xs  ">
                                    {b!=="Invalid date"? b :""}
                                  </span>
                                  </div>
                                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs flex justify-center items-center"> <span>You</span></span>
                                  {/* <Image
                                    className="mt-1 w-6 h-6 lg:h-8 lg:w-8"
                                    src={avatar}
                                    alt=""
                                  /> */}
                                </li>
                              )}
                            </>
                          );
                        })
                      : "NA"}
                  </ul>
                </div></div>
</div>
<div className=" ">
<div class="flex mt-4 sm:mt-0 items-start h-full  justify-between bg-slate-200 w-full p-3 border-t    border-gray-300">
                  <button className="mb-2 border-0 outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
          

                  <input
                    type="text"
                    placeholder="Message"
                    autoComplete="off"
                    class="block md:w-[270px] lg:w-[500px] py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none border-0 mb-2 focus:text-gray-700"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
        
                  <button onClick={() => todoMutation.mutate()} className="mb-2 bg-transparent hover:text-blue-800 outline-none border-0">
                    <svg
                      class="w-5 h-5 text-gray-500 origin-center    transform rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
        
       
</div>
    </div>
    </div>
    <div className="">

      {/* <div className="grid grid-cols-1 sm:grid sm:grid-cols-3  rounded-lg h-[92vh] mt-5 ml-2 ">
        <div className={` ${state? "col-span-0 hidden ":"col-span-1 block"} md:col-span-1 md:block lg:col-span-1 bg-slate-200 `}>
          <div className="h-[80px] bg-slate-800">
            <div class="flex justify-between items-center mt-4 bg-[#1A3578] h-[80px] px-10 rounded-lg">
              <span className="flex gap-6">
                <Image
                  className="h-[40px] w-[40px] lg:h-[60px] lg:w-[60px] object-cover rounded-full"
                  src={data?data[0]?.doctorImage?data[0].doctorImage:avatar :avatar }
                  width={100}
                  height={100}
                  alt=""
                />
                
                <div class="text-white">
                      <span class="block ml-2 text-sm lg:text-base font-bold text-gray-600">
                        {data?data[0]?.doctorName:"NA"}
                      </span>
                      <span class="block ml-2 text-xs font-medium text-gray-400">
                      {data?data[0]?.speciality:"NA"}
                      </span>
                    </div>
         
              </span>
              <span></span>
         
            </div>
          </div>
          <div className="border-r-2 border  pr-4 border-r-black">
          <ul class="overflow-auto flex flex-col  gap-y-2 h-[32rem]">
            
                  {!isLoading
                    ? data.map((doc, index) => {
                        return (
                          <li key={index}>
                          <button
                            onClick={() => {
                              setIndex(index);
                              setState(true);
                            }}
                            
                            class="flex items-center  px-3 py-2 text-sm transition duration-150 ease-in-out  w-full  cursor-pointer hover:bg-gray-100 outline-none border-0 rounded-xl focus:outline-none"
                          >
                      
                            <span className="py-3 bg-red-100 h-12 w-12 rounded-full px-1">
                              {doc?.patientName.slice(0,2)}
                            </span>
                            <div class="w-full pb-2">
                              <div class="flex justify-between ">
                                <span class="block ml-2 text-xs lg:text-base  font-semibold mt-1">
                                  {doc?.patientName}
                                </span>
                              
                              </div>
                              <span class="block ml-2 text-start text-xs lg:text-sm text-gray-400">
                                {doc.messages ? 
                                doc.messages[doc.messages.length-1].message
                                : "NA"}
                              </span>
                              <span class="block ml-2 text-start text-xs  text-gray-400">
                                {doc.messages ? 
                                moment(new Date(doc?.messages[doc.messages.length-1].sentAt?.seconds*1000), "YYYYMMDD").fromNow() !== "Invalid date"?
                                moment(new Date(doc?.messages[doc.messages.length-1].sentAt?.seconds*1000), "YYYYMMDD").fromNow()
                                :""
                             
                                : "NA"}
                              </span>
                            </div>
                          </button>
                          </li>
                        );
                      })
                    : "NA"}
 
              </ul>
          </div>
        </div>
        <div className={` ${state? "col-span-1 block":"col-span-0 hidden"} sm:col-span-2 sm:block py-4 flex flex-col justify-between`}>
        <div className="md:hidden z-30 h-6 px-4 -mb-6  pt-1">  
                  <Button onClick={()=>{setState(false)}}><BsArrowLeft/></Button>
                   </div>
          <div className="h-[80px] ">
          <div class="relative z-10 bg-white shadow-2xl mt-4 text-[#1A3578] border-l-4 border-white flex items-center justify-between p-3 border-b border-gray-300 h-[80px] px-8">
                  <div class="flex">
                    
           
              
                  <span className="py-3 bg-red-100 h-12 w-12 rounded-full px-1 flex justify-center items-center text-black">
                              {data?data[mIndex]?.patientName.slice(0,2):"NA"}
                            </span>
                    <div class="ml-4">
                      <span class="block ml-2 text-sm lg:text-base font-bold text-gray-600">
                        {data?data[mIndex]?.patientName:"NA"}
                      </span>
                      <span class="block ml-2 text-xs font-medium text-gray-400">
                        Patient
                      </span>
                    </div>

                    <span class="absolute w-3 h-3 rounded-full left-16 top-4     "></span>
                  </div>
                  <div class="flex gap-x-4">
                    <span className="text-xs lg:text-sm ">Meet Now</span>
                    <Image
                      className="h-5 w-5 lg:h-6 lg:w-6"
                      src={meet}
                      alt=""
                    />
                  </div>
                </div>
          </div>
          <div className="overflow-y-scroll h-[550px]"><div class="relative w-full p-6 overflow-y-auto h-[40rem] ">
                  <ul class="space-y-3">
                    {isLoading == false
                      ? data[mIndex]?.messages?.map((doc, index) => {
                        let b =moment(new Date(doc?.sentAt?.seconds*1000), "YYYYMMDD").fromNow()
                          return (
                            <>
                              {doc.sentBy == "patient" ? (
                                <li
                                  key={index}
                                  class="flex justify-start gap-x-2"
                                >
                              
                                  <div class="relative max-w-xl px-4 text-end py-2 text-xs lg:text-base text-gray-700  bg-[#C6ED73] rounded shadow">
                                    <span class="block text-start">{doc.message}</span>
                                  <span class="text-xs text-blue-900 px-1 py-1 rounded-lg mt-2 self-end  text-end  text-gray-400">
                                    {b!=="Invalid date"? b :""}
                                  </span>
                                  </div>
                                </li>
                              ) : (
                                <li class="flex justify-end space-x-2">
                                 
                                  <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                                  
                                    <span class="block text-xs lg:text-base">
                                      {doc.message}
                                    <span class=" text-blue-900 mt-2 text-xs  ">
                                    {b!=="Invalid date"? b :""}
                                  </span>
                                    </span>
                                  </div>
                                  <Image
                                    className="mt-1 w-6 h-6 lg:h-8 lg:w-8"
                                    src={avatar}
                                    alt=""
                                  />
                                </li>
                              )}
                            </>
                          );
                        })
                      : "NA"}
                  </ul>
                </div></div>
          <div className=" h-[80px] flex justify-start relative bottom-36 mb-2 md:bottom-0  items-end">
                        
          <div class="flex items-center justify-between bg-slate-200 w-full p-3 border-t    border-gray-300">
                  <button className="mb-2 border-0 outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
          

                  <input
                    type="text"
                    placeholder="Message"
                    autoComplete="off"
                    class="block md:w-[270px] lg:w-[500px] py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none border-0 mb-2 focus:text-gray-700"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
        
                  <button onClick={() => todoMutation.mutate()} className="mb-2 bg-transparent hover:text-blue-800 outline-none border-0">
                    <svg
                      class="w-5 h-5 text-gray-500 origin-center    transform rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
          </div>
        </div>
      </div>
      */}
    </div>
    </div>
  );
};

export default ConversationView;