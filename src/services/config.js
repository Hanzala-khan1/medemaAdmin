import { store } from "../redux/store";
import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "./endpoints";

const { token, isLoggedIn } = store.getState().root.user;

export const HTTP_CLIENT = axios.create({
  baseURL: BASE_URL,
  headers: {
    "authorization": `Bearer ${token}`,
  },
});

export const interceptorConfig = async () => {

  await HTTP_CLIENT.interceptors.request.use(
    (config) => {
      // const { token, isLoggedIn } = store.getState().root.user;
      console.log("sssssssssssssssssssssssssssssssssssssssssss", store.getState().root.user)
      // const { authToken } = store.getState().root.user;
      const token = localStorage.getItem('token')
      // config.headers = {
      //   "x-access-token": "PLASTK",
      // };

      // if (isLoggedIn) {
      console.log("token is available here ")
      config["headers"]["authorization"] = `Bearer ${token}`;
      // }
      return config;
    },
    (err) => {
      Promise.reject(err);
    }
  );
};
