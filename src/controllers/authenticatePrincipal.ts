import shell from 'shelljs';

export function authenticatePrincipal(principalName: string) {
  if (!shell.which('dfx')) {
    console.error('dfx is not installed. Please run `quikdb install-dfx` first.');
    return;
  }

  console.log(`Authenticating principal: ${principalName}`);

  const result = shell.exec(`dfx identity use ${principalName}`);

  if (result.code !== 0) {
    console.error('Error setting principal identity.');
  } else {
    console.log(`Authenticated as principal: ${principalName}`);
  }
}
