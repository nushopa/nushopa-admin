import { useState } from "react";
import { SelectWithComponents } from "../atoms/select";
import RevenueChart from "../charts/revenueChart";
import CustomerChart from "../charts/customerChart";

export function Analytics() {
  const [selectedOption, setSelectedOption] = useState("Revenue-Analytics");

  const handleSelectChange = (newOption) => {
    setSelectedOption(newOption);
    // Reset the visibility when the option changes
  };

  const renderSelectedComponent = () => {
    const optionLowerCase = selectedOption ? selectedOption.toLowerCase() : "";

    // Render the corresponding chart component based on the selected option
    switch (optionLowerCase) {
      case "revenue-analytics":
        return <RevenueChart />;
      case "customer-analytics":
        return <CustomerChart />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full ">
      <div>
        {/* Pass the onChange prop to SelectWithComponents */}
        <SelectWithComponents
          selectedOption={selectedOption}
          onChange={handleSelectChange}
        />
      </div>

      <div className="w-full">{renderSelectedComponent()}</div>
    </div>
  );
}
