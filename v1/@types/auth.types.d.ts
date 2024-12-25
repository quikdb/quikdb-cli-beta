export type AuthenticationRequestType = {
    email?: string;
    password?: string;
    principalId?: string;
    identity?: string;
    username: string;
    projectTokenRef: string;
};
export type AccessTokenType = {
    accessToken: string;
    url: string;
    canisterId: string;
};
export declare const sampleAuthRequest: {
    email: string;
    password: string;
    principalId: string;
    username: string;
    projectTokenRef: string;
};
export declare const sampleAuthForIIRequest: {
    identity: string;
    username: string;
    projectTokenRef: string;
};
