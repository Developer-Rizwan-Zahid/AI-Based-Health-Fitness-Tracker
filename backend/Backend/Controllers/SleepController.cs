using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Hubs;
using Backend.Models;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SleepController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IHubContext<FitnessHub> _hubContext;

        public SleepController(AppDbContext dbContext, IHubContext<FitnessHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        // POST: Log sleep
        [HttpPost("log")]
        public async Task<IActionResult> LogSleep([FromBody] SleepDto sleep)
        {
            var sleepEntity = new Sleep
            {
                UserId = sleep.UserId,
                DurationHours = sleep.Hours,
                SleepStart = DateTime.UtcNow,
                SleepEnd = DateTime.UtcNow.AddHours(sleep.Hours)
            };

            _dbContext.Sleeps.Add(sleepEntity);
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", sleep.UserId, "sleep", sleep.ToString());

            return Ok(new { message = "Sleep logged" });
        }

        // GET: user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetSleepRecords(int userId)
        {
            var sleeps = await _dbContext.Sleeps
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SleepStart)
                .ToListAsync();
            return Ok(sleeps);
        }

        // GET: admin
        [HttpGet("all")]
        public async Task<IActionResult> GetAllSleep()
        {
            var sleeps = await _dbContext.Sleeps.ToListAsync();
            return Ok(sleeps);
        }
    }

    public class SleepDto
    {
        public int UserId { get; set; }
        public int Hours { get; set; }

        public override string ToString() => $"{Hours} hours";
    }
}
