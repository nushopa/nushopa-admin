import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardBody, Input } from "@material-tailwind/react";
import { useState, useMemo } from "react";
import Pagination from "../pagination/pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrdersQuery,
  useUpdateStatusMutation,
} from "../../../services/api";
import { OrderTableComponent } from "./OrderTableComponent";
import { AssignDistributorModal } from "./AssignDistributorModal";

const EMPTY = [];
const ITEMS_PER_PAGE = 5;

export function OrderTable() {
  const navigate = useNavigate();

  const [searchField, setSearchField] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningOrderID, setAssigningOrderID] = useState(null);

  const [updateOrder] = useUpdateStatusMutation();

  // Mutations invalidate the "Order" tag, so this list refetches by itself.
  const { data } = useGetOrdersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const orders = data?.orders ?? EMPTY;
  const totalPages = data?.totalPages || 1;

  const filteredDetails = useMemo(() => {
    const q = searchField.toLowerCase();
    return orders.filter((o) =>
      [
        o.orderID,
        o.status,
        o.customer_id?.email,
        o.customer_id?.phone_number,
        o.customer_id?.first_name,
        o.customer_id?.last_name,
      ]
        .map((v) => String(v ?? "").toLowerCase())
        .some((v) => v.includes(q))
    );
  }, [orders, searchField]);

  const handleActionClick = (orderId) => {
    setSelectedOrderId(orderId);
    setDropdownVisible((cur) => !cur);
  };

  const handleStatusSelect = async (status, orderID) => {
    if (
      status === "Delivered" &&
      !window.confirm("Are you sure this goods have been delivered?")
    ) {
      setDropdownVisible(false);
      return;
    }
    try {
      await updateOrder({ status, orderID }).unwrap();
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error(err?.data?.message || "Failed to update order status.");
    }
    setDropdownVisible(false);
  };

  const handleAssignOpen = (orderID) => {
    setAssigningOrderID(orderID);
    setAssignModalOpen(true);
  };

  return (
    <Card className="h-full w-[95%] mx-auto">
      <AssignDistributorModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        orderID={assigningOrderID}
      />

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>Order History</div>
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              label="Search"
              placeholder="Order ID, customer email, name, phone number"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-0">
        <OrderTableComponent
          orders={filteredDetails}
          selectedOrderId={selectedOrderId}
          isDropdownVisible={isDropdownVisible}
          onRowClick={(orderID) => navigate(`/order/${orderID}`)}
          onActionClick={handleActionClick}
          onStatusSelect={handleStatusSelect}
          onAssign={handleAssignOpen}
        />
      </CardBody>

      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
}