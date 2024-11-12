import shell from 'shelljs';
import { sendDeploymentToServer } from '../http';

export async function deployToProduction(canisterName: string) {
  console.log(`Deploying ${canisterName} to the IC network...`);

  const buildResult = shell.exec(`dfx build`);

  if (buildResult.code !== 0) {
    console.error('Error building code.');
    return;
  }
  const canisterIdResult = shell.exec(`dfx deploy --network ic`);

  console.log({ canisterIdResult });

  if (canisterIdResult.code !== 0) {
    console.error('Error retrieving canister ID.');
  }

  const canisterId = canisterIdResult.stdout.trim();
  console.log(`Canister created with ID: ${canisterId}`);
  await sendDeploymentToServer(canisterId, canisterName, 'IC Network');
}
