import axios from "axios";
import { AuthenticationRequestType } from '../@types';

const SERVER_URL = 'https://quikdb-core-beta.onrender.com';

export async function authenticateCli(authenticationRequest: AuthenticationRequestType) {
  try {
    console.info('Authentication request!')
    const response = await axios.post(`${SERVER_URL}/a/signinWithCli`, authenticationRequest);
    console.log(`Authentication status: ${response.status} ${response.statusText}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error sending deployment data to server:', error.response);
    return {
      status: error.response.status,
      data: error.response.data,
    };
  }
}
