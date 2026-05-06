using EmployeeMaster.src.Application.DTOs;
using EmployeeMaster.src.Application.DTOs.EmployeeMaster.src.Application.DTOs;
using System.Data;

namespace EmployeeMaster.src.Application.Interfaces
{
    public interface IEmployeeService
    {
        // ================= READ =================
        Task<DataTable> GetEmployees(int page, int size, string? search);
        Task<DataTable> GetById(int id);

        // ================= WRITE =================
        Task<ApiResponse> Insert(EmployeeDto dto);
        Task<ApiResponse> Update(EmployeeDto dto);
        Task<ApiResponse> Delete(int id);

        // ================= DROPDOWNS =================
        Task<DataTable> GetCountries();
        Task<DataTable> GetStates(int countryId);
        Task<DataTable> GetCities(int stateId);

        // ================= DUPLICATE =================
        Task<DataTable> CheckDuplicate(EmployeeDto dto);
    }
}