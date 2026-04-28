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
import { useUpdateDistributorsMutation } from "../../../services/api";

export function UpdateDistributorsDialog({ handleOpen, open, distributorId }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    marketRepEmail: "",
    city: "",
    address: "",
    contact: 0,
  });
  const [loading, setLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [selectedLga, setSelectedLga] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [updateDistributors, { isLoading }] = useUpdateDistributorsMutation();

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
        console.error("Error fetching delivery pricelist:", error);
      })
      .finally(() => {
        setDeliveryLoading(false);
      });

    if (distributorId) {
      axios
        .get(`${baseUrl}marketplace/get-distributor/${distributorId}`)
        .then((response) => {
          if (response) {
            let distributor = response?.data?.data;
            setSelectedLga(distributor?.city);
            setFormData({
              firstName: distributor?.firstName,
              lastName: distributor?.lastName,
              marketRepEmail: distributor.email,
              address: distributor?.address,
              contact: distributor?.contact,
            });
          }
        })
        .catch((error) => {
          console.error("Error market by id", error);
        });
    }
  }, [distributorId]);
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

  const handleSubmit = async () => {
    setLoading(true);
    const patchData = {
      id: distributorId, // Provide the product ID for the update
    };
    if (formData.firstName) {
      patchData.firstName = formData.firstName;
    }
    if (formData.lastName) {
      patchData.lastName = formData.lastName;
    }
    if (selectedLga) {
      patchData.city = selectedLga;
    }
    if (formData.address) {
      patchData.address = formData.address;
    }
    if (formData.marketRepEmail) {
      patchData.email = formData.marketRepEmail;
    }
    if (formData.contact) {
      patchData.phoneNumber = formData.contact;
    }

    try {
      // Continue with distributors submission
      await updateDistributors(patchData).unwrap();
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
          <CardBody className="flex overflow-y-scroll h-[28rem] flex-col gap-2">
            <Typography variant="h4" color="blue-gray">
              Update Distributor
            </Typography>
            <div className="flex gap-3 w-full">
              <div className="w-full">
                <Typography variant="h6">Distributor First Name</Typography>
                <Input
                  label="Distributors First Name"
                  size="lg"
                  name="distributorsFirstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full">
                <Typography variant="h6">Distributor Last Name</Typography>
                <Input
                  label="Distributors Last Name"
                  size="lg"
                  name="distributorsLastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
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
            <div className="w-full flex gap-3 flex-col">
              <div className="text-[#7B7B7B] font-workSans font-semibold">
                <label htmlFor="lga">City:</label>
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
            {isLoading || loading ? "Updating..." : "Update Distributor"}
          </Button>
        </Card>
      </Dialog>
    </>
  );
}
