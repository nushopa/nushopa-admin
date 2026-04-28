import { useState } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { LifebuoyIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { logoutRedirect } from "phantom-request";

export function Sidebar() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: <PresentationChartBarIcon className="h-6 w-6" />, label: "Dashboard", path: "/" },
    { icon: <ShoppingBagIcon className="h-6 w-6" />, label: "Products", path: "/products" },
    { icon: <UsersIcon className="h-6 w-6" />, label: "Customers", path: "/customer" },
    { icon: <ShoppingBagIcon className="h-6 w-6" />, label: "Orders", path: "/order" },
    { icon: <NewspaperIcon className="h-6 w-6" />, label: "Newsletter", path: "/newsletter" },
    // { icon: <MapIcon className="h-6 w-6" />, label: "Markets", path: "#" },
    { icon: <UserGroupIcon className="h-6 w-6" />, label: "Market Rep", path: "/distributors" },
    {
      icon: (
        <img
          src="https://res.cloudinary.com/phantom1245/image/upload/v1734295978/uploads/tabler_steering-wheel-filled_r41mmd.png"
          alt="Driver Icon"
          className="h-6 w-6"
        />
      ),
      label: "Driver",
      path: "/driver",
    },
    { icon: <LifebuoyIcon className="h-6 w-6" />, label: "Support", path: "/support-message" },
    { icon: <XCircleIcon className="h-6 w-6" />, label: "Logout", onClick: logoutRedirect },
  ];

  return (
    <div
      className={`sticky top-0 left-0 h-screen ${isExpanded ? "w-60" : "w-16"
        } transition-all duration-300 bg-mainGreen shadow-xl flex flex-col justify-center items-center `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <List className="w-full flex flex-col items-start">
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            onClick={item.path ? () => navigate(item.path) : item.onClick}
            className={`text-white flex items-center w-full px-4 py-2 ${isExpanded ? "justify-start" : "justify-center"
              }`}
          >
            {!isExpanded && item.icon}
            {isExpanded && (
              <>
                <ListItemPrefix className="flex items-center justify-center">
                  {item.icon}
                </ListItemPrefix>
                <span className=" text-sm font-medium">{item.label}</span>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
}
