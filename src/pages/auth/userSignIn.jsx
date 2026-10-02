import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginAdminMutation, useLogoutAdminMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Auth from "./component/Auths";

const ADMIN_ROLE = 5000;

const UserSignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordError, setPasswordError] = useState("");
  const [loginUser, { isLoading }] = useLoginAdminMutation();
  const [logoutUser] = useLogoutAdminMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordError(value.length < 6 ? "Password must be at least 6 characters" : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || isLoading) {
      toast.error("Form has validation errors or is loading");
      return;
    }

    // The backend sets the httpOnly access cookie on success and returns
    // only `{ user }` for web. Nothing is stored in JS-accessible storage.
    const res = await loginUser({ email: formData.email, password: formData.password });

    if (res.error) {
      toast.error(res.error?.data?.message || "Invalid Email or password");
      return;
    }

    const user = res.data?.user;
    if (user?.role !== ADMIN_ROLE) {
      // The server already issued a cookie for this non-admin account; clear it.
      await logoutUser();
      toast.error("Invalid Email or password");
      return;
    }

    dispatch(addUser(user));
    toast.success("Logged in successfully");
    navigate("/");
  };

  return (
    <Auth
      title="Experience the the modern way to shop"
      subtitle="Please provide your information to continue shopping with Us."
      buttonText="Login"
      buttonPath="/sign-in"
      formSide="center"
    >
      <form onSubmit={handleSubmit}>
        <div className="gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label htmlFor="email" className="text-[#000] font-workSans font-semibold">
              Email Address:
            </label>
            <input
              type="email" id="email" name="email" required
              placeholder="Enter your email"
              value={formData.email} onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
          </div>
        </div>
        <div className="gap-4 md:gap-5 pt-2">
          <div className="w-full">
            <label htmlFor="password" className="text-[#000] font-workSans font-semibold">
              Password:
            </label>
            <input
              type="password" id="password" name="password" required
              placeholder="Enter your Password"
              value={formData.password} onChange={handleChange}
              className="w-full p-2 border-2 mt-2 rounded-lg outline-none border-[#7B7B7B] border-opacity-50 mb-4"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="bg-mainGreen w-full text-center text-white py-3 px-5 rounded-md hover:bg-green-600 mt-4 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </Auth>
  );
};

export default UserSignIn;