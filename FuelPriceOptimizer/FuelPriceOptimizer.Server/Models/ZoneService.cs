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
        public List<Dictionary<string, object>> GetTimeSeriesSummary();
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

        public List<Dictionary<string, object>> GetTimeSeriesSummary()
        {
            var summary = GetSummary();
            var dates = summary.Select(x => x.Date).Distinct();
            var zones = summary.Select(x => x.ZoneId).Distinct();
            var gridSummary = new List<Dictionary<string, object>>();
            foreach (var date in dates)
            {
                var datapoint = new Dictionary<string, object>()
                {
                    { "date", date }
                };
                var filteredData = summary.Where(x => x.Date == date);
                foreach (var zone in zones)
                {
                    var zoneData = filteredData.Where(x => x.ZoneId == zone).First();
                    datapoint.Add($"{zone}_avgTransferPrice", zoneData.AvgTransferPrice);
                    datapoint.Add($"{zone}_avgDtwPrice", zoneData.AvgDtwPrice);
                }

                gridSummary.Add(datapoint);
            }

            return gridSummary;
        }

        public List<Station> GetStations(string zoneId)
        {
            var stations = _stationService.GetByZone(zoneId);
            return stations;
        }
    }
}
