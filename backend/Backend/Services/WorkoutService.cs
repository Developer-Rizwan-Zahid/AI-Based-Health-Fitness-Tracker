using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class WorkoutService
    {
        private readonly AppDbContext _db;
        public WorkoutService(AppDbContext db) => _db = db;

        public async Task<List<Workout>> GetAllByUser(int userId) =>
            await _db.Workouts.Where(w => w.UserId == userId).OrderByDescending(w => w.Date).ToListAsync();

        public async Task<Workout> AddAsync(Workout w)
        {
            _db.Workouts.Add(w);
            await _db.SaveChangesAsync();
            return w;
        }
    }
}
