import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import Pagination from "../pagination/pagination";
import { TruncateString } from "../../../lib/util/truncateString";
import { useEffect } from "react";
import { AddMarketDialog } from "../dialogs/addMarketDialog";
import { useDeleteMarketMutation } from "../../../services/api";
import { AddCityDialog } from "../dialogs/addCityDialog";
import { UpdateMarketDialog } from "../dialogs/updateMarketDialog";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { TABLE_HEAD } from "../../../data/marketTableHead";
import { Loader } from "../../common/loaders";
import { phantomGet } from "phantom-request";
import Cookies from "js-cookie";


export function MarketTable() {
  const jwt = Cookies.get("jwt");
  const [open, setOpen] = useState(false);
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [deleteMarket] = useDeleteMarketMutation();
  const { handleDelete } = useDeleteHandler(deleteMarket, 'market')
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [searchField, setSearchField] = useState("");
  const [filteredDetails, setFilteredDetails] = useState([]);
  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: marketData, loading, refetch } = phantomGet({
    route: "marketplace/market",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {

    if (marketData) {
      setMarkets(marketData?.data);
      setFilteredDetails(marketData?.data);
      setTotalPages(marketData?.totalPages || 1);
    }

  }, [marketData]);

  useEffect(() => {
    const filteredMarkets = markets.filter(
      (market) =>
        market.city.toLowerCase().includes(searchField.toLowerCase()) ||
        market.name.toLowerCase().includes(searchField.toLowerCase()) ||
        market.distributors.some((item) =>
          item.name.toLowerCase().includes(searchField.toLowerCase())
        )
    );
    setFilteredDetails(filteredMarkets);
  }, [searchField, markets]);

  const handleOpen = () => setOpen((cur) => !cur);

  const handleUpdateOpen = (marketId) => {
    setSelectedMarketId(marketId);
    setUpdateOpen(true);
  };

  const handleOpenCityDialog = () =>
    setOpenCityDialog((prevState) => !prevState);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card className="h-full w-[96%] mx-auto">
      <AddMarketDialog open={open} handleOpen={handleOpen} />
      <UpdateMarketDialog
        open={updateOpen}
        handleOpen={() => setUpdateOpen(false)}
        marketId={selectedMarketId}
      ></UpdateMarketDialog>
      <AddCityDialog open={openCityDialog} handleOpen={handleOpenCityDialog} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              label="Search"
              placeholder="use market name, address, city, distributor name"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div>
              <Button
                onClick={handleOpen}
                className="flex items-center gap-3 capitalize bg-mainGreen"
                size="lg"
              >
                <PlusIcon className="h-4 w-4" /> Add market
              </Button>
            </div>
            <div>
              <Button
                onClick={handleOpenCityDialog}
                className="flex items-center gap-3 capitalize bg-mainGreen"
                size="lg"
              >
                <PlusIcon className="h-4 w-4" /> Add City
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className=" px-1">
        <table className="w-full min-w-max table-auto  text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          {filteredDetails.length > 0 ? (
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <Loader />
                  </td>
                </tr>
              ) : (
                filteredDetails?.map((market, index) => {
                  const isLast = index === market?.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-greenWhite hover"
                    >
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Tooltip content={market?.name}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {TruncateString({ str: market?.name, num: 25 })}
                            </Typography>
                          </Tooltip>
                        </div>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {market?.city}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content={market?.address}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {TruncateString({ str: market?.address, num: 18 })}
                          </Typography>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Tooltip content={market?.email}>
                            <div className="text-sm">
                              {TruncateString({ str: market?.email, num: 15 })}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Tooltip content={market?.phone}>
                            <div className="text-sm">
                              {TruncateString({ str: market?.phone, num: 25 })}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className={classes}>
                        <ul className="list-disc-none list-inside">
                          {market?.openingHours?.map((hour, index) => (
                            <Tooltip
                              key={index}
                              content={`${hour.open} - ${hour.close}`}
                            >
                              <li>{hour.day}</li>
                            </Tooltip>
                          ))}
                        </ul>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {market?.distributors?.length}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit market">
                          <IconButton
                            variant="text"
                            onClick={() => handleUpdateOpen(market?._id)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete market">
                          <IconButton
                            variant="text"
                            onClick={() => handleDelete(market._id)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-900" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center font-roboto font-semibold py-14 text-3xl">
                  No market to display
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </CardBody>
      <Pagination currentPage={currentPage} totalItems={totalPages} onPageChange={handlePageChange} />
    </Card>
  );
}
