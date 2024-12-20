import shell from 'shelljs';
import { production } from '../utils';

export function authenticatePrincipal(username: string, principalId: string) {
  if (!shell.which('dfx')) {
    console.error('dfx is not installed. Please run `quikdb install-dfx` first.');
    return;
  }

  console.log(`Authenticating principal: ${username}`);

  console.log('reaching out to server...');
  const startResult = shell.exec(`nohup dfx start --background > dfx_start.log 2>&1 &`, {
    silent: production,
  });
  if (startResult.code !== 0) {
    console.error('Error starting code.', startResult.stderr);
    return;
  }

  // Wait for dfx to initialize (give it some time)
  shell.exec(`sleep 10`, { silent: production });

  console.log('setting controller...');
  const setControllerResult = shell.exec(`dfx wallet add-controller ${principalId}`, { silent: production });
  if (setControllerResult.code !== 0) {
    console.error('Error setting controller.', setControllerResult.stderr);
    return;
  }
  const authorizeControllerResult = shell.exec(`dfx wallet authorize ${principalId}`, { silent: production });
  if (setControllerResult.code !== 0) {
    console.error('Error authorizing controller.', authorizeControllerResult.stderr);
    return;
  }

  // const result = shell.exec(`dfx identity use ${username}`, { silent: production });

  // if (result.code !== 0) {
  //   console.error('Error setting principal identity.', result.stderr);
  //   return false;
  // } else {
  console.log(`Authenticated as principal: ${username}`);
  return true;
  // }
}
