import { useState, useEffect } from "react";
import { Card, CardHeader, Button, CardBody, Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useDeleteProductMutation } from "../../../services/api";
import { AddProductForm } from "../dialogs/addProductDialog";
import { UpdateProductForm } from "../dialogs/updateProductDialog";
import Pagination from "../pagination/pagination";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { phantomGet } from "phantom-request";
import { ProductTableList } from "./ProductTableList";

const ITEMS_PER_PAGE = 15;
const SEARCH_FETCH_LIMIT = 1000;

export function ProductTable() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [searchField, setSearchField] = useState("");
  const isSearching = searchField.trim().length > 0;

  const [details, setDetails] = useState([]); // raw data from the API
  const [filteredDetails, setFilteredDetails] = useState([]); // after search filter
  const [currentPage, setCurrentPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(1);

  const [deleteProductMutation] = useDeleteProductMutation();
  const { handleDelete } = useDeleteHandler(deleteProductMutation);

  const { data: productData, loading, refetch } = phantomGet({
    route: "product",
    params: isSearching
      ? { page: 1, limit: SEARCH_FETCH_LIMIT } // pull everything so search covers all products
      : { page: currentPage, limit: ITEMS_PER_PAGE }, // normal server-side pagination
    fetchOnMount: false,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isSearching]);

  useEffect(() => {
    if (productData) {
      setDetails(productData?.products || []);
      setServerTotalPages(productData?.totalPages || 1);
    }
  }, [productData]);

  // Apply the text filter against whatever data is currently loaded.
  useEffect(() => {
    const term = searchField.toLowerCase();
    const filtered = details.filter(
      (product) =>
        product.product_name.toLowerCase().includes(term) ||
        product.product_cat.toLowerCase().includes(term) ||
        product.product_brand_name.toLowerCase().includes(term) ||
        product.product_sub_cat.toLowerCase().includes(term)
    );
    setFilteredDetails(filtered);
  }, [searchField, details]);

  // Whenever the search term changes, go back to page 1 so pagination
  // reflects the new (smaller) result set correctly.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchField]);

  const handleOpen = () => setOpen((cur) => !cur);
  const handleUpdateOpen = (productId) => {
    setSelectedProductId(productId);
    setUpdateOpen(true);
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const visibleDetails = isSearching
    ? filteredDetails.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : filteredDetails;

  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filteredDetails.length / ITEMS_PER_PAGE))
    : serverTotalPages;

  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text"
              name="search-input"
              label="Search"
              placeholder="use product name, brand name, category, sub category"
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
        <ProductTableList
          loading={loading}
          products={visibleDetails}
          onDelete={handleDelete}
          onEdit={handleUpdateOpen}
        />
      </CardBody>

      <Pagination currentPage={currentPage} totalItems={totalPages} onPageChange={handlePageChange} />
      <AddProductForm open={open} handleOpen={handleOpen} />
      <UpdateProductForm open={updateOpen} handleOpen={() => setUpdateOpen(false)} productId={selectedProductId} />
    </Card>
  );
}