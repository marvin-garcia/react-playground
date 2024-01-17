using Newtonsoft.Json;

namespace GasPriceCalculator.Server.Models
{
    public class WholesaleSummary
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("report")]
        public string ReportId { get; set; }
        [JsonProperty("zone")]
        public string Zone { get; set; }
        [JsonProperty("date")]
        public DateTime Date { get; set; }
        [JsonProperty("ReferenceMops")]
        public double ReferenceMops { get; set;}
        [JsonProperty("volume")]
        public double Volume { get; set; }
        [JsonProperty("margin")]
        public double Margin { get; set; }
        [JsonProperty("avgDtwPrice")]
        public double AvgDtwPrice { get; set; }
    }

    public interface IWholesaleService
    {
        public List<WholesaleSummary> GetSummary(DateTime? before, DateTime? after);
    }

    public class WholesaleService : IWholesaleService
    {
        private readonly List<WholesaleSummary> _summary;
        private readonly string _summaryFilePath = @"Data/WholesaleSummary.json";

        public WholesaleService()
        {
            string json;

            // Read JSON data from file
            using StreamReader r = new(_summaryFilePath);
            json = r.ReadToEnd();

            // Deserialize JSON to List<Zone>
            _summary = JsonConvert.DeserializeObject<List<WholesaleSummary>>(json);
        }

        public List<WholesaleSummary> GetSummary(DateTime? before, DateTime? after)
        {
            var filteredSummary = _summary;
            if (before.HasValue)
            {
                filteredSummary = filteredSummary.Where(x => x.Date > before.Value).ToList();
            }

            if (after.HasValue)
            {
                filteredSummary = filteredSummary.Where(x => x.Date < after.Value).ToList();
            }

            return filteredSummary;
        }
    }
}
