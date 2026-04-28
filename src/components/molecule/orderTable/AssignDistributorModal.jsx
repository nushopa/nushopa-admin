import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import { phantomGet, phantomPost } from "phantom-request";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DistributorsTableComponent } from "../distributorsTable/DistributorsTableComponent";

export function AssignDistributorModal({
  open,
  onClose,
  orderID,
  onAssignSuccess,
}) {
  const jwt = Cookies.get("jwt");
  const navigate = useNavigate();

  const [distributors, setDistributors] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [assignedDistributorId, setAssignedDistributorId] = useState(null);
  const [reassignConfirmOpen, setReassignConfirmOpen] = useState(false);
  const [pendingAssignId, setPendingAssignId] = useState(null);

  const { post, response, error } = phantomPost({
    route: "order/assign",
  });

  const {
    post: postUnassign,
    response: unassignResponse,
    error: unassignError,
  } = phantomPost({
    route: "order/unassign",
  });

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

  const { data: currentAssignmentData } = phantomGet({
    route: `order/assigned/${orderID}`,
    fetchOnMount: false,
  });

  useEffect(() => {
    if (open) refetch();
  }, [open, currentPage]); // eslint-disable-line

  useEffect(() => {
    if (currentAssignmentData?.distributor) {
      setAssignedDistributorId(currentAssignmentData.distributor._id ?? null);
    }
  }, [currentAssignmentData]);

  useEffect(() => {
    if (distributorData) {
      setDistributors(distributorData.distributors || []);
      setFilteredDistributors(distributorData.distributors || []);
      setTotalPages(distributorData.totalPages || 1);
    }
  }, [distributorData]);

  // ✅ FIXED: added early return after success + guarded error check
  useEffect(() => {
    if (response?.order) {
      const assignedOrderID = response.order.orderID;
      const distributorId = response.order.distributor_assigned?._id;
      if (assignedOrderID && distributorId) {
        setAssignedDistributorId(distributorId);
        onAssignSuccess?.(assignedOrderID, distributorId);
        onClose();
        navigate(`/chat/${distributorId}?order=${assignedOrderID}`);
      }
      return; // ✅ exit early, prevent falling into error block
    }

    if (error?.response) { // ✅ only fires when there's a real HTTP error
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  }, [response, error]); // eslint-disable-line

  // ✅ FIXED: added early return after success + guarded error check
  useEffect(() => {
    if (unassignResponse) {
      toast.success("Distributor unassigned successfully.");
      setAssignedDistributorId(null);
      onAssignSuccess?.(orderID, null);
      return; // ✅ exit early, prevent falling into error block
    }

    if (unassignError?.response) { // ✅ only fires when there's a real HTTP error
      toast.error(
        unassignError.response?.data?.message ||
          "Failed to unassign distributor.",
      );
    }
  }, [unassignResponse, unassignError]); // eslint-disable-line

  useEffect(() => {
    const q = searchField.toLowerCase();
    setFilteredDistributors(
      distributors.filter((d) =>
        [d.city, d.contact, d.address, d.name, d.firstName, d.lastName]
          .map((v) => (v || "").toLowerCase())
          .some((v) => v.includes(q)),
      ),
    );
  }, [searchField, distributors]);

  useEffect(() => {
    if (!open) {
      setSearchField("");
      setCurrentPage(1);
      setPendingAssignId(null);
      setReassignConfirmOpen(false);
    }
  }, [open]);

  const handleAssign = (distributorId) => {
    if (!orderID) return;

    if (assignedDistributorId && assignedDistributorId !== distributorId) {
      setPendingAssignId(distributorId);
      setReassignConfirmOpen(true);
    } else {
      post({ orderID, distributorID: distributorId });
    }
  };

  const handleUnassign = (distributorId) => {
    postUnassign({ orderID, distributorID: distributorId });
  };

  const handleConfirmReassign = () => {
    if (pendingAssignId && orderID) {
      post({ orderID, distributorID: pendingAssignId });
    }
    setReassignConfirmOpen(false);
    setPendingAssignId(null);
  };

  const handleCancelReassign = () => {
    setReassignConfirmOpen(false);
    setPendingAssignId(null);
  };

  const handleView = (distributorId) => {
    navigate(`/distributor/${distributorId}`);
  };

  return (
    <>
      <Dialog
        open={open}
        handler={onClose}
        size="xl"
        className="max-h-[90vh] flex flex-col"
      >
        <DialogHeader className="flex items-center justify-between">
          <span>Select a Distributor to Assign</span>
          <IconButton variant="text" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4 overflow-y-auto flex-1 px-4">
          <div className="w-full md:w-72">
            <Input
              type="text"
              label="Search distributors"
              placeholder="Name, city, address..."
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>

          <DistributorsTableComponent
            distributors={filteredDistributors}
            loading={loading}
            mode="assign"
            assignedDistributorId={assignedDistributorId}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
            onView={handleView}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={totalPages}
            onPageChange={setCurrentPage}
          />
        </DialogBody>
      </Dialog>

      <Dialog
        open={reassignConfirmOpen}
        handler={handleCancelReassign}
        size="sm"
      >
        <DialogHeader>Reassign Distributor?</DialogHeader>
        <DialogBody>
          This order already has a distributor assigned. Are you sure you want
          to reassign it to a different distributor?
        </DialogBody>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={handleCancelReassign}
          >
            No, keep current
          </Button>
          <Button color="green" onClick={handleConfirmReassign}>
            Yes, reassign
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}