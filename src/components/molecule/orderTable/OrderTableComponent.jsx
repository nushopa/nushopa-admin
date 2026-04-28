import {Typography,Tooltip,Chip,IconButton,} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { TruncateString } from "../../../lib/util/truncateString";
import AddCommasToNumber from "../../../lib/util/addComma";
import { TABLE_HEAD } from "../../../data/orderTableHead";

export function OrderTableComponent({
  orders = [],
  selectedOrderId,
  isDropdownVisible,
  onRowClick,
  onActionClick,
  onStatusSelect,
  onAssign,
}) {
  return (
    <table className="w-full min-w-[40%] table-auto text-left">
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

      {orders.length > 0 ? (
        <tbody>
          {orders
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(
              (
                {
                  address,
                  customer_id,
                  orderID,
                  amount_paid,
                  status,
                  createdAt,
                },
                index,
              ) => {
                const isLast = index === orders.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                const formattedDate = new Date(createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  },
                );

                return (
                  <tr
                    key={orderID || index}
                    className="cursor-pointer hover:bg-greenWhite"
                  >
                    {/* Customer name */}
                    <td
                      className={classes}
                      onClick={() => onRowClick?.(orderID)}
                    >
                      <Tooltip
                        content={`${customer_id?.first_name} ${customer_id?.last_name}`}
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {TruncateString({
                            str: `${customer_id?.first_name} ${customer_id?.last_name}`,
                            num: 10,
                          })}
                        </Typography>
                      </Tooltip>
                    </td>

                    {/* Order ID */}
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        #{orderID}
                      </Typography>
                    </td>

                    {/* Date */}
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formattedDate}
                      </Typography>
                    </td>

                    {/* Amount */}
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        &#8358;{AddCommasToNumber(amount_paid)}
                      </Typography>
                    </td>

                    {/* Phone */}
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {address.phone_number}
                      </Typography>
                    </td>

                    {/* Status chip */}
                    <td className={classes}>
                      <div className="w-fit">
                        <Chip
                          size="lg"
                          value={status}
                          className="text-center"
                        />
                      </div>
                    </td>

                    {/* Assign distributor */}
                    <td
                      className={classes}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip content="Assign distributor">
                        <IconButton
                          variant="text"
                          onClick={() => onAssign?.(orderID)}
                           disabled={status === "Delivered"}
                        >
                          <img
                            src="https://res.cloudinary.com/phantom1245/image/upload/v1734545614/uploads/clarity_assign-user-solid_h6phai.svg"
                            className="h-5 w-5"
                            alt="assign distributor"
                          />
                        </IconButton>
                      </Tooltip>
                    </td>
                    {/* Status change dropdown */}
                    <td className={classes}>
                      <Tooltip content="Change status">
                        <IconButton
                          variant="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionClick?.(orderID);
                          }}
                          disabled={status === "Delivered"}
                        >
                          <EllipsisVerticalIcon className="h-6 w-6 text-black" />
                        </IconButton>
                      </Tooltip>
                      {isDropdownVisible && selectedOrderId === orderID && (
                        <div className="relative bg-white border rounded shadow-md p-2 top-0 right-0 z-10">
                          {["Processing", "Shipped", "Delivered"].map((s) => (
                            <div
                              key={s}
                              className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                              onClick={() => onStatusSelect?.(s, orderID)}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              },
            )}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td
              colSpan={TABLE_HEAD.length + 1}
              className="text-center font-roboto font-semibold py-14 text-3xl"
            >
              No order to display
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}
