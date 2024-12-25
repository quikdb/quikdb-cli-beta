import shell from 'shelljs';
import { production } from '../utils';

export function installDfx() {
  if ((shell.exec('sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"').code !== 0, { silent: production })) {
    console.error('Error installing dfx.');
    shell.exit(1);
  } else {
    console.log('dfx installed successfully.');
  }
}
