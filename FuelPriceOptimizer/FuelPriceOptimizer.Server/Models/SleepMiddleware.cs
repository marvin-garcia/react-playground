namespace FuelPriceOptimizer.Server.Models
{
    public class SleepMiddleware(IConfiguration configuration, RequestDelegate next)
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            //var sleepEnv = Environment.GetEnvironmentVariable("SLEEP");
            var sleepEnv = _configuration["SLEEP"];

            if (!string.IsNullOrEmpty(sleepEnv) && sleepEnv.Equals("true", StringComparison.CurrentCultureIgnoreCase))
            {
                // Add a delay before processing the request (e.g., 5 seconds)
                await Task.Delay(5000);
            }

            // Continue to the next middleware or endpoint
            await _next(context);
        }
    }
}
