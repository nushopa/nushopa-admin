import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Tooltip,
  Input,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import { TruncateString } from "../../../lib/util/truncateString";
import { Loader } from "../../common/loaders";
import { phantomGet } from "phantom-request";
import { TABLE_HEAD } from "../../../data/contactTableHead";
import Cookies from "js-cookie";

export function ContactTable() {
  const jwt = Cookies.get("jwt");
  const [contact, setContact] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [filteredDetails, setFilteredDetails] = useState([]);

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: contactData, loading, refetch } = phantomGet({
    route: "contact",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (contactData) {
      setContact(contactData?.contacts);
      setFilteredDetails(contactData?.contacts);
      setTotalPages(contactData?.totalPages || 1);
    }
  }, [contactData]);

  useEffect(() => {
    const filteredContact = contact.filter(
      (contact) =>
        contact.message.toLowerCase().includes(searchField.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchField.toLowerCase()) ||
        contact.fullname.toLowerCase().includes(searchField.toLowerCase())
    );
    setFilteredDetails(filteredContact);
  }, [searchField, contact]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              label="Search"
              placeholder="Use market name, address, city, or contact name"
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
                filteredDetails?.map((contact, index) => {
                  const isLast = index === contact.length - 1;
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
                          <Tooltip content={contact?.fullname}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold capitalize"
                            >
                              {TruncateString({ str: contact?.fullname, num: 25 })}
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
                          {contact.email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content={contact?.message}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {TruncateString({
                              str: contact?.message,
                              num: 30,
                            })}
                          </Typography>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        <Button
                          size="sm"
                          variant="text"
                          className="text-mainGreen"
                          onClick={() =>
                            window.location.href = `mailto:${contact.email}?cc=info.Nushopa.ng&subject=Help from support desk&body=${encodeURIComponent(
                              contact.message
                            )}`
                          }
                        >
                          <img
                            src="https://res.cloudinary.com/phantom1245/image/upload/v1734304574/uploads/Vector_2_jx8eyr.png"
                            alt="reply icon" className="h-6 w-6 font-bold" />
                        </Button>
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
                  No support message
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
