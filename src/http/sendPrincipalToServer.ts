import axios from 'axios';

const SERVER_URL = 'http://localhost:5678/api/principals';

export async function sendPrincipalToServer(principalId: string, username: string, seedPhrase: string) {
  try {
    const response = await axios.post(SERVER_URL, {
      principalId,
      username,
      seedPhrase,
    });
    console.log(`Principal data sent to server: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('Error sending principal data to server:', error);
  }
}
