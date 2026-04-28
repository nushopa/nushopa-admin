export function TruncateString({ str, num }) {
  if (str === undefined) {
    return "unnamed";
  }

  if (str.length <= num) {
    return str;
  }
  
  return <>{str.slice(0, num)}...</>;
}
