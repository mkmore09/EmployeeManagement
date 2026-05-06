using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EmployeeMaster.src.Presentation.Filters
{
    public sealed class ArgumentExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is ArgumentException ex)
            {
                context.Result = new BadRequestObjectResult(new { error = ex.Message });
                context.ExceptionHandled = true;
            }
        }
    }
}
