import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { NEAREST_HEAD } from "../../../data/nearestMarketRepHead";
import {
  useUpdateAssignMutation,
  useUpdateUnassignMutation,
} from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { phantomGet } from "phantom-request";
import { toast } from "react-toastify";
import NearestDistributorRow from "./Nearestdistributorrow ";

export default function NearestDistributors({ order, orderID, distributors }) {
  const [currentAssigned, setCurrentAssigned] = useState(null);
  const [updateAssign] = useUpdateAssignMutation();
  const [updateUnassign] = useUpdateUnassignMutation();
  const navigate = useNavigate();

  const { data: assignedDistributor, loading: isLoading } = phantomGet({
    route: `order/assigned/${orderID}`,
  });

  useEffect(() => {
    if (assignedDistributor?.distributor) {
      setCurrentAssigned(assignedDistributor?.distributor?._id || null);
    } else {
      setCurrentAssigned(null);
    }
  }, [assignedDistributor]);

  const handleAssign = async (distributorId) => {
    try {
      if (currentAssigned) {
        toast.info("Please unassign the current distributor first.");
        return;
      }
      await updateAssign({ orderID, distributorID: distributorId }).unwrap();
      setCurrentAssigned(distributorId);
      navigate(`/chat/${distributorId}?order=${orderID}`);
    } catch (error) {
      console.error("Failed to assign distributor:", error);
    }
  };

  const handleUnassign = async () => {
    try {
      await updateUnassign({ orderID }).unwrap();
      setCurrentAssigned(null);
    } catch (error) {
      console.error("Failed to unassign distributor:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <table className="w-full min-w-max min-h-fit max-h-[10rem] overflow-y-auto table-auto my-5 text-left">
      <thead>
        <tr>
          {NEAREST_HEAD.map((head) => (
            <th
              key={head}
              className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {distributors?.map((distributor, index) => {
          const isLast = index === distributors.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

          return (
            <NearestDistributorRow
              key={distributor._id}
              distributor={distributor}
              orderID={orderID}
              order={order}
              currentAssigned={currentAssigned}
              onAssign={handleAssign}
              onUnassign={handleUnassign}
              classes={classes}
            />
          );
        })}
      </tbody>
    </table>
  );
}