using System.Data;
using Microsoft.Data.SqlClient;

namespace EmployeeMaster.src.Infrastructure.helper
{
    public class SqlHelper
    {
        private readonly string _connectionString;

        public SqlHelper(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
        }

        // ✅ Used for SELECT SPs
        public async Task<DataTable> ExecuteAsync(string spName, SqlParameter[]? parameters)
        {
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand(spName, con);

            cmd.CommandType = CommandType.StoredProcedure;

            if (parameters != null)
                cmd.Parameters.AddRange(parameters);

            await con.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            DataTable dt = new DataTable();
            dt.Load(reader);

            return dt;
        }

        // ❌ OLD (remove usage)
        // public async Task<int> ExecuteNonQueryAsync(...)

        // ✅ NEW → used for INSERT / UPDATE / DELETE
        public async Task<DataTable> ExecuteWithResultAsync(string spName, SqlParameter[]? parameters)
        {
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand(spName, con);

            cmd.CommandType = CommandType.StoredProcedure;

            if (parameters != null)
                cmd.Parameters.AddRange(parameters);

            await con.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            DataTable dt = new DataTable();
            dt.Load(reader);

            return dt;
        }
    }
}