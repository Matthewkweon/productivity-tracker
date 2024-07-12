from flask import Flask, render_template, request, jsonify
import time
import pyautogui
from pynput import keyboard
from twilio.rest import Client
import random
import requests
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)
# Twilio configuration
"""
account_sid = 'US062dcfd811912efe587c81ac03d20925'
auth_token = 'Y8QW3G616NF7N3G4GU5643EH'
twilio_phone_number = '+17753866072'
your_phone_number = '+13147378208'



client = Client(account_sid, auth_token)
"""
#API tokens
PUSHOVER_API_TOKEN = 'a9qoo26o82jqweeg8p2zf3oudomt4h'
PUSHOVER_USER_KEY = 'u1b3s25dbbus9eie2hy9jhtu6ah223'

# Global variables to track activity
keyboard_activity = False
last_activity_time = time.time()
tracking_active = False
tracking_thread = None

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

def on_press(key):
    global keyboard_activity, last_activity_time
    keyboard_activity = True
    last_activity_time = time.time()

# Set up the keyboard listener
listener = keyboard.Listener(on_press=on_press)
listener.start()

def is_user_active():
    global keyboard_activity, last_activity_time
    initial_position = pyautogui.position()
    time.sleep(1)  # Wait for 1 second
    new_position = pyautogui.position()
    
    mouse_active = abs(initial_position[0] - new_position[0]) > 5 or abs(initial_position[1] - new_position[1]) > 5
    
    if mouse_active:
        last_activity_time = time.time()
    
    activity = mouse_active or keyboard_activity
    keyboard_activity = False  # Reset keyboard activity flag
    
    return activity

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

def track_activity():
    global last_activity_time
    while True:
        current_time = time.time()
        if current_time - last_activity_time >= 300:  # 5 minutes
            if not is_user_active():
                send_pushover_notification()
                last_activity_time = current_time  # Reset timer after sending notification
        time.sleep(60)  # Check every minute


@app.route('/')
def home():
    return render_template('index.html')

sessions = {}
@app.route('/start', methods=['POST'])
def start_tracking():
    global tracking_active, tracking_thread
    if not tracking_active:
        tracking_active = True
        tracking_thread = threading.Thread(target=track_activity)
        tracking_thread.start()
        return jsonify({"status": "started"})
    return jsonify({"status": "already running"})

@app.route('/stop', methods=['POST'])
def stop_tracking():
    global tracking_active, tracking_thread
    if tracking_active:
        tracking_active = False
        if tracking_thread:
            tracking_thread.join()
        return jsonify({"status": "stopped"})
    return jsonify({"status": "not running"})

if __name__ == '__main__':
    """
    listener = keyboard.Listener(on_press=on_press)
    listener.start()
    print("Starting the web server...")
    print("Once it's running, go to http://127.0.0.1:5000/ in your web browser.")
    app.run(debug=True, use_reloader=False)
    """
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
    app.run(debug=True)
"""u1b3s25dbbus9eie2hy9jhtu6ah223"""