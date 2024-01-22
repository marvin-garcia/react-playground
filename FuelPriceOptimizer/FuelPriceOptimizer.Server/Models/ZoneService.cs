using Newtonsoft.Json;

namespace FuelPriceOptimizer.Server.Models
{
    public class ZoneSummary
    {
        [JsonProperty("zone")]
        public string ZoneId { get; set; }
        [JsonProperty("date")]
        public DateTime Date { get; set; }
        [JsonProperty("avgTransferPrice")]
        public double AvgTransferPrice { get; set; }
        [JsonProperty("avgDtwPrice")]
        public double AvgDtwPrice { get; set; }

        public ZoneSummary() { }
    }

    public interface IZoneService
    {
        public List<ZoneSummary> GetSummary();
        public List<ZoneSummary> GetSummary(string zoneId);
        public List<Station> GetStations(string zoneId);
    }

    public class ZoneService : IZoneService
    {
        private readonly string _zonesFilesPath = @"Data\ZoneSummary";
        private readonly IStationService _stationService;

        public ZoneService(IStationService stationService)
        {
            _stationService = stationService;
        }

        public List<ZoneSummary> GetSummary()
        {
            var summary = new List<ZoneSummary>();
            var summaryFiles = Directory.GetFiles(_zonesFilesPath);
            foreach (var summaryFile in summaryFiles)
            {
                var zoneId = Path.GetFileNameWithoutExtension(summaryFile);
                summary.AddRange(GetSummary(zoneId));
            }

            summary = [.. summary.OrderBy(x => x.Date)];
            return summary;
        }

        public List<ZoneSummary> GetSummary(string zoneId)
        {
            string json;

            // Read JSON data from file
            using StreamReader r = new(@$"{_zonesFilesPath}\{zoneId}.json");
            json = r.ReadToEnd();

            var summary = JsonConvert.DeserializeObject<List<ZoneSummary>>(json);
            summary = [.. summary.OrderBy(x => x.Date)];
            return summary;
        }

        public List<Station> GetStations(string zoneId)
        {
            var stations = _stationService.GetByZone(zoneId);
            return stations;
        }
    }
}
