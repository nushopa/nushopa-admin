import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://farm2home-api-zibka.ondigitalocean.app"
    : "http://localhost:3000";

// withCredentials lets the browser send the auth cookie on the handshake
export const socket = io(URL, { withCredentials: true });