import { Button } from "@material-tailwind/react";
import { phantomPut } from "phantom-request";
import { useEffect, useState } from "react";
import { useUpdateUnassignMutation } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MessageInput = ({ onSendMessage, status, orderID, setStatus, setShowDriverList }) => {
  const [inputValue, setInputValue] = useState("");
  const [updateUnassign] = useUpdateUnassignMutation();
  const { put, loading, latestData } = phantomPut({
    route: "order/update",
    getLatestData: `order/${orderID}`,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && latestData) {
      setStatus(latestData?.orders[0]?.status || ""); // Update only if there's a change
    }
  }, [latestData, loading, setStatus]);
  const handleSend = () => {
    if (inputValue) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      put({ orderID, status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUnassign = async () => {
    try {
      await updateUnassign({ orderID }).unwrap();
      handleUpdateStatus("cancelled");
      setStatus("cancelled");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to unassign distributor");
    }
  };

  const handleReset = async () => {
    handleUpdateStatus("Processing");
    setStatus("Processing");
  }
  const handleComplete = () => {
    if (window.confirm("Has this order been completed?")) {
      handleUpdateStatus("completed");
    }
  };

  return (
    <div className="flex flex-col h-[26vh] fixed bottom-0.5 right-0 w-full max-w-[84%] space-y-2 p-4 bg-gray-100 rounded-lg">
      <div>status: {status || "ready for pickup"}</div>
      <div className="flex gap-4">
        <Button
          onClick={handleUnassign}
          disabled={status !== "Processing"}
          className={`flex items-center ${status === "Processing" ? "bg-mainGreen text-white" : "bg-gray-300 text-gray-500"
            } border-2 border-mainGreen gap-2 px-4 py-2 rounded-lg`}
        >
          Cancel
        </Button>
        <Button
          onClick={setShowDriverList}
          disabled={status !== "ready for pickup"}
          className={`flex items-center ${status === "ready for pickup" ? "bg-mainGreen text-white" : "bg-gray-300 text-gray-500"
            } border-2 border-mainGreen gap-2 px-4 py-2 rounded-lg`}
        >
          Assign Driver
        </Button>
        <Button
          onClick={handleComplete}
          disabled={status !== "delivered"}
          className={`flex items-center ${status === "delivered" ? "bg-mainGreen text-white" : "bg-gray-300 text-gray-500"
            } border-2 border-mainGreen gap-2 px-4 py-2 rounded-lg`}
        >
          Completed
        </Button>
        <Button
          disabled={false}
          onClick={handleReset}
          className="flex items-center text-mainGreen gap-2 px-4 py-2 bg-transparent border-2 border-mainGreen rounded-lg hover:bg-[#243730]"
        >
          Reset
        </Button>
      </div>
      <div className="flex flex-1 items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 placeholder:text-[12.5px] placeholder:leading-[18.75px] border-[#9A9A9A] px-4 py-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
        />
        <button
          onClick={handleSend}
          className="bg-[#007145] text-white text-md h-[4rem] w-[5rem] rounded-lg hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
