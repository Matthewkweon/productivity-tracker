# Productivity Tracker

Productivity Tracker is a web application designed to help users manage their study sessions and maintain focus. It features activity tracking, inactivity notifications, and daily goal setting.

## Features

- Start and stop study sessions
- Track user activity
- Send notifications for inactivity periods
- Set and manage daily goals
- Motivational messages to keep users engaged

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Python with Flask
- Deployment: Heroku (backend), GitHub Pages (frontend)
- Notifications: Pushover API

## Setup and Installation

### Backend (Heroku)

1. Clone the repository:
```
git clone https://github.com/Matthewkweon/productivity-tracker.git
cd productivity-tracker
```

2. Install the required Python packages:
```
pip install -r requirements.txt
```

3. Set up a Heroku account and install the Heroku CLI.

4. Create a new Heroku app:
```
heroku create productivity-tracker
```

5. Set the necessary environment variables:
```
heroku config:set PUSHOVER_API_TOKEN=your_pushover_api_token
heroku config:set PUSHOVER_USER_KEY=your_pushover_user_key
```

6. Deploy the app to Heroku:
```
git push heroku main
```

### Frontend (GitHub Pages)

1. In your GitHub repository settings, enable GitHub Pages for the repository.

2. Set the source to the branch and folder containing your HTML, CSS, and JavaScript files.

3. Update the `API_URL` in your JavaScript file to point to your Heroku app URL.

## Usage

1. Open the application in your web browser.
2. Click "Start Study Session" to begin tracking your activity.
3. Set your daily goals when prompted.
4. The app will send notifications if you're inactive for more than 5-15 minutes depending on what you set it to.
5. Click "End Study Session" when you're done.

## Contributing

Contributions to the Productivity Tracker project are welcome. Please feel free to submit a Pull Request.

## Acknowledgements and Notes

Thank pushover for a free platform to send notifications between devices. I have tried to use twilio, but the process is very long and hope to incorporate it soon so that this program sends text messages instead.
