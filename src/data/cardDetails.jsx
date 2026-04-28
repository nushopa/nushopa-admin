import { Avatar } from "@material-tailwind/react";
import AddCommasToNumber from "../lib/util/addComma"; // Ensure you import the utility

export const CardDetails = ({ totalRevenue, totalCustomer, totalProducts, totalProductSold }) => {
  const cardDetails = [
    {
      bgColor: "lightGreen",
      iconUrl: "https://res.cloudinary.com/phantom1245/image/upload/v1707694723/farm2home/Frame_10122797_dygaxk.png",
      title: "Total Revenue",
      value: totalRevenue,
    },
    {
      bgColor: "lightOrange",
      iconUrl: "https://res.cloudinary.com/phantom1245/image/upload/v1707694710/farm2home/Frame_10122797_1_bvp4li.png",
      title: "Total Customers",
      value: totalCustomer,
    },
    {
      bgColor: "lightPurple",
      iconUrl: "https://res.cloudinary.com/phantom1245/image/upload/v1707694702/farm2home/Frame_10122797_2_hy72kn.png",
      title: "Total Products",
      value: totalProducts,
    },
    {
      bgColor: "lightRed",
      iconUrl: "https://res.cloudinary.com/phantom1245/image/upload/v1707694753/farm2home/Frame_10122797_3_d5ri4x.png",
      title: "Total Product Sold",
      value: totalProductSold,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cardDetails.map((items, index) => (
        <div key={index} className={`w-[16rem] p-3 rounded bg-opacity-70 bg-${items.bgColor}`}>
          <div>
            <Avatar src={items.iconUrl} />
          </div>
          <div className="capitalize pt-6 font-workSans pb-1 text-lg">{items.title}</div>
          <div className="text-2xl font-semibold pb-1">
            {items.title === "Total Revenue" ? "₦" : ""}
            {AddCommasToNumber(items.value)}
          </div>
        </div>
      ))}
    </div>
  );
};
