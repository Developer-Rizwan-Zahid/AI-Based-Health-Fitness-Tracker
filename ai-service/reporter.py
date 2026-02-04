import requests
from jinja2 import Template
from datetime import datetime, timedelta
import sys

DOTNET_BASE = "http://localhost:5137/api"
REPORT_SEND_ENDPOINT = f"{DOTNET_BASE}/reports/send"

HTML_TEMPLATE = """
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Weekly Progress Report</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; padding: 20px; }
    .card { border-radius: 8px; background:#fff; padding:16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom:12px; }
    h1 { color: #0b5fff; }
    table { width:100%; border-collapse: collapse; }
    th, td { text-align:left; padding:8px; border-bottom:1px solid #eee; }
  </style>
</head>
<body>
  <h1>Weekly Progress Report — {{ user_email }}</h1>
  <p>Report period: {{ start_date }} — {{ end_date }}</p>

  <div class="card">
    <h3>Summary</h3>
    <ul>
      <li>Total Workouts: {{ total_workouts }}</li>
      <li>Total Meals Logged: {{ total_meals }}</li>
      <li>Average Sleep Hours: {{ avg_sleep_hours }}</li>
      <li>Estimated Avg Daily Calories: {{ avg_daily_calories }}</li>
    </ul>
  </div>

  <div class="card">
    <h3>Recent Workouts</h3>
    {% if workouts %}
      <table>
        <thead><tr><th>Date</th><th>Type</th><th>Duration (min)</th><th>Calories</th></tr></thead>
        <tbody>
        {% for w in workouts %}
          <tr>
            <td>{{ w.date }}</td>
            <td>{{ w.type }}</td>
            <td>{{ w.durationMinutes }}</td>
            <td>{{ w.caloriesBurned }}</td>
          </tr>
        {% endfor %}
        </tbody>
      </table>
    {% else %}
      <p>No workouts this week.</p>
    {% endif %}
  </div>

  <div class="card">
    <h3>Recent Meals</h3>
    {% if meals %}
      <table>
        <thead><tr><th>Date</th><th>Name</th><th>Calories</th></tr></thead>
        <tbody>
        {% for m in meals %}
          <tr>
            <td>{{ m.date }}</td>
            <td>{{ m.name }}</td>
            <td>{{ m.calories }}</td>
          </tr>
        {% endfor %}
        </tbody>
      </table>
    {% else %}
      <p>No meals logged this week.</p>
    {% endif %}
  </div>

  <div class="card">
    <h3>Notes</h3>
    <p>{{ note }}</p>
  </div>

  <footer style="font-size:12px; color:#777; margin-top:20px;">
    Generated on {{ generated_on }}
  </footer>
</body>
</html>
"""

def iso_date(dt):
    return dt.isoformat()

def format_date(dt):
    return dt.strftime("%Y-%m-%d %H:%M")

def get_week_range(reference=None):
    if reference is None:
        reference = datetime.utcnow()
    end = reference
    start = end - timedelta(days=7)
    return start, end

def fetch_user_email(user_id):
    r = requests.get(f"{DOTNET_BASE}/auth/user/{user_id}")
    if r.status_code == 200:
        return r.json().get("email")
    return f"user-{user_id}@example.com"

def fetch_data_for_user(user_id, start_iso, end_iso):
    meals = requests.get(f"{DOTNET_BASE}/meal/{user_id}").json()
    sleeps = requests.get(f"{DOTNET_BASE}/sleep/{user_id}").json()
    def in_range(item, date_key):
        try:
            dt = datetime.fromisoformat(item[date_key].replace("Z", "+00:00"))
            return start_iso <= dt <= end_iso
        except:
            return True

    s_dt = datetime.fromisoformat(start_iso)
    e_dt = datetime.fromisoformat(end_iso)
    workouts = [w for w in workouts if in_range(w, "date")]
    meals = [m for m in meals if in_range(m, "date")]
    sleeps = [s for s in sleeps if in_range(s, "sleepStart")]
    return workouts, meals, sleeps

def build_report_html(user_email, workouts, meals, sleeps, start_date, end_date):
    total_workouts = len(workouts)
    total_meals = len(meals)
    avg_sleep_hours = round(sum([s.get("durationHours", 0) for s in sleeps]) / (len(sleeps) or 1), 2)
    total_cal = sum([m.get("calories", 0) for m in meals])
    avg_daily_cal = round(total_cal / 7, 2)

    template = Template(HTML_TEMPLATE)
    html = template.render(
        user_email=user_email,
        start_date=format_date(start_date),
        end_date=format_date(end_date),
        total_workouts=total_workouts,
        total_meals=total_meals,
        avg_sleep_hours=avg_sleep_hours,
        avg_daily_calories=avg_daily_cal,
        workouts=[{
            "date": format_date(datetime.fromisoformat(w["date"].replace("Z", "+00:00"))),
            "type": w.get("type",""),
            "durationMinutes": w.get("durationMinutes", 0),
            "caloriesBurned": w.get("caloriesBurned", 0)
        } for w in workouts],
        meals=[{
            "date": format_date(datetime.fromisoformat(m["date"].replace("Z", "+00:00"))),
            "name": m.get("name",""),
            "calories": m.get("calories", 0)
        } for m in meals],
        note="Keep up the good work! Small consistent actions win.",
        generated_on=format_date(datetime.utcnow())
    )
    return html

def send_report_via_dotnet(to_email, subject, html):
    payload = {"to": to_email, "subject": subject, "html": html}
    r = requests.post(REPORT_SEND_ENDPOINT, json=payload)
    r.raise_for_status()
    return r.json()

def run_for_user(user_id):
    start, end = get_week_range()
    start_iso = start.isoformat()
    end_iso = end.isoformat()

    workouts, meals, sleeps = fetch_data_for_user(user_id, start_iso, end_iso)
    to_email = None
    try:
        u = requests.get(f"{DOTNET_BASE}/user/{user_id}")
        if u.status_code == 200:
            to_email = u.json().get("email")
    except:
        pass
    if not to_email:
        to_email = f"user+{user_id}@example.com"

    html = build_report_html(to_email, workouts, meals, sleeps, start, end)
    subject = f"Your Weekly FitTrackAI Report — {start.date()} → {end.date()}"
    resp = send_report_via_dotnet(to_email, subject, html)
    print("Report sent:", resp)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python reporter.py <userId>")
        sys.exit(1)
    user_id = int(sys.argv[1])
    run_for_user(user_id)
