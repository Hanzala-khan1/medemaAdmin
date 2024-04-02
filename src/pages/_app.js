import DashboardLayout from "@/layout/DashboardLayout";
import GeneralLayout from "@/layout/GeneralLayout";
import { interceptorConfig } from "@/services/config";
import "@/styles/globals.css";
import '@/styles/table.css'
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { store, persistor } from "../redux/store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [roles, setRoles] = useState('');

  useEffect(() => {
    // Defer execution until component mounts on the client side
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUser(token);
    setRoles(role);
    interceptorConfig(store.dispatch);
  }, []); // Empty dependency array ensures it runs only once after mount

  console.log("uuuuuuuuuussssssssssssssss", user);

  // // Redirect if user is not logged in
  // useEffect(() => {
  //   if (user === null) {
  //     router.push('/signin');
  //   }
  // }, []);

  if (typeof window === 'undefined' || user === null) {
    // Prevent rendering on server side or until user data is fetched
    return null;
  }

  // Render layouts based on route
  if (router.pathname === "/signin" || router.pathname === "/forgot") {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <GeneralLayout>
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
            </GeneralLayout>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <DashboardLayout>
            <Component {...pageProps} roles={roles} />
            <ReactQueryDevtools initialIsOpen={false} />
          </DashboardLayout>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
