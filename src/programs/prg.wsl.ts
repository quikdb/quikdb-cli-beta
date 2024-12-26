import * as readlineSync from 'readline-sync';
import * as fs from 'fs';
import { Tools } from '../utils';
import { program } from './init';
import validator from 'email-validator';
import { installDfx } from '../controllers';

program
  .command('wsl')
  .description('Dynamically add a config entry')
  .action((options) => {
    
    // const projectTokenRef = readlineSync.question('Please enter your project token: ');

    installDfx();
    console.log('wsl test success!')
  });
