import shell from 'shelljs';
import { production } from '../utils';

export async function createPrincipal(username: string) {
  if (!shell.which('dfx')) {
    console.error('quikdb is not installed. Please run `quikdb install` first.');
    return { status: false };
  }

  console.log('requesting permissions to create new principal');
  const result = shell.exec(`dfx identity new ${username}`, { silent: production });

  if (result.code !== 0) {
    console.error('error creating identity');
    return { status: false };
  }

  const seedPhraseMatch = result.stderr.match(/Your seed phrase for identity '[^']+': (.*)/);
  const seedPhrase = seedPhraseMatch ? seedPhraseMatch[1].trim() : null;

  if (!seedPhrase) {
    console.error('Error extracting seed phrase.');
    return { status: false };
  }
  
  return { status: true, seedPhrase };
}
