import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginAdminMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Auth from "./component/Auths";

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
    <Auth
          title="Experience the the modern way to shop"
          subtitle="Please provide your information to continue shopping with Us."
          buttonText="Login"
          buttonPath="/sign-in"
          formSide="center"
        >
      <h2 className="text-2xl font-semibold text-start font-workSans mb-4">
        Admin Sign In
      </h2>
      <form  onSubmit={handleSubmit}>
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

        
        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4"
          disabled={isLoading ? true : false} // Disable the button while loading
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
       
      </form>
    </Auth>
  );
};

export default UserSignIn;
