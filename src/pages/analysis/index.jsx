import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,


} from 'chart.js';
import { Select ,DatePicker} from 'antd';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import { collection, getDocs, query ,where} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep', 'Oct','Nov','Dec'];
const Index = () => {

  ChartJS.register(CategoryScale, LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
  )
  const [year,setYear]=useState(new Date().getFullYear())
  const [year1,setYear1]=useState(new Date().getFullYear())
  const [jan,setJan]=useState("0");
  const [feb,setfeb]=useState("0");
  const [mar,setmar]=useState("0");
  const [apr,setapr]=useState("0");
  const [may,setmay]=useState("0");
  const [jun,setjun]=useState("0");
  const [jul,setjul]=useState("0");
  const [aug,setaug]=useState("0");
  const [sep,setsep]=useState("0");
  const [oct,setoct]=useState("0");
  const [nov,setnov]=useState("0");
  const [dec,setdec]=useState("0");  
  const fetchData = async()=>{
    var arr=[];
  const docRef = collection(db,"orders");
  try{
   const res = await getDocs(docRef);
      res.docs.map((doc)=>{
arr.push(doc.data())
      })  
      return arr
   
  }catch(error){

  }
  }
  const {data,isLoading}= useQuery(["Analytic"],fetchData,{
    staleTime:60000
  })

  const fetchPatient = async()=>{
    var arr=[];
  const docRef = query (collection(db,"users"),where("role","==","user"));
  try{
   const res = await getDocs(docRef);
      res.docs.map((doc)=>{
arr.push(doc.data())
      })  
      return arr
   
  }catch(error){

  }
  }
  const {data:patientData,isLoading:patientIsLoading}= useQuery(["Patient-Analytic"],fetchPatient,{
    staleTime:60000
  })

  const calculateOrders =(e)=>{
    var ajan =data?.filter((doc)=>{
      return new Date(doc?.Date?.seconds*1000).getMonth() == e &&  new Date(doc?.Date?.seconds*1000).getFullYear() == year
    })
    return ajan?.length
  }
  const calculatePatient =(e)=>{
    var ajan =patientData?.filter((doc)=>{
      return new Date(doc?.created_at?.seconds*1000).getMonth() == e &&  new Date(doc?.created_at?.seconds*1000).getFullYear() == year1
    })
    return ajan?.length
  }

  const yearChange = (date, dateString) => {
    // console.log(date);
    setYear(date?.$y)
  };
  const yearChange1 = (date, dateString) => {
    // console.log(date);
    setYear1(date?.$y)
  };

if(!isLoading){
  // console.log(data)

  var ajan =data?.filter((doc)=>{
    return new Date(doc?.Date?.seconds*1000).getMonth()+1 == 7 &&  new Date(doc?.Date?.seconds*1000).getFullYear() == year
  })
  

  // console.log(jan,"data")
// data?.map((doc)=>{
// console.log(new Date(doc.Date.seconds*1000).getMonth())
// })
}
// console.log( new Date( doc.data().Date.seconds).getMonth())
  const options = {
    responsive: true,
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true,

      }
    },
    plugins: {

      //  title: {
      //     display: true,
      //     text: 'Patient State',

      //   },
    },
  };
  const chartdata = {
    labels,
    datasets: [
      {
        
        fill: true,
        data: [calculatePatient(0), calculatePatient(1), calculatePatient(2), calculatePatient(3), calculatePatient(4), calculatePatient(5), calculatePatient(6), calculatePatient(7),calculatePatient(8),calculatePatient(9),calculatePatient(10),calculatePatient(11)],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: [
          'rgb(173, 216, 230)',


        ],
        borderWidth: 2


      },
    ],
  };
  const data1 = {
    labels,
    datasets: [
      {

        fill: true,
        data: [calculateOrders(0), calculateOrders(1), calculateOrders(2), calculateOrders(3), calculateOrders(4), calculateOrders(5), calculateOrders(6), calculateOrders(7),calculateOrders(8),calculateOrders(9),calculateOrders(10),calculateOrders(11)],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: [
          'rgb(	144, 238, 144)',


        ],
        borderWidth: 2


      },
    ],
  };
 if(isLoading){
  return <div className='flex-1 justify-center items-center '>Loading....</div>
 }
  return (
    <div className='mt-[40px]  h-[400px] w-[900px] gap-6 grid grid-cols-2 ml-6 '>
      
      <div className='h-[350px] w-[430px]  col-span-1 bg-slate-100  border border-spacing-2 flex flex-col items-center shadow-xl  rounded-md p-4' >
        <div className='flex justify-between items-center px-3 w-full'>
          <h2>Patients State</h2>
          <div className='h-[20px]'>
            {/* <Select
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
              bordered={false}
              className="text-xs font-normal"
              placeholder="Today"
              options={[
                { value: "Paid", label: "Paid" },
                { value: "UnPaid", label: "UnPaid" },
              ]}
            /> */}
            <DatePicker onChange={yearChange1} picker="year" />
          </div>
        </div>
        <div className=''>

          {/* <div className='rotate-270 h-[20px] w-[180px] inline '>Patients Visits</div> */}
          <div className='-rotate-90 h-[20px] w-[180px]  relative top-[60px] -left-[96px] font-poppins text-xs text-darkgray'>Patients Visits</div>
          <div className=''>
            <Line options={options} data={chartdata} style={{ height: "270px", width: "400px" }} />
          </div>
          <div className='flex justify-center text-sm'>
            <h2 className='text-sm font-poppins font-normal'>Months</h2>
          </div>
        </div>
      </div>
      <div className='h-[350px] w-[430px]  col-span-1 bg-slate-100  border border-spacing-2 flex flex-col items-center shadow-xl  rounded-md p-4' >
        <div className='flex justify-between items-center px-3 w-full'>
          <h2>Orders State</h2>
          <div className='h-[20px]'>
            {/* <Select
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
              bordered={false}
              className="text-xs font-normal"
              placeholder="Today"
              options={[
                { value: "Paid", label: "Paid" },
                { value: "UnPaid", label: "UnPaid" },
              ]}
            /> */}
           <DatePicker onChange={yearChange} picker="year" />
          </div>
        </div>
        <div className=''>

          {/* <div className='rotate-270 h-[20px] w-[180px] inline '>Patients Visits</div> */}
          <div className='-rotate-90 h-[20px] w-[180px]  relative top-[60px] -left-[96px] font-poppins text-xs text-darkgray'>Monthly Orders</div>
          <div className=''>
            <Line options={options} data={data1} style={{ height: "270px", width: "400px" }} />
          </div>
          <div className='flex justify-center text-sm'>
            <h2 className='text-sm font-poppins font-normal'>Months</h2>
          </div>
        </div>
      </div>
    
    </div>
  )
}

export default Index;



