import {
  Table,
  Avatar,
  Tag,
  Menu,
  Dropdown,
  Alert,
  Spin,
  Popconfirm,
  Select,
} from "antd";
import { useState } from "react";
import avatar from "../../../public/images/user.png";
import Head from "next/head";
import Image from "next/image";
import {
  UserOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { Modal, Form, Input, Button, Upload, Radio } from "antd";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const { TextArea } = Input;

const Index = () => {
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
  const [arr, setarr] = useState('');
  const [inUpdate, setInUpdate] = useState(false);
  const MySwal = withReactContent(Swal)
  var previewArr = [];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "expert",
    category: "cardiology",
    insurance:""
  });
const queryClient=useQueryClient()
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
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
  const createUser = async () => {
    createUserWithEmailAndPassword(auth, formData?.email, formData?.password)
    .then((userCredential) => {
      const user = userCredential?.user;

      const userData = {
        name: formData?.name,
        email: formData?.email,
        role: 'expert'
      };
      const usersCollectionRef = collection(db, "users");
      const userDocRef = doc(usersCollectionRef, user?.uid);
      setDoc(userDocRef, userData)
      .then(() => {
        addData(user?.uid)
        console.log("Experts data saved successfully")
      })
      .catch((error) => {
        console.log("Error saving user data: ", error)
      })
    })
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      updateData();
    } else {
      // addData();
      createUser()
    }
  };
  const delteImage = async () => {
    const desertRef = ref(storage, `expert/${imgName}`);

    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      setPreview("");
      setImgName("");
      setBtnPre(<span>Deleted</span>);
      await updateDoc(doc(db, "expert", formData.id), { images: {} });
    } catch (err) {
      console.log(err);
    }
  };
  const changeImage = async () => {
    const desertRef = ref(storage, `expert/${formData.images.name}`);
    try {
      const res = await deleteObject(desertRef);
      console.log(res, "res");
      handleUploadImage();
      await updateDoc(doc(db, "expert", res.id), {
        images: { url: imgUrl, name: imgUrl.name },
      });
      alert("hello");
    } catch (err) {
      console.log(err);
    }
  };
  const addData = async (id) => {
    // setBtnAdd("disable");
    // const url = imageUrl;
    const newCityRef = collection(db, "expert");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData, auth_id: id
      });
      console.log(res.id);

      await updateDoc(doc(db, "expert", res.id), {
        id: res.id,
      });
      setAlertType("success");
      setAlertText("Data Added SuccessFully");
      setBtnAdd("primary");
      queryClient.invalidateQueries(["expert"]);
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data added Successfull',
   
      })
      handleCancel();
      setVisibleAlert(true);
   
      handleOk();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const updateData = async (docs) => {
    const newCityRef = collection(db, "expert");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      await updateDoc(doc(db, "expert", formData.id), { ...formData });

      setAlertType("success");
      setAlertText("Data Added SuccessFully");
      setInUpdate(false);
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 1000);
      handleOk();
      setEditData(false);
      queryClient.invalidateQueries(["expert"]);
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data edited  Successfull',
   
      })
      handleCancel();
      setVisibleAlert(true);
   
      handleOk();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteData = async (e) => {
    console.log(e);
    try {
      const res = await deleteDoc(doc(db, "expert", e.id));
      console.log(res);
      setAlertType("error");
      setAlertText("Data Deleted SuccessFully");
      queryClient.invalidateQueries(["expert"]);
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data delted successfully',
   
      })
      handleCancel();
      setVisibleAlert(true);
   
      handleOk();
      setLoading(false);
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategory = async () => {
    let arr = [];
    const dbRef = collection(db, "expert_categories");
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
  const { isLoading, data, error } = useQuery(
    ["expert_categories"],
    fetchCategory,
    {
      staleTime: 60000,
    }
  );
  const fetchInsurance = async () => {
    let arr = [];
    const dbRef = collection(db, "insurance");
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
  const { isLoading:insuranceLoading, data:insuranceData  } = useQuery(
    ["Insurance"],
    fetchInsurance,
    {
      staleTime: 60000,
    }
  );

  function handleChange(value) {
    console.log(value);
    setFormData((e)=>({...e,category:value}))
  
  }
   function handleInsuranceChange(value) {
    console.log(value);
    setFormData((e)=>({...e,insurance:value}))
  
  }
 
  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "expert");
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
  const expertData = useQuery(["expert"], fetchData, {
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
      category: "cardiology",
    });
    setPreview("");
    setImgName("");
    setVisible(false);
  };

  const onFinish = (values) => {
    console.log(values);
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
      <Button
        className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
        onClick={delteImage}
      >
        X
      </Button>
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
      <Button
        className="-ml-8 h-6 w-4 text-center flex justify-center items-center  text-red-800"
        onClick={() => {
          setPreview("");
        }}
      >
        X
      </Button>
    </div>
  );

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
      render: (_, record, index) => (
        <div className="w-full flex items-center justify-center">
          <span className="text-base font-poppins font-medium text-[#474747]">
            {index + 1}
          </span>
        </div>
      ),
    },

    {
      title: (
        <div className="flex items-center w-[260px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium"> Name </span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.name;
        return record?.name ? (
          <div className="flex items-center w-[260px] justify-center space-x-2">
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
        <div className="flex items-center w-[260px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium"> Email </span>
        </div>
      ),
      dataIndex: "email",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.email;
        return record?.email ? (
          <div className="flex items-center w-[260px] justify-center space-x-2">
            <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.email ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center w-[260px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium"> Category </span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.category;
        return record?.category ? (
          <div className="flex items-center w-[260] justify-center space-x-2">
            {/* <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.category ? short.slice(0, 50) : "NA"}
            </span> */}
            <ul>
            {record?.category ?
               record.category.map((doc,index)=>{
                return(
                  <li key={index} className="capitalize"> {doc}</li>
                )
               })
            :""
          }
            </ul>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center w-[260px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium"> Insurance </span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.insurance;
        return record?.insurance ? (
          <div className="flex items-center w-[260] justify-center space-x-2">
            {/* <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.category ? short.slice(0, 50) : "NA"}
            </span> */}
            <ul>
            {record?.insurance ?
               record.insurance.map((doc,index)=>{
                return(
                  <li key={index} className="capitalize"> {doc}</li>
                )
               })
            :""
          }
            </ul>
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
        <h1 className="font-semibold font-barlow text-lg md:text-2xl md:ml-6">
          Expert
        </h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-1 md:py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add Expert
        </button>
      </div>
      <Modal
        open={visible}
        title="Add Expert "
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        
        // bodyStyle={{backgroundColor:"red",borderRadius:"20px"}}
    
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12  gap-x-4 gap-y-3 ">
            <div className="col-span-6 flex flex-col items-start ">
              <div style={{ width: "220px" }}>
                <label className="text-lg"> Name</label>
              </div>

              <Input
                type="text"
                required
                className="py-1 px-2 outline-none border-b w-[250px] mt-1 border-gray rounded-md"
                placeholder="Enter Name"
                value={formData.name}
                name="name"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 flex flex-col ">
              <div style={{ width: "220px" }}>
                <label className="text-lg"> Email</label>
              </div>

              <Input
                type="text"
                required
                className="py-1 px-2 outline-none border-b w-[250px] mt-1 border-gray rounded-md"
                placeholder="Enter Email"
                value={formData.email}
                name="email"
                onChange={handleFormChange}
              />
            </div>

            <div className="col-span-6 flex flex-col ">
              <div style={{ width: "220px" }}>
                <label className="text-lg">Category Name</label>
              </div>
              <Select
                mode="multiple"
               placeholder="select category"
                onChange={handleChange}
                className="mt-2 w-[250px]"
                value={formData.category}
                // value={formData.category}
                tokenSeparators={[","]}
              >
                {
                      
                     
                      !isLoading ?
                      data.map((dataCat,index)=>{
                        return( 
                            index==0?
                            <Option key={dataCat.name}>{dataCat.name}</Option>
                        :
                        <Option  key={dataCat.name}>{dataCat.name}</Option>
                            )
                      })
                      :
                      <option>Loading</option>
                   
                   
                   }
              </Select>
        
            </div>
         
            <div className="col-span-6 flex flex-col ">
              <div style={{ width: "220px" }}>
                <label className="text-lg">Insurance Name</label>
              </div>
              <Select
                mode="multiple"
               placeholder="select Insurance"
                onChange={handleInsuranceChange}
                className="mt-2 w-[250px]"
                value={formData.insurance}
                // value={formData.category}
                tokenSeparators={[","]}
              >
                {
                      
                     
                      !insuranceLoading ?
                      insuranceData?.map((dataCat,index)=>{
                        return( 
                            index==0?
                            <Option key={dataCat.name}>{dataCat.name}</Option>
                        :
                        <Option  key={dataCat.name}>{dataCat.name}</Option>
                            )
                      })
                      :
                      <option>Loading</option>
                   
                   
                   }
              </Select>
        
            </div>

            <div className="col-span-12 flex flex-col ">
              <div style={{ width: "220px" }}>
                <label className="text-lg"> Password</label>
              </div>

              <Input
                type="Password"
                required
                className="py-1 px-2 outline-none border-b w-[250px] mt-1 border-gray rounded-md"
                placeholder="Enter Password"
                value={formData.password}
                name="password"
                onChange={handleFormChange}
              />
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
          <div className="flex justify-center mt-4 col-span-12">
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
          dataSource={expertData.data}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default Index;
