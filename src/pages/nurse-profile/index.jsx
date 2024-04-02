import {
    Table,
    Avatar,
    Tag,
    Menu,
    Dropdown,
    Alert,
    Spin,
    Popconfirm,
    DatePicker
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
  } from "@ant-design/icons";
  import React from "react";
  import { Modal, Form, Input, Button, Upload, Radio,Select } from "antd";
  import { UploadOutlined } from "@ant-design/icons";
  import { auth, db, storage } from "@/config/firebase";
  import Image from "next/image";
  import dayjs from "dayjs";
  import {
    addDoc,
    collection,
    getDocs,
    setDoc,
    doc,
    getDoc,
    query,
    deleteDoc,
    where,
    updateDoc,
  } from "firebase/firestore";
  import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
  import { useRouter } from "next/router";
  import Swal from 'sweetalert2'
  import withReactContent from 'sweetalert2-react-content'
  import {
    ref,
    uploadBytes,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
  } from "firebase/storage";
  import { useRef } from "react";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  const { TextArea } = Input;

  const Index = () => {
    const MySwal = withReactContent(Swal)
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [imgUrl, setImgUrl] = useState("");
    const [uplodedUrl, setUploadedUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [btnPre, setBtnPre] = useState(<span>Change</span>);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [editData, setEditData] = useState(false);
    const [imgName, setImgName] = useState("");
    const [btnAdd, setBtnAdd] = useState("primary");
    const [loading, setLoading] = useState(false);
    const [arr, setarr] = useState([]);
    const [inUpdate, setInUpdate] = useState(false);
    var previewArr = [];
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: "",
        fees: "",
        feesHour: "",
        discount: "",
        address: "",
        email: "",
        password: "",
        phone: "",
        details: "",
        experience: "",
        workingAt: "",
        education: "",
        id: "",
        gender: "male",
        availability: "weekdays",
        unavailability: [],
        images: {
          url: "",
          name: "",
        },
      });
    const handleDateSelect = (date) => {
        const selectedDate = new Date(date);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        formData.unavailability==[]?
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
  
      console.log('unavailable===  ',formData?.unavailability)
    
    
    const handleFormChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
  
    const handleGenderChange = (value) => {
      setFormData((e) => ({ ...e, gender: value }));
    };
    const handleAvailiblityChange = (value) => {
      setFormData((e) => ({ ...e, availability: value }));
    };
    const createUser = async () => {
      createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        const userData = {
          name: formData?.name,
          email: formData?.email,
          role: 'nurses',
          id:user?.uid
        };
        const usersCollectionRef = collection(db, "users");
        const userDocRef = doc(usersCollectionRef, user.uid);
  
        setDoc(userDocRef, userData)
        .then(() => {
          imgUrl==""? addData("",user?.uid):
          handleUploadImage(user?.uid);
          console.log("User data saved successfully")
        })
        .catch((error) => {
          console.log("Error saving user data:", error)
        })
      })
    }
   const addMutaion = useMutation(createUser,{
    
    onSuccess:()=>{
      console.log("succes");
      queryClient.invalidateQueries(["nurses"])
    }
   })
    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (editData) {
        handleUploadImage();
      } else {
        addMutaion.mutate()
        // createUser();
        // handleUploadImage();
      }
    };
    const delteImage = async () => {
      const desertRef = ref(storage, `nurses/${imgName}`);
  
      try {
        const res = await deleteObject(desertRef);
        console.log(res, "res");
        setPreview("");
        setImgName("");
        setBtnPre(<span>Deleted</span>);
        await updateDoc(doc(db, "nurses", formData.id), { images: {} });
      } catch (err) {
        console.log(err);
      }
    };
  
    const addData = async (imageUrl, uid) => {
      // setBtnAdd("disable");
      const url = imageUrl;
      const newCityRef = collection(db, "nurses");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        const res = await addDoc(newCityRef, {
          ...formData, auth_id: uid
        });
        console.log(res.id);
  
        await updateDoc(doc(db, "nurses", res.id), {
          id: res.id,
          images: { url: imageUrl?imageUrl:"", name:imgUrl!==""?imgUrl.uid:"" },
        
        });
        queryClient.invalidateQueries(["NurseProfile"]);
        MySwal.fire({
          icon: 'success',
          // title: 'Oops...',
          text: ' Data added Successfull',
     
        })
        handleCancel();
        setImgUrl("")
        setBtnAdd("primary");
       
        // router.reload("/physio");
     
  
     
        setLoading(false);
      } catch (err) {
        handleCancel();
        console.log(err);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          
        })
        setLoading(false)
        handleCancel()
      }
    };
    const updateDocData= async(docs)=>{
   
      try{
       if (inUpdate) {
         await updateDoc(doc(db, "nurses", formData.id), {
           images: { url: docs, name: imgUrl.uid },
         });
       }
       handleCancel()
       queryClient.invalidateQueries(["Nurse-profile"])
       MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: 'Edited Successfull',
   
      })
       setInUpdate(false);
       
       handleOk();
       setEditData(false);
     
      
      }
    catch(error){
     console.log(error)
    }
  
   }
    const updateData = async (docs) => {
      const newCityRef = collection(db, "nurses");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        if (inUpdate) {
          const desertRef = ref(storage, `nurses/${formData.images.name}`);
          const deleteImg = await deleteObject(desertRef);
          // console.log(deleteImg);
        }
        await updateDoc(doc(db, "nurses", formData.id), { ...formData });
     
       
        updateDocData(docs)
    
    
     
      } catch (err) {
        console.log(err);
        updateDocData(docs)
        // MySwal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: 'Something went wrong!',
          
        // })
        setLoading(false)
        handleCancel()
      }
    };
    const deleteDocData= async(e)=>{
      try{
        const res = await deleteDoc(doc(db, "nurses", e.id));
        queryClient.invalidateQueries(["nurse-profile"]);
        console.log(res)
        MySwal.fire({
          icon: 'success',
          // title: 'Oops...',
          text: 'Deleted ',
     
        })
      }catch(error){
        console.log(error)
        MySwal.fire({
          icon: 'error',
          // title: 'Oops...',
          text: 'some thing went wrong',
     
        })
      }
    }
    const deleteData = async (e) => {
      console.log(e);
      try {
        const desertRef = ref(storage, `nurses/${e.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        deleteDocData(e)
        // console.log(deleteImg);
        setAlertType("error");
        
      
        // console.log(deleteImg);
        setAlertType("error");
        // router.reload("/category");
        setVisibleAlert(true);
        setTimeout(() => {
          setVisibleAlert(false);
        }, 5000);
      } catch (err) {
        console.log(err);
        deleteDocData(e)
        handleCancel()
        setLoading(false)
      }
    };
    const handleUploadImage = async (uid) => {
      setLoading(true);
      const imgRef = ref(storage, `nurses/${imgUrl ? imgUrl.uid : ""}`);
  
      try {
        const res = await uploadBytes(imgRef, imgUrl);
        // console.log(res, "result");
        const uploadTask = uploadBytesResumable(imgRef, imgUrl);
  
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // console.log("File available at", downloadURL);
        // addData();
        setUploadedUrl(downloadURL);
        editData ? updateData(downloadURL) : addData(downloadURL, uid);
      } catch (err) {
        console.log(err, "message");
      }
    };
  

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
        username: "",
        address: "",
        email: "",
        password: "",
        phone: "",
        id: "",
        gender: "",
        images: {
          url: "",
          name: "",
        },
      });
      setPreview("");
      setImgName("");
      setVisible(false);
      setLoading(false)
    };
  
    const onFinish = (values) => {
      // console.log(values);
      handleCancel();
    };
  
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
          src={preview}
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
    const docRef= query(collection(db,"nurses"),where("auth_id","==", localStorage.getItem("id") ))
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
 const {isLoading,data}=useQuery(["Nurse-profile"],fetchData,{
  staleTime:60000
 })
 if(!isLoading){
  // console.log(data)
 }
  return (
    <div className="" style={{ marginTop: "30px", }}>
      <div className="flex justify-end"><Button onClick={()=>{setEditData(true); setFormData({...data});setPreview(data?.images?.url) ;setVisible(true)}}>Edit Profile</Button></div>
     <div className=" flex ">
      <div className="h-[80px] w-[80px] rounded-full ">
      <Image src={data?.images?.url?data.images.url:loader} className="object-cover" alt="image" height={200} width={200}/>
      </div>
     </div>
     <div className="mt-[200px] ">
      {!isLoading && data?
   
          <div className=" grid grid-cols-2 gap-x-2" > 
          <h3 className="bg-blue-300 py-2  px-2 text-white">Name : {data?.name?data.name:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Email : {data?.email?data.email:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Phone : {data?.phone?data.phone:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Address : {data?.address?data.address:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Education : {data?.education?data.education:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Experience : {data?.experience?data.experience:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Fees/Day : {data?.perDay?data.perDay:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Fees/Hour : {data?.perHour?data.perHour:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Gender : {data?.gender?data.gender:"NA"} </h3>
        
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Availabele : {data?.availability?data.availability:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Longitude : {data?.long?data.long:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Latitude : {data?.lat?data.lat:"NA"} </h3>
          <ul className="bg-blue-400 py-2 px-4 text-white">UnAviable : {data?.unavailability?.map((doc,index)=>{
          return(
            <li key={index}>{doc}</li>
          )
          })} </ul>
  <h3 className="bg-blue-400 py-2 px-2 text-white">Discount : {data?.discount?data.discount:"NA"} </h3>
          </div>
       
      :"NA"
      
      }
     </div>
     <Modal
        open={visible}
        title="Add aya"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        // style={{overflowY:"scroll"}}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12 gap-x-4 ">
          <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Name</label>
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
            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Fees/Day</label>
              </div>
              <Input
                required
                type="number"
                className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="14"
                value={formData.perDay}
                name="perDay"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Fees/
                Hour</label>
              </div>
              <Input
                required
                type="number"
                className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="14"
                value={formData.perHour}
                name="perHour"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Discount</label>
              </div>
              <Input
                type="number"
                className="py-1 px-2 outline-none border-b w-full  border-gray rounded-md"
                placeholder="2$"
                value={formData.discount}
                name="discount"
                onChange={handleFormChange}
              />
            </div>

            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
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
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Experience</label>
              </div>
              <Input
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="Experience"
                value={formData.experience}
                name="experience"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Education</label>
              </div>
              <Input
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="Education"
                value={formData.education}
                name="education"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Email</label>
              </div>
              <Input
                type="email"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="jhon@abc.com"
                value={formData.email}
                name="email"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Password</label>
              </div>
              <Input
                type="password"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="******"
                value={formData.password}
                name="password"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
                <label className="text-lg">phone</label>
              </div>
              <Input
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="444-222-444"
                value={formData.phone}
                name="phone"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Latitude</label>
              </div>
              <div className="flex space-x-1">
              <Input
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="124.000"
                value={formData.lat}
                name="lat"
                onChange={handleFormChange}
              />
              {/* <Button>Auto Generate </Button> */}
              </div>
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-lg">Longitude</label>
              </div>
              <div className="flex space-x-1">
              <Input
              required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="-245.00"
                value={formData.long}
                name="long"
                onChange={handleFormChange}
                />
             
                {/* <Button>Auto Generate </Button> */}
              
                </div>
            </div>
            <div className="col-span-6  ">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Gender</label>
              </div>
              <div>
                <Select
                  className="w-full rounded-md text-black"
                  name="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                >
                  <Select.Option defaultChecked value="male">
                    Male
                  </Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </div>
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Working At</label>
              </div>
              <Input
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="working at"
                value={formData.workingAt}
                name="workingAt"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6  ">
                <div style={{ width: "87px" }}>
                  <label className="text-lg">Availability</label>
                </div>
                <div>
                <Select
                
                  className="w-full  rounded-md text-black"
                  name="gender"
                  onChange={handleGenderChange}
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
                <DatePicker onSelect={handleDateSelect} />
              </div>
              <div className="flex ml-1 px-1">
              {formData?.unavailability?.map((date) => (
          <div key={date.toString()}>
            <span>{dayjs(date.toString()).format('DD MMM YYYY')}</span>
            <Button onClick={() => handleRemoveDate(date)}>Remove</Button>
          </div>
        ))}
        </div>
            <div className="col-span-12  ">
              <div style={{ width: "180px" }}>
                <label className="text-[17px] ">Details</label>
              </div>
              <div className="  w-full">
                <TextArea
                  rows="2"
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Enter Details Here"
                  value={formData.details}
                  name="details"
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="col-span-6 mt-4">
              <Form.Item
                label="Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    setUploadImage(true)
                    return e;
                  }
                  setImgUrl(e.file);
                  
                  console.log(e.file, "test");
                  // handleUploadImage()
                  let b = URL.createObjectURL(e.file);
                  setPreview(b);
                  setInUpdate(true);
                  console.log(arr, "arr");
                  return e && e.fileList;
                }}
              >
                <Upload
                  className="ml-11"
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            </div>
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
          <div className="flex justify-center col-span-12">
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
  );
};

export default Index;





{/* <div className=" flex justify-end ">
<div>
  <button className="py-4 bg-white px-4 border-red-500 outline-none ">
    Edit Profile
  </button>
</div>
</div>
<div className="w-[600px] mt-4 flex flex-col items-start ">
<div className="w-[600px]  bg-black h-[200px] rounded-md">
  <div className="relative flex gap-4 top-36">
    <div className="w-[120px] h-[120px] ml-8  bg-[#264798]  rounded-md">
    
    </div>
    <div>
      <h2 className=" text-white"> {data.name}</h2>
    </div>
  </div>
</div>
</div>
<div className="w-[250px] bg-slate-400 flex  mt-24 flex-col items-start px-2">
<div className="flex  gap-x-2 border-b border-black">
  <h4>Name</h4>
  <h4>:</h4>
  <h4>{data.name}</h4>
</div>
<div className="flex gap-2">
  <h4>Email</h4>
  <h4>:</h4>
  <h4>{data.email}</h4>
</div>
<div className="flex gap-2">
  <h4>Role</h4>
  <h4>:</h4>
  <h4 className="capitalize">{data.role}</h4>
</div>
</div> */}