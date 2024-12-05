import shell from 'shelljs';

export async function getPrincipal(username: string) {
  if (!shell.which('dfx')) {
    console.error('dfx is not installed. Please run `quikdb install-dfx` first.');
    return { status: false };
  }

  const principalIdResult = shell.exec(`dfx identity get-principal --identity ${username}`, { silent: true });

  if (principalIdResult.code !== 0) {
    console.error('Error retrieving principal ID.');
    return { status: false };
  }

  const principalId = principalIdResult.stdout.trim();
  console.log(`Current Principal ID: ${principalId}`);
  
  return { status: true, data: principalId };
}
