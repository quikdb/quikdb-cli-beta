import shell from 'shelljs';
import { production } from '../utils';
export async function deployToProduction(canisterName) {
    console.log(`Deploying ${canisterName} to the IC network...`);
    const buildResult = shell.exec(`dfx build`, { silent: production });
    if (buildResult.code !== 0) {
        console.error('Error building code.');
        return;
    }
    const canisterIdResult = shell.exec(`dfx deploy --network ic`, { silent: production });
    if (canisterIdResult.code !== 0) {
        console.error('Error retrieving canister ID.');
    }
    const canisterId = canisterIdResult.stdout.trim();
    console.log(`Canister created with ID: ${canisterId}`);
}
//# sourceMappingURL=deployToProduction.js.map