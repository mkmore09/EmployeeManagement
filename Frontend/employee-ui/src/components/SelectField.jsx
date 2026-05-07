import React from "react";

export default function SelectField({
  label,
  options,
  error,
  className = "",
  ...props
}) {

  return (

    <div>

      {/* Label */}
      <label className="block text-sm mb-1">
        {label}
      </label>

      {/* Select */}
      <select
        {...props}
        className={`
          w-full border px-3 py-2 rounded outline-none
          focus:ring-2 focus:ring-blue-400
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
      >

        <option value="">
          Select {label}
        </option>

        {options.map((opt, i) => (

          <option
            key={i}
            value={opt.value}
          >
            {opt.label}
          </option>

        ))}

      </select>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}

    </div>
  );
}