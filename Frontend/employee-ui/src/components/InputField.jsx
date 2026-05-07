import React from "react";

export default function InputField({
  label,
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

      {/* Input */}
      <input
        {...props}
        className={`
          w-full border px-3 py-2 rounded outline-none
          focus:ring-2 focus:ring-blue-400
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
      />

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}

    </div>
  );
}