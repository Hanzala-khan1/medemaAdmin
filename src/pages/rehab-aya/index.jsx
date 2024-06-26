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
    query,
    where,
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
      perDay: "",
      perHour:"",
      discount: "",
      address: "",
      email: "",
      password: "",
      phone: "",
      details: "",
      experience: "",
      role:"aya",
      lat:"",
      rgNo:"",
      speciality:"",
      long:"",
      workingAt: "",
      education: "",
      id: "",
      ref:"",
      gender: "male",
      availability: "weekdays",
      unavailability: [],
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
          role: 'aya',
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
      }).catch(()=>{
        MySwal.fire({
          icon: 'error',
          // title: 'Oops...',
          text: ' Email already in use',
     
        })
      })
    }
   const addMutaion = useMutation(createUser,{
    
    onSuccess:()=>{
      console.log("succes");
      queryClient.invalidateQueries(["Rehab-Aya"])
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
      const desertRef = ref(storage, `aya/${imgName}`);
  
      try {
        const res = await deleteObject(desertRef);
        console.log(res, "res");
        setPreview("");
        setImgName("");
        setBtnPre(<span>Deleted</span>);
        await updateDoc(doc(db, "aya", formData.id), { images: {} });
      } catch (err) {
        console.log(err);
      }
    };
  
    const addData = async (imageUrl, uid) => {
      // setBtnAdd("disable");
      const url = imageUrl;
      const newCityRef = collection(db, "aya");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        const res = await addDoc(newCityRef, {
          ...formData, auth_id: uid
        });
        console.log(res.id);
  
        await updateDoc(doc(db, "aya", res.id), {
          id: res.id,
          ref:localStorage.getItem("id"),
          images: { url: imageUrl?imageUrl:"", name:imgUrl!==""?imgUrl.uid:"" },
        
        });
        queryClient.invalidateQueries(["Rehab-Aya"]);
        MySwal.fire({
          icon: 'success',
          // title: 'Oops...',
          text: ' Data added Successfull',
     
        })
        setImgUrl("")
        setBtnAdd("primary");
        handleCancel();
        // router.reload("/aya");
     
  
     
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
         await updateDoc(doc(db, "aya", formData.id), {
           images: { url: docs, name: imgUrl.uid },
         });
       }
       handleCancel()
       queryClient.invalidateQueries(["Rehab-Aya"])
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
      const newCityRef = collection(db, "aya");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        if (inUpdate) {
          const desertRef = ref(storage, `aya/${formData.images.name}`);
          const deleteImg = await deleteObject(desertRef);
          // console.log(deleteImg);
        }
        await updateDoc(doc(db, "aya", formData.id), { ...formData });
     
       
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
        const res = await deleteDoc(doc(db, "aya", e.id));
        queryClient.invalidateQueries(["Rehab-Aya"]);
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
        const desertRef = ref(storage, `aya/${e.images.name}`);
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
      const imgRef = ref(storage, `aya/${imgUrl ? imgUrl.uid : ""}`);
  
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
      const dbRef = query(collection(db, "aya"),where("ref","==",localStorage.getItem("id") ));
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
    const { isLoading, data, error } = useQuery(["Rehab-Aya"], fetchData, {
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
        perDay: "",
        perHour:"",
        discount: "",
        address: "",
        email: "",
        password: "",
        phone: "",
        details: "",
        experience: "",
        role:"aya",
        lat:"",
        rgNo:"",
        speciality:"",
        long:"",
        workingAt: "",
        education: "",
        id: "",
        ref:"",
        gender: "male",
        availability: "weekdays",
        unavailability: [],
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
              style={{ marginLeft: "8px" }}
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
          <div className="flex items-center  justify-center  w-[160px] space-x-4">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Fees/Day</span>
          </div>
        ),
        dataIndex: "status",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="mx-auto text-sm font-poppins font-normal text-[black]  py-1">
              {record?.perDay }
            </span>
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center  justify-center  w-[160px] space-x-4">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Fees/Hour</span>
          </div>
        ),
        dataIndex: "status",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="mx-auto text-sm font-poppins font-normal text-[black]  py-1">
              {record?.perHour }
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
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Education</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record.education}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Experience</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record.experience}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Medical Registration No</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record.rgNo?record.rgNo:"NA"}
              </span>
            }
          </div>
        ),
      },
      {
        title: (
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Working at</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record.workingAt}
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
          <div className="flex items-center space-x-4 justify-center w-[160px]">
            <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
            <span className="text-base font-poppins font-medium">Address</span>
          </div>
        ),
        dataIndex: "payment",
        sorter: (a, b) => a.age - b.age,
        render: (_, record) => (
          <div className="w-full flex items-center  justify-center">
            {
              <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
                {record?.address?record.address:"NA"}
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
          <h1 className="font-semibold font-barlow text-2xl ml-6">Aya</h1>
          <button
            className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
            onClick={() => {
              setEditData(false);
              showModal();
            }}
          >
            + Add Aya
          </button>
        </div>
        <Modal
          open={visible}
          title="Add Aya"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
          // style={{overflowY:"scroll"}}
        >
  <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12 gap-x-4 gap-y-1">
          <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md   ">Name</label>
                </div>
  
                <Input
                autoComplete="off"
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
                <div style={{ width: "170px" }}>
                  <label className="text-md   ">Medical Registration No</label>
                </div>
  
                <Input
                autoComplete="off"
                  type="text"
                  required
                  className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="Registration No"
                  value={formData.rgNo}
                  name="rgNo"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md   ">Specialization</label>
                </div>
  
                <Input
                autoComplete="off"
                  type="text"
                  required
                  className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="Specialization"
                  value={formData.speciality}
                  name="speciality"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "147px" }}>
                  <label className="text-md">Fees/Day</label>
                </div>
                <Input
                autoComplete="off"
                  required
                  type="number"
                  className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="14$"
                  value={formData.perDay}
                  name="perDay"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md">Fees/Hour</label>
                </div>
                <Input
                autoComplete="off"
                  required
                  type="number"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="fees/day"
                  value={formData.perHour}
                  name="perHour"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md">Discount</label>
                </div>
                <Input
                autoComplete="off"
                  type="number"
                  className="py-1 px-2 outline-none border-b w-full  border-gray rounded-md"
                  placeholder="2 %"
                  value={formData.discount}
                  name="discount"
                  onChange={handleFormChange}
                />
              </div>
  
             
              <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md">Experience</label>
                </div>
                <Input
                autoComplete="off"
                  required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder=""
                  value={formData.experience}
                  name="experience"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "147px" }}>
                  <label className="text-md">Education</label>
                </div>
                <Input
                autoComplete="off"
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder=""
                  value={formData.education}
                  name="education"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md">Email</label>
                </div>
                <Input
                autoComplete="off"
                  type="email"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="jhon@abc.com"
                  value={formData.email}
                  name="email"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "147px" }}>
                  <label className="text-md">Password</label>
                </div>
                <Input.Password
                autoComplete="off"
                  minLength='6'
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="password"
                  value={formData.password}
                  name="password"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "170px" }}>
                  <label className="text-md">phone</label>
                </div>
                <Input
                 autoComplete="off"
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="444-222-444"
                  value={formData.phone}
                  name="phone"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div >
                  <label className="text-md">Gender</label>
                </div>
                <div>
                <Select
                    className="w-full rounded-md text-black"
                  name="gender"
                  placeholder="Gender"
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
                <div style={{ width: "170px" }}>
                  <label className="text-md">Working At</label>
                </div>
                <Input
                 autoComplete="off"
                  required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="working at"
                  value={formData.workingAt}
                  name="workingAt"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
                <div style={{ width: "147px" }}>
                  <label className="text-md">Address</label>
                </div>
                <Input
                 autoComplete="off"
                  required
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Address"
                  value={formData.address}
                  name="address"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-md">Latitude</label>
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
            <div className="col-span-6 ">
              <div style={{ width: "147px" }}>
                <label className="text-md">Longitude</label>
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
              <div className="col-span-12  ">
                <div style={{ width: "170px" }}>
                  <label className="text-md ">Details</label>
                </div>
                <div className="  w-full">
                  <TextArea
                    rows="3"
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
                      return e;
                    }
                    setImgUrl(e.file);
                    console.log(e.file)
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
            key={data?.id}
          />
        </div>
      </div>
    );
  };
  
  export default Index;
  