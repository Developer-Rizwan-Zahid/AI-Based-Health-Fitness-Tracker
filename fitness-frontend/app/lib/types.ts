export interface User {
  id: number;
  name: string;
  email: string;
  goal?: string;
}

export interface Meal {
  id: number;
  userId: number;
  name: string;
  calories: number;
  date: string;
}

export interface Workout {
  id: number;
  userId: number;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string;
}

export interface Sleep {
  id: number;
  userId: number;
  durationHours: number;
  sleepStart: string;
  sleepEnd: string;
}
