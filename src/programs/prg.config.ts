import * as readlineSync from 'readline-sync';
import * as fs from 'fs';
import { Tools } from '../utils';
import { program } from './init';
import validator from 'email-validator';

program
  .command('config')
  .option('-u, --username <username>', 'username for the account')
  .option('-e, --email <email>', 'email for the account')
  .option('-i, --identity <identity>', 'identity for the account')
  .description('Dynamically add a config entry')
  .action((options) => {
    if (!options.identity && !options.email) {
      console.error('email or identity is required')
      return;
    }

    if (!options.username) {
      console.error('username is required.');
      return;
    }

    const projectTokenRef = readlineSync.question('Please enter your project token: ');
    if (!projectTokenRef) {
      console.error('Token is required to proceed.');
      return;
    }
    
    fs.writeFileSync(Tools.CONFIG_FILE, '');

    if (validator.validate(options.email)) {
      Tools.appendToConfigFile('email', options.email);
    } else if (options.identity) {
      Tools.appendToConfigFile('identity', options.identity);
    }

    Tools.appendToConfigFile('username', options.username);
    Tools.appendToConfigFile('projectTokenRef', projectTokenRef);
    console.log('config success!')
  });
