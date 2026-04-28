import { Button } from "@material-tailwind/react";

export function AssignUnassignButton({
  distributorId,
  isAssigned,
  isDisabled,
  onAssign,
  onUnassign,
}) {
  return (
    <Button
      variant={isAssigned ? "outlined" : "gradient"}
      onClick={() => (isAssigned ? onUnassign(distributorId) : onAssign(distributorId))}
      disabled={isDisabled}
    >
      {isAssigned ? "Unassign" : "Assign"}
    </Button>
  );
}