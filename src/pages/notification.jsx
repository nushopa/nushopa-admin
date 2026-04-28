import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import DefaultLayout from "../layouts/defaultLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import { useDispatch } from "react-redux";
import { addNotification, setNotifications } from "../redux/notificationSlice";
import { TruncateString } from "../lib/util/truncateString";
import { timeSince } from "../lib/util/notificationTime";
import { phantomGet } from "phantom-request";
import { BellSlashIcon } from "@heroicons/react/24/solid";

export default function NotificationPage() {
  const { data: notificationsData } = phantomGet({ route: "notification" });
  const [notifications, setNotificationsState] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("notification", (newNotification) => {
      dispatch(addNotification(newNotification));
    });

    return () => {
      socket.off("notification");
    };
  }, [dispatch]);
  useEffect(() => {
    if (notificationsData) {
      dispatch(setNotifications(notificationsData));
      setNotificationsState(notificationsData);
    }
  }, [notificationsData, dispatch]);
  return (
    <DefaultLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold text-mainGreen mb-4">Notifications</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Card className="p-6 rounded-lg shadow-lg overflow-hidden bg-white">
              {notifications.length > 0 ? (
                <List>
                  {notifications
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((item, index) => {
                      const formattedDate = new Date(item?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      });

                      return (
                        <ListItem
                          key={index}
                          onClick={() => {
                            if (item.category === "newsletter") {
                              navigate(`/newsletter`);
                            } else if (item.category === "support-portal") {
                              navigate(`/support`);
                            } else if (item.category === "account-creation") {
                              navigate("/customer");
                            } else if (item.category === "order") {
                              navigate(`/order/${item.orderId}`);
                            } else if (item.category === "market-rep") {
                              navigate(`/order/${item.orderId}`);
                            } else if (item.category === "driver") {
                              navigate(`/driver`);
                            }
                          }}
                          className="group flex items-start p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                        >
                          <ListItemPrefix>
                            <div className="w-12 h-12 bg-mainGreen text-white flex items-center justify-center rounded-full">
                              PF
                            </div>
                          </ListItemPrefix>
                          <div>
                            {item.category === "newsletter" ? (
                              <div>
                                <div className="text-lg font-medium text-black group-hover:text-mainGreen">
                                {item?.title}
                                </div>
                                <p className="text-gray-600">{item?.message}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {timeSince(item.createdAt)} • {formattedDate}
                                </p>
                              </div>
                            ) : item.category === "support-portal" ? (
                              <div>
                                <div className="text-lg font-medium text-black group-hover:text-mainGreen">
                                  Support Portal Message: {item?.message}
                                </div>
                                <p className="text-gray-600">{item?.title}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {timeSince(item.createdAt)} • {formattedDate}
                                </p>
                              </div>
                            ) : item.category === "account-creation" ? (
                              <div>
                                <div className="text-lg font-medium text-black group-hover:text-mainGreen">
                                  New Account Created: {item?.full_name}
                                </div>
                                <p className="text-gray-600">{item.title}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {timeSince(item.createdAt)} • {formattedDate}
                                </p>
                              </div>
                            ) : item.category === "order" ? (
                              <div>
                                <div className="text-lg font-medium text-gray-700 group-hover:text-mainGreen">
                                  {item?.title}
                                </div>
                                <p className="text-gray-600">{item?.message}</p>
                                <p className="text-sm text-gray-400 mt-1">Order ID: {item.orderId}</p>
                                <p className="text-sm text-gray-400 mt-1">Customer ID: {item.customer_id}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Created At: {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                            ) : item.category === "market-rep" ? (
                              <div>
                                <div className="text-lg font-medium text-gray-700 group-hover:text-mainGreen">
                                  {item?.title}
                                </div>
                                <p className="text-gray-600">{item?.message}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Created At: {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                            ) : item.category === "driver" ? (
                              <div>
                                <div className="text-lg font-medium text-gray-700 group-hover:text-mainGreen">
                                  {item?.title}
                                </div>
                                <p className="text-gray-600">{item?.message}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Created At: {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <div className="text-lg font-medium text-gray-700 group-hover:text-mainGreen">
                                  {TruncateString({ str: item?.full_name, num: 25 })}
                                </div>
                                <p className="text-gray-600">{item?.message}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {timeSince(item.createdAt)} • {formattedDate}
                                </p>
                              </div>
                            )}
                          </div>
                        </ListItem>
                      );
                    })}
                </List>
              ) : (
                <div className="text-center py-20">
                  <BellSlashIcon className="w-40 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">You’re all caught up!</p>
                  <p className="text-gray-400">No new notifications for now.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
