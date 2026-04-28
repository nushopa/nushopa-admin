import {  setPhantomConfig } from "phantom-request";
import Cookies from "js-cookie";
// import { toast } from "react-toastify";

const jwt = Cookies.get("jwt");

// Set global configuration for API requests
setPhantomConfig({
  baseURL: import.meta.env.VITE_BASE_URL,
  token: jwt,
  // onUnauthorized: logoutRedirect
});