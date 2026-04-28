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
import { useUpdateMarketMutation } from "../../../services/api";

export function UpdateMarketDialog({ handleOpen, open, marketId }) {
  const [formData, setFormData] = useState({
    marketName: "",
    marketEmail: "",
    marketPhone: "",
    city: "",
    address: "",
    openingHours: [],
  });
  const [loading, setLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [selectedLga, setSelectedLga] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [updateMarket, { isLoading }] = useUpdateMarketMutation();
  let baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}pricelist`)
      .then((response) => {
        if (response.data) {
          setDeliveryPrices(response.data.prices);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery pricelist:", error);
      })
      .finally(() => {
        setDeliveryLoading(false);
      });
  }, [baseUrl]);
  useEffect(() => {
    if (marketId) {
      axios
        .get(`${baseUrl}marketplace/market/${marketId}`)
        .then((response) => {
          if (response) {
            let market = response?.data?.data;
            setFormData({
              marketName: market?.name,
              marketEmail: market?.email || "",
              marketPhone: market?.phone || "",
              setSelectedLga: market?.city,
              address: market?.address,
              openingHours: [],
            });
          }
        })
        .catch((error) => {
          console.error("Error market by id", error);
        });
    }
  }, [baseUrl, marketId]);
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



  const handleSubmit = async () => {
    setLoading(true);
    const patchData = {
      id: marketId, 
    };
    if (formData.marketName) {
      patchData.name = formData.marketName;
    }
    if (formData.marketEmail) {
      patchData.email = formData.marketEmail;
    }
    if (formData.marketPhone) {
      patchData.phone = formData.marketPhone;
    }
    if (selectedLga) {
      patchData.city = selectedLga;
    }
    if (formData.address) {
      patchData.address = formData.address;
    }

    try {
      await updateMarket(patchData).unwrap();
      window.location.reload();
   
      handleOpen(false);
      
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
              Update Market
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
            </div>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Market Email</Typography>
                <Input
                  label="market email"
                  type="email"
                  size="lg"
                  name="marketEmail"
                  value={formData.marketEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Market Phone</Typography>
                <Input
                  label="market phone"
                  name="phoneNumber"
                  size="lg"
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
           
           
          </CardBody>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Updating..." : "Update Market"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
