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
  DeleteFilled
} from "@ant-design/icons";
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
import withReactContent from "sweetalert2-react-content";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addRehab, userSignup } from "@/services";
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
    Name: "",
    full_name:"",
    email: "",
    password: "",
    address: "",
    city: "",
    phone: "",
    details: "",
    dob: "",
    education: "",
    gender: "",
    perHour:"",
    perDay:"",
    images: "",
    lat: "",
    long: "",
    description: "",
    discount: ""
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if(name=="name"){
      const val = value?.toLowerCase();
      setFormData((prevFormData) => ({ ...prevFormData, [name]: val }));
    }else{
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }
  };

  // const handleDoctorChange = () => {
  //   setFormData((e) => ({ ...e, doctorAvail: true }));
  // };
  // const handlePowerChange = () => {
  //   setFormData((e) => ({ ...e, powerBackup: true }));
  // };
  // const handleParkingChange = () => {
  //   setFormData((e) => ({ ...e, parkingFacility: true }));
  // };
  const handleFormSubmit = (e) => {
    try {
      e.preventDefault();
      // if (!validatePassword()) {
      //   return;
      // }
      // let { confirmpassword, confirmPassword, username, ...data } = formData
console.log("formdatatatattatatatta",formData)
      let params = formData
      // console.log(params)
      // MySwal.showLoading();
      addRehab(params)
        .then((res) => {
          if (res.data.auth) {
            console.log("resdata...........", res.data)
            MySwal.fire({
              icon: "success",
              // title: 'Oops...',
              text: " Sign Up Successfull",
            });
            router.push("/rehab");
          }
        })
        .catch((err) => {
          console.log("send error.nnnnn..", err);
          MySwal.fire({
            icon: "error",
            // title: 'Oops...',
            text: err?.response?.data?.message,
          });
        })
        .finally(() => {
          MySwal.hideLoading();
        });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response?.data?.message,
      });  
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
      setPreview("");
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

  

    // const imgRef = ref(storage, `rehab/${imgUrl ? imgUrl.uid : ""}`);
    // const imgRef1 = ref(storage, `rehab/${imgUrl1 ? imgUrl1.uid : ""}`);
    // const imgRef2 = ref(storage, `rehab/${imgUrl2 ? imgUrl2.uid : ""}`);
    // try {

 
    //     const res = await uploadBytes(imgRef, imgUrl);
    //     console.log(res, "result");
    //     const uploadTask = uploadBytesResumable(imgRef, imgUrl);
    //     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //     const res1 = await uploadBytes(imgRef1, imgUrl1);
    //     console.log(res1, "result");
   
     

      // const uploadTask1 = uploadBytesResumable(imgRef1, imgUrl1);
      // const downloadURL1 = await getDownloadURL(uploadTask1.snapshot.ref);
      // const res2 = await uploadBytes(imgRef2, imgUrl2);
      // console.log(res2, "result");
      // const uploadTask2 = uploadBytesResumable(imgRef2, imgUrl2);
      // const downloadURL2 = await getDownloadURL(uploadTask2.snapshot.ref);
      // console.log("File available at", downloadURL2);
      // addData();
    //   setUploadedUrl(downloadURL);
    //   // setUploadedUrl(downloadURL1);
    //   // setUploadedUrl(downloadURL2);
    //   editData
    //     ? updateData()
    //     : addData();
    // } catch (err) {
    //   console.log(err, "message");
    //   setLoading(false)
    // }
  };

  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "rehab");
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
  const { isLoading, data, error } = useQuery(["rehab"], fetchData, {
    staleTime: 60000,
  });
  console.log("isLoading", data);

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
      unavailability: [],
      description: "",
      doctorAvail: false,
      powerBackup: false,
      parkingFacility: false,
      images: []
    });
    setPreview([]);
    setPreview1("");
    setPreview2("")
    setImgName1("");
    setImgName2("")
    setImgName("");
    setLoading(false)
    setVisible(false);
  };

  const onFinish = (values) => {
    console.log(values);
    handleCancel();
  };

  const uploadButton =  (
 
    <div>
      <UploadOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>

  );
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
const handledeleteItem=(e)=>{
  let item = preview.filter((doc)=>{
        return doc.name !== e 
  })
  setPreview(item)

}
  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  console.log(Menu, "menue");
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
            src={record.images?record?.images[0]?.url:''}
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
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Facilities</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex flex-col items-center  justify-center">
          {
            <>
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                24/7 Doctors
                {record.doctorAvail ? (
                  <span className="text-green-400 ml-5">
                    {" "}
                    <CheckCircleOutlined />
                  </span>
                ) : (
                  <span className="text-red-400 ml-2">
                    {" "}
                    <CloseCircleOutlined />
                  </span>
                )}
              </span>
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                PowerBackup
                {record.powerBackup ? (
                  <span className="text-green-400 ml-3">
                    {" "}
                    <CheckCircleOutlined />
                  </span>
                ) : (
                  <span className="text-red-400 ml-2">
                    {" "}
                    <CloseCircleOutlined />
                  </span>
                )}
              </span>

              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                Parking facility
                {record.parkingFacility ? (
                  <span className="text-green-400 ml-1">
                    {" "}
                    <CheckCircleOutlined />
                  </span>
                ) : (
                  <span className="text-red-400 ml-2">
                    {" "}
                    <CloseCircleOutlined />
                  </span>
                )}
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
          <span className="text-base font-poppins font-medium">Details</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.description;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm  text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.description ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center  justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Fees</span>
        </div>
      ),
      dataIndex: "status",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className=" flex items-center w-[160px] justify-center">
          <span className="mx-auto text-sm font-poppins font-normal text-[black]  py-1">
            {record?.perDay + "" + "$"}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Discount</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-[160px] flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.discount + "" + "$"}
            </span>
          }
        </div>
      ),
    },

    {
      title: (
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Latitude</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.lat}
            </span>
          }
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4 justify-center w-[160px]">
          <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
          <span className="text-base font-poppins font-medium">Longitude</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.long}
            </span>
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
                        // setPreview(record.images);
                        setImgName(record.images.name);
                        setPreview1(record.images.url1);
                        setImgName1(record.images.name1);
                        setPreview2(record.images.url2);
                        setImgName2(record.images.name2);
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
  console.log(typeof headings.length.toString());
  return (
    <div className="flex flex-col bg-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold font-barlow text-2xl ml-6">Rehab</h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add Rehab
        </button>
      </div>

      <Modal
        open={visible}
        title="Add Rehab"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <form onSubmit={handleFormSubmit}>
          <div className=" gap-x-4 gap-y-3 text-black mt-4 text-lg">
            Rehab Info:
          </div>
          <div className="grid grid-cols-12 gap-x-4 gap-y-3">
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "170px" }}>
                <label className="text-lg   ">Name</label>
              </div>

              <Input
              autoComplete="off"
                type="text"
                required
                className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="Enter Title"
                value={formData.Name}
                name="Name"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex space-x-2">
              <div style={{ width: "147px" }}>
                <label className="text-lg">Fees/Day</label>
              </div>
              <Input
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
                <label className="text-lg">Address</label>
              </div>
              <Input
              autoComplete="off"
                required
                type="text"
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="Addres"
                value={formData.address}
                name="address"
                onChange={handleFormChange}
              />
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
            <div className=" col-span-12 text-black mt-4 text-lg">
            Rehab Admin Info:
          </div>
          <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Full Name</label>
                </div>
                <Input
                autoComplete="off"
                required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Full Name"
                  value={formData.full_name}
                  name="full_name"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Email</label>
                </div>
                <Input
                autoComplete="off"
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
                autoComplete="off"
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
                  <label className="text-lg">Phone</label>
                </div>
                <Input
                autoComplete="off"
                required
                  type="tel"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="jhon@abc.com"
                  value={formData.phone}
                  name="phone"
                  onChange={handleFormChange}
                />
              </div>
              {/* <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Email</label>
                </div>
                <Input
                autoComplete="off"
                required
                  type="email"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="jhon@abc.com"
                  value={formData.email}
                  name="email"
                  onChange={handleFormChange}
                />
              </div> */}
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
