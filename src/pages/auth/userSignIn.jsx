import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/authLayout";
import { useLoginAdminMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  auth,
  signInWithPopup,
  provider,
} from "../../lib/firebase/firebase.config";
import Cookies from "js-cookie";

const UserSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginUser, { isLoading }] = useLoginAdminMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordError, setPasswordError] = useState("");
  // const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "password") {
      // Use value.length instead of formData.confirmPassword
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        if (user.email && user.uid) {
          if (user.phoneNumber === null || user.phoneNumber === undefined) {
            const postDataInfo = {
              email: user.email,
              password: user.uid,
            };
            localStorage.setItem("profile-picture", user.photoURL);
            try {
              loginUser(postDataInfo)
                .then((res) => {
                  const { token } = res.data;

                  // Store token in cookies
                  Cookies.set("jwt", token, {
                    expires: 7, // Cookie expiration in days
                    secure: true, // Ensures HTTPS
                    sameSite: "Strict", // Prevent CSRF
                  });

                  if (res.data.user.role === 5000) {
                    localStorage.setItem("userId", res.data.user._id);
                    dispatch(addUser(res.data.user));
                    toast.success("logged in successfully");
                    navigate("/");
                  } else {
                    toast.error("Invalid Email or password");
                    return;
                  }
                })
                .catch((error) => console.error(error));
            } catch (e) {
              console.error(e);
            }
          }
        }
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postDataInfo = {
      email: formData.email,
      password: formData.password,
    };

    if (passwordError || isLoading) {
      toast.error("Form has validation errors or is loading");
      return;
    }

    try {
      loginUser(postDataInfo)
        .then((res) => {
          const { token } = res.data;

          // Store token in cookies
          Cookies.set("jwt", token, {
            expires: 7, // Cookie expiration in days
            secure: true, // Ensures HTTPS
            sameSite: "Strict", // Prevent CSRF
          });
          if (res.data.user.role === 5000) {
            localStorage.setItem("userId", res.data.user._id);
            dispatch(addUser(res.data.user));
            
            console.log("JWT Token:", token); 
            toast.success("Logged in successfully");
            if (Cookies.get("jwt")) {
              navigate("/");
            }
          } else {
            toast.error("Invalid Email or password");
          }
        })
        .catch(() => toast.error("Invalid Email or password"));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold text-center font-workSans mb-4">
        Nushopa Admin Sign In
      </h2>
      <form className="bg-white rounded-lg p-8" onSubmit={handleSubmit}>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-[#000] font-workSans font-semibold"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className=" gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-[#000] font-workSans font-semibold"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your Password"
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>

        <div className="font-workSans font-normal text-[16px] py-3 w-full">
          <a href="#" className="text-mainGreen">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4"
          disabled={isLoading ? true : false} // Disable the button while loading
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
        <div className="relative flex w-[90%] mx-auto flex-row py-6 ">
          <div className=" w-full inline-flex items-center text-xs align-middle">
            <div className="ms-2 w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
          </div>

          <div className="shrink px-3 basis-0 flex-1 group">
            <span className="w-7 h-7 flex justify-center items-center font-medium text-gray-800 rounded-full">
              or
            </span>
          </div>

          <div className=" w-full inline-flex items-center text-xs align-middle">
            <div className=" w-full h-px flex-1 bg-gray-200 group-last:hidden dark:bg-gray-700"></div>
          </div>
        </div>
        <div className=" flex w-full justify-center gap-3 items-center flex-row  ">
          <div onClick={handleGoogleLogin}>
            <img
              className=" w-[3rem]"
              src="https://res.cloudinary.com/phantom1245/image/upload/v1702037705/farm2home/Frame_268_fpbpmd.png"
              alt=""
            />
          </div>
          <div>
            <a href="#">
              <img
                className=" w-[3rem]"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037689/farm2home/Frame_267_queazd.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="w-full py-4">
          <div className="text-center text-[#000] font-workSans font-normal text-[16px] py-3 w-full">
            Don’t have an account?{" "}
            <span>
              <a href="/sign-up" className="text-mainGreen">
                Create Account
              </a>
            </span>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserSignIn;
