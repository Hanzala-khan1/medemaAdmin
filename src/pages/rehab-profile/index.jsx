import {
  Table,
  Avatar,
  Tag,
  Menu,
  Dropdown,
  Alert,
  Spin,
  Popconfirm,
} from "antd";

import { useState } from "react";
import avatar from "../../../public/images/user.png";
import Head from "next/head";
import loader from '../../../public/images/loader.png'
import {
  UserOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  DeleteFilled
} from "@ant-design/icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import dayjs from "dayjs";
// Import Swiper styles
import 'swiper/css';
import React from "react";
import { Modal, Form, Input, Button, Upload, Radio ,Select,Image} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {deleteUser} from 'firebase/auth'
import { db, storage,auth } from "@/config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useRef } from "react";
import Swal from "sweetalert2";
import { DatePicker } from "antd";
import withReactContent from "sweetalert2-react-content";
import { createUserWithEmailAndPassword } from "firebase/auth";
import moment from "moment";
const { TextArea } = Input;

const Index = () => {
  const MySwal = withReactContent(Swal);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [imgUrl, setImgUrl] = useState([]);
  const [imgUrl1, setImgUrl1] = useState("");
  const [imgUrl2, setImgUrl2] = useState("");
  const [uplodedUrl, setUploadedUrl] = useState("");
  const [uplodedUrl1, setUploadedUrl1] = useState("");
  const [uplodedUrl2, setUploadedUrl2] = useState("");
  const [preview, setPreview] = useState([]);
  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [btnPre, setBtnPre] = useState(<span>Change</span>);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [URLs,setURLs]=useState([])
  const [editData, setEditData] = useState(false);
  const [imgName, setImgName] = useState("");
  const [imgName1, setImgName1] = useState("");
  const [imgName2, setImgName2] = useState("");
  const [btnAdd, setBtnAdd] = useState("primary");
  const [loading, setLoading] = useState(false);
  const [arr, setarr] = useState([]);
  const [inUpdate, setInUpdate] = useState(false);
  const [inUpdate1, setInUpdate1] = useState(false);
  const [inUpdate2, setInUpdate2] = useState(false);
  var previewArr = [];
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    address: "",
    email: "",
    password:"",
    long: "",
    lat: "",
    id: "",
    perDay:"",
    ref:"",
    role:"rehab",
    perHour:"",
    availability: "weekdays",
    unavailability:[],
    description: "",
    doctorAvail: false,
    powerBackup: false,
    parkingFacility: false,
    images: []
  });
  const handleDateSelect = (date,dateString) => {
    const selectedDate = new Date(date+ 86400000);
    // console.log(selectedDate)
    const formattedDate = selectedDate.toISOString().split('T')[0];
    formData.unavailability==undefined || formData.unavailability==[]?
    setFormData((prevFormData) => ({
        ...prevFormData,
        unavailability: [formattedDate],
      }))
    :
    setFormData((prevFormData) => ({
      ...prevFormData,
      unavailability: [...prevFormData.unavailability, formattedDate],
    }));
  };

  const handleRemoveDate = (dateToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      unavailability: prevFormData.unavailability.filter((date) => date !== dateToRemove)
    }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if(name=="name"){
      const val = value?.toLowerCase();
      setFormData((prevFormData) => ({ ...prevFormData, [name]: val }));
    }else{
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }
  };
  const handleAvailiblityChange = (value) => {
    setFormData((e) => ({ ...e, availability: value }));
  };
  const handleDoctorChange = () => {
    setFormData((e) => ({ ...e, doctorAvail: true }));
  };
  const handlePowerChange = () => {
    setFormData((e) => ({ ...e, powerBackup: true }));
  };
  const handleParkingChange = () => {
    setFormData((e) => ({ ...e, parkingFacility: true }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      handleUploadImage();
    } else {
     createUser()
    }
  };
  const updateSingleDoc=async()=>{
try{
 await updateDoc(doc(db, "rehab", formData.id), { images: [...formData.images] });
}catch(error){
  console.log(error)
}
  }
  const deleteSingleImage= async(name)=>{
    let imgArray= [];
    const desertRef = ref(storage, `rehab/${name}`);
    
    let item = formData.images.filter((doc)=>{
      return doc.name !== name 
})
console.log(item)
    
     setFormData((prev)=>({...prev,images:item}))
    try{
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      await updateDoc(doc(db, "rehab", formData.id), { images: [...formData.images] });

     queryClient.invalidateQueries(["rehab"])
    }catch(error){
     updateSingleDoc()
console.log(error)
    }
   
  }
  const delteImage = async () => {
    const desertRef = ref(storage, `rehab/${imgName}`);
    const desertRef1 = ref(storage, `rehab/${imgName1}`);
    const desertRef2 = ref(storage, `rehab/${imgName2}`);

    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      setPreview([]);
      setImgName("");
      setImgName1("");
      setImgName2("");
      setBtnPre(<span>Deleted</span>);
      await updateDoc(doc(db, "rehab", formData.id), { images: {} });
    } catch (err) {
      console.log(err);
    }
  };
  const changeImage = async () => {
    const desertRef = ref(storage, `rehab/${formData.images.name}`);
    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      handleUploadImage();
      await updateDoc(doc(db, "rehab", res.id), {
        images: { url: imgUrl, name: imgUrl.uid },
      });
      alert("hello");
    } catch (err) {
      console.log(err);
    }
  };
  const createUser = async () => {
    createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
      .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        // Additional user data to be stored in the database
        const userData = {
          name: formData?.name,
          email: formData?.email,
          role: 'rehab'
        };
        const usersCollectionRef = collection(db, "users");
        const userDocRef = doc(usersCollectionRef, user.uid);

        setDoc(userDocRef, userData)
          .then(() => {
            handleUploadImage(user?.uid)
            console.log("User data saved successfully!");
            // Do something else, like redirecting to another page
          })
          .catch((error) => {
            console.log("Error saving user data:", error);
          });
      })
      .catch((error) => {
        // Handle signup errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        MySwal.fire('Email Already in Use')
        // Handle specific error codes or display a generic error message
      });
  }
  const addData = async (id) => {
    // setBtnAdd("disable");
    // const url = imageUrl;
    const newCityRef = collection(db, "rehab");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData, auth_id: id
      });
      console.log(res.id);

      await updateDoc(doc(db, "rehab", res.id), {
        id: res.id,
        images: URLs
        
      });
      setAlertType("success");
      setAlertText("Data Added SuccessFully");
      setBtnAdd("primary");
      
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data added Successfull',
   
      })
      handleCancel();
     
      setPreview([])
      queryClient.invalidateQueries();
      // router.reload("/rehab");
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
      handleOk();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const updateData = async () => {

    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
     const res= await updateDoc(doc(db, "rehab", formData.id), {
        images:[...URLs,...formData.images]
      });
        console.log(res)


      // setAlertType("success");
      // setAlertText("Data Added SuccessFully");
      // setInUpdate(false);
      // setVisibleAlert(true);
      // setTimeout(() => {
      //   setVisibleAlert(false);
      // }, 1000);
      handleOk();
      setEditData(false);
      queryClient.invalidateQueries();
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data added Successfull',
   
      })
      setURLs([]);
      setPreview([]);
    handleCancel();
    setLoading(false)
      // router.reload("/rehab");
    } catch (err) {
        setLoading(false)
      console.log(err);
    }
  };
  const deleteDocData= async(e)=>{
    try{
      const res = await deleteDoc(doc(db, "rehab", e.id));
      queryClient.invalidateQueries();
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data deleted successfull',
   
      })
      console.log(res)
    }catch(error){
      console.log(error)
    }
  }
  const deleteData = async (e) => {
    console.log(e);
    try {
      const desertRef = ref(storage, `rehab/${e.images.name}`);
      const desertRef1 = ref(storage, `rehab/${e.images.name1}`);
      const desertRef2 = ref(storage, `rehab/${e.images.name2}`);
      const deleteImg = await deleteObject(desertRef);
      const deleteImg1 = await deleteObject(desertRef1);
      const deleteImg2 = await deleteObject(desertRef2);
     deleteDocData(e)
      console.log(res);
      console.log(deleteImg);
      setAlertType("error");
      setAlertText("Data Deleted SuccessFully");
     
      // router.reload("/category");
      setURLs([])
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
    } catch (err) {
      deleteDocData(e)
      console.log(err);
    }
  };
  const handleUploadImage = (id) => {
    setLoading(true);

    const promises = []
    preview?.map((doc) => {
        console.log('loop');

        const sotrageRef = ref(storage, `rehab/${doc.name}`);

        const uploadTask = uploadBytesResumable(sotrageRef, doc.file);
        promises.push(uploadTask)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // setProgress(prog);
            },
            (error) => console.log(error),
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
                    setURLs((prevState )=>( [...prevState, {url:downloadURLs,name:doc.name}]))
                    console.log("File available at", downloadURLs);
                });
            }
        );
           

    })
    Promise.all(promises)
        .then(() => { setPreview([]);
         editData
        ? updateData()
        : addData(id);})
        .then(err => console.log(err))
