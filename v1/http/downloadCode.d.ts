import { LogStatus, StatusCode } from '../@types';
/**
 * Function to download project code and save it to a specified file.
 * @param {string} projectId - Encrypted project ID.
 * @param {string} token - Authorization token.
 * @param {string} outputPath - Path where the downloaded file should be saved.
 */
export declare function downloadProjectCode(projectId: string, token: string, outputPath: string): Promise<{
    status: LogStatus;
    code: StatusCode;
    message: string;
    data: {
        filePath: string;
    };
} | {
    status: LogStatus;
    code: any;
    message: any;
    data?: undefined;
}>;
