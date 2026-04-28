import {
  Badge,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Tooltip,
} from "@material-tailwind/react";
import DefaultLayout from "../layouts/defaultLayout";
import { useEffect, useState } from "react";
import { Analytics } from "../components/analytics/analyticChart";
import { OrderTable } from "../components/molecule/orderTable/orderTable";
import { useNavigate } from "react-router-dom";
import { AddCityDialog } from "../components/molecule/dialogs/addCityDialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { UpdateCityDialog } from "../components/molecule/dialogs/updateCityDialog";
import { useDeleteCityMutation } from "../services/api";
import { TruncateString } from "../lib/util/truncateString";
import { socket } from "../services/socket";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, setNotifications } from "../redux/notificationSlice";
import { CardDetails } from "../data/cardDetails";
import { timeSince } from "../lib/util/notificationTime";
import useDeleteHandler from "../lib/hook/useDeleteHandler";
import { phantomGet } from "phantom-request";
import Cookies from "js-cookie";
import AdvertComponent from "../components/Advert/AdvertComponent";

export default function Dashboard() {
  const jwt = Cookies.get("jwt");

  const { data: customersData, loading: customerLoading } = phantomGet({
    route: "customers",
    token: jwt,
  });
  const { data: priceListData, loading: priceListLoading } = phantomGet({
    route: "pricelist",
  });
  const { data: productsData, loading: productsLoading } = phantomGet({
    route: "product/total",
  });
  const { data: totalRevenueData, loading: totalRevenueLoading } = phantomGet({
    route: "order/total/order",
  });
  const { data: totalProductSoldData, loading: totalProductSoldLoading } =
    phantomGet({ route: "order/total/sold" });
  const { data: notificationsData, loading: notificationsLoading } = phantomGet(
    { route: "notification" },
  );

  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductSold, setTotalProductSold] = useState(0);

  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [cityPrice, setCityPrice] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);

  let navigate = useNavigate();
  const [deleteCityMutation] = useDeleteCityMutation();
  const { handleDelete } = useDeleteHandler(deleteCityMutation);
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notifications);

  useEffect(() => {
    // Listen for real-time notifications
    socket.on("notification", (newNotification) => {
      dispatch(addNotification(newNotification));
    });

    // Cleanup the effect
    return () => {
      socket.off("notification");
    };
  }, [dispatch]);

  useEffect(() => {
    if (customersData) setTotalCustomer(customersData?.totalItems);
    if (priceListData) setCityPrice(priceListData.prices);
    if (productsData) setTotalProducts(productsData.totalProducts);
    if (totalRevenueData) setTotalRevenue(totalRevenueData.totalRevenue);
    if (totalProductSoldData) setTotalProductSold(totalProductSoldData);
    if (notificationsData) dispatch(setNotifications(notificationsData));
  }, [
    customersData,
    priceListData,
    productsData,
    totalRevenueData,
    totalProductSoldData,
    notificationsData,
    dispatch,
  ]);
  if (
    !customerLoading &&
    !priceListLoading &&
    !productsLoading &&
    !totalRevenueLoading &&
    !totalProductSoldLoading &&
    notificationsLoading
  ) {
    return <div>Loading...</div>;
  }
  const handleOpenCityDialog = () =>
    setOpenCityDialog((prevState) => !prevState);
  const handleUpdateOpen = (CityId) => {
    setSelectedCityId(CityId);
    setUpdateOpen(true);
  };

  return (
    <DefaultLayout>
      <AddCityDialog open={openCityDialog} handleOpen={handleOpenCityDialog} />
      <UpdateCityDialog
        open={updateOpen}
        handleOpen={() => setUpdateOpen(false)}
        CityId={selectedCityId}
      />
      <div className="px-3 pt-6 font-medium  my-2">
        <CardDetails
          totalRevenue={totalRevenue}
          totalCustomer={totalCustomer}
          totalProducts={totalProducts}
          totalProductSold={totalProductSold}
        />
        <div className="capitalize pt-8 font-workSans pb-1 text-lg">
          Analytics
        </div>
        <div className="w-full flex gap-5 justify-between">
          <div className="w-[70%]">
            <Analytics />
          </div>
          <div className="w-[30%] mt-3">
            <Card className="w-full  mt-9 overflow-y-auto h-[20rem] rounded-md">
              {notifications.length > 0 ? (
                <List className="my-2 p-0">
                  {notifications
                    ?.slice()
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    ?.map((item, index) => {
                      const dateObject = new Date(item?.createdAt);

                      // Format the date as YYYY-MM-DD
                      const formattedDate = dateObject.toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      );
                      return (
                        <div key={index}>
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
                            className="group flex items-start p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                          >
                            <ListItemPrefix>
                              <div className="w-12 h-12 bg-mainGreen text-white flex items-center justify-center rounded-full">
                                PF
                              </div>
                            </ListItemPrefix>
                            <div>
                              {item.category === "newsletter" ? (
                                <div>
                                  <div className="text-md font-medium text-black group-hover:text-mainGreen">
                                    {item?.title}
                                  </div>
                                  <p className="text-gray-600">
                                    {item?.message}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {timeSince(item.createdAt)} •{" "}
                                    {formattedDate}
                                  </p>
                                </div>
                              ) : item.category === "support-portal" ? (
                                <div>
                                  <div className="text-md font-medium text-black group-hover:text-mainGreen">
                                    Support Portal Message: {item?.message}
                                  </div>
                                  <p className="text-gray-600">{item?.title}</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {timeSince(item.createdAt)} •{" "}
                                    {formattedDate}
                                  </p>
                                </div>
                              ) : item.category === "account-creation" ? (
                                <div>
                                  <div className="text-md font-medium text-black group-hover:text-mainGreen">
                                    New Account Created: {item?.full_name}
                                  </div>
                                  <p className="text-gray-600">{item.title}</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {timeSince(item.createdAt)} •{" "}
                                    {formattedDate}
                                  </p>
                                </div>
                              ) : item.category === "order" ? (
                                <div>
                                  <div className="text-md font-medium text-gray-700 group-hover:text-mainGreen">
                                    {item?.title}
                                  </div>
                                  <p className="text-gray-600">
                                    {item?.message}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Order ID: {item.orderId}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Customer ID: {item.customer_id}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Created At:{" "}
                                    {new Date(item.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ) : item.category === "market-rep" ? (
                                <div>
                                  <div className="text-md font-medium text-gray-700 group-hover:text-mainGreen">
                                    {item?.title}
                                  </div>
                                  <p className="text-gray-600">
                                    {item?.message}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Created At:{" "}
                                    {new Date(item.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ) : item.category === "driver" ? (
                                <div>
                                  <div className="text-md font-medium text-gray-700 group-hover:text-mainGreen">
                                    {item?.title}
                                  </div>
                                  <p className="text-gray-600">
                                    {item?.message}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Created At:{" "}
                                    {new Date(item.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-md font-medium text-gray-700 group-hover:text-mainGreen">
                                    {TruncateString({
                                      str: item?.full_name,
                                      num: 25,
                                    })}
                                  </div>
                                  <p className="text-gray-600">
                                    {item?.message}
                                  </p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {timeSince(item.createdAt)} •{" "}
                                    {formattedDate}
                                  </p>
                                </div>
                              )}
                            </div>
                          </ListItem>
                        </div>
                      );
                    })}
                </List>
              ) : (
                <div className="mx-auto pt-32 text-mainGreen capitalize text-center">
                  no new notifications <br /> please refresh
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="w-full flex  mt-10 justify-between">
          <div className="w-[80%] ">
            <OrderTable />
          </div>
          <div className="w-[20%]">
            <div className="mb-3">
              <AdvertComponent />
            </div>

            <Badge content={cityPrice.length}>
              <Button className="bg-mainGreen" onClick={handleOpenCityDialog}>
                Add City
              </Button>
            </Badge>
            <Card className="w-[95%]  mt-9 overflow-y-auto p-4 h-[20rem] rounded-md">
              <List className="my-2 p-0">
                {cityPrice
                  ?.slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  ?.map((item, index) => (
                    <div key={index}>
                      <ListItem className="group  rounded-md py-1.5 px-1 text-sm font-normal text-green-gray-700 hover:bg-green-500 hover:text-white focus:bg-green-500 focus:text-white">
                        <ListItemPrefix className="flex">
                          <Tooltip content="Edit city">
                            <IconButton
                              variant="text"
                              onClick={() => handleUpdateOpen(item?._id)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content={item?.city}>
                            <div className=" ">
                              {TruncateString({ str: item?.city, num: 15 })}
                            </div>
                          </Tooltip>
                        </ListItemPrefix>

                        <ListItemSuffix className="flex">
                          <div className="font-workSans text-md text-mainGreen hover:text-black">
                            {item?.estimatePrice}
                          </div>

                          <Tooltip content="Delete market">
                            <IconButton
                              variant="text"
                              onClick={() => handleDelete(item._id)}
                            >
                              <TrashIcon className="h-4 w-4 text-red-900" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSuffix>
                      </ListItem>
                    </div>
                  ))}
              </List>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
