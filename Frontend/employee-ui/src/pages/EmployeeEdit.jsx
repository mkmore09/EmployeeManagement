import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import {
  getEmployeeById,
  updateEmployee
} from "../api/employeeApi";

export default function EmployeeEdit() {

  const { id } = useParams();

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
  // LOAD EMPLOYEE
  // =====================
  useEffect(() => {
    if (id) loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      const res = await getEmployeeById(id);
      const emp = res.data?.[0] || res?.[0];

      if (!emp) return;

      // 🔥 IMPORTANT: MAP API → FORM STATE
      setForm({
        firstName: emp.FirstName || "",
        lastName: emp.LastName || "",
        email: emp.EmailAddress || "",
        mobile: emp.MobileNumber || "",
        pan: emp.PanNumber || "",
        passport: emp.PassportNumber || "",

        dob: emp.DateOfBirth
          ? emp.DateOfBirth.split("T")[0]
          : "",

        doj: emp.DateOfJoinee
          ? emp.DateOfJoinee.split("T")[0]
          : "",

        countryId: emp.CountryId || "",
        stateId: emp.StateId || "",
        cityId: emp.CityId || "",

        gender: emp.Gender === 1 ? "Male" : "Female",
        isActive: emp.IsActive ?? false,
      });

    } catch (err) {
      setApiMessage("Failed to load employee");
      setIsSuccess(false);
    }
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setApiMessage("");

    try {
      const payload = {
        ...form,
        Id: id,
        gender: form.gender === "Male" ? 1 : 2,
        DateOfBirth: form.dob || null,
        DateOfJoinee: form.doj || null,
      };

      const res = await updateEmployee(payload);

      if (!res?.success) {

  // ================= BACKEND FIELD ERROR =================
  if (res.field) {

    setErrors(prev => ({
      ...prev,
      [res.field]: res.message
    }));

  } else {

    // general error
    setApiMessage(res?.message || "Creation failed");

  }

  setIsSuccess(false);
  return;
}

      setApiMessage(res.message || "Updated successfully");
      setIsSuccess(true);

    } catch (err) {
      setApiMessage(err?.response?.data?.message || "Server error");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      

      <EmployeeForm
        form={form}
        setForm={setForm}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        loading={loading}
        isEditMode={true}
      />
    </>
  );
}