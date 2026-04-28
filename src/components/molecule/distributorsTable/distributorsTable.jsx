import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import { useDeleteDistributorMutation } from "../../../services/api";
import { UpdateDistributorsDialog } from "../dialogs/updateDistributorsDialog";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { phantomGet, phantomPost } from "phantom-request";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DistributorsTableComponent } from "./DistributorsTableComponent";

export function DistributorsTable() {
  const jwt = Cookies.get("jwt");
  const navigate = useNavigate();

  const [distributors, setDistributors] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState(null);
  const [deleteDistributorMutation] = useDeleteDistributorMutation();
  const { handleDelete } = useDeleteHandler(deleteDistributorMutation, "distributor");
  const [searchField, setSearchField] = useState("");

  const [assignedDistributorId, setAssignedDistributorId] = useState(null);

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // For assigning orders
  const { post, response, error } = phantomPost({
    route: "order/assign",
  });

  // For unassigning orders
  const {
    post: postUnassign,
    response: unassignResponse,
    error: unassignError,
  } = phantomPost({
    route: "order/unassign",
  });

  // Fetch distributors
  const {
    data: distributorData,
    loading,
    refetch,
  } = phantomGet({
    route: "customers/distributors",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  // Whenever currentPage changes, re-fetch
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // When data / assign response / error arrives, update state or navigate
  useEffect(() => {
    if (distributorData) {
      setDistributors(distributorData.distributors || []);
      setFilteredDetails(distributorData.distributors || []);
      setTotalPages(distributorData.totalPages || 1);
    }

    if (response) {
      const orderID = response.order?.orderID;
      const distributorId = response.order?.distributor_assigned?._id;
      if (orderID && distributorId) {setAssignedDistributorId(distributorId);
        navigate(`/chat/${distributorId}?order=${orderID}`);
      }
    }

    if (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }

    if (unassignResponse) {
      toast.success("Distributor unassigned successfully.");
      setAssignedDistributorId(null);
      refetch();
    }

    if (unassignError) {
      toast.error(unassignError.response?.data?.message || "Failed to unassign distributor.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributorData, response, error, unassignResponse, unassignError]);

  // Search filter
  useEffect(() => {
    const searchLower = searchField.toLowerCase();

    const filteredDistributors = distributors.filter((distributor) => {
      const city = (distributor.city || "").toLowerCase();
      const contact = (distributor.contact || "").toLowerCase();
      const address = (distributor.address || "").toLowerCase();
      const firstName = (distributor.firstName || "").toLowerCase();
      const lastName = (distributor.lastName || "").toLowerCase();

      return (
        city.includes(searchLower) ||
        contact.includes(searchLower) ||
        address.includes(searchLower) ||
        firstName.includes(searchLower) ||
        lastName.includes(searchLower)
      );
    });

    setFilteredDetails(filteredDistributors);
  }, [searchField, distributors]);

  // Pagination callback
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Order assignment dialog state
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleOrderDialogClose = () => {
    setOrderDialogOpen(false);
    setOrderId("");
  };

  const handleOrderSubmit = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter a valid Order ID.");
      return;
    }
    post({ orderID: orderId, distributorID: selectedDistributorId });
    setOrderDialogOpen(false);
    setOrderId("");
  };

  // ✅ Assign: opens the order ID dialog
  const handleAssign = (distributorId) => {
    setSelectedDistributorId(distributorId);
    setOrderDialogOpen(true);
  };

  // ✅ Unassign: opens confirmation modal (no orderId needed from outside — use tracked state)
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false);

  const handleUnassign = (distributorId) => {
    setSelectedDistributorId(distributorId);
    setUnassignDialogOpen(true);
  };

  const handleUnassignConfirm = () => {
    postUnassign({ distributorID: selectedDistributorId });
    setUnassignDialogOpen(false);
    setSelectedDistributorId(null);
  };

  const handleUnassignCancel = () => {
    setUnassignDialogOpen(false);
    setSelectedDistributorId(null);
  };

  return (
    <Card className="h-full w-[96%] mx-auto">
      {/* EDIT DIALOG */}
      <UpdateDistributorsDialog
        open={updateOpen}
        handleOpen={() => setUpdateOpen(false)}
        distributorId={selectedDistributorId}
      />

      {/* UNASSIGN CONFIRMATION DIALOG */}
      <Dialog open={unassignDialogOpen} handler={handleUnassignCancel} size="sm">
        <DialogHeader>Unassign Distributor</DialogHeader>
        <DialogBody>
          Are you sure you want to unassign this distributor from the order? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleUnassignCancel}
            className="mr-1"
          >
            No, Cancel
          </Button>
          <Button color="red" onClick={handleUnassignConfirm}>
            Yes, Unassign
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ORDER ASSIGNMENT DIALOG */}
      <Dialog open={orderDialogOpen} handler={handleOrderDialogClose}>
        <DialogHeader>Assign Order ID</DialogHeader>
        <DialogBody>
          <Input
            label="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOrderDialogClose}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button onClick={handleOrderSubmit}>Submit</Button>
        </DialogFooter>
      </Dialog>

      {/* TABLE HEADER & SEARCH BAR */}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              label="Search"
              placeholder="Use market name, address, city, or distributor name"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      {/* TABLE BODY */}
      <CardBody className="px-1">
        <DistributorsTableComponent
          distributors={filteredDetails}
          loading={loading}
          onRowClick={(id) => navigate(`/distributor/${id}`)}
          onEdit={(id) => {
            setSelectedDistributorId(id);
            setUpdateOpen(true);
          }}
          onDelete={handleDelete}
          assignedDistributorId={assignedDistributorId}
          onAssign={handleAssign}
          onUnassign={(id) => handleUnassign(id)}
          onView={(id) => navigate(`/distributor/${id}`)}
        />
      </CardBody>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}