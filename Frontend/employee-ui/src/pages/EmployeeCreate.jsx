import React, { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import { createEmployee } from "../api/employeeApi";

export default function EmployeeCreate() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    pan: "",
    passport: "",
    dob: "",
    doj: "",
    countryId: "",
    stateId: "",
    cityId: "",
    gender: "",
    isActive: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [apiMessage, setApiMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // =====================
  // VALIDATION
  // =====================
  const validate = () => {
    const err = {};

    if (!form.firstName?.trim()) err.firstName = "Required";
    if (!form.email?.trim()) err.email = "Required";
    if (!form.mobile?.trim()) err.mobile = "Required";

    if (!form.countryId) err.countryId = "Required";
    if (!form.stateId) err.stateId = "Required";
    if (!form.cityId) err.cityId = "Required";

    if (!form.gender) err.gender = "Required";

    return err;
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setLoading(true);
    setApiMessage("");

    try {

      // 🔥 FIXED PAYLOAD (IMPORTANT)
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName?.trim(),

        email: form.email,
        mobile: form.mobile,
        pan: form.pan,
        passport: form.passport,

        countryId: Number(form.countryId),
        stateId: Number(form.stateId),
        cityId: Number(form.cityId),

        gender: form.gender === "Male" ? 1 : 2,

        // ✅ CRITICAL FIX (SQL DATE SAFE)
        DateOfBirth: form.dob ? new Date(form.dob).toISOString() : null,
        DateOfJoinee: form.doj ? new Date(form.doj).toISOString() : null,

        isActive: form.isActive
      };

      const res = await createEmployee(payload);

      // =====================
      // API RESPONSE HANDLING
      // =====================
      if (!res?.success) {
        setApiMessage(res?.message || "Creation failed");
        setIsSuccess(false);
        return;
      }

      setApiMessage(res.message || "Employee created successfully");
      setIsSuccess(true);

      // reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        pan: "",
        passport: "",
        dob: "",
        doj: "",
        countryId: "",
        stateId: "",
        cityId: "",
        gender: "",
        isActive: false,
      });

    } catch (err) {
      setApiMessage(
        err?.response?.data?.message ||
        err?.message ||
        "Server error"
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <>
      {apiMessage && (
        <div
          className={`p-2 mb-3 rounded ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {apiMessage}
        </div>
      )}

      <EmployeeForm
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        loading={loading}
        isEditMode={false}
      />
    </>
  );
}