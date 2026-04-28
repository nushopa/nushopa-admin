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
    setLoading(true);
    const postDataInfo = {
      city: formData.city,
      estimatePrice: formData.estimatePrice,
    };
    try {
      // Continue with market submission
      await addCity(postDataInfo)
        .then((res) => {
          if (!res.error) {
            toast.success("city successfully added");
            window.location.reload();
            handleOpen(false);
          } else {
            alert(res.error.data.message);
          }
        })
    } catch (error) {
      toast.error("Error submitting market");
    }
    setLoading(false);
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
              Add City
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
                <Typography variant="h6">Estimate Price</Typography>
                <Input
                  label="Estimate Price"
                  size="lg"
                  type="number"
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
