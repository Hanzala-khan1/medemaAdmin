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
  import { db, storage } from "@/config/firebase";
  import {
    addDoc,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";
  import { useQuery,useQueryClient } from "@tanstack/react-query";
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
    const [arr, setarr] = useState([]);
    const [inUpdate, setInUpdate] = useState(false);
    const MySwal = withReactContent(Swal);
    var previewArr = [];
    const [formData, setFormData] = useState({
      name: "",
   
    });
  const queryClient =useQueryClient()
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
    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (editData) {
        updateData();
      } else {
        addData();
      }
    };
    const delteImage = async () => {
      const desertRef = ref(storage, `expert_categories/${imgName}`);
  
      try {
        const res = await deleteObject(desertRef);
        console.log(res, "res");
        setPreview("");
        setImgName("");
        setBtnPre(<span>Deleted</span>);
        await updateDoc(doc(db, "expert_categories", formData.id), { images: {} });
      } catch (err) {
        console.log(err);
      }
    };
    const changeImage = async () => {
      const desertRef = ref(storage, `expert_categories/${formData.images.name}`);
      try {
        const res = await deleteObject(desertRef);
        console.log(res, "res");
        handleUploadImage();
        await updateDoc(doc(db, "expert_categories", res.id), {
          images: { url: imgUrl, name: imgUrl.name },
        });
        alert("hello");
      } catch (err) {
        console.log(err);
      }
    };
    const addData = async (imageUrl) => {
      // setBtnAdd("disable");
      const url = imageUrl;
      const newCityRef = collection(db, "expert_categories");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
        const res = await addDoc(newCityRef, {
          ...formData,
        });
        console.log(res.id);
  
        await updateDoc(doc(db, "expert_categories", res.id), {
          id: res.id,
        });
        setAlertType("success");
        setAlertText("Data Added SuccessFully");
        setBtnAdd("primary");
        queryClient.invalidateQueries(["expert_categories"])
        handleCancel();
        MySwal.fire({
          icon: 'success',
          // title: 'Oops...',
          text: ' Data added Successfull',
     
        })
   
    
        handleOk();
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false)
        handleCancel()
      }
    };
    const updateData = async (docs) => {
      const newCityRef = collection(db, "expert_categories");
      // const {title,fees,address,powerAvail,doctorAvail,}=formData
  
      try {
       
        await updateDoc(doc(db, "expert_categories", formData.id), { ...formData });
      
        setAlertType("success");
        setAlertText("Data Added SuccessFully");
        setInUpdate(false);
        setVisibleAlert(true);
        setTimeout(() => {
          setVisibleAlert(false);
        }, 1000);
        handleOk();
        setEditData(false);
        queryClient.invalidateQueries(["expert_categories"])
        handleCancel();
        MySwal.fire({
          icon: 'success',
          // title: 'Oops...',
          text: ' Edited Data Successfully',
     
        })
   
      } catch (err) {
        console.log(err);
        setLoading(false);
        handleCancel();
      }
    };
    const deleteData = async (e) => {
      console.log(e);
      try {

        const res = await deleteDoc(doc(db, "expert_categories", e.id));
        console.log(res);
        setAlertType("error");
        setAlertText("Data Deleted SuccessFully");
        queryClient.invalidateQueries(["expert_categories"])
        handleCancel();
        MySwal.fire({
          icon: 'success',
          // title: 'Oops...',
          text: ' Data deleted',
     
        })
        setVisibleAlert(true);
        setTimeout(() => {
          setVisibleAlert(false);
        }, 5000);
      } catch (err) {
        console.log(err);
        
      }
    };

  
    const fetchData = async () => {
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
    const { isLoading, data, error } = useQuery(["expert_categories"], fetchData, {
      staleTime: 60000,
    });
    console.log(isLoading, data);
  
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
          <div className="flex items-center w-[260px] justify-center space-x-4">
            <Image
              src={"/images/sort.svg"}
              width={20}
              height={20}
              style={{ marginLeft: "0px" }}
            />
            <span className="text-base font-poppins font-medium"> Category Name</span>
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
    console.log(typeof headings.length.toString());
    return (
      <div className="flex flex-col bg-white space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold font-barlow text-2xl ml-6">Experts Categories</h1>
          <button
            className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
            onClick={() => {
              setEditData(false);
              showModal();
            }}
          >
            + Add category
          </button>
        </div>
        <Modal
          open={visible}
          title="Add Expert Category"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
          width={450}
          // style={{overflowY:"scroll"}}
        >
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-12 gap-x-4 gap-y-3">
              <div className="col-span-12 flex space-x-2">
                <div style={{ width: "250px" }}>
                  <label className="text-lg">Category Name</label>
                </div>
  
                <Input
                  type="text"
                  required
                  className="py-1 px-2 outline-none border-b  border-gray rounded-md"
                  placeholder="Enter Name"
                  value={formData.name}
                  autoComplete="off"
                  name="name"
                  onChange={handleFormChange}
                />
              </div>
              {/* <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Fees</label>
                </div>
                <input
                  required
                  type="number"
                  className="py-2 px-2 w-full outline-none border-b  border-gray rounded-md"
                  placeholder="14$"
                  value={formData.fees}
                  name="fees"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Discount</label>
                </div>
                <input
                  type="number"
                  className="py-2 px-2 outline-none border-b w-full  border-gray rounded-md"
                  placeholder="2$"
                  value={formData.discount}
                  name="discount"
                  onChange={handleFormChange}
                />
              </div> */}
  
              {/* <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Address</label>
                </div>
                <input
                  required
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Addres"
                  value={formData.address}
                  name="address"
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-6 flex space-x-2">
                <div style={{ width: "170px" }}>
                  <label className="text-lg">Experience</label>
                </div>
                <input
                  required
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder=""
                  value={formData.experience}
                  name="experience"
                  onChange={handleFormChange}
                />
              </div> */}
              {/* <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Education</label>
                </div>
                <input
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder=""
                  value={formData.education}
                  name="education"
                  onChange={handleFormChange}
                />
              </div> */}
          
          
              {/* <div className="col-span-6 flex space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-lg">Gender</label>
                </div>
                <select
                  className="w-[220px] px-2 rounded-md text-black"
                  name="gender"
                  onChange={handleFormChange}
                >
                  <option defaultChecked value="male">
                    Male
                  </option>
                  <option value="female">Female</option>
                </select>
              </div> */}
              {/* <div className="col-span-6 flex items-center space-x-2">
                <div style={{ width: "147px" }}>
                  <label className="text-sm">Working At</label>
                </div>
                <input
                  required
                  type="text"
                  className="py-2 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="working at"
                  value={formData.workingAt}
                  name="workingAt"
                  onChange={handleFormChange}
                />
              </div> */}
          
{/*   
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
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    {uploadButton}
                  </Upload>
                </Form.Item>
                <Form.Item className=" ml-14 -mt-4">
                  <Button
                    onClick={() => {
                      changeImage();
                    }}
                  >
                    {btnPre}
                  </Button>
                </Form.Item>
              </div> */}
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
  