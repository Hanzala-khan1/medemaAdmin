import { Table, Avatar, Tag, Menu, Dropdown, Alert, Spin, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import avatar from "../../../../public/images/user.png";
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
  query,
  where,
} from "firebase/firestore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useRef } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/endpoints";
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
  const [orderData, SetOrderData] = useState([])
  const MySwal = withReactContent(Swal)
  const [role, setRole] = useState(null)
  const queryClient = useQueryClient()


  let getuserorders = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        authorization: `Bearer ${token}`,
      };

      let url = `${BASE_URL}/user/getAllBookings?status=accepted`;
      let body = {
        page: 1,
        limit: 20,
      }
      // const userCount = await axios.get(url, data,{ headers });
      const orderlist = await axios({
        method: 'get',
        url: url,
        data: body,
        headers: headers
      });
      console.log("ordersordersorders", orderlist.data.bookings.results)
      if (orderlist.data) {
        SetOrderData(orderlist.data.bookings.results);
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
    getuserorders()
  }, [])



  const ChangeBookingStatus = async (status, id) => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        authorization: `Bearer ${token}`,
      };

      let url = `${BASE_URL}/user/changeBookingStatus`;
      let body = {
        status: status,
        bookingId: id,
      }
      // const userCount = await axios.get(url, data,{ headers });
      const orderlist = await axios({
        method: 'post',
        url: url,
        data: body,
        headers: headers
      });
      // SetOrderData(orderlist.data.bookings.results);
      getuserorders()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    setRole(localStorage.getItem("role"))
  }, [])
  const fetchData = async () => {
    let arr = [];
    const dbRef = collection(db, "orders");
    if (localStorage.getItem("role") == "admin") {
      try {

        const querySnapshot = await getDocs(dbRef);

        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
          console.log(new Date(doc.data().Date.seconds).getMonth())
        });
        // console.log(arr,"data")
        return arr;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {

        const querySnapshot = await getDocs(query(dbRef, where("receiverId", "==", localStorage.getItem("id"))));

        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        return arr;
      } catch (error) {
        console.log(error);
      }
    }

  };

  const { isLoading, data, error, } = useQuery(["Orders"], fetchData, {
    refetchOnWindowFocus: "always",

  });
  // console.log({data});
  if (!isLoading) {
    console.log(error)
  }

  const acceptOrder = async (res) => {

    try {
      const rep = await updateDoc(doc(db, "orders", res.id), {
        status: "accepted",


      });
      console.log(rep)

      queryClient.invalidateQueries(['Orders'])
      MySwal.fire({
        icon: 'success',
        text: 'Status Updated',

      })

    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',

      })
      console.log(err)
    }

  }
  const rejectOrder = async (res) => {

    try {
      const rep = await updateDoc(doc(db, "orders", res.id), {
        status: "rejected",

      });
      queryClient.invalidateQueries(['Orders'])
      MySwal.fire({
        icon: 'success',
        text: 'Status Updated',

      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',

      })
      console.log(err)
    }

  }
  const completeOrder = async (res) => {

    try {
      const rep = await updateDoc(doc(db, "orders", res.id), {
        status: "completed",
        payment: "paid"
      });
      queryClient.invalidateQueries(['Orders'])
      MySwal.fire({
        icon: 'success',
        text: 'Status Updated',

      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',

      })
      console.log(err)
    }

  }




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
        <div className="flex items-center w-[180px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium">Type</span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.package;
        return record?.package ? (
          <div className="flex items-center w-[160px] justify-center space-x-2">
            <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.package ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center w-[180px] justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium">Booked By</span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.booked_by.full_name;
        return record?.booked_by.full_name ? (
          <div className="flex items-center w-[160px] justify-center space-x-2">
            <span className="text-sm font-poppins text-clip font-medium text-[#474747]">
              {record.booked_by.full_name ? short.slice(0, 50) : "NA"}
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
          <span className="text-base font-poppins font-medium">Patient Name</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record?.patientName;

        return (
          <div className=" flex items-center w-[160px] justify-center">
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record?.patientName ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Appointment</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record?.patientName;
        let fromDate = new Date(record?.patientDetail?.bookFrom?.seconds * 1000);
        let toDate = new Date(record?.patientDetail?.bookFrom?.seconds * 1000);

        return (
          <div className=" flex flex-col items-center  w-[160px] justify-center">
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              From {record.patientDetail?.bookFrom ? record?.patientDetail?.bookFrom : "NA"}
            </span>
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              To {record.patientDetail?.bookTo ? record?.patientDetail?.bookTo : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Patient Age</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {

        let dobString = record.DOB;
        let dobDate = new Date(dobString);

        let currentDate = new Date();

        let currentYear = currentDate.getFullYear();
        let dobYear = dobDate.getFullYear();

        let patientAge = currentYear - dobYear;


        return (
          <div className=" flex  items-center  w-[160px] justify-center">
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.DOB ? `${patientAge} Years` : "NA"}
            </span>

          </div>
        );
      },
    },

    {
      title: (
        <div className="flex items-center justify-center  w-[280px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Reason for Booking</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.reason_for_booking;

        return (
          <div className=" flex items-center w-[280px] justify-center">
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              {record.reason_for_booking ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[280px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Patient Contact</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.phone;

        return (
          <div className=" flex flex-col items-center w-[280px] justify-center">
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              Phone :  {record.phone ? short.slice(0, 50) : "NA"}
            </span>
            <span className="text-sm   text-clip font-poppins font-medium text-[#474747]">
              {/* {record.description} */}
              Phone2 : {record.alternative_phone ? short.slice(0, 50) : "NA"}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center w-[220px]  justify-center space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}

          />
          <span className="text-base font-poppins font-medium">Patient Gender</span>
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
        <div className="flex items-center justify-center  w-[160px] space-x-4">
          <Image src={"/images/sort.svg"} width={20} height={20} />
          <span className="text-base font-poppins font-medium">Status</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        let short = record.status;

        return (
          <div className=" flex items-center w-[160px] justify-center">

            <span className="text-sm   text-clip font-poppins capitalize font-medium text-[#474747]">
              {/* {record.description} */}
              {record.status ? short.slice(0, 50) : "NA"}
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
          <span className="text-base font-poppins font-medium">Payment</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-[250px] flex items-center justify-center">
          <span

            className={`${record.payment_status !== "unpaid" ? 'bg-green-300' : 'bg-orange'} mx-auto text-sm w-[250px] text-center font-poppins font-normal text-[black] px-6 py-1`}
          >
            {record.payment_status}
          </span>
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="flex items-center space-x-4">
    //       <Image
    //         src={"/images/sort.svg"}
    //         width={20}
    //         height={20}
    //         style={{ marginLeft: "8px" }}
    //       />
    //       <span className="text-base font-poppins font-medium">Action</span>
    //     </div>
    //   ),
    //   render: (_, record) => (
    //     <div className="w-full flex items-center justify-center bg-white text-white">
    //       <Dropdown
    //         menu={{

    //           items: [
    //             {
    //               label: (
    //                 <Button
    //                   className="text-green-300 hover:text-white bg-blue-900 w-full px-4 py-1 rounded-md "
    //                   onClick={() => {
    //                     ChangeBookingStatus("accepted", record._id.toString())
    //                   }}
    //                 >
    //                   Accept
    //                 </Button>
    //               ),
    //               key: "Accept",
    //             },
    //             {
    //               label: (

    //                 <Button className="w-[90px]" onClick={() => {
    //                   ChangeBookingStatus("rejected", record._id.toString())
    //                 }} danger>Reject</Button>

    //                 // className="text-white bg-red-800 w-full px-2 py-1 rounded-md "
    //               ),
    //               key: "Reject",
    //             },
    //             {
    //               label: (

    //                 <Button type="primary" onClick={() => {
    //                   ChangeBookingStatus("completed", record._id.toString())
    //                 }} danger>Complete</Button>

    //                 // className="text-white bg-red-800 w-full px-2 py-1 rounded-md "
    //               ),
    //               key: "Complete",
    //             },
    //           ],
    //         }}
    //         placement="bottomLeft"
    //         theme={"dark"}

    //       >
    //         <Button>
    //           <MoreOutlined />
    //         </Button>
    //       </Dropdown>
    //       {/* <button className="text-2xl hover:text-3xl font-bold " onClick={onClick}>
    //             <MoreOutlined />
    //           </button> */}
    //     </div>
    //   ),
    // },
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
        <h1 className="font-semibold font-barlow text-2xl ml-6">New Orders</h1>

      </div>


      <div className="">
        <Table
          columns={columns}
          dataSource={orderData}
          onChange={onChange}
          id="newOrders"
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
};

export default Index;
