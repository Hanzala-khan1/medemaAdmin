import { Layout, Spin ,Button,Popconfirm,message} from "antd";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { db,auth } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const { Header, Content } = Layout;
import { signOut } from "firebase/auth";
import routes from "@/routes/routes";
import Link from "next/link";
import SignIn from '../../pages/signin'
const Index = ({ children }) => {
  const [show,setShow]=useState(false)
  const [showPadding,setShowPadding]=useState(24)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState('empty');
  const a = routes.find((doc) => {
    return router.pathname == doc.path;
  })

  useEffect(() => {
    setCurrentUser(localStorage.getItem('token'))
    
    if(router.pathname == "/chat"){ setShow(true) ; setShowPadding(0) } 
    if(router.pathname !== "/chat"){ setShow(false) ; setShowPadding(24) } 
  },[router.pathname])
console.log("ccccccccccccccccccccccccccurrent",currentUser)
  if(!currentUser){
    router.push('/signin')

  }
  const [title, setTitle] = useState('')
  const { data, isLoading } = useQuery(["user"], async () => {
    const response = await (await fetch("/api/currentUser")).json();
    // console.log("res", response);
    const userRef = doc(db, "users", response.uid);
    const userRes = await getDoc(userRef);

    if (userRes.exists) {
      return userRes.data();
    }

    // return null;
  });
  // console.log("user in layout", data);
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-[100vh]">
  //   <Spin className="absolute top-1/2 left-1/2" />
  //   </div>);
  // }
  const confirm = (e) => {
   handleLogout(e)
    
  };
  const cancel = (e) => {
    console.log(e);
   
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    try{
      const res = await signOut(auth)
      console.log(res)
      localStorage.removeItem('role')
      localStorage.removeItem('token')
      localStorage.removeItem("id")
      localStorage.removeItem("email")
      router.push('/signin')
    }catch(error){
      console.log(error)
    }
 
  }

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", }}>
      <Header
        className="site-layout-background"
        style={{ padding: 0, position: "fixed", top: 0, width: "100%", zIndex: 5, height: '80px' }}
      >  <div className="flex justify-between items-center px-4 ">
      <div className="flex items-center gap-4 w-full justify-start px-6">
          <Image src={"/images/logo.svg"} width={118} height={48} />
          <div className="" style={{ marginLeft: "30px" }}>
            <h2 className="text-white hidden sm:block  ">{a ? a.title : 'Dashboard'}</h2>
          </div>
       
        </div>
       
          <Popconfirm
          title="Logout"
          description="Are you sure to Logout?"
          onConfirm={confirm}
          onCancel={cancel}
      
         
        >
              <Button className="  px-6  rounded-md bg-white hover:bg-[blue] ">Logout</Button>
              </Popconfirm>
      
 
   
        </div>
      </Header>
      <div>
        <Sidebar role={data?.role} user={data} />
      </div>
      <Layout className={`site-layout ${show?"overflow-y-hidden":"overflow-y-scroll"} `} style={{ marginTop: "50px" }} >
        <Content style={{ background: "#FAFBFF", }}>
          <div
            className={`${show?"overflow-x-hidden ":"overflow-x-scroll p-24"} bg-[#FAFBFF] `}
            style={{  minHeight: 360,padding:showPadding }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>


  );
};

export default Index;
