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

    public class ZoneSummaryList
    {
        public string ZoneId { get; set; }
        public List<ZoneSummary> Summaries { get; set; }

        public ZoneSummaryList() { }

        public ZoneSummaryList(string zoneId, List<ZoneSummary> summaries)
        {
            this.ZoneId = zoneId;
            this.Summaries = summaries;
        }
    }

    public interface IZoneService
    {
        public List<ZoneSummaryList> GetSummary();
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

        public List<ZoneSummaryList> GetSummary()
        {
            var zonesSummaries = new List<ZoneSummaryList>();
            var summaryFiles = Directory.GetFiles(_zonesFilesPath);
            foreach (var summaryFile in summaryFiles)
            {
                var zoneId = Path.GetFileNameWithoutExtension(summaryFile);
                zonesSummaries.Add(new ZoneSummaryList(zoneId, GetSummary(zoneId)));
            }

            return zonesSummaries;
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
