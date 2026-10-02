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
import { useState, useMemo } from "react";
import Pagination from "../pagination/pagination";
import {
  useDeleteDistributorMutation,
  useGetDistributorsQuery,
  useUpdateAssignMutation,
  useUpdateUnassignMutation,
} from "../../../services/api";
import { UpdateDistributorsDialog } from "../dialogs/updateDistributorsDialog";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DistributorsTableComponent } from "./DistributorsTableComponent";

const EMPTY = [];
const ITEMS_PER_PAGE = 15;

export function DistributorsTable() {
  const navigate = useNavigate();

  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState(null);
  const [deleteDistributorMutation] = useDeleteDistributorMutation();
  const { handleDelete } = useDeleteHandler(
    deleteDistributorMutation,
    "distributor"
  );
  const [searchField, setSearchField] = useState("");
  const [assignedDistributorId, setAssignedDistributorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [updateAssign] = useUpdateAssignMutation();
  const [updateUnassign] = useUpdateUnassignMutation();

  const { data, isFetching } = useGetDistributorsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const distributors = data?.distributors ?? EMPTY;
  const totalPages = data?.totalPages || 1;

  // The row component shows first_name/last_name, other code uses
  // firstName/lastName, so search every variant.
  const filteredDetails = useMemo(() => {
    const term = searchField.toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(term);
    return distributors.filter(
      (d) =>
        has(d.city) ||
        has(d.contact) ||
        has(d.address) ||
        has(d.email) ||
        has(d.phone_number) ||
        has(d.first_name) ||
        has(d.last_name) ||
        has(d.firstName) ||
        has(d.lastName)
    );
  }, [distributors, searchField]);

  // ---------- Assign (needs an order ID) ----------
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
    try {
      const res = await updateAssign({
        orderID: orderId.trim(),
        distributorID: selectedDistributorId,
      }).unwrap();

      const assignedOrderID = res?.order?.orderID;
      const distributorId = res?.order?.distributor_assigned?._id;
      if (assignedOrderID && distributorId) {
        setAssignedDistributorId(distributorId);
        navigate(`/chat/${distributorId}?order=${assignedOrderID}`);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    } finally {
      handleOrderDialogClose();
    }
  };

  const handleAssign = (distributorId) => {
    setSelectedDistributorId(distributorId);
    setOrderDialogOpen(true);
  };

  // ---------- Unassign ----------
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false);

  const handleUnassign = (distributorId) => {
    setSelectedDistributorId(distributorId);
    setUnassignDialogOpen(true);
  };

  const handleUnassignConfirm = async () => {
    try {
      await updateUnassign({ distributorID: selectedDistributorId }).unwrap();
      toast.success("Distributor unassigned successfully.");
      setAssignedDistributorId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to unassign distributor.");
    } finally {
      setUnassignDialogOpen(false);
      setSelectedDistributorId(null);
    }
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
          Are you sure you want to unassign this distributor from the order?
          This action cannot be undone.
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
          loading={isFetching}
          onRowClick={(id) => navigate(`/distributor/${id}`)}
          onEdit={(id) => {
            setSelectedDistributorId(id);
            setUpdateOpen(true);
          }}
          onDelete={handleDelete}
          assignedDistributorId={assignedDistributorId}
          onAssign={handleAssign}
          onUnassign={handleUnassign}
          onView={(id) => navigate(`/distributor/${id}`)}
        />
      </CardBody>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
}