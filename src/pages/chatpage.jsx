import { useEffect, useMemo, useState, useRef } from "react";
import MessageList from "../components/chat/messageList";
import MessageInput from "../components/chat/messageInput";
import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../layouts/defaultLayout";
import { socket } from "../services/socket";
import { Button, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  useAssignDriverMutation,
  useGetAssignedDriverQuery,
  useGetDriversQuery,
  useGetOrderQuery,
  useUnassignDriverMutation,
} from "../services/api";

const EMPTY = [];
const DRIVER_LIMIT = 100;

const ChatApp = () => {
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDriverList, setShowDriverList] = useState(false);
  const [searchParams] = useSearchParams();
  const orderID = searchParams.get("order");
  const bottomRef = useRef(null);

  const { data: orderData } = useGetOrderQuery(orderID, { skip: !orderID });
  const { data: assignedDriver } = useGetAssignedDriverQuery(orderID, {
    skip: !orderID,
  });
  const { data: driversData } = useGetDriversQuery({
    page: 1,
    limit: DRIVER_LIMIT,
  });

  const [assignDriver, { isLoading: assigning }] = useAssignDriverMutation();
  const [unassignDriver, { isLoading: unassigning }] =
    useUnassignDriverMutation();

  // Server is the source of truth; mutations invalidate "Order" so this
  // refreshes after assign / unassign.
  const currentAssigned = assignedDriver?.driver?._id ?? null;

  const activeDrivers = useMemo(
    () => (driversData?.driver ?? EMPTY).filter((d) => d.status === true),
    [driversData]
  );

  useEffect(() => {
    if (orderData) setStatus(orderData?.orders?.[0]?.status ?? "");
  }, [orderData]);

  useEffect(() => {
    const handleConnect = () =>
      console.log("Connected to socket server with ID:", socket.id);

    const handleReceive = (data) => {
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceive);
    if (orderID) socket.emit("joinRoom", { orderID });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receiveMessage", handleReceive);
    };
  }, [orderID]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDriverSelect = async (driver) => {
    try {
      await assignDriver({ orderID, driverID: driver._id }).unwrap();
      setStatus("driver assigned");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to assign driver.");
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignDriver({ orderID }).unwrap();
      setStatus("ready for pickup");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to unassign driver.");
    }
  };

  const handleSendMessage = (text) => {
    const message = { orderID, sender: "admin", type: "text", text };

    socket.emit("sendMessage", message, (response) => {
      const messageWithTimestamp = {
        ...response,
        orderID,
        sender: "admin",
        type: "text",
        text,
      };
      setMessages((prev) => [...prev, messageWithTimestamp]);
    });
  };

  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-between h-full">
        <MessageList messages={messages} />
        <div ref={bottomRef} />

        {showDriverList &&
          status === "ready for pickup" &&
          activeDrivers.length > 0 && (
            <div className="flex flex-col min-h-fit max-h-[10rem] overflow-y-auto fixed bottom-48 right-0 w-full max-w-[84%] space-y-2 p-4 bg-gray-100 rounded-lg">
              {activeDrivers.map((driver) => {
                const isAssigned = currentAssigned === driver._id;
                return (
                  <div
                    key={driver._id}
                    className="cursor-pointer flex justify-between items-center p-2 hover:bg-gray-200 rounded"
                  >
                    <Typography>
                      {driver?.firstName} {driver?.lastName}
                    </Typography>
                    <div className="flex gap-4">
                      <Button
                        variant="gradient"
                        onClick={() => handleDriverSelect(driver)}
                        disabled={currentAssigned !== null || assigning}
                      >
                        {isAssigned ? "Assigned" : "Assign"}
                      </Button>
                      {isAssigned && (
                        <Button
                          variant="outlined"
                          onClick={handleUnassign}
                          disabled={unassigning}
                        >
                          Unassign
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        <MessageInput
          setShowDriverList={() => setShowDriverList((v) => !v)}
          onSendMessage={handleSendMessage}
          status={status}
          orderID={orderID}
          setStatus={setStatus}
        />
      </div>
    </DefaultLayout>
  );
};

export default ChatApp;