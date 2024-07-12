// Initialize Firebase (replace with your config)
const firebaseConfig = {
    // Your Firebase configuration here
  };
  firebase.initializeApp(firebaseConfig);
  
  const functions = firebase.functions();
  
  document.getElementById('startButton').addEventListener('click', startTracking);
  document.getElementById('stopButton').addEventListener('click', stopTracking);
  
  function startTracking() {
    const startSession = firebase.functions().httpsCallable('startSession');
    startSession().then(result => {
      document.getElementById('status').textContent = 'Study session started!';
    }).catch(error => {
      console.error(error);
      document.getElementById('status').textContent = 'Error starting session';
    });
  }
  
  function stopTracking() {
    const endSession = firebase.functions().httpsCallable('endSession');
    endSession().then(result => {
      document.getElementById('status').textContent = 'Study session ended.';
    }).catch(error => {
      console.error(error);
      document.getElementById('status').textContent = 'Error ending session';
    });
  }