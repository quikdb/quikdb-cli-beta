import shell from 'shelljs';

export async function createPrincipal(username: string) {
  if (!shell.which('dfx')) {
    console.error('dfx is not installed. Please run `quikdb install-dfx` first.');
    return { status: false };
  }

  console.log('Creating new principal...');
  const result = shell.exec(`dfx identity new ${username}`);

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
  
  return { status: true, data: seedPhrase };
}
