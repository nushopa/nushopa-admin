import { Select, Option } from "@material-tailwind/react";

export function SelectWithComponents({ selectedOption, onChange }) {
  return (
    <div className="w-32">
      <Select
        className="border-gray-200 pr-20 !bg-[#EDEDED] !border-t-gray-200 focus:!border-gray-900 focus:!border-t-gray-900"
        labelProps={{
          className: "hidden",
        }}
        value={selectedOption}
        onChange={onChange}
      >
        <Option value="Revenue-Analytics">Revenue-Analytics</Option>
        <Option value="Customer-Analytics">Customer-Analytics</Option>
      </Select>
    </div>
  );
}
