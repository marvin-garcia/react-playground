using FuelPriceOptimizer.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace FuelPriceOptimizer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GraphController(IConfiguration configuration, ILogger<FilesController> logger, IGraphService graphService) : Controller
    {
        private readonly ILogger _logger = logger;
        private readonly IConfiguration _configuration = configuration;
        private readonly IGraphService _graphService = graphService;

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _graphService.GetUsers();
            return new OkObjectResult(users);
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var user = await _graphService.GetUser(userId);
            return new OkObjectResult(user);
        }

        [HttpGet("groups")]
        public async Task<IActionResult> GetGroups()
        {
            var groups = await _graphService.GetGroups();
            return new OkObjectResult(groups);
        }

        [HttpGet("groups/{groupId}")]
        public async Task<IActionResult> GetGroup(string groupId)
        {
            var group = await _graphService.GetGroup(groupId);
            return new OkObjectResult(group);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser(AADB2C.User user)
        {
            var newUser = await _graphService.CreateUser(user);
            return new OkObjectResult(newUser);
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var deletedUser = await _graphService.DeleteUser(userId);
            return new OkObjectResult(deletedUser);
        }
    }
}
