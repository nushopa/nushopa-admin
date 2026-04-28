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
} from "@material-tailwind/react";
import { useDeleteNewsletterMutation } from "../../../services/api";
import Pagination from "../pagination/pagination";
import { useEffect, useState } from "react";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { phantomGet } from "phantom-request";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const TABLE_HEAD = ["Select User", "Email Address", ""];

export function NewsletterTable() {
  const jwt = Cookies.get("jwt");
  const [newsLetter, setNewsLetter] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [filteredDetails, setFilteredDetails] = useState([]);
  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data: newsLetterData, refetch } = phantomGet({
    route: "news",
    token: jwt,
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (newsLetterData) {
      setNewsLetter(newsLetterData?.newsletter);
      setTotalPages(newsLetterData?.totalPages || 1);
    }

  }, [newsLetterData]);

  useEffect(() => {
    const filteredNewsLetter = newsLetter.filter((newsLetter) =>
      newsLetter.email.toLowerCase().includes(searchField.toLowerCase())
    );
    setFilteredDetails(filteredNewsLetter);
  }, [searchField, newsLetter]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDetails.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [deleteNewsletter] = useDeleteNewsletterMutation();
  const { handleDelete } = useDeleteHandler(deleteNewsletter, "user")

  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        return prevSelectedEmails.filter(
          (selectedEmail) => selectedEmail !== email
        );
      } else {
        return [...prevSelectedEmails, email];
      }
    });
  };

  const handleSendEmail = () => {
    if (selectedEmails.length > 0) {
      const mailtoLink = `mailto:${selectedEmails.join(",")}`;
      window.open(mailtoLink, "_blank");
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
              label="Search"
              placeholder="search using email"
              icon={<UserGroupIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
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
          {currentItems.length > 0 ? (
            <tbody>
              {currentItems.map(
                ({ _id, email }, index) => {
                  const isLast = index === currentItems.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index} className="cursor-pointer hover:bg-greenWhite hover">
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
                          className="font-normal"
                        >
                          {email}
                        </Typography>
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
              )}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center font-roboto font-semibold py-14 text-3xl">
                  No newsletter to display
                </td>
              </tr>
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
