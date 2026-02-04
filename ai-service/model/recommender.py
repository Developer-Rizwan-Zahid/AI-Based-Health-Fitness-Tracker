import numpy as np
from datetime import datetime, timedelta

def generate_recommendations(user_data):
    total_workouts = len(user_data.get("workouts", []))
    total_meals = len(user_data.get("meals", []))
    total_sleep = len(user_data.get("sleeps", []))

    avg_sleep = np.mean([s["durationHours"] for s in user_data.get("sleeps", [])]) if total_sleep else 7
    total_calories = sum([m["calories"] for m in user_data.get("meals", [])]) if total_meals else 2000
    today = datetime.now().date()
    weeklyWorkouts = []
    weeklyCalories = []
    weeklySleep = []

    for i in range(7):
        day = today - timedelta(days=6 - i)
        day_str = day.strftime("%a")  
        workout_duration = sum([w["durationMinutes"] for w in user_data.get("workouts", []) if w.get("date") == day.isoformat()])
        calories = sum([m["calories"] for m in user_data.get("meals", []) if m.get("date") == day.isoformat()])
        sleep_hours = sum([s["durationHours"] for s in user_data.get("sleeps", []) if s.get("sleepStart")[:10] == day.isoformat()])

        weeklyWorkouts.append({"day": day_str, "duration": workout_duration})
        weeklyCalories.append({"day": day_str, "calories": calories})
        weeklySleep.append({"day": day_str, "hours": sleep_hours})

    return {
        "suggestedWorkout": "Cardio" if avg_sleep > 7 else "Light Yoga",
        "recommendedCalories": 2200 if total_workouts > 3 else 1800,
        "dietTip": "Increase protein intake" if total_calories < 2000 else "Maintain current diet",
        "sleepAdvice": "Great job!" if avg_sleep >= 7 else "Try to sleep at least 7 hours daily",
        "weeklyWorkouts": weeklyWorkouts,
        "weeklyCalories": weeklyCalories,
        "weeklySleep": weeklySleep
    }
