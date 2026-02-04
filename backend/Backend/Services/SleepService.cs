using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SleepService
    {
        private readonly AppDbContext _db;
        public SleepService(AppDbContext db) => _db = db;

        public async Task<List<Sleep>> GetAllByUser(int userId) =>
            await _db.Sleeps.Where(s => s.UserId == userId).OrderByDescending(s => s.SleepStart).ToListAsync();

        public async Task<Sleep> AddAsync(Sleep sleep)
        {
            _db.Sleeps.Add(sleep);
            await _db.SaveChangesAsync();
            return sleep;
        }
    }
}
