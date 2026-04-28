import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import { useAddMarketMutation } from "../../../services/api";
import { toast } from "react-toastify";

export function AddMarketDialog({ handleOpen, open }) {
  const [formData, setFormData] = useState({
    marketName: "",
    marketEmail: "",
    phoneNumber: "",
    city: "",
    address: "",
    openingHours: [],
  });
  const [loading, setLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [selectedLga, setSelectedLga] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [addMarket, { isLoading }] = useAddMarketMutation();

  useEffect(() => {
    let baseUrl = import.meta.env.VITE_BASE_URL;

    axios
      .get(`${baseUrl}pricelist`)
      .then((response) => {
        if (response.data) {
          setDeliveryPrices(response.data.prices);
        }
      })
      .catch((error) => {
        console.error("Error fetching price list:", error); // Log the error
        toast.error("Failed to load price list. Please try again."); // Notify the user
      })
      .finally(() => {
        setDeliveryLoading(false);
      });

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectLga = (newOption) => {
    setSelectedLga(newOption);
  };

  const handleAddOpeningHours = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      openingHours: [
        ...prevFormData.openingHours,
        { day: "", open: "", close: "" },
      ],
    }));
  };

  const handleOpeningHourChange = (index, field, value) => {
    const updatedOpeningHours = [...formData.openingHours];
    updatedOpeningHours[index][field] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      openingHours: updatedOpeningHours,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const postDataInfo = {
      name: formData.marketName,
      email: formData.marketEmail,
      phone: formData.phoneNumber, // Updated field
      city: selectedLga,
      address: formData.address,
      openingHours: formData.openingHours,
    };
    try {
      // Continue with market submission
      await addMarket(postDataInfo)
        .then((res) => {
          if (!res.error) {
            window.location.reload();
            handleOpen(false);
          } else {
            alert(res.error.data.message);
          }
        })
    } catch (error) {
      console.error("Error submitting market:", error);
    }
    setLoading(false);
  };

  if (deliveryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Dialog
        size="lg"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex overflow-y-auto h-[30rem] flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Market
            </Typography>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Market Name</Typography>
                <Input
                  label="marketName"
                  size="lg"
                  name="marketName"
                  value={formData.marketName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <Typography variant="h6">Market Email</Typography>
                <Input
                  label="marketEmail"
                  size="lg"
                  name="marketEmail"
                  value={formData.marketEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Phone Number</Typography>
                <Input
                  label="phoneNumber"
                  size="lg"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full flex gap-3 flex-col">
              <div className="text-[#7B7B7B] font-workSans font-semibold">
                <Typography variant="h6">City</Typography>
              </div>
              <Select
                size="lg"
                label="Select City"
                value={selectedLga}
                onChange={handleSelectLga}
              >
                {deliveryPrices.map((city, index) => (
                  <Option key={index} value={city.city} label={city.city}>
                    {city.city}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Address</Typography>
                <Input
                  label="Address"
                  size="lg"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <Button
                onClick={handleAddOpeningHours}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add Opening Hours
              </Button>
            </div>
            {formData.openingHours.map((openingHour, index) => (
              <div key={index} className="flex gap-3 w-full">
                <div className="w-full">
                  <Typography variant="h6">Day</Typography>
                  <Input
                    label="day"
                    size="lg"
                    value={openingHour.day}
                    onChange={(e) =>
                      handleOpeningHourChange(index, "day", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <Typography variant="h6">Open</Typography>
                  <Input
                    label="open"
                    size="lg"
                    value={openingHour.open}
                    onChange={(e) =>
                      handleOpeningHourChange(index, "open", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <Typography variant="h6">Close</Typography>
                  <Input
                    label="close"
                    size="lg"
                    value={openingHour.close}
                    onChange={(e) =>
                      handleOpeningHourChange(index, "close", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Adding..." : "Add Market"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
