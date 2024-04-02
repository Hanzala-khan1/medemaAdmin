// const BASE_URL = "https://medemaa-2c866c7d1e6e.herokuapp.com/";
const BASE_URL = "http://localhost:5000";

const ENDPOINTS = {
  GET_CATEGORIES: "/user/getCategories",
  SIGNUP: "/user/register",
  LOGIN: "/user/login",
  LOGOUT: "/user/logout",
  GET_ALL_REHAB: "/user/getAllRehabLists",
  GET_SINGLE_REHAB: "/user/getARehab",
  ADD_FAVOURITE: "/user/addRemoveFav",
  GET_ALL_FAV: "/user/getAllFav",
  ADD_ORDER: "/user/addBooking",
  GET_ALL_ORDERS: "user/getAllBookings",
  GET_ALL_USER_COUNT: "user/getUsersCount",
  ADD_REHAB: "user/addRehab",
};
export { BASE_URL, ENDPOINTS };
