import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { phantomGet } from "phantom-request";
import Cookies from "js-cookie";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AddCommasToNumber } from "../utils/utils";

export default function OrderDetails() {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt");

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, refetch } = phantomGet({
    route: `order/${orderID}`,
    token: jwt,
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
  }, [orderID]); // eslint-disable-line

  useEffect(() => {
    if (data) {
      setOrderData(data);
      setLoading(false);
      setError(null);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Typography>Loading order details...</Typography>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Typography color="red">
          Failed to load order. Please try again.
        </Typography>
      </div>
    );
  }

  const order = orderData?.orders?.[0];

  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <Typography>Order not found.</Typography>
      </div>
    );
  }

  const {
    orderID: id,
    status,
    amount_paid,
    createdAt,
    delivery_code,
    address,
    customer_id,
    products,
    distributor_assigned,
    product_image,
  } = order;

  const customerName =
    `${customer_id?.first_name ?? ""} ${customer_id?.last_name ?? ""}`.trim();
  const initials =
    `${customer_id?.first_name?.[0] ?? ""}${customer_id?.last_name?.[0] ?? ""}`.toUpperCase();

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const statusColor =
    {
      Processing: "amber",
      Shipped: "blue",
      Delivered: "green",
      Cancelled: "red",
    }[status] ?? "gray";

  return (
    <div className="w-[95%] mx-auto py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate("/order")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Orders
        </button>
        <h1 className="text-lg font-medium">Order #{id}</h1>
        <Chip value={status} color={statusColor} size="sm" />
      </div>

      {/* Top grid — customer + order info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer card */}
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none pb-0"
          >
            <Typography
              variant="small"
              className="uppercase tracking-wide text-gray-500 font-medium text-xs"
            >
              Customer
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-medium text-sm">
                {initials || "?"}
              </div>
              <div>
                <p className="font-medium text-sm">{customerName || "—"}</p>
                <p className="text-xs text-gray-500">
                  {customer_id?.email ?? "—"}
                </p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <Row
                label="Phone"
                value={
                  address?.phone_number ?? customer_id?.phone_number ?? "—"
                }
              />
              <Row label="City" value={address?.city ?? "—"} />
              <Row label="Address" value={address?.address ?? "—"} />
            </div>
          </CardBody>
        </Card>

        {/* Order info card */}
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none pb-0"
          >
            <Typography
              variant="small"
              className="uppercase tracking-wide text-gray-500 font-medium text-xs"
            >
              Order info
            </Typography>
          </CardHeader>
          <CardBody>
            <div className="space-y-1 text-sm">
              <Row label="Order ID" value={`#${id}`} bold />
              <Row label="Date" value={formattedDate} />
              <Row
                label="Amount paid"
                value={`₦${AddCommasToNumber(amount_paid)}`}
                bold
              />
              <Row label="Delivery code" value={delivery_code ?? "—"} mono />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none pb-0"
        >
          <Typography
            variant="small"
            className="uppercase tracking-wide text-gray-500 font-medium text-xs"
          >
            Products
          </Typography>
        </CardHeader>
        <CardBody className="px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-gray-50">
                <th className="text-left px-6 py-2 text-gray-500 font-medium">
                  Product
                </th>
                <th className="text-right px-6 py-2 text-gray-500 font-medium">
                  Qty
                </th>
                <th className="text-right px-6 py-2 text-gray-500 font-medium">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-blue-gray-50 last:border-0"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {(item.product_id?.product_image ??
                      item.product_image) ? (
                        <img
                          src={
                            item.product_id?.product_image ?? item.product_image
                          }
                          alt={item.product_id?.product_name ?? "Product"}
                          className="w-10 h-10 rounded object-cover border border-blue-gray-50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                      <span>
                        {item.product_id?.product_name ??
                          item.product_id ??
                          "—"}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-6 py-3">
                    {item.product_quatity ?? item.product_quantity ?? "—"}
                  </td>
                  <td className="text-right px-6 py-3">
                    {item.product_id?.price
                      ? `₦${AddCommasToNumber(item.product_id.price)}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Assigned distributor */}
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none pb-0"
        >
          <Typography
            variant="small"
            className="uppercase tracking-wide text-gray-500 font-medium text-xs"
          >
            Assigned distributor
          </Typography>
        </CardHeader>
        <CardBody>
          {distributor_assigned ? (
            <div className="space-y-1 text-sm">
              <Row
                label="Name"
                value={
                  `${distributor_assigned.first_name ?? ""} ${distributor_assigned.last_name ?? ""}`.trim() ||
                  "—"
                }
              />
              <Row label="Email" value={distributor_assigned.email ?? "—"} />
              <Row
                label="Phone"
                value={distributor_assigned.phone_number ?? "—"}
              />
            </div>
          ) : (
            <Typography variant="small" className="text-gray-500">
              No distributor assigned yet.
            </Typography>
          )}
        </CardBody>
      </Card>

      {/* Delivery image (if present) */}
      {product_image && (
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none pb-0"
          >
            <Typography
              variant="small"
              className="uppercase tracking-wide text-gray-500 font-medium text-xs"
            >
              Delivery proof
            </Typography>
          </CardHeader>
          <CardBody>
            <img
              src={product_image}
              alt="Delivery proof"
              className="max-w-sm rounded-lg border border-blue-gray-50"
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Helper for key-value rows
function Row({ label, value, bold, mono }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-500">{label}</span>
      <span
        className={`${bold ? "font-medium" : ""} ${mono ? "font-mono tracking-wide" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
