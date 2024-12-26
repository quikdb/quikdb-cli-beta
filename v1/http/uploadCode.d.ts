import { LogAction, LogStatus, StatusCode } from '../@types';
/**
 * Function to upload project code with a file attachment.
 * @param {string} projectId - Encrypted project ID.
 * @param {string} token - Authorization token.
 * @param {string} filePath - Path to the file to be uploaded.
 */
export declare function uploadProjectCode(projectId: string, token: string, filePath: string): Promise<{
    status: LogStatus;
    code: StatusCode;
    action: LogAction;
    message: string;
    data: any;
} | {
    status: LogStatus;
    code: any;
    message: any;
    action?: undefined;
    data?: undefined;
}>;
//# sourceMappingURL=uploadCode.d.ts.map