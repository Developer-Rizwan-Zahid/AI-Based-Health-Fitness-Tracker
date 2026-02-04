using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class MealService
    {
        private readonly AppDbContext _db;
        public MealService(AppDbContext db) => _db = db;

        public async Task<List<Meal>> GetAllByUser(int userId) =>
            await _db.Meals.Where(m => m.UserId == userId).OrderByDescending(m => m.Date).ToListAsync();

        public async Task<Meal> AddAsync(Meal meal)
        {
            _db.Meals.Add(meal);
            await _db.SaveChangesAsync();
            return meal;
        }
    }
}
