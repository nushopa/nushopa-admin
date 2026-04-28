import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAdminMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/authLayout";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const ADMIN_ROLE = 5000;
const UserSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createUser, { isLoading }] = useCreateAdminMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      console.log("[handleSubmit] Form submission initiated");
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (isLoading) return;

    const postDataInfo = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phoneNumber,
      role: ADMIN_ROLE,
    };

    console.log("====== SIGNUP SUBMIT DEBUG ======");
    console.log("Posting signup data:", postDataInfo);
    console.log("=================================");
 // Check if there are any validation errors before submitting the form
    if (passwordError || isLoading) {
      return;
    }

   try {
      const res = await createUser({
        ...postDataInfo,
        password: formData.password,
      });

      console.log("[handleSubmit] API response received:", res);

      if (res.data) {
        console.log("[handleSubmit] Registration successful | User data:", res.data.data);
        console.log("[handleSubmit] Storing pending verification email in localStorage:", formData.email);
        localStorage.setItem("pendingVerificationEmail", formData.email);
        dispatch(addUser(res.data.data));
        console.log("[handleSubmit] Dispatched addUser to Redux store");
        toast.success("OTP sent to your email. Please verify to complete registration.");
        console.log("[handleSubmit] Navigating to /verify-otp");
        navigate("/verify-otp");
      } else {
        const errorMessage = res.error?.data?.message || "Registration failed";
        console.error("[handleSubmit] Registration failed — API error response:", {
          status: res.error?.status,
          message: errorMessage,
          fullError: res.error,
        });
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("[handleSubmit] Unexpected error during registration:", err);
      toast.error("An error occurred during registration");
    }
  };

 

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold font-workSans mb-4">
        Create an Admin Account
      </h2>
      <form className="bg-white rounded-lg p-8" onSubmit={handleSubmit}>

        {/* First & Last Name */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="firstName"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label
              htmlFor="lastName"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>

        {/* Email */}
        <div className="gap-4 md:gap-5 pt-2">
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

        {/* Phone Number */}
        <div className="gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label
              htmlFor="phoneNumber"
              className="text-[#000] font-workSans font-semibold"
            >
              Phone Number:
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone Number"
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">

          {/* Password */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="password"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              Password:
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your Password"
                className="w-full p-2 pr-10 border-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword
                  ? <AiOutlineEyeInvisible size={20} />
                  : <AiOutlineEye size={20} />
                }
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="confirmPassword"
              className="text-[#000] mb-2 font-workSans text-md font-semibold"
            >
              Confirm Password:
            </label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your Password"
                required
                className="w-full p-2 pr-10 border-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword
                  ? <AiOutlineEyeInvisible size={20} />
                  : <AiOutlineEye size={20} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Password Error */}
        {passwordError && (
          <p className="text-red-500 text-sm mt-1 mb-2">{passwordError}</p>
        )}

        <div className="w-full flex items-center justify-center">
          <div className="text-[#000] font-workSans font-normal text-[16px] py-3 w-full">
            By creating an account, you agree to Nushopa{" "}
            <span>
              <a href="#" className="text-mainGreen">
                Terms & Conditions
              </a>
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create an Account"}
        </button>

        <div className="relative flex w-[90%] mx-auto flex-row py-6">
          <div className="w-full inline-flex items-center text-xs align-middle">
            <div className="ms-2 w-full h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="shrink px-3 basis-0 flex-1 group">
            <span className="w-7 h-7 flex justify-center items-center font-medium text-gray-800 rounded-full">
              or
            </span>
          </div>
          <div className="w-full inline-flex items-center text-xs align-middle">
            <div className="w-full h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full justify-center gap-3 items-center flex-row">
          <div>
            <a href="#">
              <img
                className="w-[3rem]"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037705/farm2home/Frame_268_fpbpmd.png"
                alt="Sign up with Google"
              />
            </a>
          </div>
          <div>
            <a href="#">
              <img
                className="w-[3rem]"
                src="https://res.cloudinary.com/phantom1245/image/upload/v1702037689/farm2home/Frame_267_queazd.png"
                alt=""
              />
            </a>
          </div>
        </div>

        <div className="w-full py-4">
          <div className="text-center text-[#000] font-workSans font-normal text-[16px] py-3 w-full">
            Already have an account?{" "}
            <span>
              <a href="/sign-in" className="text-mainGreen">
                Sign In
              </a>
            </span>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserSignUp;