using FuelPriceOptimizer.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FuelPriceOptimizer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ZonesController(IConfiguration configuration, IZoneService zoneService, ILogger<ZonesController> logger) : Controller
    {
        private readonly ILogger _logger = logger;
        private readonly IConfiguration _configuration = configuration;
        private readonly IZoneService _zoneService = zoneService;

        [HttpGet("{zoneId}/summary")]
        public IActionResult GetSummary(string zoneId)
        {
            var summary = _zoneService.GetSummary(zoneId);
            return new OkObjectResult(summary);
        }

        [HttpGet("summary")]
        public IActionResult GetAllSummaries()
        {
            var summaries = _zoneService.GetSummary();
            return new OkObjectResult(summaries);
        }

        [HttpGet("summary/timeseries")]
        public IActionResult GetTmeSeriesSummary()
        {
            var timeseries = _zoneService.GetTimeSeriesSummary();
            return new OkObjectResult(timeseries);
        }

        [HttpGet("{zoneId}/stations")]
        public IActionResult GetStations(string zoneId)
        {
            var stations = _zoneService.GetStations(zoneId);
            return new OkObjectResult(stations);
        }
    }
}
