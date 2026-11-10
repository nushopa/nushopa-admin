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
    estimatePrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [updateCity, { isLoading }] = useUpdateCityMutation();
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  let baseUrl = import.meta.env.VITE_BASE_URL;
  // let baseUrl = "http://localhost:3000/";

  useEffect(() => {
    if (!CityId || !open) return;

    setIsLoadingCity(true);
    axios
      .get(`${baseUrl}pricelist/${CityId}`)
      .then(({ data }) => {
        const city = data?.city;
        if (!city) throw new Error("The selected delivery area was not found.");
        setFormData({
          city: city.city ?? "",
          estimatePrice: String(city.estimatePrice ?? ""),
        });
      })
      .catch((error) => {
        console.error("Could not load delivery fee:", error);
        toast.error(
          error.response?.data?.message || "Could not load delivery fee.",
        );
      })
      .finally(() => setIsLoadingCity(false));
  }, [baseUrl, CityId, open]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      await updateCity({
        id: CityId,
        city: formData.city.trim(),
        estimatePrice,
      }).unwrap();
      toast.success("Delivery fee updated.");
      handleOpen(false);
    } catch (error) {
      console.error("Could not update delivery fee:", error);
      toast.error(error?.data?.message || "Could not update delivery fee.");
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
              Update delivery fee
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
            type="button"
            onClick={handleSubmit}
            fullWidth
            disabled={
              isLoading ||
              loading ||
              isLoadingCity ||
              !formData.city.trim() ||
              formData.estimatePrice === ""
            }
          >
            {isLoading || loading ? "Updating..." : "Update Price"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
