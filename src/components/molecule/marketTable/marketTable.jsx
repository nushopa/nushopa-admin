import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card, CardHeader, Typography, Button, CardBody, IconButton, Tooltip, Input,
} from "@material-tailwind/react";
import { useMemo, useState } from "react";
import Pagination from "../pagination/pagination";
import { TruncateString } from "../../../lib/util/truncateString";
import { AddMarketDialog } from "../dialogs/addMarketDialog";
import { AddCityDialog } from "../dialogs/addCityDialog";
import { UpdateMarketDialog } from "../dialogs/updateMarketDialog";
import { useDeleteMarketMutation, useGetMarketsQuery } from "../../../services/api";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { TABLE_HEAD } from "../../../data/marketTableHead";
import { Loader } from "../../common/loaders";

const EMPTY = [];
const ITEMS_PER_PAGE = 15;

// Accept the different shapes the API might return.
const extractMarkets = (data) => {
  if (!data) return EMPTY;
  if (Array.isArray(data)) return data;
  const list = data.data ?? data.markets ?? data.market ?? data.marketplace;
  return Array.isArray(list) ? list : EMPTY;
};

export function MarketTable() {
  const [open, setOpen] = useState(false);
  const [openCityDialog, setOpenCityDialog] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching, isError, error, refetch } = useGetMarketsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const markets = useMemo(() => extractMarkets(data), [data]);
  const totalPages = data?.totalPages || 1;

  // Shows in the console so you can see the real response shape / status.
  if (import.meta.env.DEV) {
    if (isError) console.error("[markets] request failed:", error);
    else if (data) console.log("[markets] response:", data);
  }

  const [deleteMarket] = useDeleteMarketMutation();
  const { handleDelete } = useDeleteHandler(deleteMarket, "market");

  const rows = useMemo(() => {
    const term = searchField.toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(term);
    return markets.filter(
      (m) =>
        has(m.city) || has(m.name) || has(m.address) ||
        (m.distributors ?? []).some((d) => has(d?.name) || has(d?.first_name) || has(d?.business_name))
    );
  }, [markets, searchField]);

  return (
    <Card className="h-full w-[96%] mx-auto">
      <AddMarketDialog open={open} handleOpen={() => setOpen((c) => !c)} />
      <UpdateMarketDialog open={updateOpen} handleOpen={() => setUpdateOpen(false)} marketId={selectedMarketId} />
      <AddCityDialog open={openCityDialog} handleOpen={() => setOpenCityDialog((c) => !c)} />

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text" name="search-input" label="Search"
              placeholder="use market name, address, city, distributor name"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField} onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button onClick={() => setOpen(true)} className="flex items-center gap-3 capitalize bg-mainGreen" size="lg">
              <PlusIcon className="h-4 w-4" /> Add market
            </Button>
            <Button onClick={() => setOpenCityDialog(true)} className="flex items-center gap-3 capitalize bg-mainGreen" size="lg">
              <PlusIcon className="h-4 w-4" /> Add City
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-1">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, i) => (
                <th key={`${head}-${i}`} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr><td colSpan={TABLE_HEAD.length} className="text-center py-4"><Loader /></td></tr>
            ) : isError ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-14">
                  <p className="text-red-500 font-semibold text-xl">
                    Failed to load markets
                    {error?.status ? ` (${error.status})` : ""}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {error?.data?.message || "Check the Network tab for the marketplace/market request."}
                  </p>
                  <Button className="mt-4 bg-mainGreen" onClick={refetch}>Retry</Button>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center font-roboto font-semibold py-14 text-3xl">
                  No market to display
                </td>
              </tr>
            ) : (
              rows.map((market, index) => {
                const classes = index === rows.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={market._id ?? index} className="hover:bg-greenWhite">
                    <td className={classes}>
                      <Tooltip content={market.name || ""}>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {TruncateString({ str: market.name || "", num: 25 })}
                        </Typography>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">{market.city}</Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content={market.address || ""}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {TruncateString({ str: market.address || "", num: 18 })}
                        </Typography>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content={market.email || ""}>
                        <div className="text-sm">{TruncateString({ str: market.email || "", num: 15 })}</div>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content={market.phone || ""}>
                        <div className="text-sm">{TruncateString({ str: market.phone || "", num: 25 })}</div>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <ul className="list-inside">
                        {market.openingHours?.map((hour, i) => (
                          <Tooltip key={i} content={`${hour.open} - ${hour.close}`}>
                            <li>{hour.day}</li>
                          </Tooltip>
                        ))}
                      </ul>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {market.distributors?.length ?? 0}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit market">
                        <IconButton
                          variant="text"
                          onClick={() => { setSelectedMarketId(market._id); setUpdateOpen(true); }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete market">
                        <IconButton variant="text" onClick={() => handleDelete(market._id)}>
                          <TrashIcon className="h-4 w-4 text-red-900" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
      <Pagination currentPage={currentPage} totalItems={totalPages} onPageChange={setCurrentPage} />
    </Card>
  );
}