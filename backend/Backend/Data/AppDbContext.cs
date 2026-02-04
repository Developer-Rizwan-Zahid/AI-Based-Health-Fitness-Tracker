using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<Sleep> Sleeps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //User entity configuration
           modelBuilder.Entity<User>(entity =>
{
    entity.HasKey(u => u.Id);
    entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
    entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
    entity.HasIndex(u => u.Email).IsUnique();

    entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(256);
    entity.Property(u => u.CreatedAt).IsRequired().HasDefaultValueSql("NOW()");

    entity.Property(u => u.Weight).IsRequired().HasDefaultValue(0);
    entity.Property(u => u.Height).IsRequired().HasDefaultValue(0);
    entity.Property(u => u.Goal).HasMaxLength(200).HasDefaultValue("");
});

            //Workout entity configuration
            modelBuilder.Entity<Workout>(entity =>
            {
                entity.HasKey(w => w.Id);
                entity.Property(w => w.Date).IsRequired();
                entity.Property(w => w.DurationMinutes).IsRequired();
                entity.HasOne<User>().WithMany(u => u.Workouts).HasForeignKey(w => w.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            //Meal entity configuration
            modelBuilder.Entity<Meal>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Date).IsRequired();
                entity.Property(m => m.Calories).IsRequired();
                entity.HasOne<User>().WithMany(u => u.Meals).HasForeignKey(m => m.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            //Sleep entity configuration
            modelBuilder.Entity<Sleep>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.SleepStart).IsRequired();
                entity.Property(s => s.DurationHours).IsRequired();
                entity.HasOne<User>().WithMany(u => u.Sleeps).HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
