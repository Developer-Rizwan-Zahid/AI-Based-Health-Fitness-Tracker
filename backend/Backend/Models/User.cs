using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Auth fields
        public string PasswordHash { get; set; } = string.Empty; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 

        // Health fields
        public double Weight { get; set; }      
        public double Height { get; set; }     
        public string Goal { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
        public ICollection<Meal> Meals { get; set; } = new List<Meal>();
        public ICollection<Sleep> Sleeps { get; set; } = new List<Sleep>();
    }
}
