import shell from 'shelljs';
import { sendPrincipalToServer } from '../http';

export async function createPrincipal(username: string) {
  if (!shell.which('dfx')) {
    console.error('dfx is not installed. Please run `quikdb install-dfx` first.');
    return { status: false };
  }

  console.log('Creating new principal...');
  const result = shell.exec(`dfx identity new ${username}`);

  if (result.code !== 0) {
    console.error('Error creating principal.');
    return { status: false };
  }

  const seedPhraseMatch = result.stderr.match(/Your seed phrase for identity '[^']+': (.*)/);
  const seedPhrase = seedPhraseMatch ? seedPhraseMatch[1].trim() : null;

  if (!seedPhrase) {
    console.error('Error extracting seed phrase.');
    return { status: false };
  }

  const principalIdResult = shell.exec('dfx identity get-principal', { silent: true });

  if (principalIdResult.code !== 0) {
    console.error('Error retrieving principal ID.');
    return { status: false };
  }

  const principalId = principalIdResult.stdout.trim();
  console.log(`Principal created with ID: ${principalId}`);

  await sendPrincipalToServer(principalId, username, seedPhrase);
  
  return { status: false, data: principalId };
}
