import { Tooltip, Typography } from "@material-tailwind/react";
import { TruncateString } from "../../../lib/util/truncateString";
import { useNavigate } from "react-router-dom";
import { AssignUnassignButton } from "../../assignButton/AssignUnassignButton";

export default function NearestDistributorRow({
   distributor,
  orderID,
  currentAssigned,
  onAssign,
  onUnassign,
  classes,
}) {
  const navigate = useNavigate();
  const isAssigned = currentAssigned === distributor.id;

  return (
    <tr
      key={distributor._id}
      className="cursor-pointer hover:bg-greenWhite"
    >
      <td className={classes}>
        <div className="flex items-center gap-3">
          <Tooltip
            content={distributor?.firstName + " " + distributor?.lastName}
          >
            <Typography
              variant="small"
              color="blue-gray"
              className="font-bold"
              onClick={() => {
                if (currentAssigned) {
                  navigate(`/chat/${distributor._id}?order=${orderID}`);
                }
              }}
            >
              {TruncateString({
                str: distributor?.firstName + " " + distributor?.lastName,
                num: 24,
              })}
            </Typography>
          </Tooltip>
        </div>
      </td>

      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="font-normal">
          {distributor?.address}
        </Typography>
      </td>

      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="font-normal">
          {distributor?.city}
        </Typography>
      </td>

      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="font-normal">
          {distributor?.phoneNumber}
        </Typography>
      </td>

      <td className={classes}>
     <AssignUnassignButton
          distributorId={distributor._id}
          isAssigned={isAssigned}
          isDisabled={!!currentAssigned && !isAssigned} // block other rows when one is assigned
          onAssign={onAssign}
          onUnassign={onUnassign}
          size="sm"
        />
      </td>
    </tr>
  );
}