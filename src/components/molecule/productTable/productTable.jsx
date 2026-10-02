import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, Button, CardBody, Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  useDeleteProductMutation,
  useToggleProductStockMutation,
  useGetProductsQuery,
} from "../../../services/api";
import { AddProductForm } from "../dialogs/addProductDialog";
import { UpdateProductForm } from "../dialogs/updateProductDialog";
import Pagination from "../pagination/pagination";
import useDeleteHandler from "../../../lib/hook/useDeleteHandler";
import { ProductTableList } from "./ProductTableList";

const EMPTY = [];
const ITEMS_PER_PAGE = 15;
const SEARCH_FETCH_LIMIT = 1000;

export function ProductTable() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isSearching = searchField.trim().length > 0;

  const [deleteProductMutation] = useDeleteProductMutation();
  const [toggleProductStock] = useToggleProductStockMutation();
  const { handleDelete } = useDeleteHandler(deleteProductMutation);

  // While searching, pull everything so search covers all products.
  // Mutations invalidate the "Product" tag, so the list refetches by itself.
  const { data, isFetching } = useGetProductsQuery(
    isSearching ? { page: 1, limit: SEARCH_FETCH_LIMIT } : { page: currentPage, limit: ITEMS_PER_PAGE }
  );
  const products = data?.products ?? EMPTY;
  const serverTotalPages = data?.totalPages || 1;

  useEffect(() => { setCurrentPage(1); }, [searchField]);

  const filtered = useMemo(() => {
    if (!isSearching) return products;
    const term = searchField.toLowerCase();
    const has = (v) => String(v ?? "").toLowerCase().includes(term);
    // product_brand_name / product_sub_cat are optional -> must be null-safe
    return products.filter(
      (p) => has(p.product_name) || has(p.product_cat) || has(p.product_brand_name) || has(p.product_sub_cat)
    );
  }, [products, searchField, isSearching]);

  const visible = isSearching
    ? filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filtered;
  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    : serverTotalPages;

  const handleToggleStock = async (id, out_of_stock) => {
    try {
      await toggleProductStock({ id, out_of_stock }).unwrap();
    } catch (error) {
      console.error("Failed to toggle stock status:", error);
    }
  };

  return (
    <Card className="h-full w-[96%] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <Input
              type="text" name="search-input" label="Search"
              placeholder="use product name, brand name, category, sub category"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchField} onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button onClick={() => setOpen(true)} className="flex items-center gap-3 capitalize bg-mainGreen" size="lg">
              <PlusIcon className="h-4 w-4" /> Add product
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-1">
        <ProductTableList
          loading={isFetching}
          products={visible}
          onDelete={handleDelete}
          onEdit={(id) => { setSelectedProductId(id); setUpdateOpen(true); }}
          onToggleStock={handleToggleStock}
        />
      </CardBody>

      <Pagination currentPage={currentPage} totalItems={totalPages} onPageChange={setCurrentPage} />
      <AddProductForm open={open} handleOpen={() => setOpen((c) => !c)} />
      <UpdateProductForm
        open={updateOpen}
        handleOpen={() => { setUpdateOpen(false); setSelectedProductId(null); }}
        productId={selectedProductId}
      />
    </Card>
  );
}