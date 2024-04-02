import { HTTP_CLIENT } from "./config";
import { ENDPOINTS } from "./endpoints";

export const getCategories = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_CATEGORIES);
};

export const userSignup = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.SIGNUP, params);
};

export const userLogin = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.LOGIN, params);
};

export const getUserCount = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_ALL_USER_COUNT);
};
export const addRehab = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.ADD_REHAB,params);
};
