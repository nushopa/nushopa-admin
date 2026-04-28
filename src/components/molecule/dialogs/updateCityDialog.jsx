import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
} from "@material-tailwind/react";
import { useUpdateCityMutation } from "../../../services/api";
import { toast } from "react-toastify";
import axios from "axios";

export function UpdateCityDialog({ handleOpen, open, CityId }) {
  const [formData, setFormData] = useState({
    city: "",
    estimatePrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [updateCity, { isLoading }] = useUpdateCityMutation();

  let baseUrl = import.meta.env.VITE_BASE_URL;
  // let baseUrl = "http://localhost:3000/";

  useEffect(() => {
    if (CityId) {
      axios
        .get(`${baseUrl}pricelist/${CityId}`)
        .then((response) => {
          if (response) {
            let city = response?.data?.city;
            setFormData({
              city: city?.city,
              estimatePrice: city?.estimatePrice,
            });
          }
        })
        .catch((error) => {
          toast.error("Error city by id", error);
        });
    }
  }, [baseUrl, CityId]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const patchData = {
      id: CityId, 
    };
    if (formData.estimatePrice) {
      patchData.estimatePrice = formData.estimatePrice;
    }
    if (formData.city) {
      patchData.city = formData.city;
    }
    try {
      await updateCity(patchData).unwrap();
      window.location.reload();
      handleOpen(false);

    } catch (error) {
      toast.error("Error submitting market:", error);
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
            {isLoading || loading ? "Updating..." : "Update Price"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
