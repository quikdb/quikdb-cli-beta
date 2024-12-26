import shell from 'shelljs';
import { production } from '../utils';

export function setOwner(canisterName: string, principal: string) {
  console.log(`Testing canister functions for ${canisterName}...`);
  const result = shell.exec(`dfx canister call ${canisterName} setOwner ${principal}`, { silent: production });

  if (result.code !== 0) {
    console.error('Error testing canister.');
  } else {
    console.log('Test completed successfully.');
  }
}
