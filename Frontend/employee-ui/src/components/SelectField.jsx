import React from "react";

export default function SelectField({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input"
      >
        <option value="">Select {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}   {/* ✅ FIX HERE */}
          </option>
        ))}
      </select>
    </div>
  );
}