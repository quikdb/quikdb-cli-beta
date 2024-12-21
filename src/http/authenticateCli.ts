import axios from "axios";
import { AuthenticationRequestType } from '../@types';
import { SERVER_URL } from '../utils';

export async function authenticateCli(authenticationRequest: AuthenticationRequestType) {
  try {
    console.info('seeking authorization!');
    const response = await axios.post(`${SERVER_URL}/a/signinWithCli`, authenticationRequest);
    return {
      status: true,
      code: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error sending deployment data to server:', error.response?.statusText || 'server down');
    console.log('if you are authenticating with internet identity you may need to run "quikdb config" again.')
    return {
      status: false,
      code: error.response?.status,
      data: error.response?.data,
    };
  }
}
