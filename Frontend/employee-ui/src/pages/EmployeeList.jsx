import React, { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../api/employeeApi";
import formatDate from "../Helpers/formatDate";
import { useNavigate } from "react-router-dom";

export default function EmployeeList() {
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const navigate = useNavigate();

  // FETCH
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees(1, 10, "");
      setData(res || []);
    } catch {
      setMessage("Failed to load employees");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      const res = await deleteEmployee(id);

      if (!res?.success) {
        setMessage(res.message);
        setIsSuccess(false);
        return;
      }

      setMessage(res.message || "Deleted successfully");
      setIsSuccess(true);

      fetchEmployees();
    } catch {
      setMessage("Delete failed");
      setIsSuccess(false);
    }
  };

  // ✅ UPDATED EDIT ROUTE
  const handleEdit = (emp) => {
    navigate(`/employee/edit/${emp.Row_Id}`);
  };

  // ➕ ADD NEW EMPLOYEE NAVIGATION (optional button)
  const handleAdd = () => {
    navigate("/employee/create");
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Employee List
          </h2>

          {/* ADD BUTTON */}
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Employee
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">

            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Mobile</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((emp) => (
                <React.Fragment key={emp.Row_Id}>

                  <tr
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(emp.Row_Id)}
                  >
                    <td className="px-3 py-2">
                      {emp.FirstName} {emp.LastName}
                    </td>

                    <td className="px-3 py-2">{emp.EmailAddress}</td>
                    <td className="px-3 py-2">{emp.MobileNumber}</td>

                    <td className="px-3 py-2">
                      {emp.CityName}, {emp.StateName}
                    </td>

                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        emp.IsActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {emp.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td
                      className="px-3 py-2 space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEdit(emp)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(emp.Row_Id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedRow === emp.Row_Id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><b>ID:</b> {emp.Row_Id}</div>
                          <div><b>Code:</b> {emp.EmployeeCode}</div>
                          <div><b>PAN:</b> {emp.PanNumber}</div>
                          <div><b>Passport:</b> {emp.PassportNumber}</div>
                          <div><b>Country:</b> {emp.CountryName}</div>
                          <div><b>State:</b> {emp.StateName}</div>
                          <div><b>City:</b> {emp.CityName}</div>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}