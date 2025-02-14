import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  options = [],
  className = "",
  labelClassName = "",
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className={`text-lg font-medium mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          required={required}
          value={value}
          onChange={onChange}
          className={`bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg ${className}`}
        >
          <option disabled>Select{label}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          required={required}
          className={`bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg ${className}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Input;
