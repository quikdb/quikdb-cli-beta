import shell from 'shelljs';
import { production } from '../utils';

export function deployToLocal(principalId: string) {
  if (!shell.which('dfx')) {
    console.error('quikdb is not installed. Please run `quikdb install` first.');
    return;
  }

  console.log(`Deploying code to local...`);
  const installResult = shell.exec(`npm i`, { silent: production });
  if (installResult.code !== 0) {
    console.error('Error installing code.', installResult.stderr);
    return;
  }

  console.log('creating virtual space...');
  const createCanisterResult = shell.exec(`dfx canister create database`, { silent: production });
  if (createCanisterResult.code !== 0) {
    console.error('Error starting code.', createCanisterResult.stderr);
    return;
  }

  const createTestCanisterResult = shell.exec(`dfx canister create test`, { silent: production });
  if (createTestCanisterResult.code !== 0) {
    console.error('Error starting code.', createTestCanisterResult.stderr);
    return;
  }

  console.log('building variations...');
  const buildResult = shell.exec(`dfx build`, { silent: production });
  if (buildResult.code !== 0) {
    console.error('Error building code.', buildResult.stderr);
    return;
  }

  console.log('setting up your database...');
  shell.exec(`dfx ledger fabricate-cycles --t 10000 --canister database`, { silent: production });
  shell.exec(`dfx canister deposit-cycles --all 10T`, { silent: production });
  const args = `{"initOwner": ${principalId}}`;
  const deployResult = shell.exec(`dfx deploy`, { silent: production });

  if (deployResult.code !== 0) {
    console.error('Error deploying to local canister.', deployResult.stderr);
  } else {
    console.log('Code deployed to local canister successfully.');
    const backendUrlMatch = deployResult.stderr.match(/database:\s(http:\/\/[^\s]+)/);

    if (backendUrlMatch) {
      const generateResult = shell.exec(`dfx generate database`, { silent: production });
      if (generateResult.code !== 0) {
        console.error('Error generating declarations file', generateResult.stderr);
        return;
      }
      return backendUrlMatch[1];
    } else {
      console.log('Backend URL not found.');
    }
  }
}
