import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "../../services/api";
import { addUser, clearUser } from "../../redux/user";

export default function SessionLoader({ children }) {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (data?.customer) {
      dispatch(addUser(data.customer));
    } else if (error?.status === 401) {
      dispatch(clearUser());
    }
  }, [data, error, dispatch]);

  if (isLoading) return null; // or a spinner

  return children;
}