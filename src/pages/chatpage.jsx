import { useEffect, useState, useRef } from "react";
import MessageList from "../components/chat/messageList";
import MessageInput from "../components/chat/messageInput";
import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../layouts/defaultLayout";
import { socket } from "../services/socket";
import { phantomGet, phantomPut } from "phantom-request";
import { Button, Typography } from "@material-tailwind/react";

const ChatApp = () => {
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentAssigned, setCurrentAssigned] = useState(null);
  const [activeDriver, setActiveDriver] = useState([]);
  const [showDriverList, setShowDriverList] = useState(false); // New state
  const [searchParams] = useSearchParams();
  const orderID = searchParams.get("order");
  const bottomRef = useRef(null);
  const itemsPerPage = 15;

  const { data: orderData } = phantomGet({ route: `order/${orderID}` });
  const { data: assignedDriver } = phantomGet({ route: `order/driver/assigned/${orderID}` });

  const { data: drivers, refetch } = phantomGet({
    route: "driver",
    params: { limit: itemsPerPage },
    fetchOnMount: false,
  });
  const { put, response, error } = phantomPut({
    route: "order/assign-driver",
    getLatestData: `order/${orderID}`,
  });
  const { put: unassignDriver } = phantomPut({
    route: "order/unassign-driver",
    getLatestData: `order/${orderID}`,
  });
  useEffect(() => {
    if (assignedDriver?.driver) {
      setCurrentAssigned(assignedDriver?.driver?._id || null);
    } else {
      setCurrentAssigned(null); // Handle when no distributor is assigned
    }
  }, [assignedDriver]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (drivers) {
      const activeDrivers = drivers.driver.filter((driver) => driver.status === true);
      setActiveDriver(activeDrivers);
    }
  }, [drivers, error, response]);

  useEffect(() => {
    if (orderData) {
      setStatus(orderData?.orders[0]?.status);
    }
  }, [orderData]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.id);
    });

    if (orderID) {
      socket.emit("joinRoom", { orderID });
    }

    socket.on("receiveMessage", (data) => {
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
      console.log("Socket connection closed.");
    };
  }, [orderID]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDriverSelect = (driver) => {
    put({ orderID, driverID: driver._id });
    setCurrentAssigned(driver._id);
    setStatus("driver assigned");
  };

  const handleUnassign = () => {
    unassignDriver({ orderID });
    setCurrentAssigned(null);
    setStatus("ready for pickup");
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

      setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
    });
  };

  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-between h-full">
        <MessageList messages={messages} />
        <div ref={bottomRef} />

        {showDriverList && status === "ready for pickup" && activeDriver.length > 0 && (
          <div className="flex flex-col min-h-fit max-h-[10rem] overflow-y-auto fixed bottom-48 right-0 w-full max-w-[84%] space-y-2 p-4 bg-gray-100 rounded-lg">
            {activeDriver.map((driver, index) => {
              const isAssigned = currentAssigned === driver._id;
              return (
                <div
                  key={index}
                  className="cursor-pointer flex justify-between items-center p-2 hover:bg-gray-200 rounded"
                >
                  <Typography>{driver?.firstName} {driver?.lastName}</Typography>
                  <div className="flex gap-4">
                    <Button
                      variant="gradient"
                      onClick={() => handleDriverSelect(driver)}
                      disabled={currentAssigned !== null}
                    >
                      {isAssigned ? "Assigned" : "Assign"}
                    </Button>
                    {isAssigned && (
                      <Button
                        variant="outlined"
                        onClick={handleUnassign}
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

        <MessageInput setShowDriverList={() => setShowDriverList(!showDriverList)} onSendMessage={handleSendMessage} status={status} orderID={orderID} setStatus={setStatus} />
      </div>
    </DefaultLayout>
  );
};

export default ChatApp;
