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
  let previewArr = [];
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    description: "",
    images: {
      url: "",
      name: "",
    },
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };


  const handleUploadImage = async (uid) => {
    setLoading(true);
    const imgRef = ref(storage, `categories/${imgUrl ? imgUrl.uid : ""}`);

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

 const addMutaion = useMutation(handleUploadImage,{
  
  onSuccess:()=>{
    console.log("succes");
    queryClient.invalidateQueries(["Categories"])
  }
 })
 
  const delteImage = async () => {
    const desertRef = ref(storage, `categories/${imgName}`);

    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      setPreview("");
      setImgName("");
      setBtnPre(<span>Deleted</span>);
      await updateDoc(doc(db, "categories", formData.id), { images: {} });
    } catch (err) {
      console.log(err);
    }
  };

  const addData = async (imageUrl, uid) => {
    // setBtnAdd("disable");
    const url = imageUrl;
    const newCityRef = collection(db, "categories");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData,
      });
      console.log(res.id);

      await updateDoc(doc(db, "categories", res.id), {
        id: res.id,
        images: { url: imageUrl?imageUrl:"", name:imgUrl!==""?imgUrl.uid:"" },
      
      });
      queryClient.invalidateQueries(["Categories"]);
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data added Successfull',
   
      })
      setImgUrl("")
      setBtnAdd("primary");
      handleCancel();
      // router.reload("/categories");
   

   
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
       await updateDoc(doc(db, "categories", formData.id), {
         images: { url: docs, name: imgUrl.uid },
       });
     }
     handleCancel()
     queryClient.invalidateQueries(["Categories"])
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
    const newCityRef = collection(db, "categories");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      if (inUpdate) {
        const desertRef = ref(storage, `categories/${formData.images.name}`);
        const deleteImg = await deleteObject(desertRef);
        // console.log(deleteImg);
      }
      await updateDoc(doc(db, "categories", formData.id), { ...formData });
   
     
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
      const res = await deleteDoc(doc(db, "categories", e.id));
      queryClient.invalidateQueries(["Categories"]);
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
      const desertRef = ref(storage, `categories/${e.images.name}`);
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
 
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      handleUploadImage();
    } else {
    handleUploadImage();
      // createUser();
      // handleUploadImage();
    }
  };
  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "categories");
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
  const { isLoading, data, error } = useQuery(["Categories"], fetchData, {
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
      id: "",
      description: "",
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
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Description</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.description;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.description ? short.slice(0, 50) : "NA"}
            </span>
          </div>
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
               
                    <Button onClick={() => {
                      deleteData(record);
                    }}  danger>Delete</Button>
                
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
        <h1 className="font-semibold font-barlow text-2xl ml-6">Categories</h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add Category
        </button>
      </div>
      <Modal
        open={visible}
        title="Add Category"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        // style={{overflowY:"scroll"}}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12 gap-x-4 gap-y-3">
            <div className="col-span-12 flex space-x-2">
              <div style={{ width: "115px" }}>
                <label className="text-lg   ">Name</label>
              </div>

              <Input
                type="text"
                required
                className="py-2 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="Enter Name"
                value={formData.name}
                name="name"
                onChange={handleFormChange}
              />
            </div>
     

            <div className="col-span-12 flex ">
              <div style={{ width: "185px" }}>
                <label className="text-[17px] ">Description</label>
              </div>
              <div className=" -ml-12 w-full">
                <TextArea
                  rows="2"
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Enter Description Here"
                  value={formData.description}
                  name="description"
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="col-span-12  mt-4">
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

            {
            loading? <div className="h-24 w-24 flex justify-center"><Spin/></div> :  (          
            editData ? (
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
            ))}
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
