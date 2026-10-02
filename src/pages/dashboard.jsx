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
import { useMemo, useState } from "react";
import { Analytics } from "../components/analytics/analyticChart";
import { OrderTable } from "../components/molecule/orderTable/orderTable";
import { AddCityDialog } from "../components/molecule/dialogs/addCityDialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { UpdateCityDialog } from "../components/molecule/dialogs/updateCityDialog";
import {
  useDeleteCityMutation,
  useGetCustomerQuery,
  useGetPriceListQuery,
  useGetProductTotalQuery,
  useGetTotalRevenueQuery,
  useGetTotalSoldQuery,
} from "../services/api";
import { TruncateString } from "../lib/util/truncateString";
import { useSelector } from "react-redux";
import { CardDetails } from "../data/cardDetails";
import useDeleteHandler from "../lib/hook/useDeleteHandler";
import AdvertComponent from "../components/Advert/AdvertComponent";
import NotificationItem from "../components/notification/NotificationItem";

const EMPTY = [];

export default function Dashboard() {
  // Auth cookie is sent automatically by the RTK Query base query.
  // limit: 1 is enough because we only need `totalItems`.
  const { data: customersData, isLoading: l1 } = useGetCustomerQuery({
    page: 1,
    limit: 1,
  });
  const { data: priceListData, isLoading: l2 } = useGetPriceListQuery();
  const { data: productsData, isLoading: l3 } = useGetProductTotalQuery();
  const { data: revenueData, isLoading: l4 } = useGetTotalRevenueQuery();
  const { data: soldData, isLoading: l5 } = useGetTotalSoldQuery();

  const totalCustomer = customersData?.totalItems ?? 0;
  const cityPrice = priceListData?.prices ?? EMPTY;
  const totalProducts = productsData?.totalProducts ?? 0;
  const totalRevenue = revenueData?.totalRevenue ?? 0;
  const totalProductSold = soldData ?? 0;

  // Notifications are fetched + kept live (socket) by HeaderInfo,
  // so here we only read them from the store.
  const notifications = useSelector((state) => state.notifications);
  const sortedNotifications = useMemo(
    () =>
      notifications
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [notifications]
  );

  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);

  const [deleteCityMutation] = useDeleteCityMutation();
  const { handleDelete } = useDeleteHandler(deleteCityMutation);

  if (l1 || l2 || l3 || l4 || l5) {
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
      <div className="px-3 pt-6 font-medium my-2">
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
            <Card className="w-full mt-9 overflow-y-auto h-[20rem] rounded-md">
              {sortedNotifications.length > 0 ? (
                <List className="my-2 p-0">
                  {sortedNotifications.map((item, index) => (
                    <NotificationItem
                      key={item._id ?? index}
                      item={item}
                      compact
                    />
                  ))}
                </List>
              ) : (
                <div className="mx-auto pt-32 text-mainGreen capitalize text-center">
                  no new notifications <br /> please refresh
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="w-full flex mt-10 justify-between">
          <div className="w-[80%]">
            <OrderTable />
          </div>
          <div className="w-[20%]">
            <AdvertComponent />

            <Badge content={cityPrice.length}>
              <Button className="bg-mainGreen" onClick={handleOpenCityDialog}>
                Add City
              </Button>
            </Badge>
            <Card className="w-[95%] mt-9 overflow-y-auto p-4 h-[20rem] rounded-md">
              <List className="my-2 p-0">
                {cityPrice
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((item, index) => (
                    <div key={item._id ?? index}>
                      <ListItem className="group rounded-md py-1.5 px-1 text-sm font-normal text-green-gray-700 hover:bg-green-500 hover:text-white focus:bg-green-500 focus:text-white">
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
                            <div>
                              {TruncateString({ str: item?.city, num: 15 })}
                            </div>
                          </Tooltip>
                        </ListItemPrefix>

                        <ListItemSuffix className="flex">
                          <div className="font-workSans text-md text-mainGreen hover:text-black">
                            {item?.estimatePrice}
                          </div>

                          <Tooltip content="Delete city">
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