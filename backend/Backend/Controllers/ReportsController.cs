using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly AppDbContext _db;

        public ReportController(EmailService emailService, AppDbContext db)
        {
            _emailService = emailService;
            _db = db;
        }

        [HttpPost("send/{userId}")]
        public async Task<IActionResult> SendReport(int userId)
        {
            try
            {
                //Fetch user from database
                var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null || string.IsNullOrEmpty(user.Email))
                    return BadRequest(new { message = "User email not found." });

                //Fetch weekly data
                var workouts = await _db.Workouts
                    .Where(w => w.UserId == userId && w.Date >= DateTime.UtcNow.AddDays(-7))
                    .ToListAsync();
                var meals = await _db.Meals
                    .Where(m => m.UserId == userId && m.Date >= DateTime.UtcNow.AddDays(-7))
                    .ToListAsync();
                var sleeps = await _db.Sleeps
                    .Where(s => s.UserId == userId && s.SleepStart >= DateTime.UtcNow.AddDays(-7))
                    .ToListAsync();

                //Prepare email content (HTML)
                string body = $@"
                    <h2>Hello {user.Name}!</h2>
                    <p>Here’s your weekly health summary:</p>
                    <ul>
                        <li><strong>Workouts:</strong> {workouts.Count} sessions</li>
                        <li><strong>Meals Logged:</strong> {meals.Count}</li>
                        <li><strong>Sleep Records:</strong> {sleeps.Count}</li>
                    </ul>
                    <p>Keep up the good work!</p>
                    <p>— FitTrackAI</p>
                ";

                string subject = "Your Weekly Health Report";

                await _emailService.SendEmailAsync(user.Email, subject, body);

                return Ok(new { message = "Weekly report sent successfully!" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Failed to send email.", error = ex.Message });
            }
        }
    }
}
