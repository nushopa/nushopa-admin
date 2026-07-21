import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon, ArchiveBoxIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { Typography, IconButton, Tooltip, Avatar } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { TruncateString } from "../../../lib/util/truncateString";
import AddCommasToNumber from "../../../lib/util/addComma";
import { TABLE_HEAD } from "../../../data/productTableHead";
import { Loader } from "../../common/loaders";

export function ProductTableList({ loading, products, onDelete, onEdit, onToggleStock }) {
  const navigate = useNavigate();

  return (
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
        {!loading && products.length > 0 ? (
          products.map(
            ({
              _id,
              product_cat,
              product_image,
              product_price,
              product_name,
              product_total,
              product_cost_price,
              createdAt,
              out_of_stock,
            }, index) => {
              const isLast = index === products.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
              const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              return (
                <tr key={_id ?? index} className="cursor-pointer hover:bg-greenWhite hover">
                  <td className={classes} onClick={() => navigate(`/product/${_id}`)}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={product_image}
                        alt={product_name}
                        size="md"
                        className={`border border-blue-gray-50 bg-blue-gray-50/50 ${
                          out_of_stock ? "opacity-40" : ""
                        }`}
                      />
                      <div className="flex flex-col">
                        <Tooltip content={product_name}>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {TruncateString({ str: product_name, num: 24 })}
                          </Typography>
                        </Tooltip>
                        {out_of_stock && (
                          <Typography variant="small" className="text-red-600 font-medium text-xs">
                            Out of stock
                          </Typography>
                        )}
                      </div>
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
                    <Tooltip content={out_of_stock ? "Mark as in stock" : "Mark as out of stock"}>
                      <IconButton
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStock(_id, !out_of_stock);
                        }}
                      >
                        {out_of_stock ? (
                          <ArchiveBoxXMarkIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ArchiveBoxIcon className="h-4 w-4 text-orange-600" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Edit product">
                      <IconButton
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(_id);
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete product">
                      <IconButton
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(_id);
                        }}
                      >
                        <TrashIcon className="h-4 w-4 text-red-900" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            }
          )
        ) : (
          <tr>
            <td colSpan={TABLE_HEAD.length}>
              <Loader />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}