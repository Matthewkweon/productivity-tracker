const API_URL = 'https://productivityapp-06361fe96871.herokuapp.com'; // Replace with your actual Heroku app URL
let userId = Date.now().toString();
let trackingActive = false;
let activityInterval;

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
        trackingActive = true;
        startActivityMonitoring();
        getGoals();
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
            body: JSON.stringify({ userId }),
            credentials: 'include'
        }).catch(error => console.error('Error updating activity:', error));
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

function showGoalsPrompt() {
    const goals = prompt("Enter your goals for today (comma-separated):");
    if (goals) {
        const goalsArray = goals.split(',').map(goal => goal.trim());
        setGoals(goalsArray);
    }
}

function setGoals(goals) {
    fetch(`${API_URL}/set_goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goals })
    })
    .then(response => response.json())
    .then(() => {
        displayGoals(goals);
    })
    .catch(error => console.error('Error setting goals:', error));
}

function getGoals() {
    fetch(`${API_URL}/get_goals?userId=${userId}`)
    .then(response => response.json())
    .then(goals => {
        if (goals.length === 0) {
            showGoalsPrompt();
        } else {
            displayGoals(goals);
        }
    })
    .catch(error => console.error('Error getting goals:', error));
}

function displayGoals(goals) {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';
    goals.forEach(goal => {
        const li = document.createElement('li');
        li.textContent = goal;
        goalsList.appendChild(li);
    });
    document.getElementById('goalsSection').style.display = 'block';
}

function addGoal() {
    const newGoalInput = document.getElementById('newGoal');
    const newGoal = newGoalInput.value.trim();
    if (newGoal) {
        fetch(`${API_URL}/get_goals?userId=${userId}`)
        .then(response => response.json())
        .then(goals => {
            goals.push(newGoal);
            setGoals(goals);
            newGoalInput.value = '';
        })
        .catch(error => console.error('Error adding goal:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing event listeners)
    document.getElementById('startButton').addEventListener('click', startTracking);
    document.getElementById('stopButton').addEventListener('click', stopTracking);
    document.getElementById('addGoalButton').addEventListener('click', addGoal);
    getGoals();
});
