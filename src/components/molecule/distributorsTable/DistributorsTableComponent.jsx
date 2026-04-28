import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Typography, IconButton, Tooltip, Button } from "@material-tailwind/react";
import { TruncateString } from "../../../lib/util/truncateString";
import { Loader } from "../../common/loaders";
import { TABLE_HEAD } from "../../../data/distributorTableHead";
import { AssignUnassignButton } from "../../assignButton/AssignUnassignButton";

export function DistributorsTableComponent({
  distributors = [],
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  mode = "manage",
  assignedDistributorId = null, 
  onAssign,
  onUnassign,
  onView,
}) {

  
  const isAssignMode = mode === "assign";

  return (
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
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

      {distributors.length > 0 ? (
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                <Loader />
              </td>
            </tr>
          ) : (
            distributors.map((distributor, index) => {
              const isLastRow = index === distributors.length - 1;
              const classes = isLastRow ? "p-4" : "p-4 border-b border-blue-gray-50";

             
              const isAssigned = assignedDistributorId === distributor._id;

              return (
                <tr
                  key={distributor._id || index}
                  className={`${!isAssignMode ? "cursor-pointer" : ""} hover:bg-greenWhite`}
                  onClick={!isAssignMode ? () => onRowClick?.(distributor._id) : undefined}
                >
                  {/* Name */}
                  <td className={classes}>
                    <Tooltip content={(distributor.first_name || "") + " " + (distributor.last_name || "")}>
                      <Typography variant="small" color="blue-gray" className="font-bold capitalize">
                        {TruncateString({
                          str: (distributor.first_name || "") + " " + (distributor.last_name || ""),
                          num: 25,
                        }) || "Unnamed"}
                      </Typography>
                    </Tooltip>
                  </td>

                  {/* City */}
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {distributor.city || "—"}
                    </Typography>
                  </td>

                  {/* Address */}
                  <td className={classes}>
                    <Tooltip content={distributor.address || ""}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {TruncateString({ str: distributor.address || "", num: 24 }) || "—"}
                      </Typography>
                    </Tooltip>
                  </td>

                  {/* Email */}
                  <td className={classes}>
                    <Tooltip content={distributor.email || ""}>
                      <div className="font-normal text-sm">
                        {TruncateString({ str: distributor.email || "", num: 24 }) || "—"}
                      </div>
                    </Tooltip>
                  </td>

                  {/* Phone */}
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {distributor.phone_number}
                    </Typography>
                  </td>

                  <td className={classes} onClick={(e) => e.stopPropagation()}>
                    {isAssignMode ? (
                     
                      <div className="flex items-center gap-2">
                        <AssignUnassignButton
                          distributorId={distributor._id}
                          isAssigned={isAssigned}
                          onAssign={onAssign}
                          onUnassign={onUnassign}
                          size="sm"
                        />

                        <Button
                          size="sm"
                          variant="filled"
                          color="white"
                          className="text-xs py-1 px-3 normal-case"
                          onClick={() => onView?.(distributor._id)}
                        >
                          View
                        </Button>
                      </div>
                    ) : (
                     
                      <>
                        <Tooltip content="Edit market rep">
                          <IconButton variant="text" onClick={() => onEdit?.(distributor._id)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip content="Delete market rep">
                          <IconButton variant="text" onClick={() => onDelete?.(distributor._id)}>
                            <TrashIcon className="h-4 w-4 text-red-900" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
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
              No market rep to display
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}