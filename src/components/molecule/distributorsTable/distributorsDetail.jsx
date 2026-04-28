import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { phantomGet, phantomPost } from "phantom-request";
import { Loader } from "../../common/loaders";
import DefaultLayout from "../../../layouts/defaultLayout";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { AssignUnassignButton } from "../../assignButton/AssignUnassignButton";

export function DistributorDetail() {
  const { distributorId } = useParams();
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt"); // ✅ FIX 1: get token

  const [distributor, setDistributor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [linkedOrderId, setLinkedOrderId] = useState(null);

  // ✅ FIX 2: pass token so API call doesn't return 401
  const {
    data: distributorData,
    loading,
    error: fetchError,
  } = phantomGet({
    route: `customers/distributors/${distributorId}`,
    token: jwt,
    fetchOnMount: true,
  });

  // ✅ FIX 2: pass token for assignment status fetch too
  const { data: assignmentData } = phantomGet({
    route: `order/assigned-distributor/${distributorId}`,
    token: jwt,
    fetchOnMount: true,
  });

  const {
    post: postAssign,
    response: assignResponse,
    error: assignError,
  } = phantomPost({
    route: "order/assign",
  });

  const {
    post: postUnassign,
    response: unassignResponse,
    error: unassignError,
  } = phantomPost({
    route: "order/unassign",
  });

  // ✅ FIX 3: handle all possible response shapes from the API
  useEffect(() => {
    if (distributorData) {
      const resolved =
        distributorData.distributor ||   // { distributor: {...} }
        distributorData.data ||           // { data: {...} }
        distributorData.customer ||       // { customer: {...} }
        (distributorData._id ? distributorData : null); // root object IS the distributor

      if (resolved) {
        setDistributor(resolved);
      } else {
        // Log for debugging if none of the known shapes match
        console.warn("Unexpected distributorData shape:", distributorData);
        toast.error("Unexpected response format from server.");
      }
    }
  }, [distributorData]);

  // Handle assignment status
  useEffect(() => {
    if (assignmentData?.order) {
      setIsAssigned(true);
      setLinkedOrderId(assignmentData.order.orderID || assignmentData.order._id);
    } else {
      setIsAssigned(false);
      setLinkedOrderId(null);
    }
  }, [assignmentData]);

  // Handle assign response
  useEffect(() => {
    if (assignResponse?.order) {
      const orderID = assignResponse.order.orderID;
      setIsAssigned(true);
      setLinkedOrderId(orderID);
      toast.success("Distributor assigned successfully!");
      navigate(`/chat/${distributorId}?order=${orderID}`);
    }
    if (assignError) {
      toast.error(
        assignError.response?.data?.message || "Failed to assign distributor."
      );
    }
  }, [assignResponse, assignError]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle unassign response
  useEffect(() => {
    if (unassignResponse) {
      toast.success("Distributor unassigned successfully.");
      setIsAssigned(false);
      setLinkedOrderId(null);
    }
    if (unassignError) {
      toast.error(
        unassignError.response?.data?.message || "Failed to unassign distributor."
      );
    }
  }, [unassignResponse, unassignError]);

  const handleAssign = () => {
    postAssign({ distributorID: distributorId });
  };

  const handleUnassign = () => {
    if (!linkedOrderId) {
      toast.error("No linked order found.");
      return;
    }
    postUnassign({ distributorID: distributorId, orderID: linkedOrderId });
  };

  const handleDelete = () => {
    toast.success("Distributor deleted successfully!");
    navigate("/distributors");
  };

  // ✅ FIX 4: show error state instead of infinite loader when fetch fails
  if (fetchError) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-500 text-lg font-semibold">
            Failed to load distributor details.
          </p>
          <p className="text-gray-500 text-sm">
            {fetchError?.response?.data?.message ||
              "Please check your connection or try again."}
          </p>
          <Button color="green" onClick={() => navigate("/distributors")}>
            Back to Distributors
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  // ✅ FIX 4: loading covers both network-in-flight AND data not yet set
  if (loading || !distributor) return <Loader />;

  return (
    <DefaultLayout>
      <div className="py-8 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="p-8 border-b flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-mainGreen mb-4">
                Distributor Details
              </h1>
              <p className="text-gray-600">
                Detailed information about this distributor.
              </p>
            </div>

            <AssignUnassignButton
              distributorId={distributorId}
              isAssigned={isAssigned}
              onAssign={handleAssign}
              onUnassign={handleUnassign}
              size="md"
              className="px-6 py-2"
            />
          </div>

          {/* Profile & Details */}
          <div className="p-8 grid md:grid-cols-3 gap-8">
            {/* Profile Picture */}
            <div className="flex justify-center md:col-span-1">
              {distributor.profile_picture ? (
                <img
                  src={distributor.profile_picture}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-mainGreen"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Information Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.first_name ||
                    distributor.firstName ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.last_name ||
                    distributor.lastName ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.email || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.phone_number ||
                    distributor.contact ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.address || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.city || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.date_of_birth
                    ? new Date(distributor.date_of_birth).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.status === "approved"
                    ? "Approved"
                    : distributor.status === "pending"
                    ? "Pending"
                    : "Inactive"}
                </p>
              </div>

              {/* Proof of Identity */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proof of Identity
                </label>
                {distributor.proof_Of_Identity ? (
                  <img
                    src={distributor.proof_Of_Identity}
                    alt="Proof of Identity"
                    className="max-h-64 rounded-md border border-gray-300 object-contain"
                  />
                ) : (
                  <p className="text-gray-500">
                    No proof of identity uploaded
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Account Created
                </label>
                <p className="mt-1 font-semibold">
                  {distributor.createdAt
                    ? new Date(distributor.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8 flex justify-end gap-4">
            <Button color="red" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Distributor
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteModalOpen}
          handler={() => setIsDeleteModalOpen(false)}
          size="sm"
        >
          <DialogHeader>Confirm Deletion</DialogHeader>
          <DialogBody>
            Are you sure you want to delete this distributor? This action
            cannot be undone.
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="blue-gray"
              onClick={() => setIsDeleteModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </DefaultLayout>
  );
}