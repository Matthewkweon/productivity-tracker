const API_URL = 'https://productivityapp-06361fe96871.herokuapp.com'; // Replace with your actual Heroku app URL
let userId = Date.now().toString();
let trackingActive = false;
let activityInterval;

document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById('startButton');
    const stopBtn = document.getElementById('stopButton');
    const goalsModal = document.getElementById('goalsModal');
    const saveGoalsBtn = document.getElementById('saveGoalsBtn');
    const goalsInput = document.getElementById('goalsInput');

    let studyGoals = "";
    startBtn.addEventListener('click', () => {
        goalsModal.style.display = 'block';
    });

    saveGoalsBtn.addEventListener('click', () => {
        studyGoals = goalsInput.value;
        goalsModal.style.display = 'none';
        console.log("Study goals saved: ", studyGoals);  // For debugging

        startTracking(studyGoals);
    });

    stopBtn.addEventListener('click', () => {
        studyGoals = "";
        goalsInput.value = "";
        console.log("Study session ended. Goals cleared.");  // For debugging

        stopTracking();
    });
});


function startTracking() {
    console.log('Start button clicked');
    fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goals })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Start response:', data);
        document.getElementById('status').textContent = 'Study session started!';
        trackingActive = true;
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
        trackingActive = false;
        stopActivityMonitoring();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'Error ending session';
    });
}

function updateActivity() {
    if (trackingActive) {
        fetch(`${API_URL}/update_activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
    }
}

function startActivityMonitoring() {
    activityInterval = setInterval(updateActivity, 60000);  // Send activity update every minute
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keypress', updateActivity);
}

function stopActivityMonitoring() {
    clearInterval(activityInterval);
    document.removeEventListener('mousemove', updateActivity);
    document.removeEventListener('keypress', updateActivity);
}
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('goalsModal').style.display = 'block';
});

document.getElementById('stopButton').addEventListener('click', stopTracking);

