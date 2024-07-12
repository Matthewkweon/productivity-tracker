document.getElementById('startButton').addEventListener('click', startTracking);
document.getElementById('stopButton').addEventListener('click', stopTracking);

const API_URL = 'https://productivityapp-06361fe96871.herokuapp.com/';  // Replace with your actual backend URL

function startTracking() {
    fetch(`${API_URL}/start`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('status').textContent = 'Study session started!';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').textContent = 'Error starting session';
        });
}

function stopTracking() {
    fetch(`${API_URL}/stop`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('status').textContent = 'Study session ended.';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').textContent = 'Error ending session';
        });
}