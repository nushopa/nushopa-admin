import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import Pagination from "../pagination/pagination";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useGetDistributorsQuery,
  useGetAssignedDistributorQuery,
  useUpdateAssignMutation,
  useUpdateUnassignMutation,
} from "../../../services/api";
import { DistributorsTableComponent } from "../distributorsTable/DistributorsTableComponent";

const EMPTY = [];
const ITEMS_PER_PAGE = 10;

export function AssignDistributorModal({
  open,
  onClose,
  orderID,
  onAssignSuccess, // optional
}) {
  const navigate = useNavigate();

  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reassignConfirmOpen, setReassignConfirmOpen] = useState(false);
  const [pendingAssignId, setPendingAssignId] = useState(null);

  const [updateAssign] = useUpdateAssignMutation();
  const [updateUnassign] = useUpdateUnassignMutation();

  // Only hit the API while the modal is open.
  const { data, isFetching } = useGetDistributorsQuery(
    { page: currentPage, limit: ITEMS_PER_PAGE },
    { skip: !open }
  );
  const distributors = data?.distributors ?? EMPTY;
  const totalPages = data?.totalPages || 1;

  const { data: assignmentData } = useGetAssignedDistributorQuery(orderID, {
    skip: !open || !orderID,
  });
  const assignedDistributorId = assignmentData?.distributor?._id ?? null;

  const filteredDistributors = useMemo(() => {
    const q = searchField.toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(q);
    return distributors.filter(
      (d) =>
        has(d.city) ||
        has(d.contact) ||
        has(d.address) ||
        has(d.name) ||
        has(d.email) ||
        has(d.first_name) ||
        has(d.last_name) ||
        has(d.firstName) ||
        has(d.lastName)
    );
  }, [distributors, searchField]);

  useEffect(() => {
    if (!open) {
      setSearchField("");
      setCurrentPage(1);
      setPendingAssignId(null);
      setReassignConfirmOpen(false);
    }
  }, [open]);

  const doAssign = async (distributorId) => {
    try {
      const res = await updateAssign({
        orderID,
        distributorID: distributorId,
      }).unwrap();
      const assignedOrderID = res?.order?.orderID ?? orderID;
      onAssignSuccess?.(assignedOrderID, distributorId);
      onClose();
      navigate(`/chat/${distributorId}?order=${assignedOrderID}`);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  const handleAssign = (distributorId) => {
    if (!orderID) return;
    if (assignedDistributorId && assignedDistributorId !== distributorId) {
      setPendingAssignId(distributorId);
      setReassignConfirmOpen(true);
    } else {
      doAssign(distributorId);
    }
  };

  const handleUnassign = async (distributorId) => {
    try {
      await updateUnassign({ orderID, distributorID: distributorId }).unwrap();
      toast.success("Distributor unassigned successfully.");
      onAssignSuccess?.(orderID, null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to unassign distributor.");
    }
  };

  const handleConfirmReassign = () => {
    const id = pendingAssignId;
    setReassignConfirmOpen(false);
    setPendingAssignId(null);
    if (id && orderID) doAssign(id);
  };

  const handleCancelReassign = () => {
    setReassignConfirmOpen(false);
    setPendingAssignId(null);
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
            loading={isFetching}
            mode="assign"
            assignedDistributorId={assignedDistributorId}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
            onView={(id) => navigate(`/distributor/${id}`)}
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