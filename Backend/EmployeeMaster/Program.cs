using EmployeeMaster.src.Application.Interfaces;
using EmployeeMaster.src.Application.Services;
using EmployeeMaster.src.Infrastructure.helper;
using EmployeeMaster.src.Infrastructure.Persistence.Repositories;
using EmployeeMaster.src.Presentation.Exceptions;
using EmployeeMaster.src.Presentation.Filters;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ================= CONTROLLERS + FILTER =================
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ArgumentExceptionFilter>();
});

// ================= CORS =================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ================= SWAGGER =================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ================= DI =================
builder.Services.AddScoped<SqlHelper>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

// ================= DTO VALIDATION RESPONSE =================
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value.Errors.Count > 0)
            .SelectMany(x => x.Value.Errors)
            .Select(x => x.ErrorMessage)
            .ToList();

        var response = new
        {
            success = false,
            message = errors.FirstOrDefault() ?? "Validation failed"
        };

        return new BadRequestObjectResult(response);
    };
});

var app = builder.Build();

// ================= DEBUG (VERY IMPORTANT) =================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // ?? shows real errors
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ================= HTTPS =================
app.UseHttpsRedirection();

// ================= GLOBAL EXCEPTION HANDLER =================
app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        // ? DO NOT INTERFERE WITH SWAGGER
        if (context.Request.Path.StartsWithSegments("/swagger"))
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            return;
        }

        context.Response.ContentType = "application/json";

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        var feature = context.Features.Get<IExceptionHandlerFeature>();

        if (feature == null)
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                success = false,
                message = "Unexpected error occurred"
            }));

            return;
        }

        var ex = feature.Error;

        // ?? LOG ERROR
        logger.LogError(ex, "Unhandled Exception");

        int statusCode = ex switch
        {
            ValidationException => StatusCodes.Status400BadRequest,
            ArgumentException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        context.Response.StatusCode = statusCode;

        var response = new
        {
            success = false,
            message = ex.Message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    });
});

// ================= MIDDLEWARE =================
app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthorization();

// ================= ENDPOINTS =================
app.MapControllers();

app.Run();