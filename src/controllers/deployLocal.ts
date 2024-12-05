import shell from 'shelljs';

export function deployToLocal(principalId: string) {
  if (!shell.which('dfx')) {
    console.error('quikdb is not installed. Please run `quikdb install` first.');
    return;
  }

  console.log(`Deploying code to local for principal ID: ${principalId} ...`);
  const installResult = shell.exec(`npm i`);
  if (installResult.code !== 0) {
    console.error('Error installing code.', installResult.stderr);
    return;
  }

  console.log('reaching out to server...');
  const startResult = shell.exec(`nohup dfx start > dfx_start.log 2>&1 &`);
  if (startResult.code !== 0) {
    console.error('Error starting code.', startResult.stderr);
    return;
  }

  // Wait for dfx to initialize (give it some time)
  shell.exec(`sleep 5`);

  console.log('creating virtual space...');
  const createCanisterResult = shell.exec(`dfx canister create database`);
  if (createCanisterResult.code !== 0) {
    console.error('Error starting code.', createCanisterResult.stderr);
    return;
  }

  console.log('building variations...');
  const buildResult = shell.exec(`dfx build`);
  if (buildResult.code !== 0) {
    console.error('Error building code.', buildResult.stderr);
    return;
  }

  console.log('setting up your database...');
  const args = `{"initOwner": ${principalId}}`;
  const deployResult = shell.exec(`dfx deploy`);

  if (deployResult.code !== 0) {
    console.error('Error deploying to local canister.', deployResult.stderr);
  } else {
    console.log('Code deployed to local canister successfully.');
  }
}
