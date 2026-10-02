import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../common/loaders";
import DefaultLayout from "../../../layouts/defaultLayout";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  useDeleteDriverMutation,
  useGetDriverQuery,
  useSetDriverReviewMutation,
} from "../../../services/api";

export function DriverDetail() {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // setDriverReview / deleteDriver invalidate the "Driver" tag, so this
  // query refetches automatically after a review toggle.
  const { data: driver, isLoading, isError } = useGetDriverQuery(driverId);
  const [setDriverReview, { isLoading: toggling }] =
    useSetDriverReviewMutation();
  const [deleteDriver, { isLoading: deleting }] = useDeleteDriverMutation();

  const handleReviewToggle = async () => {
    try {
      await setDriverReview({ id: driverId, review: !driver.review }).unwrap();
      toast.success(
        driver.review ? "Driver set to under review." : "Driver verified."
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update driver.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDriver(driverId).unwrap();
      toast.success("Account deleted successfully!");
      setIsDeleteModalOpen(false);
      navigate("/driver");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete driver.");
    }
  };

  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsImageModalOpen(true);
  };

  if (isLoading) return <Loader />;

  if (isError || !driver) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-500 text-lg font-semibold">
            Failed to load driver details.
          </p>
          <button
            className="px-4 py-2 bg-gray-300 rounded-md shadow hover:bg-gray-400 transition"
            onClick={() => navigate("/driver")}
          >
            Back to Drivers
          </button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-8 font-roboto bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 border-b">
            <h1 className="text-4xl font-extrabold text-mainGreen mb-4">
              Driver Details
            </h1>
            <p className="text-gray-600">
              Detailed information about the driver.
            </p>
          </div>
          <div className="p-8 grid md:grid-cols-3 gap-8">
            <div className="flex justify-center md:col-span-1">
              {driver?.profilePicture ? (
                <img
                  src={driver.profilePicture}
                  alt="Driver Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-mainGreen"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="First Name:" value={driver.firstName} />
              <Field label="Last Name:" value={driver.lastName} />
              <Field label="Email:" value={driver.email} />
              <Field label="Phone Number:" value={driver.phoneNumber} />
              <Field label="Home Address:" value={driver.address} />
              <Field label="City:" value={driver.workCity} />
              <Field label="Date of Birth:" value={driver.dateOfBirth} />
              <Field
                label="Status:"
                value={driver.status ? "Active" : "Inactive"}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proof of Identity:
                </label>
                {driver.proofOfIdentity && (
                  <img
                    src={driver.proofOfIdentity}
                    alt="Proof of Identity"
                    onClick={() => handleImageClick(driver.proofOfIdentity)}
                    className="mt-2 rounded-md border border-gray-300 object-contain max-h-48 cursor-pointer hover:opacity-90 transition"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  License File:
                </label>
                {driver.licenseFile && (
                  <img
                    src={driver.licenseFile}
                    alt="License File"
                    onClick={() => handleImageClick(driver.licenseFile)}
                    className="mt-2 rounded-md border border-gray-300 object-contain max-h-48 cursor-pointer hover:opacity-90 transition"
                  />
                )}
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Account Created:"
                  value={
                    driver.createdAt
                      ? new Date(driver.createdAt).toLocaleDateString()
                      : "—"
                  }
                />
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 flex justify-end space-x-4">
            <button
              onClick={handleReviewToggle}
              disabled={toggling}
              className={`px-6 py-3 rounded-md font-semibold shadow transition duration-200 disabled:opacity-60 ${
                driver.review
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-mainGreen hover:bg-green-700 text-white"
              }`}
            >
              {driver.review ? "Set to Under Review" : "Verify Driver"}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-md font-semibold shadow hover:bg-red-600 transition duration-200"
            >
              Delete Driver
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={isDeleteModalOpen}
          handler={setIsDeleteModalOpen}
          size="sm"
        >
          <DialogHeader className="bg-red-500 text-white">
            Confirm Deletion
          </DialogHeader>
          <DialogBody divider className="text-gray-800">
            Are you sure you want to delete this driver? This action cannot be
            undone.
          </DialogBody>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md shadow hover:bg-gray-400 transition"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="ml-3 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition disabled:opacity-60"
              onClick={handleDelete}
              disabled={deleting}
            >
              Delete
            </button>
          </DialogFooter>
        </Dialog>

        {/* Image Modal */}
        <Dialog
          open={isImageModalOpen}
          handler={setIsImageModalOpen}
          size="md"
        >
          <DialogHeader className="p-2">
            <span className="text-xl font-semibold">Image Preview</span>
          </DialogHeader>
          <DialogBody className="flex justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Full View"
                className="max-w-full max-h-[70vh] object-contain rounded-md"
              />
            ) : (
              ""
            )}
          </DialogBody>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md shadow hover:bg-gray-400 transition"
              onClick={() => setIsImageModalOpen(false)}
            >
              Close
            </button>
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
      <p className="mt-1 text-lg font-semibold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}