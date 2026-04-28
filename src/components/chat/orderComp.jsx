import { useState, useEffect } from "react";

const SectionTitle = ({ title }) => (
  <h2 className="text-2xl font-semibold text-[#007145] border-b pb-2">
    {title}
  </h2>
);

const DetailItem = ({ label, value }) => (
  <p className="text-gray-800">
    <span className="font-semibold text-black">{label}: </span>
    <span>{value || "N/A"}</span>
  </p>
);

const CustomerDetails = ({ customer, createdAt }) => (
  <section className="space-y-3">
    <SectionTitle title="Customer Details" />
    <DetailItem
      label="Full Name"
      value={`${customer?.first_name} ${customer?.last_name}`}
    />
    <DetailItem label="Phone Number" value={customer?.phone_number} />
    <DetailItem
      label="Order Date"
      value={new Date(createdAt).toLocaleDateString()}
    />
  </section>
);

const DeliveryDetails = ({ address, extraDetails }) => (
  <section className="space-y-3">
    <SectionTitle title="Delivery Details" />
    <DetailItem
      label="Full Name"
      value={`${address?.first_name} ${address?.last_name}`}
    />
    <DetailItem label="Email" value={address?.email} />
    <DetailItem label="Phone Number" value={address?.phone_number} />
    <DetailItem label="Address" value={address?.address} />
    <DetailItem
      label="State/City"
      value={`${address?.state} - ${address?.city}`}
    />
    {address?.additional_phone_number && (
      <DetailItem
        label="Additional Phone"
        value={address?.additional_phone_number}
      />
    )}
    {address?.directions && (
      <DetailItem label="Directions" value={address?.directions} />
    )}
     {extraDetails.map(({ label, value }) => (
      <DetailItem key={label} label={label} value={value} />
    ))}
  </section>
);

const EntityDetails = ({ title, entity, extraDetails = [] }) => (
  <section className="space-y-3">
    <SectionTitle title={title} />
    <DetailItem
      label="Full Name"
      value={`${entity?.firstName} ${entity?.lastName}`}
    />
    <DetailItem label="Email" value={entity?.email} />
    <DetailItem label="Phone Number" value={entity?.phoneNumber} />
    {extraDetails.map(({ label, value }) => (
      <DetailItem key={label} label={label} value={value} />
    ))}
  </section>
);

const OrderSummary = ({ orderID, status, amount_paid }) => (
  <section className="space-y-3">
    <SectionTitle title="Order Summary" />
    <DetailItem label="Order ID" value={orderID} />
    <DetailItem label="Status" value={status} />
    <DetailItem label="Amount Paid" value={amount_paid} />
  </section>
);

const ProductDetails = ({ products }) => (
  <section className="space-y-6">
    <SectionTitle title="Product Details" />
    {products?.map((productItem, index) => (
      <div key={index} className="p-4 border rounded-md shadow-sm bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={productItem?.product_id?.product_image}
            alt="product"
            className="w-24 h-24 rounded-md object-cover"
          />
          <div className="flex-1">
            <DetailItem
              label="Product"
              value={productItem?.product_id?.product_name}
            />
            <DetailItem label="Quantity" value={productItem?.product_quatity} />
            <DetailItem
              label="Price"
              value={productItem?.product_id?.product_cost_price}
            />
          </div>
        </div>
        {productItem?.product_id?.alt_image?.length > 0 && (
          <div className="mt-2">
            <span className="font-bold text-black">Other Images: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {productItem.product_id.alt_image.map((imgLink, idx) => (
                <img
                  key={idx}
                  src={imgLink}
                  alt={`alt ${idx}`}
                  className="w-16 h-16 rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </section>
);

const OrderComp = ({ isUserMessage, message }) => {
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    setOrderDetails(message.orders || message);
  }, [message]);

  if (!orderDetails || Object.keys(orderDetails).length === 0) {
    return <p className="text-gray-500">Loading order details...</p>;
  }

  const {
    customer_id: customer,
    address,
    driver_assigned: driver,
    distributor_assigned: distributor,
    pickup_distance,
    pickup_duration,
    delivery_distance,
    delivery_duration,
  } = orderDetails;

  return (
    <div
      className={`w-full max-w-3xl rounded-xl shadow-md bg-white border border-gray-200 p-6 space-y-8 ${
        isUserMessage
          ? "rounded-t-[10px] rounded-bl-[10px]"
          : "rounded-t-[10px] rounded-br-[10px]"
      }`}
    >
      <CustomerDetails
        customer={customer}
        createdAt={orderDetails?.createdAt}
      />
      <DeliveryDetails
        address={address}
        extraDetails={
          delivery_distance !== "0km" && delivery_duration !== "0min"
            ? [
                { label: "Delivery Distance", value: delivery_distance },
                { label: "Delivery Duration", value: delivery_duration },
              ]
            : []
        }
      />
      {driver && (
        <EntityDetails
          title="Driver Details"
          entity={driver}
          extraDetails={[
            { label: "City", value: driver.workCity },
            { label: "Vehicle Type", value: driver.vehicleType },
            ...(pickup_distance !== "0km" && pickup_duration !== "0min"
              ? [
                  { label: "Distance to Pickup", value: pickup_distance },
                  { label: "Pickup Duration", value: pickup_duration },
                ]
              : []),
          ]}
        />
      )}
      {distributor && (
        <EntityDetails
          title="Distributor Details"
          entity={distributor}
          extraDetails={[
            { label: "City", value: distributor?.city },
            { label: "Address", value: distributor?.address },
          ]}
        />
      )}
      <OrderSummary
        orderID={orderDetails?.orderID}
        status={orderDetails?.status}
        amount_paid={orderDetails?.amount_paid}
      />
      <ProductDetails products={orderDetails?.products} />
    </div>
  );
};

export default OrderComp;
