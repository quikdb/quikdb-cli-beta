import { LogStatus, StatusCode } from '../@types';
/**
 * Function to encrypt user data by making a POST request to /v/p/projectId/activate
 */
export declare function deactivateProject(projectId: string, payload: string, accessToken: string): Promise<{
    status: LogStatus;
    code: StatusCode;
    message: string;
    data: any;
} | {
    status: LogStatus;
    code: any;
    message: any;
    data?: undefined;
}>;
