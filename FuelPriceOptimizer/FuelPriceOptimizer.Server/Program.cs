using FuelPriceOptimizer.Server.Models;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IFileService, FileService>();
builder.Services.AddSingleton<IStationService, StationService>();
builder.Services.AddSingleton<IZoneService, ZoneService>();
builder.Services.AddSingleton<IOptimizationService, OptimizationService>();
builder.Services.AddCors();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors(builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
