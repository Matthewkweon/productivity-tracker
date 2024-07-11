document.getElementById('startButton').addEventListener('click', startTracking);
document.getElementById('stopButton').addEventListener('click', stopTracking);

function startTracking() {
    // This will be replaced with actual API call later
    document.getElementById('status').textContent = 'Study session started!';
}

function stopTracking() {
    // This will be replaced with actual API call later
    document.getElementById('status').textContent = 'Study session ended.';
}