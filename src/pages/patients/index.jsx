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

import {
  UserOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { Modal, Form, Input, Button, Upload, Radio, Select, Image } from "antd";
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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
import { BASE_URL } from "@/services/endpoints";
import axios from "axios";
import { typescript } from "../../../next.config";
import { addRehab, deleteRehab, deleteUser, updateuser, userSignup } from "@/services";
import { convertEmptyStringToNull } from "@/lib/commonfunction";
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
    type: null,
    role: null,
    full_name: null,
    email: null,
    password: null,
    confirmPassword: null,
    description: null,
    discount: null,
    address: null,
    city: null,
    phone: null,
    is_rehab_employee: null,
    is_rehab_admin: null,
    rehab: null,
    is_super_admin: null,
    availability: null,
    details: null,
    dob: null,
    education: null,
    experience: null,
    gender: "male",
    hospital: null,
    emergency: null,
    perHour: null,
    perDay: null,
    images: {
      url: "",
      name: "",
    },
  });
  const [userData, setUserdata] = useState([])

  let getuserdata = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        authorization: `Bearer ${token}`,
      };
      // let data = {
      //   page: 1, 
      //   limit: 20, 
      // };
      let url = `${BASE_URL}/user/getUserByType`;
      let body = {
        page: 1,
        limit: 20,
        type: "Individual",
        role: "Patient"
      }
      // const userCount = await axios.get(url, data,{ headers });
      const userList = await axios({
        method: 'post',
        url: url,
        data: body
      });
      if (userList.data.userList) {
        setUserdata(userList.data.userList.results);
      }
      else {
        console.log("no rehab Found")
      }

    } catch (error) {
      console.log("err..", error);
      MySwal.hideLoading(); // Assuming MySwal is for a loading indicator
    }
  };
  useEffect(() => {
    getuserdata()
  }, [])
  const handleFormChange = (event) => {
    console.log(event.target)
    const { name, value } = event.target;
    // if (name == "name") {
    //   const val = value?.toLowerCase();
    //   setFormData((prevFormData) => ({ ...prevFormData, [name]: val }));
    // } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    // }
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
          role: 'nurse',
          id: user?.uid
        };
        const usersCollectionRef = collection(db, "users");
        const userDocRef = doc(usersCollectionRef, user.uid);

        setDoc(userDocRef, userData)
          .then(() => {
            imgUrl == "" ? addData("", user?.uid) :
              handleUploadImage(user?.uid);
            console.log("User data saved successfully")
          })
          .catch((error) => {
            console.log("Error saving user data:", error)
          })
      }).catch(() => {
        MySwal.fire({
          icon: 'error',
          // title: 'Oops...',
          text: ' Email already in use',

        })
      })
  }
  const addMutaion = useMutation(createUser, {

    onSuccess: () => {
      console.log("succes");
      queryClient.invalidateQueries(["Nurses"])
    }
  })
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("nenennenenenenen", formData)
      let params = convertEmptyStringToNull(formData)
      params['type'] = "Individual"
      params["role"] = "Patient"
      if (!editData) {
        await userSignup(params)
          .then((res) => {
            if (res.data.new_rehab) {
              setVisible(false);
              getuserdata()
              MySwal.fire({
                icon: "success",
                // title: 'Oops...',
                text: "Nurse Added Successfully",
              });
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
            handleOk();
            handleCancel()
          });
      } else {
        console.log("i am ok")
        await updateuser(params)
          .then((res) => {
            if (res.data) {
              setVisible(false);
              getuserdata()
              MySwal.fire({
                icon: "success",
                // title: 'Oops...',
                text: "User Updated Successfull",
              });
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
            handleOk();
            handleCancel()
          });
      }
    } catch (error) {
      console.log(error)
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response,
      });
    }
  };

  const deleteUserdata = async (e) => {
    console.log(e);
    try {
      await deleteUser(e)
        .then((res) => {
          if (res.data) {
            setVisible(false);
            getuserdata()
            MySwal.fire({
              icon: "success",
              // title: 'Oops...',
              text: "User Deleted Successful",
            });
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
          handleOk();
          handleCancel()
        });

    } catch (err) {
      console.log(err);
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
        images: { url: imageUrl ? imageUrl : "", name: imgUrl !== "" ? imgUrl.uid : "" },

      });
      queryClient.invalidateQueries(["Nurses"]);
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: ' Data added Successfull',

      })
      setImgUrl("")
      setBtnAdd("primary");
      handleCancel();
      // router.reload("/nurses");



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
  const updateDocData = async (docs) => {

    try {
      if (inUpdate) {
        await updateDoc(doc(db, "nurses", formData.id), {
          images: { url: docs, name: imgUrl.uid },
        });
      }
      handleCancel()
      queryClient.invalidateQueries(["Nurses"])
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: 'Edited Successfull',

      })
      setInUpdate(false);

      handleOk();
      setEditData(false);


    }
    catch (error) {
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
  const deleteDocData = async (e) => {
    try {
      const res = await deleteDoc(doc(db, "nurses", e.id));
      queryClient.invalidateQueries(["Nurses"]);
      console.log(res)
      MySwal.fire({
        icon: 'success',
        // title: 'Oops...',
        text: 'Deleted ',

      })
    } catch (error) {
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

  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "nurses");
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
  const { isLoading, data, error } = useQuery(["Nurses"], fetchData, {
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
      type: null,
      role: null,
      full_name: null,
      email: null,
      password: null,
      confirmPassword: null,
      description: null,
      discount: null,
      address: null,
      city: null,
      phone: null,
      is_rehab_employee: null,
      is_rehab_admin: null,
      rehab: null,
      is_super_admin: null,
      availability: null,
      details: null,
      dob: null,
      education: null,
      experience: null,
      gender: "male",
      hospital: null,
      emergency: null,
      perHour: null,
      perDay: null,
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
            src={record.images ? record.images.url : ''}
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
        let short = record.full_name;
        return record?.full_name ? (
          <div className="flex items-center w-[160px] justify-center space-x-2">
            <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.full_name ? short.slice(0, 50) : "NA"}
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
            {record.gender == "male" ?
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
          <span className="text-base font-poppins font-medium">Availability </span>
        </div>
      ),
      dataIndex: "provider",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return record?.gender ? (
          <div className="flex items-center justify-center  space-x-2">
            {record?.availability == "" ? (
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
            {record.fees + "" + "$"}
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
          <span className="text-base font-poppins font-medium">Specialization</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record?.role}
            </span>
          }
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="flex items-center space-x-4 justify-center w-[160px]">
    //       <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
    //       <span className="text-base font-poppins font-medium">Medial Registation No</span>
    //     </div>
    //   ),
    //   dataIndex: "payment",
    //   sorter: (a, b) => a.age - b.age,
    //   render: (_, record) => (
    //     <div className="w-full flex items-center  justify-center">
    //       {
    //         <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
    //           {record?.rgNo}
    //         </span>
    //       }
    //     </div>
    //   ),
    // },
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
          <span className="text-base font-poppins font-medium">
            Working at
          </span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center">
          {
            <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
              {record.hospital}
            </span>
          }
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="flex items-center space-x-4 justify-center w-[160px]">
    //       <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
    //       <span className="text-base font-poppins font-medium">Latitude</span>
    //     </div>
    //   ),
    //   dataIndex: "payment",
    //   sorter: (a, b) => a.age - b.age,
    //   render: (_, record) => (
    //     <div className="w-full flex items-center  justify-center">
    //       {
    //         <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
    //           {record.lat}
    //         </span>
    //       }
    //     </div>
    //   ),
    // },
    // {
    //   title: (
    //     <div className="flex items-center space-x-4 justify-center w-[160px]">
    //       <Image src={"/images/sort.svg"} width={20} height={20} style={{}} />
    //       <span className="text-base font-poppins font-medium">Longitude</span>
    //     </div>
    //   ),
    //   dataIndex: "payment",
    //   sorter: (a, b) => a.age - b.age,
    //   render: (_, record) => (
    //     <div className="w-full flex items-center  justify-center">
    //       {
    //         <span className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[160px]  py-1">
    //           {record.long}
    //         </span>
    //       }
    //     </div>
    //   ),
    // },
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
                        deleteUserdata(record)
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
        <h1 className="font-semibold font-barlow text-2xl ml-6">Patients</h1>
        <button
          className=" bg-[#1A3578] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded "
          onClick={() => {
            setEditData(false);
            showModal();
          }}
        >
          + Add patient
        </button>
      </div>
      <Modal
        open={visible}
        title="Add nurses"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      // style={{overflowY:"scroll"}}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-12 gap-x-4 gap-y-1">
            <div className=" w-full  col-span-6  ">
              <div style={{ width: "170px" }}>
                <label className="text-md   ">Name</label>
              </div>

              <Input
                autoComplete="off"
                type="text"
                required
                className="py-1 px-2 w-full outline-none border-b  border-gray rounded-md"
                placeholder="Enter Title"
                value={formData.full_name}
                name="full_name"
                onChange={handleFormChange}
              />
            </div>
            {/* <div className="col-span-6 ">
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
            </div> */}
            {/* <div className="col-span-6 ">
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
            </div> */}
            <div className=" col-span-6 w-full md:col-span-6">
              <div style={{ width: "170px" }}>
                <label className="text-md">Fees/Day</label>
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
            <div className=" col-span-6 md:col-span-6">
              <div style={{ width: "170px" }}>
                <label className="text-md">Fees/Hour</label>
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
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-md">Discount</label>
              </div>
              <Input
                autoComplete="off"
                type="number"
                className="py-1 px-2 outline-none border-b w-full  border-gray rounded-md"
                placeholder="2%"
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
                placeholder="Experience"
                value={formData.experience}
                name="experience"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="text-md">Education</label>
              </div>
              <Input
                autoComplete="off"
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
              <div style={{ width: "170px" }}>
                <label className="text-md">Password</label>
              </div>
              <Input.Password
                autoComplete="off"

                minLength='6'
                className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                placeholder="******"
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
            <div style={{ width: "170px" }}>
                <label className="text-md">Gender</label>
              </div>
                  <select
                    className="  py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    placeholder="Gender"
                  >
                    <option defaultChecked className="py-2" value="male">
                      Male
                    </option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
            <div className="col-span-6  ">
              <div style={{ width: "170px" }}>
                <label className="">Working At</label>
              </div>
              <Input
                autoComplete="off"
                required
                type="text"
                className=" outline-none w-full border-b  border-gray rounded-md"
                placeholder="working at"
                value={formData.hospital}
                name="hospital"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="">Address</label>
              </div>
              <Input
                autoComplete="off"
                required
                type="text"
                className=" outline-none w-full border-b  border-gray rounded-md"
                placeholder="Address"
                value={formData.address}
                name="address"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className="">City</label>
              </div>
              <Input
                autoComplete="off"
                required
                type="text"
                className=" outline-none w-full border-b  border-gray rounded-md"
                placeholder="Address"
                value={formData.city}
                name="city"
                onChange={handleFormChange}
              />
            </div>
            <div className="col-span-6 ">
              <div style={{ width: "170px" }}>
                <label className=""> Availability Yes/No
                </label>
              </div>
              <Input
                autoComplete="off"
                required
                type="text"
                className=" outline-none w-full border-b  border-gray rounded-md"
                placeholder="Address"
                value={formData.availability}
                name="availability"
                onChange={handleFormChange}
              />
            </div>
            {/* <div className="col-span-6 ">
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
              <div style={{ width: "170px" }}>
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
            </div> */}
            <div className="col-span-12  ">
              <div style={{ width: "180px" }}>
                <label className=" ">Details</label>
              </div>
              <div className="  w-full">
                <TextArea
                  rows="2"
                  type="text"
                  className="py-1 px-2 outline-none w-full border-b  border-gray rounded-md"
                  placeholder="Enter Details Here"
                  value={formData.description}
                  name="description"
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

      <div className="">
        <Table
          columns={columns}
          dataSource={userData}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default Index;
