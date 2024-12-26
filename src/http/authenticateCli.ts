import axios from 'axios';
import { AuthenticationRequestType } from '../@types';
import { SERVER_URL } from '../utils';

export async function authenticateCli(authenticationRequest: AuthenticationRequestType) {
  try {
    console.info('seeking authorization!');
    const body: AuthenticationRequestType = authenticationRequest.identity
      ? {
          identity: authenticationRequest.identity,
          username: authenticationRequest.username,
          projectTokenRef: authenticationRequest.projectTokenRef,
        }
      : {
          email: authenticationRequest.email,
          username: authenticationRequest.username,
          password: authenticationRequest.password,
          projectTokenRef: authenticationRequest.projectTokenRef,
          principalId: authenticationRequest.principalId,
        };
    const response = await axios.post(`${SERVER_URL}/a/signinWithCli`, body);
    return {
      status: true,
      code: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Authorization Error:', error.response?.statusText || 'server down');
    console.log('if you are authenticating with internet identity you may need to run "quikdb config" again.');
    return {
      status: false,
      code: error.response?.status,
      data: error.response?.data,
    };
  }
}
