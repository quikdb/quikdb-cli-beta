import { LogStatus, StatusCode } from '../@types';
/**
 * Function to encrypt user data by making a POST request to /a/encrypt
 */
export declare function encryptUserData(payload: string, projectTokenRef: string): Promise<{
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
