import shell from 'shelljs';
import { createPrincipal } from './createPrincipal';
import { production } from '../utils';

export async function getPrincipal(username: string): Promise<
  | {
      status: boolean;
      data?: null;
    }
  | {
      status: boolean;
      data: {
        principalId: string;
        seedPhrase: string;
      };
  }
> {
  if (!shell.which('dfx')) {
    console.error('quikdb is not installed. Please run `quikdb install` first.');
    return { status: false };
  }

  let principalIdResult = shell.exec(`sudo dfx identity get-principal --identity ${username}`, { silent: production });
  let seedPhrase: string = '';

  if (principalIdResult.code !== 0) {
    console.error('Error retrieving principal ID.');
    console.log('creating principal...');
    const createPrincipalResponse = await createPrincipal(username);

    if (!createPrincipalResponse.status) {
      console.info('installation failed.');
      return { status: false };
    }

    principalIdResult = shell.exec(`dfx identity get-principal --identity ${username}`, { silent: production });

    seedPhrase = createPrincipalResponse.seedPhrase as string;
  }

  const principalId = principalIdResult.stdout.trim();
  console.log(`Current Principal ID: ${principalId}`);

  return { status: true, data: { principalId, seedPhrase } };
}
