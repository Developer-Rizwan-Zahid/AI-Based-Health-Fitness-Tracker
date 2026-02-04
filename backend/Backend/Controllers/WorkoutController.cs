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
    public class WorkoutController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IHubContext<FitnessHub> _hubContext;

        public WorkoutController(AppDbContext dbContext, IHubContext<FitnessHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        // POST: workout
        [HttpPost("log")]
        public async Task<IActionResult> LogWorkout([FromBody] WorkoutDto workout)
        {
            var workoutEntity = new Workout
            {
                UserId = workout.UserId,
                Type = workout.Type,
                DurationMinutes = workout.DurationMinutes,
                Date = DateTime.UtcNow
            };

            _dbContext.Workouts.Add(workoutEntity);
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", workout.UserId, "workout", workout.ToString());

            return Ok(new { message = "Workout logged" });
        }

        // GET: user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWorkouts(int userId)
        {
            var workouts = await _dbContext.Workouts
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.Date)
                .ToListAsync();
            return Ok(workouts);
        }

        // GET: admin
        [HttpGet("all")]
        public async Task<IActionResult> GetAllWorkouts()
        {
            var workouts = await _dbContext.Workouts.ToListAsync();
            return Ok(workouts);
        }
    }

    public class WorkoutDto
    {
        public int UserId { get; set; }
        public string Type { get; set; }
        public int DurationMinutes { get; set; }

        public override string ToString() => $"{Type} ({DurationMinutes} min)";
    }
}
