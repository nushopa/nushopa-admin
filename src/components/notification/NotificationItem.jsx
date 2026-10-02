import { ListItem, ListItemPrefix } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { TruncateString } from "../../lib/util/truncateString";
import { timeSince } from "../../lib/util/notificationTime";

export default function NotificationItem({ item, compact = false }) {
  const navigate = useNavigate();

  // Never crash the page because of one bad notification.
  if (!item || typeof item !== "object") return null;

  const date = item.createdAt ? new Date(item.createdAt) : null;
  const validDate = date && !Number.isNaN(date.getTime());

  const formattedDate = validDate
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";
  const createdAtFull = validDate ? date.toLocaleString() : "";
  const ago = validDate ? timeSince(item.createdAt) : "";

  const handleClick = () => {
    switch (item.category) {
      case "newsletter":
        navigate("/newsletter");
        break;
      case "support-portal":
        navigate("/support-message");
        break;
      case "account-creation":
        navigate("/customer");
        break;
      case "order":
      case "market-rep":
        if (item.orderId) navigate(`/order/${item.orderId}`);
        break;
      case "driver":
        navigate("/driver");
        break;
      default:
        break;
    }
  };

  const titleSize = compact ? "text-md" : "text-lg";
  const titleBase = `${titleSize} font-medium group-hover:text-mainGreen`;
  const titleDark = `${titleBase} text-black`;
  const titleGray = `${titleBase} text-gray-700`;
  const meta = "text-sm text-gray-400 mt-1";

  const timeLine = (
    <p className={meta}>
      {ago} {ago && formattedDate ? "•" : ""} {formattedDate}
    </p>
  );
  const createdLine = <p className={meta}>Created At: {createdAtFull}</p>;

  let content;
  switch (item.category) {
    case "newsletter":
      content = (
        <div>
          <div className={titleDark}>{item.title}</div>
          <p className="text-gray-600">{item.message}</p>
          {timeLine}
        </div>
      );
      break;
    case "support-portal":
      content = (
        <div>
          <div className={titleDark}>Support Portal Message: {item.message}</div>
          <p className="text-gray-600">{item.title}</p>
          {timeLine}
        </div>
      );
      break;
    case "account-creation":
      content = (
        <div>
          <div className={titleDark}>New Account Created: {item.full_name}</div>
          <p className="text-gray-600">{item.title}</p>
          {timeLine}
        </div>
      );
      break;
    case "order":
      content = (
        <div>
          <div className={titleGray}>{item.title}</div>
          <p className="text-gray-600">{item.message}</p>
          <p className={meta}>Order ID: {item.orderId}</p>
          <p className={meta}>Customer ID: {item.customer_id}</p>
          {createdLine}
        </div>
      );
      break;
    case "market-rep":
    case "driver":
      content = (
        <div>
          <div className={titleGray}>{item.title}</div>
          <p className="text-gray-600">{item.message}</p>
          {createdLine}
        </div>
      );
      break;
    default:
      content = (
        <div>
          <div className={titleGray}>
            {TruncateString({ str: item.full_name || "", num: 25 })}
          </div>
          <p className="text-gray-600">{item.message}</p>
          {timeLine}
        </div>
      );
  }

  return (
    <ListItem
      onClick={handleClick}
      className={`group flex items-start ${
        compact ? "p-3" : "p-4"
      } rounded-lg hover:bg-gray-100 cursor-pointer transition`}
    >
      <ListItemPrefix>
        <div className="w-12 h-12 bg-mainGreen text-white flex items-center justify-center rounded-full">
          PF
        </div>
      </ListItemPrefix>
      {content}
    </ListItem>
  );
}