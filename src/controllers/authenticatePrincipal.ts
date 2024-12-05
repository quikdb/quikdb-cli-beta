import shell from 'shelljs';

export function authenticatePrincipal(username: string, principalId: string) {
  if (!shell.which('dfx')) {
    console.error('dfx is not installed. Please run `quikdb install-dfx` first.');
    return;
  }

  console.log(`Authenticating principal: ${username}`);

  console.log('setting controller...');
  const setControllerResult = shell.exec(`dfx wallet add-controller ${principalId}`);
  if (setControllerResult.code !== 0) {
    console.error('Error setting controller.', setControllerResult.stderr);
    return;
  }
  const authorizeControllerResult = shell.exec(`dfx wallet authorize ${principalId}`);
  if (setControllerResult.code !== 0) {
    console.error('Error authorizing controller.', authorizeControllerResult.stderr);
    return;
  }

  // const result = shell.exec(`dfx identity use ${username}`);

  // if (result.code !== 0) {
  //   console.error('Error setting principal identity.', result.stderr);
  //   return false;
  // } else {
    console.log(`Authenticated as principal: ${username}`);
    return true;
  // }
}
