import shell from 'shelljs';
import * as readlineSync from 'readline-sync';

export function installDfx() {
  const request = readlineSync.question(
    'QuikDB runs on dfx VM. Do you want to proceed with the installation? (yes/no): '
  );

  if (request.toLowerCase() === 'yes' || request.toLowerCase() === 'y') {
  
  const command = 'sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"';

  const execOptions = {
    env: {
      ...process.env,
      DFXVM_INIT_YES: '1',
    },
  };

  if (shell.exec(command, execOptions).code !== 0) {
    console.error('Error installing onchain tool.');
    shell.exit(1);
  } else {
    console.log('onchain tool installed successfully.');
  }
  } else {
    console.log('Installation aborted by the user.');
    process.exit(0);
  }
}