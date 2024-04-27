import { HTTP_CLIENT } from "./config";
import { ENDPOINTS } from "./endpoints";

export const getCategories = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_CATEGORIES);
};

export const userSignup = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.SIGNUP, params);
};
export const updateuser = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.UPDATEUSER, params);
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
export const UpdateRehab = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.UPDATE_REHAB,params);
};
export const deleteRehab = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.DELETE_REHAB,params);
};
export const deleteUser = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.DELETE_USER,params);
};
export const getRehablist = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_ALL_REHAB);
};
