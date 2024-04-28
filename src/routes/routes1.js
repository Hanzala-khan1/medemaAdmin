"use client"
import { PieChartOutlined, HomeFilled, SettingFilled } from "@ant-design/icons";

import Image from "next/image";
import Link from "next/link";




   
 
const routes = [

  {
    path: "/",
    icon: <Image src={"/images/home.svg"} width={12} height={12} />,
    title: "Dashboard",
    roles: ["admin"],
  },
  {
    path: "/orders/new-orders",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "New orders",
    roles: [ "Nurses", "Doctor", "Aya", "PhysioDcotor","RehabAdmin"],
  },
  {
    path: "/UserRequests",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "Users Requests",
    roles: ['admin'],
  },
  // {
  //   path: "/rehab-order",
  //   icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
  //   title: "New orders",
  //   roles: ['RehabAdmin','admin'],
  // },
  {
    path: "/rehab-messages",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "Emergency ",
    roles: ['RehabAdmin','admin'],
  },

  {
    path: "/orders/order-history",
    icon: (
      <Image src={"/images/order_history_icon.svg"} width={12} height={12} />
    ),
    title: "Orders History",
    roles: [ "Nurses", "Doctor", "Aya", "patient", "PhysioDcotor","RehabAdmin",],
    childs: [
      {
        path: "/orders/completed",
        icon: (
          <Image src={"/images/completed_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/orders/completed"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Completed
            </button>
          </Link>
        ),
        roles: [ "admin",  "Nurses", "Doctor", "Aya", "patient", "PhysioDcotor","RehabAdmin"],
      },
      {
        path: "/orders/accepted",
        icon: (
          <Image src={"/images/completed_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/orders/accepted"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Accepted
            </button>
          </Link>
        ),
        roles: [ "admin",  "Nurses", "Doctor", "Aya", "patient", "PhysioDcotor","RehabAdmin",],
      },
      {
        path: "/orders/cancelled",
        icon: (
          <Image src={"/images/cancelled_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/orders/cancelled"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Cancelled
            </button>
          </Link>
        ),
        roles: [ "admin",  "Nurses", "Doctor", "Aya", "patient", "PhysioDcotor","RehabAdmin"],
      },
    
    ],
  },
  {
    path: "/messages",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "Messages",
    roles: ["Doctor",'admin'],
  },
  {
    path: "/chat",
    icon: <Image src={"/images/new_order_icon.svg"} width={12} height={12} />,
    title: "Chat",
    roles: ["Doctor","RehabAdmin"],
  },
 
  {
    path:'/profile',
    icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
    title: "Profile",
    roles: ["admin",  "Nurses", "Doctor", "Aya", "patient", "PhysioDcotor","RehabAdmin"],
  },
  {
    path: "/rehab",
    icon: <Image src={"/images/doctors_icon.svg"} width={12} height={12} />,
    title: "Rehab Center",
    roles: [ "admin"],
  },
  {
    path: "/rehab-users",
    icon: <Image src={"/images/users_icon.svg"} width={12} height={12} />,
    title: "Users",
    roles: ["RehabAdmin"],
    childs: [
      // {
      //   path: "/rehab-doctors",
      //   icon: <Image src={"/images/doctors_icon.svg"} width={12} height={12} />,
      //   label: (
      //     <Link
      //       href="/rehab-doctors"
      //       className="font-normal  text-base font-poppins "
      //     >
      //       <button
      //         className="py-4 text-white px-4 bg-slate-700 "
      //         style={{ backgroundColor: "transparent", border: "none" }}
      //       >
      //         Doctors
      //       </button>
      //     </Link>
      //   ),
      //   roles: ["RehabAdmin"],
      // },
      {
        path: "/rehab-nurses",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/rehab-nurses" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Nurses
            </button>
          </Link>
        ),
        roles: ["admin"],
      },
      {
        path: "/rehab-patient",
        icon: (
          <Image src={"/images/patients_icon.svg"} width={12} height={12} />
        ),
        label: (
          <Link
            href="/rehab-patient"
            className="font-normal  text-base font-poppins "
          >
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Patients
            </button>
          </Link>
        ),
        roles: ["admin" ],
      },
    
      
      {
        path: "/rehab-aya",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/rehab-aya" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Aya
            </button>
          </Link>
        ),
        roles: ["RehabAdmin","admin"],
      },
      {
        path: "/rehab-physio",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/rehab-physio" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Physio
            </button>
          </Link>
        ),
        roles: ["RehabAdmin","admin"],
      },
 
    ],
  },
  {
    path: "/users",
    icon: <Image src={"/images/users_icon.svg"} width={12} height={12} />,
    title: "Users",
    roles: [ "admin", ],
    childs: [
      // {
      //   path: "/doctors",
      //   icon: <Image src={"/images/doctors_icon.svg"} width={12} height={12} />,
      //   label: (
      //     <Link
      //       href="/doctors"
      //       className="font-normal  text-base font-poppins "
      //     >
      //       <button
      //         className="py-4 text-white px-4 bg-slate-700 "
      //         style={{ backgroundColor: "transparent", border: "none" }}
      //       >
      //         Doctors
      //       </button>
      //     </Link>
      //   ),
      //   roles: [ "admin", ],
      // },
      {
        path: "/nurses",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/nurses" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Nurses
            </button>
          </Link>
        ),
        roles: [ "admin"],
      },
      // {
      //   path: "/patients",
      //   icon: (
      //     <Image src={"/images/patients_icon.svg"} width={12} height={12} />
      //   ),
      //   label: (
      //     <Link
      //       href="/patients"
      //       className="font-normal  text-base font-poppins "
      //     >
      //       <button
      //         className="py-4 text-white px-4 bg-slate-700 "
      //         style={{ backgroundColor: "transparent", border: "none" }}
      //       >
      //         Patients
      //       </button>
      //     </Link>
      //   ),
      //   roles: [ "admin", ],
      // },
      // {
      //   path: "/rehab",
      //   icon: <Image src={"/images/doctors_icon.svg"} width={12} height={12} />,
      //   label: (
      //     <Link href="/rehab" className="font-normal  text-base font-poppins ">
      //       <button
      //         className="py-4 text-white px-4 bg-slate-700 "
      //         style={{ backgroundColor: "transparent", border: "none" }}
      //       >
      //         Rehab Center
      //       </button>
      //     </Link>
      //   ),
      //   roles: [ "admin"],
      // },
      
      {
        path: "/aya",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/aya" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Aya
            </button>
          </Link>
        ),
        roles: [ "admin"],
      },
      {
        path: "/physio",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/physio" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Physio
            </button>
          </Link>
        ),
        roles: [ "admin", "RehabAdmin"],
      },
      {
        path: "/users",
        icon: <Image src={"/images/nurses_icon.svg"} width={12} height={12} />,
        label: (
          <Link href="/users" className="font-normal  text-base font-poppins ">
            <button
              className="py-4 text-white px-4 bg-slate-700 "
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              Users
            </button>
          </Link>
        ),
        roles: [ "admin", "RehabAdmin"],
      },
    ],
  },
  {
    path: "/category",
    icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
    title: "Category",
    roles: [ "admin"],
  },

  // {
  //   path: "/analysis",
  //   icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
  //   title: "Analysis",
  //   roles: [ "admin"],
  // },
  // {
  //   path: "/expert-category",
  //   icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
  //   title: "Experts Category",
  //   roles: [ "admin"],
  // },
  // {
  //   path: "/expertProfile",
  //   icon: <Image src={"/images/analysis_icon.svg"} width={12} height={12} />,
  //   title: "Expert Profile",
  //   roles: ["expert","admin"],
  // },
  // {
  //   // path: "/orders/order-history",
  //   icon: (
  //     <Image src={"/images/nurses_icon.svg"} width={12} height={12} />
  //   ),
  //   title: "Expert",
  //   roles: [ "admin", "expert"],
  //   childs: [
  //     {
  //       path: "expert-category",
  //       icon: (
  //         <Image src={"/images/completed_icon.svg"} width={12} height={12} />
  //       ),
  //       label: (
  //         <Link
  //           href="expert-category"
  //           className="font-normal  text-base font-poppins "
  //         >
  //           <button
  //             className="py-4 text-white px-4 bg-slate-700 "
  //             style={{ backgroundColor: "transparent", border: "none" }}
  //           >
  //            Categories
  //           </button>
  //         </Link>
  //       ),
  //       roles: [ "admin"],
  //     },
  //     {
  //       path: "experts",
  //       icon: (
  //         <Image src={"/images/completed_icon.svg"} width={12} height={12} />
  //       ),
  //       label: (
  //         <Link
  //           href="experts"
  //           className="font-normal  text-base font-poppins "
  //         >
  //           <button
  //             className="py-4 text-white px-4 bg-slate-700 "
  //             style={{ backgroundColor: "transparent", border: "none" }}
  //           >
  //            Hospitals
  //           </button>
  //         </Link>
  //       ),
  //       roles: [ "admin"],
  //     },
  //     {
  //       path: "expert-doctor",
  //       icon: (
  //         <Image src={"/images/doctors_icon.svg"} width={12} height={12} />
  //       ),
  //       label: (
  //         <Link
  //           href="expert-doctor"
  //           className="font-normal  text-base font-poppins "
  //         >
  //           <button
  //             className="py-4 text-white px-4 bg-slate-700 "
  //             style={{ backgroundColor: "transparent", border: "none" }}
  //           >
  //           Experts Doctor
  //           </button>
  //         </Link>
  //       ),
  //       roles: [ "admin", "expert"],
  //     }, {
  //       path: "expert-doctor",
  //       icon: (
  //         <Image src={"/images/doctors_icon.svg"} width={12} height={12} />
  //       ),
  //       label: (
  //         <Link
  //           href="insurance"
  //           className="font-normal  text-base font-poppins "
  //         >
  //           <button
  //             className="py-4 text-white px-4 bg-slate-700 "
  //             style={{ backgroundColor: "transparent", border: "none" }}
  //           >
  //           Insurance
  //           </button>
  //         </Link>
  //       ),
  //       roles: [ "admin", "expert"],
  //     },
      
  
  //   ],
  // },
];

export default routes;
