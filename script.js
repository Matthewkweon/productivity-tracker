const API_URL = 'https://productivityapp-06361fe96871.herokuapp.com'; // Replace with your actual Heroku app URL
let userId = Date.now().toString();
let trackingActive = false;
let activityInterval;
let socket;

document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById('startButton');
    const stopBtn = document.getElementById('stopButton');
    const goalsModal = document.getElementById('goalsModal');
    const saveGoalsBtn = document.getElementById('saveGoalsBtn');
    const goalsInput = document.getElementById('goalsInput');
    const goalsDisplay = document.getElementById('goalsDisplay');
    const goalsText = document.getElementById('goalsText');
    const pomodoroStatus = document.getElementById('pomodoroStatus');

    let studyGoals = "";
    startBtn.addEventListener('click', () => {
        goalsModal.style.display = 'block';
    });

    saveGoalsBtn.addEventListener('click', () => {
        studyGoals = goalsInput.value;
        goalsModal.style.display = 'none';
        goalsDisplay.style.display = 'block';

        const goalsArray = studyGoals.split('\n');
        goalsText.innerHTML = '';

        goalsArray.forEach(goal => {
            if (goal.trim()) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'goal-checkbox';

                const label = document.createElement('label');
                label.textContent = goal;

                const div = document.createElement('div');
                div.className = 'goal-item';
                div.appendChild(checkbox);
                div.appendChild(label);

                goalsText.appendChild(div);
            }
        });

        console.log("Study goals saved: ", studyGoals);
        startTracking(studyGoals);
        startPomodoro();
    });

    stopBtn.addEventListener('click', () => {
        studyGoals = "";
        goalsInput.value = "";
        goalsDisplay.style.display = 'none';
        console.log("Study session ended. Goals cleared.");

        stopTracking();
        stopPomodoro();
    });

    document.addEventListener('mousemove', updateLastActivity);
    document.addEventListener('keypress', updateLastActivity);

    function updateLastActivity() {
        if (socket && socket.connected) {
            socket.emit('activity_ping', { userId: userId });
        }
    }
});

function startTracking(goals) {
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
        startSocketConnection(); // Start socket connection here
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
        stopSocketConnection(); // Stop socket connection here
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'Error ending session';
    });
}

function startSocketConnection() {
    socket = io(API_URL); // Initialize the socket connection

    socket.on('connect', () => {
        console.log('Connected to WebSocket');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
    });
}

function stopSocketConnection() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
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
    activityInterval = setInterval(updateActivity, 60000); // Send activity update every minute
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keypress', updateActivity);
}

function stopActivityMonitoring() {
    clearInterval(activityInterval);
    document.removeEventListener('mousemove', updateActivity);
    document.removeEventListener('keypress', updateActivity);
}

function startPomodoro() {
    let time = 25 * 60;
    let isStudySession = true; // Initialize isStudySession to true
    timerInterval = setInterval(() => {
        if (time <= 0) {
            if (isStudySession) {
                isStudySession = false;
                time = 5 * 60; // 5-minute break
                document.getElementById('pomodoroStatus').textContent = 'Break time! Take a 5-minute break.';
            } else {
                isStudySession = true;
                time = 25 * 60; // 25-minute study session
                document.getElementById('pomodoroStatus').textContent = 'Study time! 25 minutes of focused study.';
            }
        }

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        time--;
    }, 1000);
}

function stopPomodoro() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = '25:00';
    document.getElementById('pomodoroStatus').textContent = '';
}
