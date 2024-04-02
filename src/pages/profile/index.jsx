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
  import { useEffect, useState } from "react";
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
  import {
    addDoc,
    collection,
    getDocs,
    setDoc,
    doc,
    getDoc,
    deleteDoc,
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

    const router = useRouter();
    useEffect(()=>{
      const roles= localStorage.getItem("role")
      console.log(roles,"roles")
              switch (roles) {
                case "users":
                 
                  break;
                  case "admin" :  
                     
                    break ;
                    case "doctor" :
                     router.replace("/doctor-profile")
                       break;
                       case "physio" :
                        router.replace("/physio-profile")
                          break;
                          case "aya" :
                        router.replace("/aya-profile")
                          break;
                          case "nurse" :
                            router.replace("/nurse-profile")
                              break;
                              case "rehab" :
                            router.replace("/rehab-profile")
                              break;
                default:
                  break;
              }   
    },[])

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
 
    const [editData, setEditData] = useState(false);
    const [imgName, setImgName] = useState("");
    const [btnAdd, setBtnAdd] = useState("primary");
    const [loading, setLoading] = useState(false);
    const [arr, setarr] = useState([]);
    const [inUpdate, setInUpdate] = useState(false);
    var previewArr = [];
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
      username:"",
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
  
    const handleFormChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };
  
    const handleGenderChange = (value) => {
      setFormData((e) => ({ ...e, gender: value }));
    };
  
    const createUser = async () => {
      createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        const userData = {
          name: formData?.name,
          email: formData?.email,
          role: 'physio'
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
      queryClient.invalidateQueries(["Physio"])
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
      const desertRef = ref(storage, `physio/${imgName}`);
  
      try {
        const res = await deleteObject(desertRef);
        console.log(res, "res");
        setPreview("");
        setImgName("");
        setBtnPre(<span>Deleted</span>);
        await updateDoc(doc(db, "physio", formData.id), { images: {} });
      } catch (err) {
        console.log(err);
      }
    };
  
    const addData = async (imageUrl, uid) => {
      // setBtnAdd("disable");
      const url = imageUrl;
      const newCityRef = collection(db, "physio");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        const res = await addDoc(newCityRef, {
          ...formData, auth_id: uid
        });
        console.log(res.id);
  
        await updateDoc(doc(db, "physio", res.id), {
          id: res.id,
          images: { url: imageUrl?imageUrl:"", name:imgUrl!==""?imgUrl.uid:"" },
        
        });
        queryClient.invalidateQueries(["Physio"]);
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
         await updateDoc(doc(db, "users", localStorage.getItem("id")), {
           images: { url: docs, name: imgUrl.uid },
         });
       }
       handleCancel()
       queryClient.invalidateQueries(["User"])
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
      const newCityRef = collection(db, "users");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        if (inUpdate) {
          const desertRef = ref(storage, `users/${formData.images.name}`);
          const deleteImg = await deleteObject(desertRef);
          // console.log(deleteImg);
        }
        await updateDoc(doc(db, "users", localStorage.getItem("id")), { ...formData });
     
       
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
        const res = await deleteDoc(doc(db, "physio", e.id));
        queryClient.invalidateQueries(["Physio"]);
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
        const desertRef = ref(storage, `physio/${e.images.name}`);
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
      const imgRef = ref(storage, `physio/${imgUrl ? imgUrl.uid : ""}`);
  
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





  console.log(router.query);
  // const data = router.query;
  const fetchData =async()=>{
    const docRef= doc(db,"users",localStorage.getItem("id"))
try{
   const res = await getDoc(docRef);
   console.log(res.data())
   return res.data()
}catch(error){
console.log(error)
}
 }
 const {isLoading,data}=useQuery(["User"],fetchData,{
  staleTime:60000
 })
 if(!isLoading){
  // console.log(data)
 }
  return (
    <div className="" style={{ marginTop: "30px", }}>
      <div className="flex justify-end"><Button onClick={()=>{setEditData(true); setFormData({...data});setPreview(data?.images?.url) ;setVisible(true)}}>Edit Profile</Button></div>
     <div className="">
      <div className="h-[80px] w-[80px] rounded-full ">
      <Image src={data?.images?.url?data.images.url:loader} className="object-cover" alt="image" height={200} width={200}/>
      </div>
     </div>
     <div className="mt-[200px] w-[390px]">
      {!isLoading && data?
   
          <div > 
          <h3 className="bg-blue-300 py-2  px-2 text-white">Name : {data.username?data.username:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Email : {data.email?data.email:"NA"} </h3>
          <h3 className="bg-blue-300 py-2 px-2 text-white" >Phone : {data.phone?data.phone:"NA"} </h3>
          <h3 className="bg-blue-400 py-2 px-2 text-white">Address : {data.address?data.address:"NA"} </h3>
         
          {/* <h3>Email : {doc.email?doc.email:"NA"} </h3> */}
          </div>
       
      :"NA"
      
      }
     </div>
     <Modal
          open={visible}
          title="Add Physio"
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
                  value={formData.username}
                  name="username"
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
           
              <div className="col-span-6 flex space-x-2">
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
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Password</label>
                </div>
                <Input
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
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Gender</label>
                </div>
                <div>
                <Select
                  className="w-[170px] px-2 ml-6 rounded-md text-black"
                  name="gender"
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
            
              <div className="col-span-6 mt-4">
                <Form.Item
                  label="Image"
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    setImgUrl(e.file);
                    // handleUploadImage()
                    let b = URL.createObjectURL(e.file);
                    setPreview(b);
                    setInUpdate(true);
                    console.log(arr, "arr");
                    return e && e.fileList;
                  }}
                >
                  <Upload
                    name="image"
                    className="ml-12"
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
                          <Image src={doc?doc:preview} height={25} width={25} alt="img" />
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