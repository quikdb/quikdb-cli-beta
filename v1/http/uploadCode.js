import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { LogAction, LogStatus, StatusCode } from '../@types';
import { SERVER_URL } from '../utils';
/**
 * Function to upload project code with a file attachment.
 * @param {string} projectId - Encrypted project ID.
 * @param {string} token - Authorization token.
 * @param {string} filePath - Path to the file to be uploaded.
 */
export async function uploadProjectCode(projectId, token, filePath) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        const response = await axios.put(`${SERVER_URL}/v/p/${projectId}/code`, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });
        console.log('file upload success');
        return {
            status: LogStatus.SUCCESS,
            code: StatusCode.OK,
            action: LogAction.UPLOAD_PROJECT_CODE,
            message: 'File upload success.',
            data: response.data,
        };
    }
    catch (error) {
        console.error('Error uploading project code:', error.response);
        return {
            status: LogStatus.FAIL,
            code: error.response?.status || 500,
            message: error.response?.data?.message || 'Internal server error.',
        };
    }
}
//# sourceMappingURL=uploadCode.js.map