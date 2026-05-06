using System.Data;

namespace EmployeeMaster.src.Infrastructure.helper
{
    public static class DataTableHelper
    {
        public static List<Dictionary<string, object>> Convert(DataTable dt)
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
    }
}
