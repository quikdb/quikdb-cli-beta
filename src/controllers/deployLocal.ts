import shell from 'shelljs';

export function deployToLocal(canisterName: string) {
  if (!shell.which('dfx')) {
    console.error('quikdb is not installed. Please run `quikdb install` first.');
    return;
  }

  console.log(`Deploying code to locally: ${canisterName}...`);
  const buildResult = shell.exec(`dfx build`);

  if (buildResult.code !== 0) {
    console.error('Error building code.');
    return;
  }
  const result = shell.exec(`dfx deploy`);

  console.log({ result });

  if (result.code !== 0) {
    console.error('Error deploying to local canister.');
  } else {
    console.log('Code deployed to local canister successfully.');
  }
}