console.log(URLs,'URLS')

        }

    // console.log(isLoading, data);
  
    const handleCloseAlert = () => {
      setVisibleAlert(false);
    };
    const showModal = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
      form.submit();
    };
  
    const handleCancel = () => {
      setFormData({
        name: "",
        perDay: "",
        perHour: "",
        discount: "",
        address: "",
        email: "",
        password: "",
        phone: "",
        details: "",
        long:"",
        lat:"",
        experience: "",
        workingAt: "",
        education: "",
        id: "",
        gender: "male",
        availability: "weekdays",
        unavailability: [],
        images: [],
      });
      setPreview([]);
      setImgName("");
      setVisible(false);
      setLoading(false)
    };
  
    const onFinish = (values) => {
      // console.log(values);
      handleCancel();
    };
    const uploadButton1 = editData ? (
      <div className="flex">
        <Image
          src={preview1}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
      </div>
    ) : preview1 == "" ? (
      <div>
        <UploadOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    ) : (
      <div className="flex">
        <Image
          src={preview1}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
      </div>
    );
    const uploadButton2 = editData ? (
      <div className="flex">
        <Image
          src={preview2}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
        <Button
          className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
          onClick={delteImage}
        >
          X
        </Button>
      </div>
    ) : preview2 == "" ? (
      <div>
        <UploadOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    ) : (
      <div className="flex">
        <Image
          src={preview2}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
        <Button
          className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
          onClick={() => {
            setPreview2("");
          }}
        >
          X
        </Button>
      </div>
    );
    const uploadButton = editData ? (
      <div className="flex">
        <Image
          src={preview}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
      
      </div>
    ) : preview == "" ? (
      <div>
        <UploadOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    ) : (
      <div className="flex">
        <Image
          src={data?.images?.url? data?.images?.url:preview}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
   
      </div>
    );
  
    const [current, setCurrent] = useState("mail");
    const onClick = (e) => {
      console.log("click ", e);
      setCurrent(e.key);
    };





