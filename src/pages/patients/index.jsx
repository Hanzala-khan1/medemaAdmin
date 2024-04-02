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

import {
  UserOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { Modal, Form, Input, Button, Upload, Radio,Select,Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { auth, db, storage } from "@/config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  setDoc,
  doc,
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
  const MySwal = withReactContent(Swal)
    const bloodGroups= [
"O positive",
"O negative",
"A positive", 
"A negative",
"B positive",
"B negative",
"AB positive",
"AB negative"
]
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
    address: "",
    email: "",
    password: "",
    phone: "",
    details: "",
    treatment: "",
    bloodGroup: "",
    rgNo:"",
    city:"",
    nok:"",
    insurance:"no",
    insuranceCompany:"",
    insuranceNo:"",
    ref:"",
    gender:"",
    id: "",
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
  const handleInsurance = (value) => {
    setFormData((e) => ({ ...e, insurance: value }));
  };
  const handleTreatmentChange =(value)=>{
    setFormData((e)=>({...e,treatment:value}))
  }
  const handleInsuranceChange =(value)=>{
    setFormData((e)=>({...e,insuranceCompany:value}))
  }
  const handleRelation =(value)=>{
    setFormData((e)=>({...e,nokRelation:value}))
  }
  const handleBloodGroup =(value)=>{
    setFormData((e)=>({...e,bloodGroup:value}))
  }
  const createUser = async () => {
    createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
    .then((userCredential) => {
      const user = userCredential.user;

      const userData = {
        name: formData?.name,
        email: formData?.email,
        role: 'patient'
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
    }).catch(()=>{
      MySwal.fire({
        icon: 'error',
        // title: 'Oops...',
        text: 'Email already in use',
   
      })
    })
  }
 const addMutaion = useMutation(createUser,{
  
  onSuccess:()=>{
    console.log("succes");
    queryClient.invalidateQueries(["Patient"])
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
    const desertRef = ref(storage, `patient/${imgName}`);

    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      setPreview("");
      setImgName("");
      setBtnPre(<span>Deleted</span>);
      await updateDoc(doc(db, "patient", formData.id), { images: {} });
    } catch (err) {
      console.log(err);
    }
  };
const getInsurance = async()=>{
   var brr=[];
   const docref = collection(db,"insurance")    
  try{
       const res = await getDocs(docref);
       res.docs.map((doc)=>{
        brr.push(doc.data())
       })
       return brr
      }catch(error){
 console.log(error)
      }
}
  
const insuranceData = useQuery(['Insurance'],getInsurance,{
  staleTime:600000
})
if(insuranceData.isLoading==false){
  // console.log(insuranceData.data)
}
  const addData = async (imageUrl, uid) => {
    // setBtnAdd("disable");
    const url = imageUrl;
    const newCityRef = collection(db, "patient");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData, auth_id: uid
      });
      console.log(res.id);

      await updateDoc(doc(db, "patient", res.id), {
        id: res.id,
        images: { url: imageUrl?imageUrl:"", name:imgUrl!==""?imgUrl.uid:"" },
      
      });
      queryClient.invalidateQueries(["Patient"]);
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data added Successfull',
   
      })
      setImgUrl("")
      setBtnAdd("primary");
      handleCancel();
      // router.reload("/patient");
   

   
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
       await updateDoc(doc(db, "patient", formData.id), {
         images: { url: docs, name: imgUrl.uid },
       });
     }
     handleCancel()
     queryClient.invalidateQueries(["Patient"])
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
    const newCityRef = collection(db, "patient");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      if (inUpdate) {
        const desertRef = ref(storage, `patient/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        // console.log(deleteImg);
      }
      await updateDoc(doc(db, "patient", formData.id), { ...formData });
   
     
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
      const res = await deleteDoc(doc(db, "patient", e.id));
      queryClient.invalidateQueries(["Patient"]);
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
      const desertRef = ref(storage, `patient/${e.images.name}`);
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
    const imgRef = ref(storage, `patient/${imgUrl ? imgUrl.uid : ""}`);

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

  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "patient");
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
  const { isLoading, data, error } = useQuery(["Patient"], fetchData, {
    staleTime: 60000,
  });
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
      address: "",
      email: "",
      password: "",
      phone: "",
      details: "",
      treatment: "",
      bloodGroup: "",
      rgNo:"",
      city:"",
      nok:"",
      insurance:"no",
      insuranceCompany:"",
      insuranceNo:"",
      ref:"",
      gender:"",
      id: "",
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
  // console.log(Menu, "menue");
  const items = [
    {
      label: (
        <label className="text-green-300 bg-blue-900 w-full px-4 py-1 rounded-md ">
          Edit
        </label>
      ),
      key: "edit",
    },
    {
      label: (
        <label className="text-white bg-red-800 w-full px-2 py-1 rounded-md ">
          Delete
        </label>
      ),
      key: "delete",
    },
  ];
  const columns = [
    {
      title: (
        <div className="flex items-center justify-center space-x-4">
         
          {/* <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
         
          /> */}
           <span className="text-base font-poppins font-medium">#</span>
        </div>
      ),
      dataIndex: "no",
      sorter: (a, b) => a.age - b.age,
      render: (_, record,index) => (
        <div className="w-full flex items-center justify-center">
          <span className="text-base font-poppins font-medium text-[#474747]">
            {index+1}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
             <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
          <span className="text-base font-poppins font-medium">Image</span>
       
        </div>
      ),
      dataIndex: "date",
      render: (_, record) => (
        <div className="w-full flex justify-center items-center">
          {/* <Avatar
                  icon={<UserOutlined />}
                  src={
                    record?.user?.image
                      ? `${process.env.NEXT_PUBLIC_API_URL}${record?.user?.image.url}`
                      : ""
                  }
                  className="flex items-center justify-center"
                /> */}
          <Image
            src={record.images?record.images.url:''}
            alt={record.name}
            width={40}
            height={40}
            style={{ marginLeft: "0px" }}
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center w-[160px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium">Name</span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.name;
        return record?.name ? (
          <div className="flex items-center w-[160px] justify-center space-x-2">
            <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.name ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            
          />
          <span className="text-base font-poppins font-medium">Gender</span>
        </div>
      ),
      dataIndex: "provider",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return record?.gender ? (
          <div className="flex items-center justify-center  space-x-2">
          {record.gender=="male"?
             <div className="w-[60px] py-1 bg-[#DCEDE5] text-center text-[#3CB43C]">Male</div>
         :
         <div className="w-[60px] py-1 bg-[#E7E3F6] text-center text-[#8472CA]">Female</div>
            }
          
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
          <span className="text-base font-poppins font-medium">Affiliated </span>
        </div>
      ),
      dataIndex: "provider",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return record?.gender ? (
          <div className="flex items-center justify-center  space-x-2">
            {record?.ref == "" ? (
              <div className="w-[60px] py-1 bg-[#e05a5a] text-center text-[#f3f8f3]">
                No
              </div>
            ) : (
              <div className="w-[60px] py-1 bg-[#5af79b] text-center text-[#8472CA]">
                Yes
              </div>
            )}
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Treatment</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.treatment;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.treatment ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Details</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.details;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.details ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },



    {
      title: (
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Contact</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex flex-col items-center  justify-center">
          {
            <>
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Email: {record.email}
              </span>
              <span className="mx-auto text-center  text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Phone: {record.phone}
              </span>
            </>
          }
        </div>
      ),
    },
   
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">next of Kin</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record?.nok

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record?.nok ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Relation with next of kin</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record?.nokRelation

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm capitalize text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record?.nokRelation ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Blood Group</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record?.bloodGroup

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm capitalize text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record?.bloodGroup ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },

    {
      title: (
        <div className="flex items-center space-x-4 justify-center w-[260px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Insurance</span>
        </div>
      ),
      dataIndex: "insurance",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex flex-col items-center  justify-center">
          {
            <>
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Insurance: {record?.insurance}
              </span>
              <span className="mx-auto text-center  text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Insurance Company: {record.insuranceCompany? record.insuranceCompany:"NA"}
              </span>
              <span className="mx-auto text-center  text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Insurance Company: {record.insuranceNo?record.insuranceNo:"NA"}
              </span>
            </>
          }
        </div>
      ),
    },
  
    {
      title: (
        <div className="flex items-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
          <span className="text-base font-poppins font-medium">Action</span>
        </div>
      ),
      render: (_, record) => (
        <div className="w-full flex items-center justify-center bg-white text-white">
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <Button
                      className="text-green-300 hover:text-white bg-blue-900 w-full px-4 py-1 rounded-md "
                      onClick={() => {
                        showModal();
                        setFormData(record);
                        setPreview(record.images.url);
                        setImgName(record.images.name);
                        setEditData(true);
                      }}
                    >
                      Edit
                    </Button>
                  ),
                  key: "edit",
                },
                {
                  label: (
                    <Button
                      onClick={() => {
                        deleteData(record);
                      }}
                      danger
                    >
                      Delete
                    </Button>

                    // className="text-white bg-red-800 w-full px-2 py-1 rounded-md "
                  ),
                  key: "delete",
                },
              ],
            }}
            placement="bottomLeft"
            theme={"dark"}
          >
            <Button>
              <MoreOutlined />
            </Button>
          </Dropdown>
          {/* <button className="text-2xl hover:text-3xl font-bold " onClick={onClick}>
                <MoreOutlined />
              </button> */}
        </div>
      ),
    },
  ];

  const headings = [
    "#",
    "Date",
    "User",
    "Provider",
    "Service",
    "Status",
    "Payment",
    "Actions",
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  // console.log(typeof headings.length.toString());
  return (
    <div className="flex flex-col bg-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold font-barlow text-lg md:text-2xl md:ml-6">Patients</h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-1 md:py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add Pateient
        </button>
      </div>
      <Modal
        open={visible}
        title="Add Patient"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        // style={{overflowY:"scroll"}}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12 gap-x-4 gap-y-1 ">
          <div className="col-span-6  ">
                <div className="col-span-1">
                  <label className="text-md">Name</label>
                </div>
  
                <Input
                  type="text"
                  required
                  className="py-1 col-span-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="Enter Name"
                  value={formData.name}
                  name="name"
                  onChange={handleFormChange}
                />
              </div>
  
              <div className="col-span-6 ">
                <div className="col-span-1  w-full">
                  <label className="text-md">Registration Number</label>
                </div>
                <Input
                  required
                  type="text"
                  className="py-1 col-span-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Registration No"
                  value={formData.rgNo}
                  name="rgNo"
                  onChange={handleFormChange}
                />
              </div>
        
          
              <div className="col-span-6  ">
                <div className="col-span-1  w-full">
                  <label className="text-md">Email</label>
                </div>
                <Input
                  type="email"
                  className="py-1 col-span-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="jhon@abc.com"
                  value={formData.email}
                  name="email"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6   ">
                <div className="col-span-1  w-full">
                  <label className="text-md">Password</label>
                </div>
                <Input.Password
                  type="password"
                  minLength='6'
                  className="py-1 col-span-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="password"
                  value={formData.password}
                  name="password"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div className="col-span-1  w-full" >
                  <label className="text-md">Phone</label>
                </div>
                <Input
                  type="text"
                  className="py-1 col-span-2  outline-none w-full border-b  border-gray rounded-md"
                  placeholder="444-222-444"
                  value={formData.phone}
                  name="phone"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div className="col-span-1  w-full">
                  <label className="text-md">Address</label>
                </div>
                <Input
                  required
                  type="text"
                  className="py-1 col-span-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Address"
                  value={formData.address}
                  name="address"
                  onChange={handleFormChange}
                />
              </div>
                   <div className="col-span-6 ">
                <div className="col-span-1  w-full" >
                  <label className="text-md">City</label>
                </div>
                <Input
                  type="text"
                  className="py-1 col-span-2  outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Enter your city"
                  value={formData.city}
                  name="city"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div className="col-span-1  w-full" >
                  <label className="text-md">Next of Kin</label>
                </div>
                <Input
                  type="text"
                  className="py-1 col-span-2  outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Next of Kin"
                  value={formData.nok}
                  name="nok"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div className="col-span-1  w-full" >
                  <label className="text-md">Next of Kin Relation</label>
                </div>
                <div>
                <Select
                  className=" col-span-2 w-full rounded-md text-black"
                  
                  name="nokRelation"
                  placeholder="Relation"
                  onChange={handleRelation}
               value={formData.nokRelation}
                >
                  <Select.Option  value="brother">
                    Brother
                  </Select.Option>
                  <Select.Option value="sister">Sister</Select.Option>
                  <Select.Option value="wife">Wife</Select.Option>
                  <Select.Option value="mother">Mother</Select.Option>
                  <Select.Option value="father">Father</Select.Option>
                  <Select.Option value="son">Son</Select.Option>
                  <Select.Option value="daughter">Daughter</Select.Option>
                </Select>
                </div>
              </div>
              <div className="col-span-6  ">
                <div className="col-span-1  w-full">
                  <label className="text-md">Treatment</label>
                </div>
                <div>
                <Select
                  className=" col-span-2 w-full rounded-md text-black"
                  
                  name="treatment"
                  placeholder="treatment"
                  onChange={handleTreatmentChange}
               value={formData.treatment}
                >
                  <Select.Option  value="physio">
                    Physio
                  </Select.Option>
                  <Select.Option value="rehab">Rehab</Select.Option>
                  <Select.Option value="nurse">Nurse</Select.Option>
                  <Select.Option value="nurse">Other</Select.Option>
                </Select>
                </div>
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "190px" }}>
                  <label className="text-md">Blood Group</label>
                </div>
                <div>
                <Select
                  className="w-full  rounded-md text-black"
                  name="treatment"
                  placeholder="treatment"
                  onChange={handleBloodGroup}
               value={formData.bloodGroup}
                >
                  {
                    bloodGroups.map((doc,index)=>{
                    return(
                      <Select.Option key={index}  value={doc}>
                      {doc}
                    </Select.Option>
                    )
                    })
                  }
                </Select>
                </div>
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "150px" }}>
                  <label className="text-md">Gender</label>
                </div>
                <div>
                <Select
                 className="w-full  rounded-md text-black"
                  name="gender"
                  placeholder="select gender"
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
                <div style={{ width: "150px" }}>
                  <label className="text-md">Insurance</label>
                </div>
                <div>
                <Select
                 className="w-full  rounded-md text-black"
                  name="insurance"
                  placeholder="Has Insurance"
                  onChange={handleInsurance}
                >
                  <Select.Option defaultChecked value="yes">
                    Yes
                  </Select.Option>
                  <Select.Option value="no">No</Select.Option>
                </Select>
                </div>
              </div>
              {
                formData.insurance=="yes"?
                (
                <div className="col-span-6  ">
                <div className="col-span-1 transition-opacity duration-100 delay-1500  w-full">
                  <label className="text-md">Insurance Company</label>
                </div>
                <div>
                <Select
                  className=" col-span-2 w-full rounded-md text-black"
                  
                  name="insuranceCompany"
                  placeholder="insuranceCompany"
                  onChange={handleInsuranceChange}
               value={formData.insuranceCompany}
                >
                  {
                    insuranceData?.data?.map((doc,index)=>{
                    return(
                      <Select.Option key={index} value={doc?.name}>
                      {doc?.name}
                    </Select.Option>
                    )
                    })
                  }
                </Select>
                </div>
              </div>

  ):""
              }
              {
                     formData.insurance=="yes"?
                     (
                      <div className="col-span-6 ">
                      <div className="col-span-1  w-full" >
                        <label className="text-md">Insurance Number</label>
                      </div>
                      <Input
                        type="text"
                        className="py-1 col-span-2  outline-none w-full border-b  border-gray rounded-md"
                        placeholder="Insurance Number"
                        value={formData.insuranceNo}
                        name="insuranceNo"
                        onChange={handleFormChange}
                      />
                    </div>
     
       ):""
                  
              }
              
              <div className="col-span-12  ">
                <div style={{ width: "170px" }}>
                  <label className="text-[17px] ">Details</label>
                </div>
                <div className=" w-full">
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
  
              <div className="col-span-6  mt-4">
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
                  className="ml-12"
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    {uploadButton}
                  </Upload>
                </Form.Item>
                {/* <Form.Item className=" ml-14 -mt-4">
                  <Button
                    onClick={() => {
                      changeImage();
                    }}
                  >
                    {btnPre}
                  </Button>
                </Form.Item> */}
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

      <div className="">
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default Index;
