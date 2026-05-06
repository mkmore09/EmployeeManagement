using EmployeeMaster.src.Application.DTOs;
using System.Data;

namespace EmployeeMaster.src.Application.Interfaces
{
    public interface IEmployeeRepository
    {
        // ================= READ =================
        Task<DataTable> GetEmployees(int page, int size, string? search);
        Task<DataTable> GetById(int id);

        // ================= WRITE =================
        Task<DataTable> Insert(EmployeeDto dto);
        Task<DataTable> Update(EmployeeDto dto);
        Task<DataTable> Delete(int id);

        // ================= DROPDOWNS =================
        Task<DataTable> GetCountries();
        Task<DataTable> GetStates(int countryId);
        Task<DataTable> GetCities(int stateId);

        // ================= DUPLICATE =================
        Task<DataTable> CheckDuplicate(EmployeeDto dto);
    }
}