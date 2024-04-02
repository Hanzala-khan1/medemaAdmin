import { PieChartOutlined, HomeFilled, SettingFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const routes = [
  {
    path: "/",
    icon: <Image src={'/images/home.svg'} width={12} height={12} />,
    title: "Dashboard",
    roles: ["admin", ],
  },
  {
    path: "/orders/new-orders",
    icon: <Image src={'/images/new_order_icon.svg'} width={12} height={12} />,
    title: "New orders",
    roles: ["admin", ],

  },
  // {
  //   path: "/orders/order-history",
  //   icon: <Image src={'/images/order_history_icon.svg'} width={12} height={12} />,
  //   title: "Order history",
  //   roles: ["admin"],
  // },
  {
    path: "/orders/completed",
    icon: <Image src={'/images/completed_icon.svg'} width={12} height={12} />,
    title: "Completed",
    roles: ["admin",],
  },
  {
    path: "/orders/cancelled",
    icon: <Image src={'/images/cancelled_icon.svg'} width={12} height={12} />,
    title: "Cancelled",
    roles: ["admin"],
  },
  {
    path: "/orders/accepted",
    icon: <Image src={'/images/cancelled_icon.svg'} width={12} height={12} />,
    title: "Accepted",
    roles: ["admin"],
  },
  {
    path: "/users",
    icon: <Image src={'/images/users_icon.svg'} width={12} height={12} />,
    title: "Users",
    roles: ["admin"],
 
  },
  {
    path: "/doctors",
    icon: <Image src={'/images/doctors_icon.svg'} width={12} height={12} />,
    title: "Doctors",
    roles: ["admin"],
  },
  {
    path: "/nurses",
    icon: <Image src={'/images/nurses_icon.svg'} width={12} height={12} />,
    title: "Nurses",
    roles: [],
  },
  {
    path: "/physio",
    icon: <Image src={'/images/nurses_icon.svg'} width={12} height={12} />,
    title: "Physio",
    roles: ["admin"],
  },
  {
    path: "/aya",
    icon: <Image src={'/images/nurses_icon.svg'} width={12} height={12} />,
    title: "Aya",
    roles: ["admin"],
  },
  {
    path: "/patients",
    icon: <Image src={'/images/patients_icon.svg'} width={12} height={12} />,
    title: "Patients",
    roles: ["admin"],
  },
  {
    path: "/rehab",
    icon: <Image src={'/images/patients_icon.svg'} width={12} height={12} />,
    title: "Rehab Center",
    roles: ["admin"],
  },
  {
    path: "/analysis",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Analysis",
    roles: ["admin"],
  },
  {
    path: "/expert-category",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Experts Category",
    roles: ["admin"],
  },
  {
    path: "/experts",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Experts",
    roles: ["admin"],
  },
  {
    path: "/expert-doctor",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Expert Doctors",
    roles: ["admin"],
  },
  {
    path: "/rehab-doctors",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Rehab Doctors",
    roles: ["admin"],
  },
  {
    path: "/chat",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Chat",
    roles: ["admin"],
  },
  {
    path: "/messages",
    icon: <Image src={'/images/analysis_icon.svg'} width={12} height={12} />,
    title: "Messages",
    roles: ["admin"],
  },
  {
    path: "/rehab-order",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "New orders",
    roles: ['rehab'],
  },
  {
    path: "/rehab-messages",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "Emergency Messages ",
    roles: ['rehab'],
  },
];

export default routes;
