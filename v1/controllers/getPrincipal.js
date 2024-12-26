import shell from 'shelljs';
import { createPrincipal } from './createPrincipal';
import { production } from '../utils';
export async function getPrincipal(username) {
    if (!shell.which('dfx')) {
        console.error('quikdb is not installed. Please run `quikdb install` first.');
        return { status: false };
    }
    let principalIdResult = shell.exec(`dfx identity get-principal --identity ${username}`, { silent: production });
    let seedPhrase = '';
    if (principalIdResult.code !== 0) {
        console.error('Error retrieving principal ID.');
        console.log('creating principal...');
        const createPrincipalResponse = await createPrincipal(username);
        if (!createPrincipalResponse.status) {
            console.info('installation failed.');
            return { status: false };
        }
        principalIdResult = shell.exec(`dfx identity get-principal --identity ${username}`, { silent: production });
        seedPhrase = createPrincipalResponse.seedPhrase;
    }
    const principalId = principalIdResult.stdout.trim();
    console.log(`Current Principal ID: ${principalId}`);
    return { status: true, data: { principalId, seedPhrase } };
}
//# sourceMappingURL=getPrincipal.js.map