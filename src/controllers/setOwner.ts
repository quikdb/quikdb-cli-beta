import shell from 'shelljs';

export function setOwner(canisterName: string, principal: string) {
  console.log(`Testing canister functions for ${canisterName}...`);
  const result = shell.exec(`dfx canister call ${canisterName} setOwner ${principal}`);

  if (result.code !== 0) {
    console.error('Error testing canister.');
  } else {
    console.log('Test completed successfully.');
  }
}
