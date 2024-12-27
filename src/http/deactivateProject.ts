import axios from 'axios';
import { LogStatus, StatusCode, LogAction } from '../@types';
import { SERVER_URL } from '../utils';

/**
 * Function to encrypt user data by making a POST request to /v/p/projectId/activate
 */
export async function deactivateProject(projectId: string, payload: string, accessToken: string) {
  try {
    const response = await axios.post(
      `${SERVER_URL}/v/p/${projectId}/activate`,
      { data: payload },
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      status: LogStatus.SUCCESS,
      code: StatusCode.OK,
      message: 'Data encrypted successfully.',
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      status: LogStatus.FAIL,
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Internal server error.',
    };
  }
}
