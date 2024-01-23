using System;
using System.Diagnostics;
using Newtonsoft.Json;

namespace FuelPriceOptimizer.Server.Models
{
    public abstract class BaseParameters
    {
        [JsonProperty("volume")]
        public double Volume { get; set; }
        [JsonProperty("marketShare")]
        public double MarketShare { get; set; }
        [JsonProperty("profitMargin")]
        public double ProfitMargin { get; set; }
    }

    public class OptimizationParameters : BaseParameters { }

    public class OptimizationPrediction : BaseParameters
    {
        [JsonProperty("date")]
        public DateTime Date { get; set; }
        [JsonProperty("fuelPrice")]
        public double FuelPrice { get; set; }

        public OptimizationPrediction() { }

        public OptimizationPrediction(BaseParameters parameters, double price)
        {
            this.Date = DateTime.UtcNow;
            this.Volume = parameters.Volume;
            this.MarketShare = parameters.MarketShare;
            this.ProfitMargin = parameters.ProfitMargin;
            this.FuelPrice = price;
        }
    }

    public class TrainingHistory
    {
        [JsonProperty("date")]
        public DateTime Date { get; set; }
        [JsonProperty("user")]
        public string User { get; set; }
        [JsonProperty("durationInMinutes")]
        public int DurationInMinutes { get; set; }
    }

    public interface IOptimizationService
    {
        public OptimizationPrediction PredictPrice(OptimizationParameters parameters);
        public List<OptimizationPrediction> GetOptimizationHistory();
        public List<TrainingHistory> GetTrainingHistory();
    }

    public class OptimizationService : IOptimizationService
    {
        private readonly List<OptimizationPrediction> _predictionHistory;
        private readonly string _optimizationHistoryFilePath = @"Data/OptimizationHistory.json";

        public OptimizationService()
        {
            string json;

            // Read JSON data from file
            using StreamReader r = new(_optimizationHistoryFilePath);
            json = r.ReadToEnd();

            // Deserialize JSON to List<Zone>
            _predictionHistory = JsonConvert.DeserializeObject<List<OptimizationPrediction>>(json);
        }

        public OptimizationPrediction PredictPrice(OptimizationParameters parameters)
        {
            var random = new Random();
            var price = Math.Round(random.NextDouble(), 2);

            var prediction = new OptimizationPrediction(parameters, price);
            return prediction;
        }

        public List<OptimizationPrediction> GetOptimizationHistory()
        {
            return _predictionHistory;
        }

        public List<TrainingHistory> GetTrainingHistory()
        {
            var random = new Random();
            var history = new List<TrainingHistory>();

            // Generate a random number of activities (between 5 and 10)
            int numberOfActivities = random.Next(5, 7);

            for (int i = 0; i < numberOfActivities; i++)
            {
                // Generate random date within working hours (9 AM to 5 PM) between 12/16/23 and 1/2/24
                DateTime date = GenerateRandomDate(random, new DateTime(2023, 12, 16), new DateTime(2024, 1, 2));

                // Generate random user between John Doe and Jane Doe
                string user = GenerateRandomUser(random);

                // Generate random duration between 2 and 5 minutes
                int durationInMinutes = random.Next(2, 6);

                // Create and add the activity to the list
                history.Add(new TrainingHistory { Date = date, User = user, DurationInMinutes = durationInMinutes });
            }

            history = history.OrderByDescending(x => x.Date).ToList();

            return history;
        }

        private static DateTime GenerateRandomDate(Random random, DateTime startDate, DateTime endDate)
        {
            TimeSpan workingHoursStart = new TimeSpan(9, 0, 0);
            TimeSpan workingHoursEnd = new TimeSpan(17, 0, 0);

            DateTime randomDate = startDate.AddDays(random.Next((endDate - startDate).Days));
            randomDate = randomDate.AddHours(workingHoursStart.TotalHours + random.NextDouble() * (workingHoursEnd.TotalHours - workingHoursStart.TotalHours));

            return randomDate;
        }

        private static string GenerateRandomUser(Random random)
        {
            string[] users = { "John Doe", "Jane Doe" };
            return users[random.Next(users.Length)];
        }
    }
}
