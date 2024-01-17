using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GasPriceCalculator.Server.Models;

namespace GasPriceCalculator.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : Controller
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IFileService _fileService;
        private readonly string _containerName;

        public FilesController(IConfiguration configuration, ILogger<FilesController> logger, IFileService fileService)
        {
            _logger = logger;
            _configuration = configuration;
            _fileService = fileService;
            _containerName = "gasreports";
        }

        [HttpGet]
        public IActionResult Get()
        {
            var files = _fileService.Get();
            return new OkObjectResult(files);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                using var stream = file.OpenReadStream();
                var sasUrl = await _fileService.UploadAsync(_containerName, file.FileName, stream);

                return new OkObjectResult(sasUrl);
            }
            catch (Exception e)
            {
                return BadRequest($"Error: {e.Message}");
            }
        }
    }
}
