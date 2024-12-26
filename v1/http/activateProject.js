import axios from 'axios';
import { LogStatus, StatusCode } from '../@types';
import { SERVER_URL } from '../utils';
/**
 * Function to encrypt user data by making a POST request to /v/p/projectId/activate
 */
export async function activateProject(projectId, payload, accessToken) {
    try {
        const response = await axios.post(`${SERVER_URL}/v/p/${projectId}/activate`, { data: payload }, {
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json',
            },
        });
        return {
            status: LogStatus.SUCCESS,
            code: StatusCode.OK,
            message: 'Data encrypted successfully.',
            data: response.data.data,
        };
    }
    catch (error) {
        // Handle errors and return a structured response
        console.error('Error encrypting user data:', error.response?.data || error.message);
        return {
            status: LogStatus.FAIL,
            code: error.response?.status || 500,
            message: error.response?.data?.message || 'Internal server error.',
        };
    }
}
//# sourceMappingURL=activateProject.js.map