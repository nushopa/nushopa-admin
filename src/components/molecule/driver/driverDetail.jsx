import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { phantomDelete, phantomGet, phantomPut } from "phantom-request";
import { Loader } from "../../common/loaders";
import DefaultLayout from "../../../layouts/defaultLayout";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DriverDetail() {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data } = phantomGet({ route: `driver/${driverId}` });

  const { put, response, latestData } = phantomPut({
    route: `driver/${driverId}/review`,
    getLatestData: `driver/${driverId}`,
  });

  const { deleteRequest } = phantomDelete({
    route: `driver/${driverId}`,
  });

  useEffect(() => {
    if (data) {
      setDriver(data);
    }
    if (response) {
      setDriver(latestData);
    }
  }, [data, response, latestData]);

  const handleReviewToggle = () => {
    const updatedReview = !driver.review;
    put({ review: updatedReview });
  };

  const handleDelete = async () => {
    deleteRequest();
    toast.success("Account deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsImageModalOpen(true);
  };

  if (!driver) return <Loader />;

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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.firstName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.phoneNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Home Address:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.address}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.workCity}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.dateOfBirth}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {driver.status ? "Active" : "Inactive"}
                </p>
              </div>
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
                <label className="block text-sm font-medium text-gray-700">
                  Account Created:
                </label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {new Date(driver.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 flex justify-end space-x-4">
            <button
              onClick={handleReviewToggle}
              className={`px-6 py-3 rounded-md font-semibold shadow transition duration-200 ${
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
            Are you sure you want to delete this driver? This action cannot be undone.
          </DialogBody>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md shadow hover:bg-gray-400 transition"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="ml-3 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
              onClick={handleDelete}
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
            ): ""}
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
