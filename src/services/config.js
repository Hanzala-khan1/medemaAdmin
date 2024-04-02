import { store } from "../redux/store";
import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "./endpoints";

export const HTTP_CLIENT = axios.create({
  baseURL: BASE_URL,
});

export const interceptorConfig = () => {
  HTTP_CLIENT.interceptors.request.use(
    (config) => {
      const { token, isLoggedIn } = store.getState().root.user;
      console.log("sssssssssssssssssssssssssssssssssssssssssss",store.getState().root.user)
      // const { authToken } = store.getState().root.user;

      // config.headers = {
      //   "x-access-token": "PLASTK",
      // };

      if (isLoggedIn) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => {
      Promise.reject(err);
    }
  );
};
