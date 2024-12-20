import axios from 'axios';
import { LogStatus, StatusCode, LogAction } from '../@types';
import { SERVER_URL } from '../utils';

/**
 * Function to encrypt user data by making a POST request to /a/encrypt
 */
export async function encryptUserData(payload: string, projectTokenRef: string) {
  try {
    const response = await axios.post(
      `${SERVER_URL}/a/encrypt`,
      { data: payload },
      {
        headers: {
          Authorization: projectTokenRef,
          'Content-Type': 'application/json',
        },
      }
    );
    // Return a structured response
    return {
      status: LogStatus.SUCCESS,
      code: StatusCode.OK,
      message: 'Data encrypted successfully.',
      data: response.data.data,
    };
  } catch (error: any) {
    // Handle errors and return a structured response
    console.error('Error encrypting user data:', error.response?.data || error.message);

    return {
      status: LogStatus.FAIL,
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Internal server error.',
    };
  }
}
