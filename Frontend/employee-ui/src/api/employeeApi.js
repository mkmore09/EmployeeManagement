import { api } from "./client";

// helper to unwrap response
const unwrap = async (promise) => {
  const res = await promise;
  return res.data;
};

// LIST
export const getEmployees = (page = 1, size = 10, search = "") =>
  unwrap(api.get(`/Employee`, { params: { page, size, search } }));

// GET BY ID
export const getEmployeeById = (id) =>
  unwrap(api.get(`/Employee/${id}`));

// CREATE
export const createEmployee = (data) =>
  unwrap(api.post(`/Employee`, data));

// UPDATE
export const updateEmployee = (data) =>
  unwrap(api.put(`/Employee`, data));

// DELETE
export const deleteEmployee = (id) =>
  unwrap(api.delete(`/Employee/${id}`));

// DROPDOWNS
export const getCountries = () =>
  unwrap(api.get(`/Employee/countries`));

export const getStates = (countryId) =>
  unwrap(api.get(`/Employee/states/${countryId}`));

export const getCities = (stateId) =>
  unwrap(api.get(`/Employee/cities/${stateId}`));

// DUPLICATE CHECK
export const checkDuplicate = (data) =>
  unwrap(api.post(`/Employee/check-duplicate`, data));