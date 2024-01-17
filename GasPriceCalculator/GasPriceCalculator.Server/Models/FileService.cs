using Newtonsoft.Json;
using Azure.Storage.Sas;
using Azure.Storage.Blobs;

namespace GasPriceCalculator.Server.Models
{
    public class File
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("fileName")]
        public string Name { get; set; }
        [JsonProperty("fileUrl")]
        public Uri Url { get; set; }
    }

    public interface IFileService
    {
        public List<File> Get();
        public Task<Uri> UploadAsync(string containerName, string fileName, Stream stream, int expirationMinutes = 60);
    }

    public class FileService : IFileService
    {
        private ILogger _logger;
        private IConfiguration _configuration;
        private readonly string _zonesFilePath = @"Data/ReportFiles.json";
        private readonly List<File> _files = new List<File>();

        public FileService(IConfiguration configuration, ILogger<FileService> logger)
        {
            _logger = logger;
            _configuration = configuration;

            string json;

            // Read JSON data from file
            using StreamReader r = new(_zonesFilePath);
            json = r.ReadToEnd();

            // Deserialize JSON to List<Zone>
            _files = JsonConvert.DeserializeObject<List<File>>(json);
        }

        public List<File> Get()
        {
            return _files;
        }

        public async Task<Uri> UploadAsync(string containerName, string fileName, Stream stream, int expirationMinutes = 60)
        {
            try
            {
                // upload
                var containerClient = new BlobContainerClient(_configuration["StorageAccount:ConnectionString"], containerName);
                var blobClient = containerClient.GetBlobClient(fileName);

                await blobClient.UploadAsync(stream, true);

                // get SAS token
                var permissions = BlobSasPermissions.Read;
                var expiresOn = new DateTimeOffset(DateTime.UtcNow.AddMinutes(expirationMinutes));
                Uri sasUri = blobClient.GenerateSasUri(permissions, expiresOn);

                return sasUri;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
