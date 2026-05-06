using EmployeeMaster.src.Application.DTOs;
using EmployeeMaster.src.Application.DTOs.EmployeeMaster.src.Application.DTOs;
using EmployeeMaster.src.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace EmployeeMaster.src.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeeController(IEmployeeService service)
        {
            _service = service;
        }

        // 🔹 Convert DataTable → JSON
        private List<Dictionary<string, object>> Convert(DataTable dt)
        {
            var list = new List<Dictionary<string, object>>();

            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();

                foreach (DataColumn col in dt.Columns)
                {
                    dict[col.ColumnName] = row[col];
                }

                list.Add(dict);
            }

            return list;
        }

        // ================= READ =================

        [HttpGet]
        public async Task<IActionResult> Get(int page = 1, int size = 10, string? search = null)
        {
            var data = await _service.GetEmployees(page, size, search);
            return Ok(Convert(data));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetById(id);

            if (data.Rows.Count == 0)
                return NotFound(new ApiResponse { Success = false, Message = "Employee not found" });

            return Ok(Convert(data));
        }

        // ================= WRITE =================

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EmployeeDto dto)
        {
            var res = await _service.Insert(dto);

            if (!res.Success)
                return BadRequest(res);

            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] EmployeeDto dto)
        {
            var res = await _service.Update(dto);

            if (!res.Success)
                return BadRequest(res);

            return Ok(res);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _service.Delete(id);

            if (!res.Success)
                return BadRequest(res);

            return Ok(res);
        }

        // ================= DROPDOWNS =================

        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries()
        {
            var data = await _service.GetCountries();
            return Ok(Convert(data));
        }

        [HttpGet("states/{countryId}")]
        public async Task<IActionResult> GetStates(int countryId)
        {
            var data = await _service.GetStates(countryId);
            return Ok(Convert(data));
        }

        [HttpGet("cities/{stateId}")]
        public async Task<IActionResult> GetCities(int stateId)
        {
            var data = await _service.GetCities(stateId);
            return Ok(Convert(data));
        }

        // ================= DUPLICATE =================

        [HttpPost("check-duplicate")]
        public async Task<IActionResult> CheckDuplicate([FromBody] EmployeeDto dto)
        {
            var data = await _service.CheckDuplicate(dto);
            return Ok(Convert(data));
        }
    }
}