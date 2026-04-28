// utils.js
export const AddCommasToNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const TruncateString = ({ str, num }) => {
  return str?.length > num ? str.slice(0, num) + "..." : str || "—";
};