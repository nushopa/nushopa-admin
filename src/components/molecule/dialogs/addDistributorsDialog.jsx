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
import { useAddDistributorsMutation } from "../../../services/api";
import { phantomGet } from "phantom-request";
import { toast } from "react-toastify";

export function AddDistributorsDialog({ handleOpen, open }) {
  const [formData, setFormData] = useState({
    distributorsName: "",
    marketRepEmail: "",
    city: "",
    address: "",
    contact: 0,
  });
  const [selectedLga, setSelectedLga] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [addDistributors, { isLoading }] = useAddDistributorsMutation();
  const [markets, setMarkets] = useState([]);

  const { data: priceListData } = phantomGet({ route: "pricelist" });
  const {  data: marketData, loading } = phantomGet({ route: "marketplace/market" });
  
  useEffect(() => {

    if (priceListData) {
      setDeliveryPrices(priceListData.prices);
    }

    if (marketData) {
      setMarkets(marketData.data);
    }

  }, [marketData, priceListData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Prevent negative values
    if (name === "contact") {
      newValue = Math.max(0, parseInt(value));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSelectLga = (newOption) => {
    setSelectedLga(newOption);
  };
  const handleMarket = (newOption) => {
    setSelectedMarket(newOption);
  };

  const handleSubmit = async () => {
    const postDataInfo = {
      name: formData.distributorsName,
      email: formData.marketRepEmail,
      city: selectedLga,
      address: formData.address,
      contact: formData.contact,
      marketId: selectedMarket,
    };
    try {
      // Continue with distributors submission
      await addDistributors(postDataInfo)
        .unwrap()
        .then((res) => {
          if (!res.error) {
            window.location.reload();
            handleOpen(false);
          } else {
            alert(res.error.data.message);
          }
        })
    } catch (error) {
      toast.error("Error submitting market-rep");
    }
  };

  return (
    <>
      <Dialog
        size="xl"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-full">
          <CardBody className="flex overflow-y-scroll h-[35rem] flex-col gap-2">
            <Typography variant="h4" color="blue-gray">
              Add Distributor
            </Typography>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Market Rep Name</Typography>
                <Input
                  label="Market Rep Name"
                  size="lg"
                  name="distributorsName"
                  value={formData.distributorsName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full">
                <Typography variant="h6">Market Rep Email</Typography>
                <Input
                  label="Market Rep Email"
                  size="lg"
                  name="marketRepEmail"
                  value={formData.marketRepEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full flex gap-3 flex-col">
              <div className="text-[#7B7B7B] font-workSans font-semibold">
                <label htmlFor="lga">City*:</label>
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
            <div className="w-full flex gap-3 flex-col">
              <div className="text-[#7B7B7B] font-workSans font-semibold">
                <label htmlFor="lga">Market*:</label>
              </div>
              <Select
                size="lg"
                label="Select Market"
                value={selectedMarket}
                onChange={handleMarket}
                className=""
              >
                {markets.map((market, index) => (
                  <Option key={index} value={market._id} label={market.name}>
                    {market.name}
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
              <div className="w-full">
                <Typography variant="h6">Contact</Typography>
                <Input
                  label="Contact"
                  size="lg"
                  name="contact"
                  type="number"
                  value={formData.contact}
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
            {isLoading || loading ? "Adding..." : "Add Distributor"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
