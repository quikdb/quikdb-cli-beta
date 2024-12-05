export type AuthenticationRequestType = {
  email: string;
  password: string;
  principalId: string;
  username: string;
  projectTokenRef: string;
};

export const sampleAuthRequest = {
  email: 'example@example.com',
  password: 'example-password',
  principalId: 'example-principal-id',
  username: 'example-username',
  projectTokenRef: 'example-project-token-ref',
}
