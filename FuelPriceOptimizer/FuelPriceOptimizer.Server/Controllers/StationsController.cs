using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FuelPriceOptimizer.Server.Models;
using Microsoft.Extensions.Options;

namespace FuelPriceOptimizer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StationsController(IConfiguration configuration, ILogger<StationsController> logger, IStationService stationService) : Controller
    {
        private readonly ILogger _logger = logger;
        private readonly IConfiguration _configuration = configuration;
        private readonly IStationService _stationService = stationService;

        [HttpGet]
        public IActionResult Get()
        {
            var zones = _stationService.Get();
            return new OkObjectResult(zones);
        }

        [HttpGet("zone/{zoneId}")]
        public IActionResult GetByZone(string zoneId)
        {
            var zones = _stationService.GetByZone(zoneId);
            return new OkObjectResult(zones);
        }

        [HttpGet("{stationNumber}/summary")]
        public IActionResult Getsummary(string stationNumber)
        {
            var zones = _stationService.GetSummary(stationNumber);
            return new OkObjectResult(zones);
        }

        [HttpGet("{stationNumber}/summary/latest")]
        public IActionResult GetLatestSummary(string stationNumber)
        {
            var zones = _stationService.GetSummary(stationNumber);
            return new OkObjectResult(zones[-1]);
        }

        [HttpGet("summary")]
        public IActionResult GetStationsSummary()
        {
            var stationsSummary = _stationService.GetSummary();
            return new OkObjectResult(stationsSummary);
        }

        [HttpGet("summary/timeseries")]
        public IActionResult GetTimeSeriesSummary()
        {
            var stationsSummary = _stationService.GetTimeSeriesSummary();
            return new OkObjectResult(stationsSummary);
        }
    }
}
