import shell from 'shelljs';
import { production } from '../utils';

export function authenticatePrincipal(username: string, principalId: string) {
  if (!shell.which('dfx')) {
    console.error('quikdb is not installed. Please run `quikdb install` first.');
    return;
  }

  console.log(`Authenticating principal: ${username}`);

  console.log('connecting to blockchain...');

  const stopResult = shell.exec(`nohup dfx stop > dfx_start.log 2>&1 &`, {
    silent: production,
  });
  if (stopResult.code !== 0) {
    console.error('Error starting code.', stopResult.stderr);
    return;
  }

  // Wait for dfx to initialize (give it some time)
  shell.exec(`sleep 10`, { silent: production });

  const startResult = shell.exec(`nohup dfx start --clean --background > dfx_start.log 2>&1 &`, {
    silent: production,
  });
  if (startResult.code !== 0) {
    console.error('Error starting code.', startResult.stderr);
    return;
  }

  // Wait for dfx to initialize (give it some time)
  shell.exec(`sleep 10`, { silent: production });

  console.log('requesting permissions to set controller');
  const setControllerResult = shell.exec(`dfx wallet add-controller ${principalId}`, { silent: production });
  if (setControllerResult.code !== 0) {
    console.error('Error setting controller.', setControllerResult.stderr);
    return;
  }

  console.log('requesting permission to authorize principal');

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
