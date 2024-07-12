const API_URL = 'https://productivityapp-06361fe96871.herokuapp.com'; // Replace with your actual Heroku app URL
let userId = Date.now().toString();  // Simple unique identifier

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startTracking);
    document.getElementById('stopButton').addEventListener('click', stopTracking);
});

function startTracking() {
    console.log('Start button clicked');
    fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Start response:', data);
        document.getElementById('status').textContent = 'Study session started!';
        startActivityMonitoring();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'Error starting session';
    });
}

function stopTracking() {
    console.log('Stop button clicked');
    fetch(`${API_URL}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Stop response:', data);
        document.getElementById('status').textContent = 'Study session ended.';
        stopActivityMonitoring();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'Error ending session';
    });
}

let activityInterval;

function startActivityMonitoring() {
    activityInterval = setInterval(() => {
        fetch(`${API_URL}/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
    }, 60000);  // Send activity update every minute

    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keypress', updateActivity);
}

function stopActivityMonitoring() {
    clearInterval(activityInterval);
    document.removeEventListener('mousemove', updateActivity);
    document.removeEventListener('keypress', updateActivity);
}

function updateActivity() {
    fetch(`${API_URL}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
}