import { useState, useEffect } from "react";
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
  Avatar,
} from "@material-tailwind/react";
import { useDeleteProductMutation } from "../../../services/api";
import { AddProductForm } from "../dialogs/addProductDialog";
import Pagination from "../pagination/pagination";
import { useNavigate } from "react-router-dom";
import { UpdateProductForm } from "../dialogs/updateProductDialog";
import { TruncateString } from "../../../lib/util/truncateString";
import AddCommasToNumber from "../../../lib/util/addComma";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { TABLE_HEAD } from "../../../data/productTableHead";
import { Loader } from "../../common/loaders";
import { phantomGet } from "phantom-request";

export function ProductTable() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchField, setSearchField] = useState("");
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [totalPages, setTotalPages] = useState(1);

  
  const navigate = useNavigate();

  const [deleteProductMutation] = useDeleteProductMutation();
  const { handleDelete } = useDeleteHandler(deleteProductMutation);

  const { data: productData, loading, refetch } = phantomGet({
    route: "product",
    params: { page: currentPage, limit: itemsPerPage },
    fetchOnMount: false
  });

  useEffect(() => {
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (productData) {
      setDetails(productData?.products || []);
      setFilteredDetails(productData?.products || []);
      setTotalPages(productData?.totalPages || 1);
    }

  }, [productData]);

  useEffect(() => {
    const filteredProducts = details.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchField.toLowerCase()) ||
        product.product_cat.toLowerCase().includes(searchField.toLowerCase()) ||
        product.product_brand_name.toLowerCase().includes(searchField.toLowerCase()) ||
        product.product_sub_cat.toLowerCase().includes(searchField.toLowerCase())
    );
    setFilteredDetails(filteredProducts);
  }, [searchField, details]);

  const handleOpen = () => setOpen((cur) => !cur);

  const handleUpdateOpen = (productId) => {
    setSelectedProductId(productId);
    setUpdateOpen(true);
  };

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
              label="Search"
              placeholder="use product name , brand name, category, sub category"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button onClick={handleOpen} className="flex items-center gap-3 capitalize bg-mainGreen" size="lg">
              <PlusIcon className="h-4 w-4" /> Add product
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-1">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && filteredDetails.length > 0 ? (
              filteredDetails.map(
                ({ _id, product_cat, product_image, product_price, product_name, product_total, product_cost_price, createdAt }, index) => {
                  const isLast = index === filteredDetails.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                  const dateObject = new Date(createdAt);
                  const formattedDate = dateObject.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });

                  return (
                    <tr key={index} className="cursor-pointer hover:bg-greenWhite hover">
                      <td className={classes} onClick={() => navigate(`/product/${_id}`)}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={product_image}
                            alt={product_name}
                            size="md"
                            className="border border-blue-gray-50 bg-blue-gray-50/50"
                          />
                          <Tooltip content={product_name}>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {TruncateString({ str: product_name, num: 24 })}
                            </Typography>
                          </Tooltip>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          &#8358;{AddCommasToNumber(product_price)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          &#8358;{AddCommasToNumber(product_cost_price)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {formattedDate}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {product_total}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {product_cat}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit product">
                          <IconButton variant="text" onClick={() => handleUpdateOpen(_id)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete product">
                          <IconButton variant="text" onClick={() => handleDelete(_id)}>
                            <TrashIcon className="h-4 w-4 text-red-900" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <Loader />
            )}
          </tbody>
        </table>
      </CardBody>
      <Pagination currentPage={currentPage} totalItems={totalPages} onPageChange={handlePageChange} />
      <AddProductForm open={open} handleOpen={handleOpen} />
      <UpdateProductForm open={updateOpen} handleOpen={() => setUpdateOpen(false)} productId={selectedProductId} />
    </Card>
  );
}
