const functions = require('firebase-functions');
const axios = require('axios');

const API_URL = 'https://your-app-name.herokuapp.com';

exports.startSession = functions.https.onCall(async (data, context) => {
  try {
    const response = await axios.post(`${API_URL}/start`);
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to start session');
  }
});

exports.endSession = functions.https.onCall(async (data, context) => {
  try {
    const response = await axios.post(`${API_URL}/stop`);
    return response.data;
  } catch (error) {
    console.error('Error ending session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to end session');
  }
});