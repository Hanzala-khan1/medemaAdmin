import React, { useEffect, useState } from "react";
import { db, auth } from "@/config/firebase";
import { collection, query, getDoc, where, getDocs, onSnapshot, updateDoc, arrayUnion, doc, addDoc, Timestamp, and } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { BASE_URL } from "@/services/endpoints";
import axios from "axios";
const index = () => {
  const MySwal = withReactContent(Swal);
  const [special, setSpecial] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState([])
  console.log("messagemessage", message)
  const [isLoading, setIsloading] = useState(false)
  const router = useRouter();
  const [formData, setFormData] = useState({
    message: ""
  })

  useEffect(() => {
    getemergencyMessages()
  }, [])
  let getemergencyMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        authorization: `Bearer ${token}`,
      };

      let url = `${BASE_URL}/message/getallemergency`;
      let body = {
        page: 1,
        limit: 20,
      }
      // const userCount = await axios.get(url, data,{ headers });
      const messages = await axios({
        method: 'post',
        url: url,
        data: {},
        headers: headers
      });
      console.log("messagesmessagesmessages", messages)
      if (messages.data.data) {
        setMessage(messages.data.data);
      }
      else {
        console.log("no rehab Found")
      }


    } catch (error) {
      console.log("err..", error);
      MySwal.hideLoading(); // Assuming MySwal is for a loading indicator
    }
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const publicReplay = async (e) => {

    try {
      const res = await updateDoc(doc(db, "askQuestions", e), {
        replays: arrayUnion({
          message: formData.message,
          sentBy: "doctor",
          doctorId: id
        }),
      })
      console.log(res)
      alert("message Sent");
      setFormData({ message: "" })

    } catch (error) {
      console.log(error)
    }

  }
  const handleinitaitechat = async (docs) => {
    try {

      let userId = docs.from_user
      let chatParams = {
        userId: userId,
      }
      const headers = {
        authorization: `Bearer ${token}`,
      };
      let chaturl = `${BASE_URL}/message/addchat`;

      let Chats = await axios({
        method: 'post',
        url: chaturl,
        data: chatParams,
        headers: headers
      });

      let params = {
        chatId: Chats._id.toString(),
        message: docs.message,
      }
      let url = `${BASE_URL}/message/getChatRoom`;

      let allmessages = await axios({
        method: 'post',
        url: url,
        data: params,
        headers: headers
      });
      
      router.push("/chat")

    } catch (error) {
      console.log(error)
    }
  }
  // const fetchDoctor = async()=>{
  //     const docRef = query(collection(db,"rehab"),where("auth_id","==" ,id!==""?id:localStorage.getItem("id")))
  //     let brr=[]
  //     try{
  //          const res= await getDocs(docRef);

  //          return  res.docs[0].data()
  //         }catch(error){
  //       console.log(error)
  //     }
  //   }
  // const {data:doctorData ,isLoading:newLoading} =useQuery(["Doctor"],fetchDoctor,{
  //   staleTime:60000
  // })
  // if(!newLoading){
  //   console.log(doctorData)
  // }



  // const {data:doctorData ,isLoading:newLoading} =useQuery(["Doctor"],fetchDoctor,{
  //   staleTime:60000
  // })
  // if(!newLoading){
  //   console.log(doctorData.data)
  // }
  //   const fetchMessages=async()=>{
  //       const docRef = query(collection(db,"askQuestions"),where("category","==" ,special!==""?special:localStorage.getItem("speciality")))
  //      let arr=[]
  //       try{
  //            const res= await getDocs(docRef);
  //            res.docs.map((doc)=>{
  //             arr.push(doc.data())
  //           console.log(doc.data())
  //            })
  //            return arr
  //           }catch(error){
  //         console.log(error)
  //       }

  //     }

  //   const {data,isLoading} =useQuery(["Message"],fetchMessages,{
  //     staleTime:60000,
  //     refetchOnWindowFocus:"always"
  //   })
  //   if(!isLoading){
  //     console.log(data)
  //   }

  const initChat = async (e) => {
    const docRef = collection(db, "chat-room")

    try {


      const res = await addDoc(docRef, {
        doctorId: id !== "" ? id : localStorage.getItem("id"),
        doctorName: doctorData?.name,
        messages: [{ message: e.message, sentBy: "patient", sentAt: e.sent_at }],
        patientName: e?.name,
        patientId: e.senderId,
        doctorImage: doctorData.images[0].url ? doctorData.images[0].url : "NA",
        // hospitalName:doctorData.hospital,
        speciality: "rehab",
      })

      console.log(res)
      const newRef = doc(db, "chat-room", res.id);
      const newRes = await updateDoc(newRef, {
        id: res.id
      })
      console.log(newRes)
      MySwal.fire('Chat initiated ')
      router.push("/chat")
    } catch (error) {
      console.log(error)
    }
  }
  const checkChatRoom = async (e) => {
    const checkRef = query(collection(db, "chat-room")
      , and(where("doctorId", "==", id !== "" ? id : localStorage.getItem("id")), where("patientId", "==", e.senderId)))

    try {
      console.log("hello")
      const response = await getDocs(checkRef);

      if (response.empty == true) {
        initChat(e)
      } else {
        MySwal.fire('Chat initiated ')
        router.push("/chat")
      }

    } catch (error) {
      console.log(error)
    }
  }
  return <div>

    {
      message.length ?
        <div className="  flex flex-col gap-y-2 mt-12">
          {
            message?.map((doc, index) => {



              return (
                <div className=" py-4  border bg-blue-100 bg-opacity-50 rounded-lg px-4" key={index}>
                  <h3 className="capitalize mt-2"> Patient Name : {doc?.name}</h3>
                  <h4>Message : {doc.message}</h4>

                  {doc.type == "public" ?
                    <div>
                      <h3>Answers</h3>
                      {doc.replays?.map((doc, index) => {
                        return (
                          <h4 key={index}> {doc.message}</h4>
                        )
                      })}
                      <h5>This Message is Publicies  any one can see your replay </h5>

                      <div className=" flex flex-col  space-x-2 ">

                        <textarea type="text" rows="4" placeholder="Enter Replay" className="py-2 outline-none bg-white border-0 rounded-md px-4 w-[600px]" name="message" value={formData.message} onChange={handleFormChange} />
                        <button className="bg-blue-900 text-white mt-2 h-[40px] w-[120px] outline-none rounded-lg" onClick={() => { publicReplay(doc.id) }} >Send Replay</button>
                      </div>

                    </div>
                    :
                    <div>
                      <h5>This Message is Private would you like to initiate Chat </h5>
                      <Button onClick={() => { handleinitaitechat(doc) }}>Initiate Chat</Button>
                      {/* <Button className="ml-4" onClick={()=>{checkChatRoom(doc)}}>Mark as read</Button> */}
                    </div>
                  }
                </div>
              )

            })
          }
        </div>
        : <div className="mt-4"> No Message</div>
    }
  </div>;
};

export default index;
