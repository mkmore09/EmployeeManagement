using EmployeeMaster.src.Application.DTOs;
using EmployeeMaster.src.Application.Interfaces;
using EmployeeMaster.src.Infrastructure.helper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeMaster.src.Infrastructure.Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly SqlHelper _sqlHelper;

        public EmployeeRepository(SqlHelper sqlHelper)
        {
            _sqlHelper = sqlHelper;
        }

        // ================= READ =================
        public async Task<DataTable> GetEmployees(int page, int size, string? search)
        {
            var param = new[]
            {
                new SqlParameter("@PageNumber", page),
                new SqlParameter("@PageSize", size),
                new SqlParameter("@Search", search == null ? DBNull.Value : search)
            };

            return await _sqlHelper.ExecuteAsync("stp_Emp_GetEmployeesPaged", param);
        }

        public async Task<DataTable> GetById(int id)
        {
            var param = new[]
            {
                new SqlParameter("@Row_Id", id)
            };

            return await _sqlHelper.ExecuteAsync("stp_Emp_GetById", param);
        }

        // ================= INSERT =================
        public async Task<DataTable> Insert(EmployeeDto dto)
        {
            var param = GetCommonParams(dto);

            // ✅ IMPORTANT: use ExecuteWithResultAsync
            return await _sqlHelper.ExecuteWithResultAsync("stp_Emp_InsertEmployee", param);
        }

        // ================= UPDATE =================
        public async Task<DataTable> Update(EmployeeDto dto)
        {
            var paramList = GetCommonParams(dto).ToList();
            paramList.Insert(0, new SqlParameter("@Row_Id", dto.Id));

            // ✅ IMPORTANT: use ExecuteWithResultAsync
            return await _sqlHelper.ExecuteWithResultAsync("stp_Emp_UpdateEmployee", paramList.ToArray());
        }

        // ================= DELETE =================
        public async Task<DataTable> Delete(int id)
        {
            var param = new[]
            {
                new SqlParameter("@Row_Id", id)
            };

            // (you should also update SP to return success/message)
            return await _sqlHelper.ExecuteWithResultAsync("stp_Emp_DeleteEmployee", param);
        }

        // ================= DROPDOWNS =================
        public async Task<DataTable> GetCountries()
            => await _sqlHelper.ExecuteAsync("stp_Emp_GetCountries", null);

        public async Task<DataTable> GetStates(int countryId)
        {
            var param = new[] { new SqlParameter("@CountryId", countryId) };
            return await _sqlHelper.ExecuteAsync("stp_Emp_GetStatesByCountry", param);
        }

        public async Task<DataTable> GetCities(int stateId)
        {
            var param = new[] { new SqlParameter("@StateId", stateId) };
            return await _sqlHelper.ExecuteAsync("stp_Emp_GetCitiesByState", param);
        }

        // ================= DUPLICATE =================
        public async Task<DataTable> CheckDuplicate(EmployeeDto dto)
        {
            var param = new[]
            {
                new SqlParameter("@Email", dto.Email),
                new SqlParameter("@Mobile", dto.Mobile),
                new SqlParameter("@Pan", dto.Pan),
                new SqlParameter("@Passport", dto.Passport)
            };

            return await _sqlHelper.ExecuteAsync("stp_Emp_CheckDuplicate", param);
        }

        // ================= COMMON PARAMS =================
        private SqlParameter[] GetCommonParams(EmployeeDto dto)
        {
            return new[]
            {
                new SqlParameter("@FirstName", dto.FirstName),
                new SqlParameter("@LastName", dto.LastName ?? (object)DBNull.Value),
                new SqlParameter("@CountryId", dto.CountryId),
                new SqlParameter("@StateId", dto.StateId),
                new SqlParameter("@CityId", dto.CityId),
                new SqlParameter("@EmailAddress", dto.Email),
                new SqlParameter("@MobileNumber", dto.Mobile),
                new SqlParameter("@PanNumber", dto.Pan),
                new SqlParameter("@PassportNumber", dto.Passport),
                new SqlParameter("@ProfileImage", dto.ProfileImage ?? (object)DBNull.Value),
                new SqlParameter("@Gender", dto.Gender),
                new SqlParameter("@DateOfBirth", dto.DateOfBirth),
                new SqlParameter("@DateOfJoinee", dto.DateOfJoinee ?? (object)DBNull.Value),
                new SqlParameter("@IsActive",dto.IsActive)
            };
        }
    }
}