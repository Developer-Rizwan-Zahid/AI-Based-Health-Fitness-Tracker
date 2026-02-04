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
    public class MealController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IHubContext<FitnessHub> _hubContext;

        public MealController(AppDbContext dbContext, IHubContext<FitnessHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        // POST: Log a meal
        [HttpPost("log")]
        public async Task<IActionResult> LogMeal([FromBody] MealDto meal)
        {
            var mealEntity = new Meal
            {
                UserId = meal.UserId,
                Name = meal.Name,
                Calories = meal.Calories,
                Date = DateTime.UtcNow
            };

            _dbContext.Meals.Add(mealEntity);
            await _dbContext.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", meal.UserId, "meal", meal.ToString());

            return Ok(new { message = "Meal logged" });
        }

        // GET: user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMeals(int userId)
        {
            var meals = await _dbContext.Meals
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.Date)
                .ToListAsync();
            return Ok(meals);
        }

        // GET: admin
        [HttpGet("all")]
        public async Task<IActionResult> GetAllMeals()
        {
            var meals = await _dbContext.Meals.ToListAsync();
            return Ok(meals);
        }
    }

    public class MealDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public int Calories { get; set; }

        public override string ToString() => $"{Name} ({Calories} kcal)";
    }
}
