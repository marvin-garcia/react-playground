using Newtonsoft.Json;

namespace FuelPriceOptimizer.Server.Models
{
    public class Station
    {
        [JsonProperty("stationNumber")]
        public string StationNumber { get; set; }
        [JsonProperty("opisNumber")]
        public string OPISNumber { get; set; }
        [JsonProperty("stationName")]
        public string StationName { get; set; }
        [JsonProperty("streetAddress")]
        public string StreetAddress { get; set; }
        [JsonProperty("city")]
        public string City { get; set; }
        [JsonProperty("state")]
        public string State { get; set; }
        [JsonProperty("zipCode")]
        public int ZipCode { get; set; }
        [JsonProperty("cot")]
        public string COT { get; set; }
        [JsonProperty("zone")]
        public string ZoneId { get; set; }

        public Station() { }
    }

    public class StationSummary
    {
        [JsonProperty("stationNumber")]
        public string StationNumber { get; set; }
        [JsonProperty("date")]
        public DateTime Date { get; set; }
        [JsonProperty("volume")]
        public double Volume { get; set; }
        [JsonProperty("rolling7DayVolume")]
        public double Rolling7DayVolume { get; set; }
        [JsonProperty("weekToWeekChangeVolume")]
        public double WeekToWeekChangeVolume { get; set; }
        [JsonProperty("changePercentage")]
        public double ChangePercentage { get; set; }
        [JsonProperty("margin")]
        public double Margin { get; set; }
        [JsonProperty("rum")]
        public double Rum { get; set; }
    }

    public interface IStationService
    {
        public List<Station> Get();
        public List<Station> GetByZone(string zoneId);
        public List<StationSummary> GetSummary(string stationNumber);
    }

    public class StationService : IStationService
    {
        private readonly List<Station> _stations;
        private readonly string _zonesFilePath = @"Data/Zones.json";
        private readonly string _summaryFIlesPath = @"Data/StationSummary";

        public StationService()
        {
            string json;

            // Read JSON data from file
            using StreamReader r = new(_zonesFilePath);
            json = r.ReadToEnd();

            // Deserialize JSON to List<Zone>
            _stations = JsonConvert.DeserializeObject<List<Station>>(json);
        }

        public List<Station> Get()
        {
            return [.. _stations.OrderBy(x => x.ZoneId)];
        }

        public List<Station> GetByZone(string zoneId)
        {
            var zones = _stations.Where(x => string.Equals(x.ZoneId, zoneId, StringComparison.OrdinalIgnoreCase)).ToList();
            zones = [.. zones.OrderBy(x => x.ZoneId)];
            return zones;
        }

        public List<StationSummary> GetSummary(string stationNumber)
        {
            string json;

            // Read JSON data from file
            using StreamReader r = new(@$"{_summaryFIlesPath}\{stationNumber}.json");
            json = r.ReadToEnd();

            var summary = JsonConvert.DeserializeObject<List<StationSummary>>(json);
            summary = [.. summary.OrderBy(x => x.Date)];
            return summary;
        }
    }
}
