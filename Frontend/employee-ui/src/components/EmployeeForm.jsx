import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";

import {
  getCountries,
  getStates,
  getCities,
} from "../api/employeeApi";

export default function EmployeeForm({
  form,
  setForm,
  errors,
  setErrors,
  onSubmit,
  loading,
  isEditMode,
}) {

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // ================= TODAY =================
  const today = new Date();

  // ================= MAX DOB =================
  // Employee must be at least 18 years old
  const maxDobDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // ================= DOJ MIN DATE =================
  // DOJ must be after employee turns 18
  const dojMinDate = form.dob
    ? new Date(
        new Date(form.dob).getFullYear() + 18,
        new Date(form.dob).getMonth(),
        new Date(form.dob).getDate()
      )
        .toISOString()
        .split("T")[0]
    : "";

  // ================= TODAY MAX DATE =================
  const maxTodayDate =
    today.toISOString().split("T")[0];

  // ================= LOAD COUNTRIES =================
  useEffect(() => {

    (async () => {

      const res = await getCountries();

      const list =
        (res.data || res || []).map(c => ({
          value: c.Row_Id,
          label: c.CountryName
        }));

      setCountries(list);

    })();

  }, []);

  // ================= LOAD STATES =================
  useEffect(() => {

    if (isEditMode && form.countryId) {

      (async () => {

        const stateRes =
          await getStates(form.countryId);

        const stateList =
          (stateRes.data || stateRes || [])
            .map(s => ({
              value: s.Row_Id,
              label: s.StateName
            }));

        setStates(stateList);

      })();

    }

  }, [isEditMode, form.countryId]);

  // ================= LOAD CITIES =================
  useEffect(() => {

    if (isEditMode && form.stateId) {

      (async () => {

        const cityRes =
          await getCities(form.stateId);

        const cityList =
          (cityRes.data || cityRes || [])
            .map(c => ({
              value: c.Row_Id,
              label: c.CityName
            }));

        setCities(cityList);

      })();

    }

  }, [isEditMode, form.stateId]);

  // ================= COUNTRY CHANGE =================
  const handleCountryChange = async (e) => {

    const countryId = e.target.value;

    setForm(prev => ({
      ...prev,
      countryId,
      stateId: "",
      cityId: ""
    }));

    setErrors(prev => ({
      ...prev,
      countryId: "",
      stateId: "",
      cityId: ""
    }));

    setStates([]);
    setCities([]);

    const res = await getStates(countryId);

    const list =
      (res.data || res || []).map(s => ({
        value: s.Row_Id,
        label: s.StateName
      }));

    setStates(list);
  };

  // ================= STATE CHANGE =================
  const handleStateChange = async (e) => {

    const stateId = e.target.value;

    setForm(prev => ({
      ...prev,
      stateId,
      cityId: ""
    }));

    setErrors(prev => ({
      ...prev,
      stateId: "",
      cityId: ""
    }));

    setCities([]);

    const res = await getCities(stateId);

    const list =
      (res.data || res || []).map(c => ({
        value: c.Row_Id,
        label: c.CityName
      }));

    setCities(list);
  };

  // ================= VALIDATION =================
  const validateField = (name, value) => {

    switch (name) {

      case "firstName":

        if (!value.trim())
          return "First name is required";

        break;

      case "lastName":

        if (!value.trim())
          return "Last name is required";

        break;

      case "email":

        if (!value.trim())
          return "Email is required";

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value)
        )
          return "Invalid email format";

        break;

      case "mobile":

        if (!value.trim())
          return "Mobile is required";

        if (!/^\d{10}$/.test(value))
          return "Mobile must be 10 digits";

        break;

      // ================= PAN =================
      case "pan":

        if (!value.trim())
          return "PAN is required";

        // Example: ABCDE1234F
        if (
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
            .test(value)
        )
          return "Invalid PAN format (Example: ABCDE1234F)";

        break;

      // ================= PASSPORT =================
      case "passport":

        if (!value.trim())
          return "Passport is required";

        // Example: A1234567
        if (
          !/^[A-Z]{1}[0-9]{7}$/
            .test(value)
        )
          return "Invalid Passport format (Example: A1234567)";

        break;

      case "dob":

        if (!value)
          return "DOB is required";

        if (value > maxDobDate)
          return "Employee must be at least 18 years old";

        break;

      case "doj":

        if (!value)
          return "DOJ is required";

        if (value > maxTodayDate)
          return "DOJ cannot be in future";

        if (
          form.dob &&
          value < dojMinDate
        )
          return "Joining age must be at least 18 years";

        break;

      case "countryId":

        if (!value)
          return "Country is required";

        break;

      case "stateId":

        if (!value)
          return "State is required";

        break;

      case "cityId":

        if (!value)
          return "City is required";

        break;

      default:
        return "";
    }

    return "";
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    let finalValue =
      type === "checkbox"
        ? checked
        : value;

    // ================= MOBILE =================
    // Only digits allowed
    if (name === "mobile") {

      finalValue =
        finalValue
          .replace(/\D/g, "")
          .slice(0, 10);
    }

    // ================= PAN =================
    // Format: ABCDE1234F
    if (name === "pan") {

      finalValue = finalValue.toUpperCase();

      let formatted = "";

      for (let i = 0; i < finalValue.length; i++) {

        const char = finalValue[i];

        // First 5 => Letters only
        if (i < 5) {

          if (/[A-Z]/.test(char)) {
            formatted += char;
          }
        }

        // Next 4 => Numbers only
        else if (i >= 5 && i < 9) {

          if (/[0-9]/.test(char)) {
            formatted += char;
          }
        }

        // Last 1 => Letter only
        else if (i === 9) {

          if (/[A-Z]/.test(char)) {
            formatted += char;
          }
        }
      }

      finalValue = formatted.slice(0, 10);
    }

    // ================= PASSPORT =================
    // Format: A1234567
    if (name === "passport") {

      finalValue = finalValue.toUpperCase();

      let formatted = "";

      for (let i = 0; i < finalValue.length; i++) {

        const char = finalValue[i];

        // First character => Letter only
        if (i === 0) {

          if (/[A-Z]/.test(char)) {
            formatted += char;
          }
        }

        // Remaining 7 => Digits only
        else if (i > 0 && i < 8) {

          if (/[0-9]/.test(char)) {
            formatted += char;
          }
        }
      }

      finalValue = formatted.slice(0, 8);
    }

    setForm(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // ================= REMOVE ERROR =================
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    // ================= VALIDATE =================
    const errorMessage =
      validateField(name, finalValue);

    if (errorMessage) {

      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">
            {
              isEditMode
                ? "Update Employee"
                : "Add Employee"
            }
          </h2>

          <Link
            to="/"
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back to List
          </Link>

        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-2 gap-4"
        >

          {/* First Name */}
          <InputField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          {/* Last Name */}
          <InputField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />

          {/* Email */}
          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Mobile */}
          <InputField
            label="Mobile"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            error={errors.mobile}
            maxLength={10}
            placeholder="9876543210"
          />

          {/* PAN */}
          <InputField
            label="PAN"
            name="pan"
            value={form.pan}
            onChange={handleChange}
            error={errors.pan}
            maxLength={10}
            placeholder="ABCDE1234F"
          />

          {/* Passport */}
          <InputField
            label="Passport"
            name="passport"
            value={form.passport}
            onChange={handleChange}
            error={errors.passport}
            maxLength={8}
            placeholder="A1234567"
          />

          {/* DOB */}
          <InputField
            type="date"
            label="DOB"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            error={errors.dob}
            max={maxDobDate}
          />

          {/* DOJ */}
          <InputField
            type="date"
            label="DOJ"
            name="doj"
            value={form.doj}
            onChange={handleChange}
            error={errors.doj}
            min={dojMinDate}
            max={maxTodayDate}
          />

          {/* Country */}
          <SelectField
            label="Country"
            name="countryId"
            value={form.countryId}
            options={countries}
            onChange={handleCountryChange}
            error={errors.countryId}
          />

          {/* State */}
          <SelectField
            label="State"
            name="stateId"
            value={form.stateId}
            options={states}
            onChange={handleStateChange}
            error={errors.stateId}
          />

          {/* City */}
          <SelectField
            label="City"
            name="cityId"
            value={form.cityId}
            options={cities}
            onChange={handleChange}
            error={errors.cityId}
          />

          {/* Gender */}
          <div className="col-span-2">

            <label className="font-medium">
              Gender
            </label>

            <div className="flex gap-6 mt-1">

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                />
                {" "}Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />
                {" "}Female
              </label>

            </div>

          </div>

          {/* Active */}
          <div className="col-span-2">

            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              {" "}Active
            </label>

          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
          >

            {
              loading
                ? "Saving..."
                : isEditMode
                  ? "Update"
                  : "Save"
            }

          </button>

        </form>

      </div>

    </div>
  );
}