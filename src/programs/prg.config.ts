import * as readlineSync from 'readline-sync';
import * as fs from 'fs';
import { Tools } from '../utils';
import { program } from './init';
import validator from 'email-validator';

program
  .command('config')
  .option('-e, --email <email>', 'email for the account')
  .option('-u, --username <username>', 'username for the account')
  .description('Dynamically add a config entry')
  .action((options) => {
    if (!validator.validate(options.email)) {
      console.error('valid email is required.');
      return;
    }

    if (!options.username) {
      console.error('username is required.');
      return;
    }

    const projectTokenRef = readlineSync.question('Please enter your authentication token: ');
    if (!projectTokenRef) {
      console.error('Token is required to proceed.');
      return;
    }

    fs.writeFileSync(Tools.CONFIG_FILE, '');

    Tools.appendToConfigFile('email', options.email);
    Tools.appendToConfigFile('username', options.username);
    Tools.appendToConfigFile('projectTokenRef', projectTokenRef);
  });
