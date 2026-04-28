import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const userId = localStorage.getItem("userId");
  const user = useSelector((state) => state.user);

  // Check if the user is logged in and the authentication token and userId exist
  const isLoggedIn = user.isLoggedIn && userId && userId !== "" && userId !== undefined && userId !== null;

  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

export default ProtectedRoute;
