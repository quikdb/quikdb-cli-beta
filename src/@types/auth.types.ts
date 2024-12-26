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

export const sampleAuthRequest = {
  email: 'example@example.com',
  password: 'example-password',
  principalId: 'example-principal-id',
  username: 'example-username',
  projectTokenRef: 'example-project-token-ref',
}

export const sampleAuthForIIRequest = {
  identity: 'example-identity-encrypted',
  username: 'example-username',
  projectTokenRef: 'example-project-token-ref',
}
