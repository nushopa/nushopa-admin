import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Card, CardHeader, CardBody } from "@material-tailwind/react";
import Pagination from "../pagination/pagination";
import { Loader } from "../../common/loaders";
import { useGetDriversQuery } from "../../../services/api";

const EMPTY = [];
const ITEMS_PER_PAGE = 15;
const HEADERS = [
  "Full Name",
  "Phone Number",
  "Address",
  "Vehicle Type",
  "Review Status",
];

export function DriverTable() {
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useGetDriversQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const drivers = data?.driver ?? EMPTY;
  const totalPages = data?.totalPages || 1;

  const filteredDetails = useMemo(() => {
    const term = searchField.toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(term);
    return drivers.filter(
      (d) =>
        has(d.firstName) ||
        has(d.lastName) ||
        has(d.email) ||
        has(d.phoneNumber) ||
        has(d.licensePlate) ||
        has(d.vehicleType)
    );
  }, [drivers, searchField]);

  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              label="Search"
              placeholder="Use driver name, phone, license plate, or email"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-1">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="border-y font-medium font-roboto border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={HEADERS.length} className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : filteredDetails.length === 0 ? (
              <tr>
                <td
                  colSpan={HEADERS.length}
                  className="text-center font-roboto font-semibold py-14 text-3xl"
                >
                  No driver to display
                </td>
              </tr>
            ) : (
              filteredDetails.map((driver) => (
                <tr
                  key={driver?._id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/driver/${driver?._id}`)}
                >
                  <td className="p-4 font-workSans text-md border-b border-blue-gray-50">
                    {driver?.firstName} {driver?.lastName}
                  </td>
                  <td className="p-4 font-workSans text-md border-b border-blue-gray-50">
                    {driver?.phoneNumber}
                  </td>
                  <td className="p-4 font-workSans text-md border-b border-blue-gray-50">
                    {driver?.address}
                  </td>
                  <td className="p-4 font-workSans text-md border-b border-blue-gray-50">
                    {driver?.vehicleType}
                  </td>
                  <td className="p-4 font-workSans text-md border-b border-blue-gray-50">
                    {driver?.review ? "Verified" : "Under Review"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardBody>

      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
}