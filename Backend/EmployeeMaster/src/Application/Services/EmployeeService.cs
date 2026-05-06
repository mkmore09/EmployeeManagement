using EmployeeMaster.src.Application.DTOs;
using EmployeeMaster.src.Application.DTOs.EmployeeMaster.src.Application.DTOs;
using EmployeeMaster.src.Application.Interfaces;
using EmployeeMaster.src.Presentation.Exceptions;
using System.Data;

namespace EmployeeMaster.src.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repo;

        public EmployeeService(IEmployeeRepository repo)
        {
            _repo = repo;
        }

        // ================= READ =================
        public async Task<DataTable> GetEmployees(int page, int size, string search)
            => await _repo.GetEmployees(page, size, search);

        public async Task<DataTable> GetById(int id)
            => await _repo.GetById(id);

        public async Task<DataTable> GetCountries()
            => await _repo.GetCountries();

        public async Task<DataTable> GetStates(int countryId)
            => await _repo.GetStates(countryId);

        public async Task<DataTable> GetCities(int stateId)
            => await _repo.GetCities(stateId);

        public async Task<DataTable> CheckDuplicate(EmployeeDto dto)
            => await _repo.CheckDuplicate(dto);

        // ================= INSERT =================
        public async Task<ApiResponse> Insert(EmployeeDto dto)
        {
            Validate(dto);
            Normalize(dto);
            await ValidateLocation(dto);

            var result = await _repo.Insert(dto);
            return ParseResponse(result);
        }

        // ================= UPDATE =================
        public async Task<ApiResponse> Update(EmployeeDto dto)
        {
            Validate(dto);
            Normalize(dto);
            await ValidateLocation(dto);

            var result = await _repo.Update(dto);
            return ParseResponse(result);
        }

        // ================= DELETE =================
        public async Task<ApiResponse> Delete(int id)
        {
            if (id <= 0)
                throw new ValidationException("Invalid Id");

            var result = await _repo.Delete(id);
            return ParseResponse(result);
        }

        // ================= COMMON =================
        private ApiResponse ParseResponse(DataTable dt)
        {
            if (dt.Rows.Count == 0)
                return new ApiResponse { Success = false, Message = "No response from DB" };

            return new ApiResponse
            {
                Success = Convert.ToInt32(dt.Rows[0]["success"]) == 1,
                Message = dt.Rows[0]["message"]?.ToString() ?? ""
            };
        }

        private void Validate(EmployeeDto dto)
        {
            if (dto.DateOfBirth >= DateTime.Today)
                throw new ValidationException("DOB must be less than today");

            if (dto.DateOfJoinee.HasValue && dto.DateOfJoinee >= DateTime.Today)
                throw new ValidationException("DOJ must be less than today");

            if (dto.DateOfJoinee.HasValue && dto.DateOfJoinee < dto.DateOfBirth)
                throw new ValidationException("DOJ cannot be before DOB");

            if (string.IsNullOrWhiteSpace(dto.Pan))
                throw new ValidationException("PAN required");

            if (string.IsNullOrWhiteSpace(dto.Passport))
                throw new ValidationException("Passport required");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ValidationException("Email required");

            if (string.IsNullOrWhiteSpace(dto.Mobile))
                throw new ValidationException("Mobile required");
        }

        private static void Normalize(EmployeeDto dto)
        {
            dto.Pan = dto.Pan?.ToUpperInvariant();
            dto.Passport = dto.Passport?.ToUpperInvariant();
        }

        private async Task ValidateLocation(EmployeeDto dto)
        {
            var states = await _repo.GetStates(dto.CountryId);

            bool stateExists = states.AsEnumerable()
                .Any(r => Convert.ToInt32(r["Row_Id"]) == dto.StateId);

            if (!stateExists)
                throw new ValidationException("Invalid State");

            var cities = await _repo.GetCities(dto.StateId);

            bool cityExists = cities.AsEnumerable()
                .Any(r => Convert.ToInt32(r["Row_Id"]) == dto.CityId);

            if (!cityExists)
                throw new ValidationException("Invalid City");
        }
    }
}