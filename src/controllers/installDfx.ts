import shell from 'shelljs';
import { production } from '../utils';
import path from 'path';
import os from 'os';

export function installDfx() {
  const command = 'sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"';
  
  // Define the environment variables, including DFXVM_INIT_YES=1
  const execOptions = { 
    silent: production,
    env: { 
      ...process.env, // Inherit existing environment variables
      DFXVM_INIT_YES: '1' // Automatically proceed with installation
    }
  };

  // Execute the command with the specified environment variables and options
  if (shell.exec(command, execOptions).code !== 0) {
    console.error('Error installing dfx.');
    shell.exit(1);
  } else {
    console.log('dfx installed successfully.');

    // Determine the user's shell and corresponding config file
    const userShell = process.env.SHELL || '/bin/bash';
    const shellName = path.basename(userShell);
    let shellConfigFile = '';

    switch (shellName) {
      case 'bash':
        shellConfigFile = path.join(os.homedir(), '.bashrc');
        break;
      case 'zsh':
        shellConfigFile = path.join(os.homedir(), '.zshrc');
        break;
      default:
        shellConfigFile = path.join(os.homedir(), '.profile');
    }

    // Append the sourcing command if it's not already present
    const sourcingCommand = 'source "$HOME/.local/share/dfx/env"';
    const configContent = shell.cat(shellConfigFile);

    if (!configContent.includes(sourcingCommand)) {
      shell.echo(sourcingCommand).toEnd(shellConfigFile);
      console.log(`Added sourcing command to ${shellConfigFile}. Please restart your terminal or run '${sourcingCommand}' to apply changes.`);
    } else {
      console.log(`Sourcing command already exists in ${shellConfigFile}.`);
    }
  }
}