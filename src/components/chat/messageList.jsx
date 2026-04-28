import MessageItem from "./messageItem";
import { groupMessagesByDate } from "../../lib/util/formatDate";

const MessageList = ({ messages }) => {
  const groupedMessages = groupMessagesByDate(messages); // Group messages by date

  return (
    <div className="pb-32 flex flex-col">
      {Object.keys(groupedMessages).map((dateHeading) => (
        <div
          className="flex flex-col w-full gap-[33px] p-4 pb-10"
          key={dateHeading}
        >
          <div className="text-center font-normal my-2 text-[#7f7f7f] text-md">{dateHeading}</div> {/* Display the date heading */}
          {groupedMessages[dateHeading].map((message, index) => (
            <MessageItem 
              key={`${message.timestamp}-${index}`} // Use timestamp and index as a unique key
              message={message} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
