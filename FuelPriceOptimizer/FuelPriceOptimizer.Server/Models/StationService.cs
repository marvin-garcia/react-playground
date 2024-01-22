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
        [JsonProperty("latitude")]
        public double Latitude { get; set; }
        [JsonProperty("longitude")]
        public double Longitude { get; set; }

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
        public List<StationSummary> GetSummary();
        public List<Dictionary<string, object>> GetTimeSeriesSummary();
    }

    public class StationService : IStationService
    {
        private readonly List<Station> _stations;
        private readonly string _zonesFilePath = @"Data/Zones.json";
        private readonly string _summaryFilesPath = @"Data/StationSummary";

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
            using StreamReader r = new(@$"{_summaryFilesPath}\{stationNumber}.json");
            json = r.ReadToEnd();

            var summary = JsonConvert.DeserializeObject<List<StationSummary>>(json);
            summary = [.. summary.OrderBy(x => x.Date)];
            return summary;
        }

        public List<StationSummary> GetSummary()
        {
            var summary = new List<StationSummary>();
            var stations = Get();

            foreach (var station in stations)
            {
                summary.AddRange(GetSummary(station.StationNumber));
            }

            summary = [.. summary.OrderBy(x => x.Date)];
            return summary;
        }

        public List<Dictionary<string, object>> GetTimeSeriesSummary()
        {
            var summary = GetSummary();
            var dates = summary.Select(x => x.Date).Distinct();
            var stations = summary.Select(x => x.StationNumber).Distinct();
            var gridSummary = new List<Dictionary<string, object>>();
            foreach (var date in dates)
            {
                var datapoint = new Dictionary<string, object>()
                {
                    { "date", date }
                };
                var filteredData = summary.Where(x => x.Date == date);
                foreach (var station in stations)
                {
                    var zoneData = filteredData.Where(x => x.StationNumber == station).First();
                    datapoint.Add($"{station}_volume", zoneData.Volume);
                    datapoint.Add($"{station}_rolling7DayVolume", zoneData.Rolling7DayVolume);
                    datapoint.Add($"{station}_weekToWeekChangeVolume", zoneData.WeekToWeekChangeVolume);
                    datapoint.Add($"{station}_changePercentage", zoneData.ChangePercentage);
                    datapoint.Add($"{station}_margin", zoneData.Margin);
                    datapoint.Add($"{station}_rum", zoneData.Rum);
                }

                gridSummary.Add(datapoint);
            }

            return gridSummary;
        }
    }
}
