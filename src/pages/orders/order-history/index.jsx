import { Table, Avatar, Tag, Menu } from "antd";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { UserOutlined, MoreOutlined,CloseCircleOutlined ,CheckCircleOutlined  } from "@ant-design/icons";
const Index = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
console.log(Menu,'menue')
  const items =[
    {
      label:<label className="text-green-300 ">Accept</label>,
      key:"accept",
    
    },
    {
      label:<label className="text-red-300 ">Reject</label>,
      key:"reject",
     
    }
  ]
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
      payment: "Paid",
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
      service: "Physio",
    },
    {
      key: "3",
      name: "John Brown",
      no: 3,
      status: "New",
      payment: "Paid",
      provider: "John Doe",
      date: "13 Spt 2023",
      service: "Aya",
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
    {
      key: "5",
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
    <div className="flex flex-col bg-white space-y-6">
      <h1 className="font-semibold font-barlow text-2xl"> Orders History</h1>
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
