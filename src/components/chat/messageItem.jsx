import OrderComp from "./orderComp";

const MessageItem = ({ message }) => {
  const isUserMessage = message.sender === "user";
  const hasOrder = message.orders;
  if (hasOrder)
    return (
      <>
        <OrderComp isUserMessage={isUserMessage} message={message} />
      </>
    );
  return (
    <div
      className={` w-fit px-4 py-[13px] text-[12.5px] leading-[18.75px] text-[#000000] h-fit  message-item ${
        isUserMessage
          ? "sent rounded-t-[10px] rounded-bl-[10px] "
          : "received rounded-t-[10px] rounded-br-[10px]"
      }`}
      style={{
        backgroundColor: isUserMessage ? "#007145" : " #D9D9D9",
        color: isUserMessage ? "#fff" : "#000",
        alignSelf: isUserMessage ? "flex-end" : "flex-start",
      }}
    >
      {message.type === "text" && <p>{message.text}</p>}
      {message.type === "image" && (
        <img
          className=" h-[100px] w-20"
          src={message.imageUrl}
          alt="Sent image"
        />
      )}
      {message.order && <OrderComp />}
    </div>
  );
};

export default MessageItem;
