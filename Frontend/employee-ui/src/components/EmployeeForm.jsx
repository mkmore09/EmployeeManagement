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

  // ================= COUNTRY =================
  const handleCountryChange = async (e) => {
    const countryId = e.target.value;

    setForm(prev => ({
      ...prev,
      countryId,
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

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditMode ? "Update Employee" : "Add Employee"}
          </h2>

          <Link
            to="/"
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back to List
          </Link>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">

          <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName}/>
          <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange}/>

          <InputField label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email}/>
          <InputField label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} error={errors.mobile}/>

          <InputField label="PAN" name="pan" value={form.pan} onChange={handleChange} error={errors.pan}/>
          <InputField label="Passport" name="passport" value={form.passport} onChange={handleChange} error={errors.passport}/>

          <InputField type="date" label="DOB" name="dob" value={form.dob} onChange={handleChange}/>
          <InputField type="date" label="DOJ" name="doj" value={form.doj} onChange={handleChange}/>

          <SelectField label="Country" name="countryId" value={form.countryId}
            options={countries}
            onChange={handleCountryChange}
            error={errors.countryId}
          />

          <SelectField label="State" name="stateId" value={form.stateId}
            options={states}
            onChange={handleStateChange}
            error={errors.stateId}
          />

          <SelectField label="City" name="cityId" value={form.cityId}
            options={cities}
            onChange={handleChange}
            error={errors.cityId}
          />

          {/* Gender */}
          <div className="col-span-2">
            <label className="font-medium">Gender</label>
            <div className="flex gap-6 mt-1">
              <label>
                <input type="radio" name="gender" value="Male"
                  checked={form.gender==="Male"} onChange={handleChange}/> Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female"
                  checked={form.gender==="Female"} onChange={handleChange}/> Female
              </label>
            </div>
          </div>

          {/* Active */}
          <div className="col-span-2">
            <label>
              <input type="checkbox" name="isActive"
                checked={form.isActive} onChange={handleChange}/> Active
            </label>
          </div>

          <button
            disabled={loading}
            className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>

        </form>
      </div>
    </div>
  );
}