import { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useAddCityMutation } from "../../../services/api";
import { toast } from "react-toastify";

export function AddCityDialog({ handleOpen, open }) {
  const [formData, setFormData] = useState({
    city: "",
    estimatePrice: 0,
  });
  const [loading, setLoading] = useState(false);

  const [addCity, { isLoading }] = useAddCityMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const estimatePrice = Number(formData.estimatePrice);
    if (
      !formData.city.trim() ||
      formData.estimatePrice === "" ||
      !Number.isFinite(estimatePrice) ||
      estimatePrice < 0
    ) {
      toast.error("Enter a city and a valid non-negative delivery fee.");
      return;
    }

    setLoading(true);
    try {
      await addCity({
        city: formData.city.trim(),
        estimatePrice,
      }).unwrap();
      toast.success("Delivery area added.");
      handleOpen(false);
    } catch (error) {
      console.error("Could not add delivery area:", error);
      toast.error(error?.data?.message || "Could not add delivery area.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        size="md"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex overflow-y-auto h-[20rem] flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add delivery area
            </Typography>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">City</Typography>
                <Input
                  label="City"
                  size="lg"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Delivery fee (₦)</Typography>
                <Input
                  label="Delivery fee"
                  size="lg"
                  type="number"
                  min="0"
                  step="1"
                  name="estimatePrice"
                  value={formData.estimatePrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Adding..." : "Add City"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
