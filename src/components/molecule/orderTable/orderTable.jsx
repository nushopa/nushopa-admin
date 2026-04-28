import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardBody, Input } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import { useNavigate } from "react-router-dom";
import { useUpdateStatusMutation } from "../../../services/api";
import { phantomGet } from "phantom-request";
import Cookies from "js-cookie";
import { OrderTableComponent } from "./OrderTableComponent";
import { AssignDistributorModal } from "./AssignDistributorModal";

export function OrderTable() {
  const jwt = Cookies.get("jwt");
  const navigate = useNavigate();

  const [order, setOrder] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [updateOrder] = useUpdateStatusMutation();

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningOrderID, setAssigningOrderID] = useState(null);

  // { [orderID]: distributorId }
  const [assignedOrders, setAssignedOrders] = useState({});

  const { data: orderData, refetch } = phantomGet({
    route: "order",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
  }, [currentPage]); // eslint-disable-line

  useEffect(() => {
    if (orderData) {
      const orders = orderData?.orders ?? [];
      setOrder(orders);
      setFilteredDetails(orders);
      setTotalPages(orderData?.totalPages || 1);

      const existing = {};
      orders.forEach((o) => {
        if (o.distributor_assigned) {
          existing[o.orderID] =
            o.distributor_assigned?._id ?? o.distributor_assigned;
        }
      });
      setAssignedOrders(existing);
    }
  }, [orderData]);

  // Search filter
  useEffect(() => {
    const q = searchField.toLowerCase();
    setFilteredDetails(
      order.filter((o) =>
        [
          o.orderID,
          o.status,
          o.customer_id?.email,
          o.customer_id?.phone_number,
          o.customer_id?.first_name,
          o.customer_id?.last_name,
        ]
          .map((v) => (v || "").toLowerCase())
          .some((v) => v.includes(q))
      )
    );
  }, [searchField, order]);

  const handleActionClick = (orderId) => {
    setSelectedOrderId(orderId);
    setDropdownVisible((cur) => !cur);
  };

  const handleStatusSelect = async (status, orderID) => {
    const proceed = async () => {
      try {
        const res = await updateOrder({ status, orderID }).unwrap();
        if (res.order) {
          setOrder((prev) =>
            prev.map((o) =>
              o._id === res.order._id ? { ...o, status: res.order.status } : o
            )
          );
        }
      } catch (err) {
        console.error("Error updating order:", err);
      }
    };

    if (status === "Delivered") {
      if (window.confirm("Are you sure this goods have been delivered?")) {
        await proceed();
      } else {
        setDropdownVisible(false);
        return;
      }
    } else {
      await proceed();
    }
    setDropdownVisible(false);
  };

  const handleAssignOpen = (orderID) => {
    setAssigningOrderID(orderID);
    setAssignModalOpen(true);
  };

  const handleAssignSuccess = (orderID, distributorId) => {
    setAssignedOrders((prev) => ({ ...prev, [orderID]: distributorId }));
  };

  return (
    <Card className="h-full w-[95%] mx-auto">
      <AssignDistributorModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        orderID={assigningOrderID}
        onAssignSuccess={handleAssignSuccess}
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
          assignedOrders={assignedOrders}
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