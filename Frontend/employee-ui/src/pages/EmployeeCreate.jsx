import React, { useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import { createEmployee } from "../api/employeeApi";
import { useNavigate } from "react-router-dom";
// =====================
// INITIAL STATE
// =====================
const initialForm = {
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
};

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // =====================
  // FRONTEND VALIDATION
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

    const frontendErrors = validate();

    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    setLoading(true);

    try {
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

        DateOfBirth: form.dob ? new Date(form.dob).toISOString() : null,
        DateOfJoinee: form.doj ? new Date(form.doj).toISOString() : null,

        isActive: form.isActive,
      };

      const res = await createEmployee(payload);

      // =====================
      // BACKEND VALIDATION ERROR
      // =====================
      if (!res?.success) {
        if (res?.field && res?.message) {
          const field = res.field.toLowerCase();

          setErrors((prev) => ({
            ...prev,
            [field]: res.message,
          }));
        } else {
          setErrors({
            form: res?.message || "Something went wrong",
          });
        }
        return;
      }

      // =====================
      // SUCCESS RESET
      // =====================
      setForm(initialForm);
      setErrors({});
      navigate("/");
    } catch (err) {
      setErrors({
        form:
          err?.response?.data?.message ||
          err?.message ||
          "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Global error */}
      {errors.form && (
        <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
          {errors.form}
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