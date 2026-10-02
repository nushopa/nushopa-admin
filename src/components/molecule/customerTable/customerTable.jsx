import { TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
  Checkbox,
  Chip,
} from "@material-tailwind/react";
import {
  useDeleteCustomerMutation,
  useGetCustomerQuery,
} from "../../../services/api";
import Pagination from "../pagination/pagination";
import { useMemo, useState } from "react";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { TABLE_HEAD } from "../../../data/customersTableHead";
import { toast } from "react-toastify";
import { Loader } from "../../common/loaders";

const EMPTY = [];
const ITEMS_PER_PAGE = 15;

export function CustomerTable() {
  const [deleteCustomerMutation] = useDeleteCustomerMutation();
  const { handleDelete } = useDeleteHandler(deleteCustomerMutation, "customer");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // The auth cookie is attached automatically by the RTK Query base query.
  const { data, isFetching } = useGetCustomerQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const details = data?.customers ?? EMPTY;
  const totalPages = data?.totalPages || 1;

  const filteredDetails = useMemo(() => {
    const term = searchField.toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(term);
    return details.filter(
      (c) =>
        has(c.email) ||
        has(c.first_name) ||
        has(c.last_name) ||
        has(c.phone_number)
    );
  }, [details, searchField]);

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSendEmail = () => {
    if (selectedEmails.length > 0) {
      window.open(`mailto:${selectedEmails.join(",")}`, "_blank");
    } else {
      toast.error("No emails selected");
    }
  };

  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              placeholder="use email, first name, last name, phone number"
              label="Search"
              icon={<UserGroupIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button
              className="px-8 shadow-sm py-3 bg-transparent text-black rounded-[10px] border border-[#7B7B7B] justify-center items-center gap-2 inline-flex"
              size="lg"
              onClick={() => {
                setSearchField("");
                setCurrentPage(1);
                setSelectedEmails([]);
              }}
            >
              All Users
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className=" px-0">
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
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : filteredDetails.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="text-center font-roboto font-semibold py-14 text-3xl"
                >
                  No customer to display
                </td>
              </tr>
            ) : (
              filteredDetails
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(
                  (
                    {
                      _id,
                      first_name,
                      last_name,
                      email,
                      phone_number,
                      createdAt,
                      role,
                    },
                    index
                  ) => {
                    const isLast = index === filteredDetails.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                    const formattedDate = new Date(createdAt).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "2-digit", day: "2-digit" }
                    );

                    return (
                      <tr
                        key={_id ?? index}
                        className="cursor-pointer hover:bg-greenWhite"
                      >
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Checkbox
                              ripple={true}
                              checked={selectedEmails.includes(email)}
                              onChange={() => handleCheckboxChange(email)}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal capitalize"
                          >
                            <span>{first_name}</span>
                            <span className="pl-1">{last_name}</span>
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {formattedDate}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {email}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {phone_number}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={role === 5000 ? "admin" : "user"}
                              color={role === 5000 ? "green" : "blue-gray"}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Delete User">
                            <IconButton
                              variant="text"
                              onClick={() => handleDelete(_id)}
                            >
                              <TrashIcon className="h-4 w-4 text-red-900" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )
            )}
          </tbody>
        </table>
      </CardBody>
      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        onPageChange={setCurrentPage}
      />
      <div className="flex w-full mb-10 mt-5 shrink-0 gap-2 md:w-max">
        <Button
          className="px-8 shadow-sm py-3 bg-mainGreen text-white rounded-[10px] border border-[#7B7B7B] justify-center items-center gap-2 inline-flex"
          size="lg"
          disabled
        >
          send sms
        </Button>
        <Button
          className="px-8 shadow-sm py-3 bg-transparent text-mainGreen rounded-[10px] border border-mainGreen justify-center items-center gap-2 inline-flex"
          size="lg"
          onClick={handleSendEmail}
        >
          send email
        </Button>
      </div>
    </Card>
  );
}