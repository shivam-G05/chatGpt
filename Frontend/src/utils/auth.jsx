import Cookies from "js-cookie";

export const isLoggedIn = () => {
  const token = Cookies.get("token"); // token name must match your backend
  return !!token; // convert to boolean
};
