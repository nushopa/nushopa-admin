import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { phantomGet } from "phantom-request"; 
import Pagination from "../pagination/pagination";
import { Loader } from "../../common/loaders";
import Cookies from "js-cookie";

export function DriverTable() {
  const jwt = Cookies.get("jwt");
  const [drivers, setDrivers] = useState([]); 
  const [filteredDetails, setFilteredDetails] = useState([]); 
  const [searchField, setSearchField] = useState("");
  const navigate = useNavigate();

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: driverData, loading, refetch } = phantomGet({
    route: "driver",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (driverData) {
      setDrivers(driverData.driver || []);
      setFilteredDetails(driverData.driver || []);
      setTotalPages(driverData.totalPages || 1);
    }
  }, [driverData]);

  // Handle search
  useEffect(() => {
    const searchLower = searchField.toLowerCase();

    const filtered = drivers.filter((driver) => {
      // Coalesce each field into an empty string to avoid "undefined"
      const firstName = (driver.firstName || "").toLowerCase();
      const lastName = (driver.lastName || "").toLowerCase();
      const email = (driver.email || "").toLowerCase();
      const phone = (driver.phoneNumber || "").toLowerCase();
      const licensePlate = (driver.licensePlate || "").toLowerCase(); // if you ever add this
      const vehicleType = (driver.vehicleType || "").toLowerCase();

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower) ||
        licensePlate.includes(searchLower) ||
        vehicleType.includes(searchLower)
      );
    });

    setFilteredDetails(filtered);
  }, [searchField, drivers]);

  const handleRowClick = (driverId) => {
    navigate(`/driver/${driverId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
              <th className="border-y font-medium font-roboto border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Full Name
              </th>
              <th className="border-y font-medium font-roboto border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Phone Number
              </th>
              <th className="border-y font-medium font-roboto border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Address
              </th>
              <th className="border-y font-medium font-roboto border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Vehicle Type
              </th>
              <th className="border-y font-medium font-roboto border-blue-gray-100 bg-blue-gray-50/50 p-4">
                Review Status
              </th>
            </tr>
          </thead>

          {filteredDetails.length > 0 ? (
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <Loader />
                  </td>
                </tr>
              ) : (
                filteredDetails.map((driver) => (
                  <tr
                    key={driver?._id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(driver?._id)}
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
          ) : (
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="text-center font-roboto font-semibold py-14 text-3xl"
                >
                  No driver to display
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </CardBody>

      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        onPageChange={handlePageChange}
      />
    </Card>
  );
}
