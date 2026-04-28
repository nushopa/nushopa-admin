export function Select({ onChange, className, options, value }) {
    return (
      <select className={className} onChange={onChange} value={value}>
        <option hidden={true} value="" />
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
}