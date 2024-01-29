using Microsoft.Identity.Web;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
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
builder.Services.AddSingleton<IGraphService, GraphService>();
builder.Services.AddCors();

// This is required to be instantiated before the OpenIdConnectOptions starts getting configured.
// By default, the claims mapping will map claim names in the old format to accommodate older SAML applications.
// For instance, 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' instead of 'roles' claim.
// This flag ensures that the ClaimsIdentity claims collection will be built from the claims in the token
JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

// Adds Microsoft Identity platform (AAD v2.0) support to protect this Api
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApi(options =>
        {
            builder.Configuration.Bind("AzureAdB2C", options);
        },
options => { builder.Configuration.Bind("AzureAdB2C", options); });

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

// Sleep middleware to delay all responses
app.UseMiddleware<SleepMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
