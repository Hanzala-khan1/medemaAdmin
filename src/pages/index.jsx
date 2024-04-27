import TopCard from "@/components/Home/TopCard";
import { Avatar, Select, Table, Tag } from "antd";
import Head from "next/head";
import Image from "next/image";
import { UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/config/firebase";
import { getDocs, collection, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserCount } from "@/services";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import  axios  from "axios";
import { BASE_URL } from "@/services/endpoints";

const Index = () => {
  const [userCount, setUserCount] = useState({})
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    let token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    }
  }, [])

  useEffect(() => {

    userCountData()

  }, []);


  const userCountData = async () => {
    try {
      // MySwal.showLoading();

      const token = localStorage.getItem("token");

      const headers = {
        authorization: `Bearer ${token}`,
      };

      let url = `${BASE_URL}/user/getUsersCount`;

      const userCount = await axios.get(url, { headers });
      if (userCount.data) {
        setUserCount(userCount.data)
      }

      // MySwal.hideLoading();

    } catch (error) {
      console.log("err..", error);
      MySwal.hideLoading();
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-poppins font-medium">#</span>
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
        </div>
      ),
      dataIndex: "no",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center justify-center">
          <span className="text-base font-poppins font-medium text-[#474747]">
            {record.no}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-4">
          <span className="text-base font-poppins font-medium">Date</span>
        </div>
      ),
      dataIndex: "date",
      render: (_, record) => (
        <div className="w-full flex items-center">
          <span className="text-xs font-poppins font-medium text-[#474747]">
            {record.date}
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
            style={{ marginLeft: "0px" }}
          />
          <span className="text-base font-poppins font-medium">User</span>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return record?.name ? (
          <div className="flex items-center justify-center space-x-2">
            <Avatar
              icon={<UserOutlined />}
              src={
                record?.user?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}${record?.user?.image.url}`
                  : ""
              }
              className="flex items-center justify-center"
            />
            <span className="text-xs font-poppins font-medium text-[#474747]">
              {record?.name}
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
          <span className="text-base font-poppins font-medium">Provider</span>
        </div>
      ),
      dataIndex: "provider",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => {
        return record?.provider ? (
          <div className="flex items-center justify-center  space-x-2">
            <Avatar
              icon={<UserOutlined />}
              src={
                record?.user?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}${record?.user?.image.url}`
                  : ""
              }
              className="flex items-center justify-center "
            />
            <span className=" text-xs font-poppins font-medium text-[#474747]">
              {record?.provider}
            </span>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center  w-[80px] space-x-4">
          <Image
            src={"/images/sort.svg"}
            width={20}
            height={20}

          />
          <span className="text-base font-poppins font-medium">Service</span>
        </div>
      ),
      dataIndex: "service",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className=" flex items-center w-[80px] justify-center">
          <span className="text-base font-poppins font-medium text-[#474747]">
            {record.service}
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
          <span className="text-base font-poppins font-medium">Status</span>
        </div>
      ),
      dataIndex: "status",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center justify-center">
          <Tag
            style={{ background: "rgba(207, 246, 128, 0.46)" }}
            className="mx-auto text-sm font-poppins font-normal text-[black] px-6 py-1"
          >
            {record.status}
          </Tag>
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
          <span className="text-base font-poppins font-medium">Payment</span>
        </div>
      ),
      dataIndex: "payment",
      sorter: (a, b) => a.age - b.age,
      render: (_, record) => (
        <div className="w-full flex items-center  justify-center" >
          {
            record.payment == "Paid" ?
              <Tag
                style={{ background: "#82F68070" }}
                className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[80px] px-4 py-1"
              >
                {record.payment}
              </Tag>
              :
              <Tag
                style={{ background: "rgba(245, 98, 51, 0.47)" }}
                className="mx-auto text-center text-sm font-poppins font-normal text-[black] w-[80px] px-4 py-1"
              >
                {record.payment}
              </Tag>
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
          {
            record.payment == "Paid" ?
              <div className="text-black text-xl">
                <CheckCircleOutlined />
              </div>
              :
              <div className="text-black text-xl">
                <CloseCircleOutlined />
              </div>
          }

        </div>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      no: 1,
      status: "New",
      payment: "UnPaid",
      provider: "John Doe",
      date: "13 Spt 2023",
      service: "Rehab",
    },
    {
      key: "2",
      name: "John Brown",
      no: 2,
      status: "New",
      payment: "UnPaid",
      provider: "John Doe",
      date: "13 Spt 2023",
      service: "Rehab",
    },
    {
      key: "3",
      name: "John Brown",
      no: 3,
      status: "New",
      payment: "UnPaid",
      provider: "John Doe",
      date: "13 Spt 2023",
      service: "Rehab",
    },
    {
      key: "4",
      name: "John Brown",
      no: 4,
      status: "New",
      payment: "UnPaid",
      provider: "John Doe",
      date: "13 Spt 2023",
      service: "Rehab",
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className="flex flex-col  space-y-10">
        <div className="flex flex-col items-start md:flex-row space-y-5 md:space-y-0 md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-barlow font-semibold">Dashboard</h2>
            <span className="text-base font-normal font-poppins">
              Here is your daily Statistics
            </span>
          </div>
          <div className="flex space-x-5">
            <Select
              suffixIcon={
                <Image
                  src={"/images/dropdown.svg"}
                  width={7.18}
                  height={4.59}
                />
              }
              style={{
                width: "5rem",
                boxShadow: "0px 2px 24px rgba(0, 0, 0, 0.12)",
              }}
              variant="bordered"
              className="text-xs font-normal"
              placeholder="Paid"
              options={[
                { value: "Paid", label: "Paid" },
                { value: "UnPaid", label: "UnPaid" },
              ]}
            />
            <Select
              suffixIcon={
                <Image src={"/images/filter.svg"} width={12} height={13} />
              }
              style={{
                width: "8rem",
                boxShadow: "0px 2px 24px rgba(0, 0, 0, 0.12)",
              }}
              variant="bordered"
              className="text-xs font-normal"
              placeholder="Category"
              options={[
                { value: "Paid", label: "Paid" },
                { value: "UnPaid", label: "UnPaid" },
              ]}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          <TopCard
            title="Doctors"
            number={userCount? userCount.doctors:"0"}
            icon="/images/top1.svg"
            bg={"#D7E4F1"}
          />
          <TopCard
            title="Aya"
            number={userCount? userCount.aya:"0"}
            icon="/images/top2.svg"
            bg={"#E0F1E0"}
          />
          <TopCard
            title="Nurses"
            number={userCount? userCount.nurses:"0"}
            icon="/images/top3.svg"
            bg={"#FDDFDB"}
          />
          <TopCard
            title="Users"
            number={userCount? userCount.rehab:"0"}
            icon="/images/top4.svg"
            bg={"#FDEFDC"}
          />
          <TopCard
            title="Avaiable Experts"
            number={userCount? userCount.users:"0"}
            icon="/images/top5.svg"
            bg={"#D7E4F1"}
          />
          <TopCard
            title="Online Experts"
            number="150"
            icon="/images/top6.svg"
            bg={"#E0F1E0"}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <h1 className="font-semibold font-barlow text-2xl">New Requests</h1>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            id="newOrders"
            scroll={{ x: 900 }}
          />
        </div>
      </main>
    </>
  );
};

export default Index;
