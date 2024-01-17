using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FuelPriceOptimizer.Server.Models;
using Microsoft.Extensions.Options;

namespace FuelPriceOptimizer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StationsController : Controller
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IZoneService _zoneService;

        public StationsController(IConfiguration configuration, ILogger<StationsController> logger, IZoneService zoneService)
        {
            _logger = logger;
            _configuration = configuration;
            _zoneService = zoneService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var zones = _zoneService.Get();
            return new OkObjectResult(zones);
        }

        [HttpGet("id/{zoneId}")]
        public IActionResult GetByZoneId(string zoneId)
        {
            var zones = _zoneService.GetByZoneId(zoneId);
            return new OkObjectResult(zones);
        }

        [HttpGet("state/{state}")]
        public IActionResult GetByState(string state)
        {
            var zones = _zoneService.GetByState(state);
            return new OkObjectResult(zones);
        }

        [HttpGet("state/{state}/city/{city}")]
        public IActionResult GetByCity(string state, string city)
        {
            var zones = _zoneService.GetByCity(state, city);
            return new OkObjectResult(zones);
        }

        [HttpGet("cot/{cot}")]
        public IActionResult GetByCot(string cot)
        {
            var zones = _zoneService.GetByCot(cot);
            return new OkObjectResult(zones);
        }
    }
}
