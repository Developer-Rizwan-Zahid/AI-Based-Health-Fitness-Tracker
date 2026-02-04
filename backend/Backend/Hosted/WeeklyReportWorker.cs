using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Backend.Hosted
{
    public class WeeklyReportWorker : BackgroundService
    {
        private readonly IConfiguration _config;
        public WeeklyReportWorker(IConfiguration config) => _config = config;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var now = DateTime.UtcNow;
                    if (now.DayOfWeek == DayOfWeek.Monday && now.Hour == 6) 
                    {
                        var psi = new ProcessStartInfo("python", "AIService/reporter.py 123")
                        {
                            WorkingDirectory = _config.GetValue<string>("Paths:AIServicePath") ?? "/app/AIService",
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false
                        };
                        var p = Process.Start(psi);
                        p?.WaitForExit(300000); 
                    }
                }
                catch(Exception ex)
                {
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}
