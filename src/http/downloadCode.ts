import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { LogAction, LogStatus, StatusCode } from '../@types';
import { SERVER_URL } from '../utils';

/**
 * Function to download project code and save it to a specified file.
 * @param {string} projectId - Encrypted project ID.
 * @param {string} token - Authorization token.
 * @param {string} outputPath - Path where the downloaded file should be saved.
 */
export async function downloadProjectCode(projectId: string, token: string, outputPath: string) {
  try {
    const response = await axios.patch(`${SERVER_URL}/v/p/${projectId}/code`, null, {
      headers: {
        Authorization: token,
      },
      responseType: 'arraybuffer',
    });

    fs.writeFileSync(outputPath, response.data);

    console.log(`File downloaded successfully and saved to ${outputPath}`);

    return {
      status: LogStatus.SUCCESS,
      code: StatusCode.OK,
      message: 'File download success.',
      data: {
        filePath: outputPath,
      },
    };
  } catch (error: any) {
    console.error('Error downloading project code:', error.response?.data || error.message);
    return {
      status: LogStatus.FAIL,
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Internal server error.',
    };
  }
}
