using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Weight,
                    u.Height,
                    u.Goal
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/admin/user/5
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Weight,
                user.Height,
                user.Goal
            });
        }

        // POST: api/admin/user
        [HttpPost("user")]
        public async Task<IActionResult> CreateUser([FromBody] User newUser)
        {
            if (string.IsNullOrEmpty(newUser.Name) || string.IsNullOrEmpty(newUser.Email))
                return BadRequest(new { message = "Name and Email are required" });

            newUser.Goal = newUser.Goal ?? "";

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            return Ok(newUser);
        }

        // PUT: api/admin/user/5
        [HttpPut("user/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            user.Weight = updatedUser.Weight;
            user.Height = updatedUser.Height;
            user.Goal = updatedUser.Goal ?? "";

            await _db.SaveChangesAsync();
            return Ok(user);
        }

        // DELETE: api/admin/user/5
        [HttpDelete("user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return Ok(new { message = "User deleted successfully" });
        }

        // GET: api/admin/analytics
        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            var users = await _db.Users.ToListAsync();
            var totalUsers = users.Count;
            var totalWorkouts = await _db.Workouts.CountAsync(); // optional if you track workouts
            var totalMeals = await _db.Meals.CountAsync();       // optional if you track meals
            var totalSleepRecords = await _db.Sleeps.CountAsync(); // optional

            return Ok(new
            {
                totalUsers,
                totalWorkouts,
                totalMeals,
                totalSleepRecords
            });
        }
    }
}
