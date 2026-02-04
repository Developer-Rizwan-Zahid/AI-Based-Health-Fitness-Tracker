namespace Backend.Models
{
    public class Sleep
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public double DurationHours { get; set; }
        public DateTime SleepStart { get; set; }
        public DateTime SleepEnd { get; set; }
    }
}
