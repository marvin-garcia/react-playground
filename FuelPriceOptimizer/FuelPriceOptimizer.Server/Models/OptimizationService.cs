using System;
using Newtonsoft.Json;

namespace FuelPriceOptimizer.Server.Models
{
    public class OptimizationParameters
    {
        [JsonProperty("volume")]
        public double Volume { get; set; }
        [JsonProperty("marketShare")]
        public double MarketShare { get; set; }
        [JsonProperty("profitMargin")]
        public double ProfitMargin { get; set; }
    }

    public interface IOptimizationService
    {
        public double OptimizePrice(OptimizationParameters oarameters);
    }

    public class OptimizationService : IOptimizationService
    {
        public double OptimizePrice(OptimizationParameters parameters)
        {
            var random = new Random();
            var price = Math.Round(random.NextDouble(), 2);

            return price;
        }
    }
}