//   console.log(router.query);
  // const data = router.query;
  const fetchData =async()=>{
    const docRef= query(collection(db,"rehab"),where("auth_id","==", localStorage.getItem("id") ))
try{
    var arr={};
   const res = await getDocs(docRef);
   res.docs.map((doc)=>{
    // console.log(doc.data())
arr=doc.data()
   })
  
   return arr
}catch(error){
console.log(error)
}
 }
 const {isLoading,data}=useQuery(["Rehab-profile"],fetchData,{
  staleTime:60000
 })
 if(!isLoading){
  // console.log(data)
 }
  return (
    <div className="" style={{ marginTop: "30px", }}>
      <div className="flex justify-end"><Button onClick={()=>{setEditData(true); setFormData({...data}) ;setVisible(true)}}>Edit Profile</Button></div>
     <div className="  h-[180px] mt-12">
     <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        '720':{
          spaceBetween:20,
          slidesPerView:3
        },
      

      }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
         {data?.images?.map((doc,index)=>{
        return(
          <SwiperSlide key={index}>
          <div className="rounded-full " >
          <Image src={data?.images[index]?.url?data.images[index].url:loader} className="object-cover h-[80px] w-[80px] rounded-md" alt="image" height={200} width={200}/>
          </div>
          </SwiperSlide>
        )
      })}
      </Swiper>
   
     
     </div>
     <div className="mt-[100px] ">
      {!isLoading && data?
   
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-2" > 
          <h3 className="bg-blue-300 py-2  px-2 text-white">Name : {data?.name?data.name:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Email : {data?.email?data.email:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Phone : {data?.phone?data.phone:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Address : {data?.address?data.address:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Fees/Hour : {data?.perHour?data?.perHour:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Fees/Day : {data?.perDay?data.perDay:"NA"} </h3>
        
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Availabele : {data?.availability?data.availability:"NA"} </h3>
          <ul className="bg-blue-400 py-2 px-4 text-white">UnAviable : {data?.unavailability?.map((doc,index)=>{
          return(
            <li key={index}>{doc}</li>
          )
          })} </ul>
 
          </div>
       
      :"NA"
      
      }
     </div>
     <Modal
        open={visible}
        title="Add Rehab"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        // style={{overflowY:"scroll"}}
      >
               <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12 gap-x-4 gap-y-3">
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "170px" }}>
                <label className="text-lg   ">Name</label>
              </div>

              <Input
                type="text"
                required
                className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="Enter Title"
                value={formData.name}
                name="name"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Fees/Day</label>
              </div>
              <Input
                required
                type="number"
                className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="fees/Day"
                value={formData.perDay}
                name="perDay"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Fees/Hour</label>
              </div>
              <Input
                required
                type="number"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="fees/Hour"
                value={formData.perHour}
                name="perHour"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Discount</label>
              </div>
              <Input
                type="number"
                className=" px-2 outline-none border-b w-full  border-gray rounded-md"
                placeholder="2 %"
                value={formData.discount}
                name="discount"
                onChange={handleFormChange}
              />
            </div>

           
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Latitude</label>
              </div>
              <Input
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="124.000"
                value={formData.lat}
                name="lat"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Longitude</label>
              </div>
              <Input
              required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="-245.00"
                value={formData.long}
                name="long"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Email</label>
                </div>
                <Input
                required
                  type="email"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="jhon@abc.com"
                  value={formData.email}
                  name="email"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Password</label>
                </div>
                <Input
                required
                  type="password"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="password"
                  value={formData.password}
                  name="password"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Address</label>
              </div>
              <Input
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="Addres"
                value={formData.address}
                name="address"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2 ">
                <div style={{ width: "87px" }}>
                  <label className="text-lg">Availability</label>
                </div>
                <div>
                <Select
                
                  className="w-[140px]  rounded-md text-black"
                  name="availability"
                  value={formData.availability}
                  onChange={handleAvailiblityChange}
                >
                  <Select.Option defaultChecked value="weekdays">
                    Weekdays 
                  </Select.Option>
                  <Select.Option value="weekend">Weekend</Select.Option>
                  <Select.Option value="fullWeek">Full Week</Select.Option>
                </Select>
                </div>
              </div>
              <div className="col-span-6 ">
                <div style={{width: '117px'}}>
                  <label className="text-lg">UnAvailable</label>
                </div>
                <DatePicker onSelect={handleDateSelect}
                />
              </div>
              <div className="flex ml-1 px-1">
              {formData?.unavailability?.map((date) => (
          <div key={date.toString()}>
            <span>{dayjs(date.toString()).format('DD MMM YYYY')}</span>
            <Button onClick={() => handleRemoveDate(date)}>Remove</Button>
          </div>
        ))}
        </div>

            
            <div className="col-span-12 flex ">
              <div style={{ width: "170px" }}>
                <label className="text-[17px] ">Description</label>
              </div>
              <div className=" -ml-8 w-full">
                <TextArea
                required
                  rows="2"
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Enter Details Here"
                  value={formData.description}
                  name="description"
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="col-span-12  mb-4 -mt-4">
              <h4 className="text-lg">Facilities</h4>
              <div className="flex gap-x-12 ">
                <div className="flex items-center gap-x-2 text-lg">
                  <Input
                    type="checkbox"
                    className="h-4 w-4"
                    name="doctor"
                    onChange={handleDoctorChange}
                  />
                  <label>24/7</label>
                </div>
                <div className="flex items-center gap-x-2 text-lg">
                  <Input
                    type="checkbox"
                    className="h-4 w-4"
                    name="doctor"
                    onChange={handlePowerChange}
                  />
                  <label>Power backup</label>
                </div>
                <div>
                  <div className="flex items-center gap-x-2 text-lg">
                    <Input
                      type="checkbox"
                      className="h-4 w-4"
                      name="doctor"
                      onChange={handleParkingChange}
                    />
                    <label>Parking facilities</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 ml-4 ">
              <Form.Item
                label="1st Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    setImgUrl(e)
                    console.log(e,"eeee")
                    return e;
                  }

                  setImgUrl(e?.fileList);
                  // if (e?.fileList?.length!==0){
                  //   e.fileList?.map((doc)=>{
                  //     let b;
                     
                  //        b= URL.createObjectURL(doc[0]);
                      
                    
                  //   console.log(b,"neeeee")
                  //   })
                  // }
                  // handleUploadImage()
                  let b = URL.createObjectURL(e.file);
                  console.log(b)
              
                  setPreview((prev)=>([...prev,{name:e?.file?.uid,src:b,file:e?.file}]))
                 
                 
                  // setPreview(b);
                  // setInUpdate(true);
                  console.log(e?.fileList, "arr");
                  return e && e.fileList;
                }}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            </div>
           
              {
                 preview!==[]?
                 preview?.map((doc,index)=>{
                  console.log(doc)
                  let mts = 12 ;
                  if(index >2 ){
                    mts = 0
                  }
                 return(
                  <div key={index} className={` col-span-3 ${index>2? "mt-0":"mt-8"}  bg-white   h-[100px] w-[100px]`}>
                 
                  <div ><Image src={doc?.src} height={100} width={100} className="h-[100px] w-[100px] object-cover"  alt="img" /></div>
                  <div className=" h-6 w-6   relative -top-[100px] -right-[80px]"><Button onClick={()=>{ handledeleteItem(doc?.name)}}>X</Button></div>
                  </div>
                 )
                 })
                 :""
              }
            
              {
                editData?
                formData?.images?.map((doc,index)=>{
                  return(
                    <div key={index} className={` col-span-3 ${index>2? "mt-0":"mt-8"}  bg-white   h-[100px] w-[100px]`}>
                 
                    <div ><Image src={doc?.url} height={100} width={100} className="h-[100px] w-[100px] object-cover"  alt="img" /></div>
                    <div className=" h-6 w-4   relative -top-[100px] -right-[80px]"><Button onClick={()=>{ deleteSingleImage(doc?.name)}} className="w-4 text-red-600 text-center flex justify-center items-center"><DeleteFilled/></Button></div>
                    </div>
                  )
                })
                :
                ""
              }
       
            <div>
              {previewArr.length
                ? previewArr.map((doc, index) => {
                    return (
                      <div key={index}>
                        <Image src={doc} height={25} width={25} alt="img" />
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
          <div className="flex justify-center col-span-12 mt-2">
            {loading ? (
              <div className="h-24 w-24 flex justify-center">
                <Spin />
              </div>
            ) : editData ? (
              <Button
                type="primary"
                style={{ width: "120px" }}
                htmlType="submit"
              >
                Update
              </Button>
            ) : (
              <Button
                type={btnAdd}
                style={{ width: "120px" }}
                htmlType="submit"
              >
                Add
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Index