using FuelPriceOptimizer.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FuelPriceOptimizer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OptimizationController : Controller
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IOptimizationService _optimizationService;

        public OptimizationController(IConfiguration configuration, IOptimizationService optimizationService, ILogger<OptimizationController> logger)
        {
            _logger = logger;
            _configuration = configuration;
            _optimizationService = optimizationService;
        }

        [HttpPost("price")]
        public IActionResult PredictPrice(OptimizationParameters parameters)
        {
            var price = _optimizationService.OptimizePrice(parameters);
            return new OkObjectResult(price);
        }
    }
}
