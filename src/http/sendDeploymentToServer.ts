import axios from "axios";

const SERVER_URL = "http://localhost:5678/api/principals";

export async function sendDeploymentToServer(canisterId: string, canisterName: string, network: string) {
  try {
    const response = await axios.post(SERVER_URL, {
      canisterId,
      canisterName,
      network,
    });
    console.log(`Deployment info sent to server: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('Error sending deployment data to server:', error);
  }
}
