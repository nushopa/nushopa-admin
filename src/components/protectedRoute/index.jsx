import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "../../services/api";
import { addUser } from "../../redux/user";
import { Loader } from "../common/loaders/index";
const ADMIN_ROLE = 5000;

function ProtectedRoute() {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = data?.customer;

  // keep redux in sync so the rest of the app (navbar etc.) still has the user
  useEffect(() => {
    if (user?.role === ADMIN_ROLE) dispatch(addUser(user));
  }, [user, dispatch]);

  if (isLoading) return <Loader />;
  if (isError || !user || user.role !== ADMIN_ROLE) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
