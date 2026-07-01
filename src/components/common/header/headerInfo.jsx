import { Badge, IconButton, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../services/socket";
import {
  addNotification,
  setNotifications,
} from "../../../redux/notificationSlice";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HeaderInfo = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.notifications);

  // Fetch notifications once on mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}notification/`)
      .then((response) => {
        if (response.data) {
          dispatch(setNotifications(response.data));
        }
      })
      .catch(() => {
        toast.error("Error fetching notifications");
      });
  }, [dispatch]); // ✅ runs only once

  // Register socket listener separately, also only once
  useEffect(() => {
    const handleNotification = (newNotification) => {
      dispatch(addNotification(newNotification));
      toast.info(newNotification?.title || "New notification");
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification); 
    };
  }, [dispatch]); 

  return (
    <div className="bg-white text-black shadow capitalize w-full h-[70px] flex flex-wrap md:flex-nowrap justify-between px-4 md:pl-[3rem] md:pr-[15rem] items-center">
      <div className="text-neutral-800 text-base md:text-xl font-medium font-['Work Sans']">
        Admin Dashboard
      </div>
      <div className="flex gap-3 md:gap-5 justify-center items-center">
        <div onClick={() => navigate("/notifications")}>
          <Badge content={notifications.length}>
            <IconButton className="bg-mainGreen rounded-full w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] block mx-auto text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </IconButton>
          </Badge>
        </div>
        <Typography className="text-sm md:text-lg font-bold">
          Welcome{" "}
          <span className="text-mainGreen text-wrap">
            {user.first_name + " " + user.last_name || "admin"}
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default HeaderInfo;
