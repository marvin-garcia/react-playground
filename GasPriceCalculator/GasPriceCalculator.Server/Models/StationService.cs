using Newtonsoft.Json;

namespace GasPriceCalculator.Server.Models
{
    public class Zone
    {
        [JsonProperty("stationNumber")]
        public string StationNumber { get; set; }
        [JsonProperty("opisNumber")]
        public string OPISNumber { get; set; }
        [JsonProperty("stationName")]
        public string StationName { get; set; }
        [JsonProperty("streetAddress")]
        public string StreetAddres { get; set; }
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

        public Zone() { }
    }

    public interface IZoneService
    {
        public List<Zone> Get();

        public List<Zone> GetByZoneId(string zoneId);

        public List<Zone> GetByState(string state);

        public List<Zone> GetByCity(string state, string city);

        public List<Zone> GetByCot(string cot);
    }

    public class StationService : IZoneService
    {
        private readonly List<Zone> _zones;
        private readonly string _zonesFilePath = @"Data/Zones.json";

        public StationService()
        {
            string json;

            // Read JSON data from file
            using StreamReader r = new(_zonesFilePath);
            json = r.ReadToEnd();

            // Deserialize JSON to List<Zone>
            _zones = JsonConvert.DeserializeObject<List<Zone>>(json);
        }

        public List<Zone> Get()
        {
            return _zones;
        }

        public List<Zone> GetByZoneId(string zoneId)
        {
            var zones = _zones.Where(x => string.Equals(x.ZoneId, zoneId, StringComparison.OrdinalIgnoreCase)).ToList();
            return zones;
        }

        public List<Zone> GetByState(string state)
        {
            var zones = _zones.Where(x => string.Equals(x.State, state, StringComparison.OrdinalIgnoreCase)).ToList();
            return zones;
        }

        public List<Zone> GetByCity(string state, string city)
        {
            var zones = _zones.Where(x => string.Equals(x.State, state, StringComparison.OrdinalIgnoreCase) && string.Equals(x.City, city, StringComparison.OrdinalIgnoreCase)).ToList();
            return zones;
        }

        public List<Zone> GetByCot(string cot)
        {
            var zones = _zones.Where(x => string.Equals(x.COT, cot, StringComparison.OrdinalIgnoreCase)).ToList();
            return zones;
        }
    }
}
