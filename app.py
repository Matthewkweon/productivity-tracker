from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random
import requests
import threading
import os
from datetime import datetime, clock
import pytz

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://matthewkweon.github.io", "http://localhost:5000"]}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# API tokens
PUSHOVER_API_TOKEN = os.environ.get('PUSHOVER_API_TOKEN', 'a9qoo26o82jqweeg8p2zf3oudomt4h')
PUSHOVER_USER_KEY = os.environ.get('PUSHOVER_USER_KEY', 'u1b3s25dbbus9eie2hy9jhtu6ah223')

# Global variables to track activity
sessions = {}

# Bank of messages
message_bank = [
    "Time to get back to work!",
    "Remember, your motivation is an exhaustive source. Work within your system!",
    "Make things fun to do. Whatever it may be, find a way to enjoy it!",
    "Take purposeful breaks, they will help you not burn out and study with purpose",
    "Remember the goals you have set for yourself. Keep working towards them!",
    "Remember, you're living your own life. Experiment with what works for you!",
    "Always be learning about yourself. No one but yourself can tell you what works for you.",
    "Imagine the obstacles you face and intentionally think about how you would overcome them!",
    "Don't get mad at yourself for not being perfect. Just one step at a time.",
    "After trying a study habit or anything, give yourself feedback on how it went, and make changes accordingly."
]

def get_random_message():
    return random.choice(message_bank)

def send_pushover_notification():
    try:
        message = get_random_message()
        r = requests.post("https://api.pushover.net/1/messages.json", data = {
            "token": PUSHOVER_API_TOKEN,
            "user": PUSHOVER_USER_KEY,
            "message": message,
            "title": "Work Reminder"
        })
        if r.status_code == 200:
            print(f"Notification sent: {message}")
        else:
            print(f"Failed to send notification. Status code: {r.status_code}")
    except Exception as e:
        print(f"Error sending notification: {str(e)}")

user_activity = {}
active_users = set()
user_goals = {}

@app.route('/start', methods=['POST'])
def start_tracking():
    user_id = request.json.get('userId')
    active_users.add(user_id)
    user_activity[user_id] = time.time()
    return jsonify({"status": "tracking started"})

@app.route('/stop', methods=['POST'])
def stop_tracking():
    user_id = request.json.get('userId')
    if user_id in active_users:
        active_users.remove(user_id)
    if user_id in user_activity:
        del user_activity[user_id]
    return jsonify({"status": "tracking stopped"})

@app.route('/update_activity', methods=['POST'])
def update_activity():
    user_id = request.json.get('userId')
    user_activity[user_id] = time.time()
    return jsonify({"status": "activity updated"})

@app.route('/set_goals', methods=['POST'])
def set_goals():
    user_id = request.json.get('userId')
    goals = request.json.get('goals')
    user_goals[user_id] = {
        'goals': goals,
        'date': date.today().isoformat()
    }
    return jsonify({"status": "goals set"})

@app.route('/get_goals', methods=['GET'])
def get_goals():
    user_id = request.args.get('userId')
    if user_id in user_goals:
        if user_goals[user_id]['date'] == date.today().isoformat():
            return jsonify(user_goals[user_id]['goals'])
    return jsonify([])

def check_inactivity(user_id):
    while True:
        current_time = datetime.now(pytz.utc)
        for user_id in list(active_users):
            if user_id in user_activity and (current_time - user_activity[user_id]).total_seconds() > 300:  # 5 minutes
                send_pushover_notification()
                user_activity[user_id] = current_time  # Reset the timer after sending notification
            
            # Reset goals at the start of a new day
            if user_id in user_goals and user_goals[user_id]['date'] != current_time.date().isoformat():
                del user_goals[user_id]
        
        time.sleep(60)  # Check every minute

@app.route('/start', methods=['POST'])
def start_tracking():
    user_id = request.json.get('userId', 'default')
    if user_id not in sessions:
        sessions[user_id] = {
            'last_activity': time.time(),
            'active': True
        }
        threading.Thread(target=check_inactivity, args=(user_id,)).start()
        return jsonify({"status": "started"})
    return jsonify({"status": "already running"})

@app.route('/stop', methods=['POST'])
def stop_tracking():
    user_id = request.json.get('userId', 'default')
    if user_id in sessions:
        sessions[user_id]['active'] = False
        del sessions[user_id]
        return jsonify({"status": "stopped"})
    return jsonify({"status": "not running"})

@app.route('/activity', methods=['POST'])
def update_activity():
    user_id = request.json.get('userId', 'default')
    if user_id in sessions:
        sessions[user_id]['last_activity'] = time.time()
        return jsonify({"status": "updated"})
    return jsonify({"status": "no active session"}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)