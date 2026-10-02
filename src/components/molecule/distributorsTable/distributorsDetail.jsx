import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../common/loaders";
import DefaultLayout from "../../../layouts/defaultLayout";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { AssignUnassignButton } from "../../assignButton/AssignUnassignButton";
import {
  useDeleteDistributorMutation,
  useGetDistributorAssignmentQuery,
  useGetDistributorQuery,
  usePatchDistributorStatusMutation,
  useUpdateAssignMutation,
  useUpdateUnassignMutation,
} from "../../../services/api";

const STATUS_LABEL = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

export function DistributorDetail() {
  const { distributorId } = useParams();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const {
    data: distributorData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetDistributorQuery(distributorId);

  // Which order (if any) this distributor is linked to.
  // A 404 here simply means "not assigned", so errors are ignored.
  const { data: assignmentData } =
    useGetDistributorAssignmentQuery(distributorId);

  const [updateAssign] = useUpdateAssignMutation();
  const [updateUnassign] = useUpdateUnassignMutation();
  const [patchStatus, { isLoading: updatingStatus }] =
    usePatchDistributorStatusMutation();
  const [deleteDistributor, { isLoading: deleting }] =
    useDeleteDistributorMutation();

  // Handle every response shape the API might return.
  const distributor = useMemo(() => {
    if (!distributorData) return null;
    return (
      distributorData.distributor ||
      distributorData.data ||
      distributorData.customer ||
      (distributorData._id ? distributorData : null)
    );
  }, [distributorData]);

  const linkedOrder = assignmentData?.order ?? null;
  const isAssigned = Boolean(linkedOrder);
  const linkedOrderId = linkedOrder?.orderID || linkedOrder?._id || null;

  const handleAssign = async () => {
    try {
      const res = await updateAssign({ distributorID: distributorId }).unwrap();
      const orderID = res?.order?.orderID;
      toast.success("Distributor assigned successfully!");
      if (orderID) navigate(`/chat/${distributorId}?order=${orderID}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to assign distributor.");
    }
  };

  const handleUnassign = async () => {
    if (!linkedOrderId) {
      toast.error("No linked order found.");
      return;
    }
    try {
      await updateUnassign({
        distributorID: distributorId,
        orderID: linkedOrderId,
      }).unwrap();
      toast.success("Distributor unassigned successfully.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to unassign distributor.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDistributor(distributorId).unwrap();
      toast.success("Distributor deleted successfully!");
      setIsDeleteModalOpen(false);
      navigate("/distributors");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete distributor.");
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await patchStatus({ id: distributorId, status }).unwrap();
      const newStatus = res?.distributor?.status ?? status;
      toast.success(
        newStatus === "approved"
          ? "Distributor approved. A confirmation email has been sent."
          : "Distributor rejected. A notification email has been sent."
      );
      setIsReviewModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update distributor status.");
    }
  };

  if (isError) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-500 text-lg font-semibold">
            Failed to load distributor details.
          </p>
          <p className="text-gray-500 text-sm">
            {fetchError?.data?.message ||
              "Please check your connection or try again."}
          </p>
          <Button color="green" onClick={() => navigate("/distributors")}>
            Back to Distributors
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  if (isLoading) return <Loader />;

  if (!distributor) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-500 text-lg font-semibold">
            Unexpected response format from server.
          </p>
          <Button color="green" onClick={() => navigate("/distributors")}>
            Back to Distributors
          </Button>
        </div>
      </DefaultLayout>
    );
  }

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

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
              <Field
                label="First Name"
                value={distributor.first_name || distributor.firstName}
              />
              <Field
                label="Last Name"
                value={distributor.last_name || distributor.lastName}
              />
              <Field label="Email" value={distributor.email} />
              <Field
                label="Phone Number"
                value={distributor.phone_number || distributor.contact}
              />
              <Field label="Address" value={distributor.address} />
              <Field label="City" value={distributor.city} />
              <Field
                label="Date of Birth"
                value={
                  distributor.date_of_birth
                    ? new Date(distributor.date_of_birth).toLocaleDateString()
                    : null
                }
              />
              <Field
                label="Status"
                value={STATUS_LABEL[distributor.status] || "Inactive"}
              />

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
                  <p className="text-gray-500">No proof of identity uploaded</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Field
                  label="Account Created"
                  value={
                    distributor.createdAt
                      ? new Date(distributor.createdAt).toLocaleDateString(
                          "en-GB",
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : null
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8 flex justify-end gap-4">
            {distributor.status !== "approved" && (
              <Button color="green" onClick={() => setIsReviewModalOpen(true)}>
                Review & Approve
              </Button>
            )}
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
            Are you sure you want to delete this distributor? This action cannot
            be undone.
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
            <Button color="red" onClick={handleDelete} disabled={deleting}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Review / Approval Dialog */}
        <Dialog
          open={isReviewModalOpen}
          handler={() => setIsReviewModalOpen(false)}
          size="sm"
        >
          <DialogHeader>Review Distributor</DialogHeader>
          <DialogBody>
            <p className="text-gray-700 mb-3">
              Please confirm that the submitted ID and distributor information
              is correct and this account is ready for approval.
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>
                Name:{" "}
                <span className="font-semibold">
                  {distributor.first_name} {distributor.last_name}
                </span>
              </li>
              <li>
                ID Type:{" "}
                <span className="font-semibold">
                  {distributor.id_type || "Not provided"}
                </span>
              </li>
              <li>
                Address:{" "}
                <span className="font-semibold">
                  {distributor.address || "Not provided"}
                </span>
              </li>
            </ul>
            {distributor.proof_Of_Identity && (
              <img
                src={distributor.proof_Of_Identity}
                alt="Proof of Identity"
                className="mt-4 max-h-48 rounded-md border border-gray-300 object-contain"
              />
            )}
          </DialogBody>
          <DialogFooter className="gap-2">
            <Button
              variant="text"
              color="blue-gray"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => updateStatus("rejected")}
              disabled={updatingStatus}
            >
              Reject
            </Button>
            <Button
              color="green"
              onClick={() => updateStatus("approved")}
              disabled={updatingStatus}
            >
              Approve
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </DefaultLayout>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1 font-semibold">{value || "Not provided"}</p>
    </div>
  );
}