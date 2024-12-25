import { AuthenticationRequestType } from '../@types';
export declare function authenticateCli(authenticationRequest: AuthenticationRequestType): Promise<{
    status: boolean;
    code: any;
    data: any;
}>;
