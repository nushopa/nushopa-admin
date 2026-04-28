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
import { useDeleteCustomerMutation } from "../../../services/api";
import Pagination from "../pagination/pagination";
import { useEffect, useState } from "react";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { TABLE_HEAD } from "../../../data/customersTableHead";
import { phantomGet } from "phantom-request";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


export function CustomerTable() {
  const jwt = Cookies.get("jwt");
  const [deleteCustomerMutation] = useDeleteCustomerMutation();
  const { handleDelete } = useDeleteHandler(deleteCustomerMutation, "customer")
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: customers, refetch } = phantomGet({
    route: "customers",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {

    if (customers) {
      setDetails(customers?.customers);
      setFilteredDetails(customers?.customers);
      setTotalPages(customers?.totalPages || 1);
    }

  }, [customers]);
  useEffect(() => {
    const filteredCustomers = details.filter(
      (customer) =>
        customer.email
          .toLowerCase()
          .includes(searchField.toLowerCase()) ||
        customer.first_name.toLowerCase().includes(searchField.toLowerCase()) ||
        customer.last_name
          .toLowerCase()
          .includes(searchField.toLowerCase()) ||
        customer.phone_number
          .toLowerCase()
          .includes(searchField.toLowerCase())
    );
    setFilteredDetails(filteredCustomers);
  }, [searchField, details]);

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        // Remove the email if it's already selected
        return prevSelectedEmails.filter(
          (selectedEmail) => selectedEmail !== email
        );
      } else {
        // Add the email if it's not selected
        return [...prevSelectedEmails, email];
      }
    });


  };

  const handleSendEmail = () => {
    if (selectedEmails.length > 0) {
      // Create a mailto link with pre-filled recipients
      const mailtoLink = `mailto:${selectedEmails.join(',')}`;
      // Open the link in a new window or tab
      window.open(mailtoLink, '_blank');
    } else {
      toast.error("No emails selected");
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              onClick={() => window.location.reload()}
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
          {filteredDetails.length > 0 ? (
            <tbody>
              {filteredDetails
                ?.slice()
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
                    const dateObject = new Date(createdAt);

                    // Format the date as YYYY-MM-DD
                    const formattedDate = dateObject.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    );

                    return (
                      <tr
                        key={index}
                        className="cursor-pointer hover:bg-greenWhite hover"
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
                            <IconButton variant="text" onClick={() => handleDelete(_id)}>
                              <TrashIcon className="h-4 w-4 text-red-900" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          ) : (
            <tbody className="py-14 flex justify-center w-full text-center items-center text-3xl">
              <tr><td>No customer to display</td></tr>
            </tbody>
          )}
        </table>
      </CardBody>
      <Pagination currentPage={currentPage} totalItems={totalPages} onPageChange={handlePageChange} />
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
