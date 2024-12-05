import * as fs from 'fs';
import * as path from 'path';
import shell from 'shelljs';
import * as readlineSync from 'readline-sync';
import { Tools } from '../utils';
import { program } from './init';
import { AuthenticationRequestType, sampleAuthRequest } from '../@types';
import { authenticatePrincipal, createPrincipal, deployToLocal, getPrincipal, installDfx } from '../controllers';
import { authenticateCli } from '../http';

program
  .command('install')
  .description('Checks if quikdb is installed, installs it if necessary')
  .action(async (options) => {
    let principalId: string;
    const password = readlineSync.question('Please enter your account password: ');
    if (!password) {
      console.error('Token is required to proceed.');
      return;
    }
    if (fs.existsSync(Tools.CONFIG_FILE)) {
      const configData = fs.readFileSync(Tools.CONFIG_FILE, 'utf-8');
      console.log('Current Configuration:');

      const configJson = Tools.getConfigAsJson(configData);
      (configJson as AuthenticationRequestType).password = password;

      console.log({ configJson });

      const username = (configJson as AuthenticationRequestType).username;

      const isDfxInstalled = Tools.checkAndInstallDfx();
      if (!isDfxInstalled) {
        installDfx();
      }

      const createPrincipalResponse = await createPrincipal(username);

      if(!createPrincipalResponse.status) {
        console.info('installation failed. please try with a different username')
        return;
      }

      const principal = await getPrincipal(username);
      if (!principal.status) {
        console.error('Failed to retrieve principal ID.');
        return;
      }
      principalId = principal?.data as string;

      (configJson as AuthenticationRequestType).principalId = principalId;
      console.log({ configJson });

      const validConfigJson = Tools.hasProperties<AuthenticationRequestType>(
        configJson,
        Object.keys(sampleAuthRequest) as [keyof AuthenticationRequestType]
      );

      if (!validConfigJson) {
        console.error('Invalid configuration data. Please run "quikdb config".');
        return;
      }

      const auth = await authenticateCli(configJson as AuthenticationRequestType);

      console.log({ auth: auth.data });

      if (!auth.status) {
        console.error('Failed to authenticate with the server.');
        return;
      }

      const principalAuth = authenticatePrincipal(username, principalId);

      if (!principalAuth) return;

      createPrincipalResponse.status && Tools.appendToConfigFile(
        'seedPhrase',
        createPrincipalResponse.data as string,
        path.join(Tools.CONFIG_DIR, 'accessTokens')
      );
      Tools.appendToConfigFile('accessToken', auth.data?.data?.accessToken, path.join(Tools.CONFIG_DIR, 'accessTokens'));

      shell.exec('rm -rf temp');

      await Tools.fetchCode('https://github.com/quikdb/quikdb-app-beta', 'temp/quikdb');

      if (shell.cd('temp/quikdb').code !== 0) {
        console.error('Failed to change directory to temp/quikdb. Please check if the directory exists.');
        return;
      }

      deployToLocal(principalId);
    } else {
      console.log('No configuration file found.');
    }
  });

export { program };
