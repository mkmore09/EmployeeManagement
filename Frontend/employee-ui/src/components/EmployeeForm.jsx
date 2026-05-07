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

  // ================= LOAD COUNTRIES =================
  useEffect(() => {

    (async () => {

      const res = await getCountries();

      const list = (res.data || res || []).map(c => ({
        value: c.Row_Id,
        label: c.CountryName
      }));

      setCountries(list);

    })();

  }, []);

  // ================= LOAD STATES/CITIES IN EDIT MODE =================
  useEffect(() => {

    if (isEditMode && form.countryId) {

      (async () => {

        const stateRes = await getStates(form.countryId);

        const stateList = (stateRes.data || stateRes || []).map(s => ({
          value: s.Row_Id,
          label: s.StateName
        }));

        setStates(stateList);

      })();
    }

  }, [isEditMode, form.countryId]);

  useEffect(() => {

    if (isEditMode && form.stateId) {

      (async () => {

        const cityRes = await getCities(form.stateId);

        const cityList = (cityRes.data || cityRes || []).map(c => ({
          value: c.Row_Id,
          label: c.CityName
        }));

        setCities(cityList);

      })();
    }

  }, [isEditMode, form.stateId]);

  // ================= COUNTRY =================
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

    try {

      const res = await getStates(countryId);

      const list = (res.data || res || []).map(s => ({
        value: s.Row_Id,
        label: s.StateName
      }));

      setStates(list);

    } catch {

      console.log("State load failed");

    }
  };

  // ================= STATE =================
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

    try {

      const res = await getCities(stateId);

      const list = (res.data || res || []).map(c => ({
        value: c.Row_Id,
        label: c.CityName
      }));

      setCities(list);

    } catch {

      console.log("City load failed");

    }
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

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";

        break;

      case "mobile":

        if (!value.trim())
          return "Mobile is required";

        if (!/^\d{10}$/.test(value))
          return "Mobile must be 10 digits";

        break;

      case "pan":

        if (!value.trim())
          return "PAN is required";

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
          return "Invalid PAN format";

        break;

      case "passport":

        if (!value.trim())
          return "Passport is required";

        if (!/^[A-Z0-9]{6,20}$/.test(value))
          return "Invalid passport format";

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

        if (form.dob && value < dojMinDate)
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

  // ================= INPUT =================
  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    let finalValue =
      type === "checkbox"
        ? checked
        : value;

    // ================= AUTO UPPERCASE =================
    if (name === "pan" || name === "passport") {
      finalValue = finalValue.toUpperCase();
    }

    setForm(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // ================= REMOVE BACKEND ERROR =================
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    // ================= FRONTEND VALIDATION =================
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
            {isEditMode
              ? "Update Employee"
              : "Add Employee"}
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

          <InputField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <InputField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />

          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField
            label="Mobile"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            error={errors.mobile}
          />

          <InputField
            label="PAN"
            name="pan"
            value={form.pan}
            onChange={handleChange}
            error={errors.pan}
          />

          <InputField
            label="Passport"
            name="passport"
            value={form.passport}
            onChange={handleChange}
            error={errors.passport}
          />

          <InputField
            type="date"
            label="DOB"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            error={errors.dob}
            max={maxDobDate}
          />

          <InputField
            type="date"
            label="DOJ"
            name="doj"
            value={form.doj}
            onChange={handleChange}
            error={errors.doj}
            min={dojMinDate}
          />

          <SelectField
            label="Country"
            name="countryId"
            value={form.countryId}
            options={countries}
            onChange={handleCountryChange}
            error={errors.countryId}
          />

          <SelectField
            label="State"
            name="stateId"
            value={form.stateId}
            options={states}
            onChange={handleStateChange}
            error={errors.stateId}
          />

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

            {loading
              ? "Saving..."
              : isEditMode
                ? "Update"
                : "Save"}

          </button>

        </form>

      </div>

    </div>
  );
}