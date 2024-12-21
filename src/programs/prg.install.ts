import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import shell from 'shelljs';
import * as readlineSync from 'readline-sync';
import { production, Tools } from '../utils';
import { program } from './init';
import { AuthenticationRequestType, sampleAuthForIIRequest, sampleAuthRequest } from '../@types';
import { authenticatePrincipal, deployToLocal, getPrincipal, installDfx } from '../controllers';
import { authenticateCli, encryptUserData, uploadProjectCode } from '../http';

const homeDir = os.homedir();

const quikdbDir = path.resolve(homeDir, '.quikdb', 'quikdb');
const distDir = path.resolve(homeDir, '.quikdb', 'dist.zip');

program
  .command('install')
  .description('Checks if quikdb is installed, installs it if necessary')
  .action(async (options) => {
    let principalId: string;
    let password: string;

    if (fs.existsSync(Tools.CONFIG_FILE)) {
      const configData = fs.readFileSync(Tools.CONFIG_FILE, 'utf-8');
      console.log('Current Configuration:');

      const configJson = Tools.getConfigAsJson(configData);

      const identity = (configJson as AuthenticationRequestType)?.identity;

      const username = (configJson as AuthenticationRequestType).username;

      const projectTokenRef = (configJson as AuthenticationRequestType)?.projectTokenRef;

      if (!identity) {
        password = readlineSync.question('Please enter your account password: ');

        if (!password) {
          console.error('password is required to proceed.');
          return;
        }

        (configJson as AuthenticationRequestType).password = password;
      }

      const isDfxInstalled = Tools.checkAndInstallDfx();
      if (!isDfxInstalled) {
        installDfx();
      }

      const principal = await getPrincipal(username);
      if (!principal.status) {
        console.error('Failed to retrieve principal ID.');
        return;
      }

      principalId = principal.data?.principalId as string;

      if (!identity) (configJson as AuthenticationRequestType).principalId = principalId;

      console.log({ configJson });

      /************* validating config json ************/
      if (identity) {
        const validConfigJson = Tools.hasProperties<AuthenticationRequestType>(
          configJson,
          Object.keys(sampleAuthForIIRequest) as [keyof AuthenticationRequestType]
        );

        if (!validConfigJson) {
          console.error('Invalid configuration data. Please run "quikdb config".');
          return;
        }
        console.log('configuration data is valid for ii');
      } else {
        const validConfigJson = Tools.hasProperties<AuthenticationRequestType>(
          configJson,
          Object.keys(sampleAuthRequest) as [keyof AuthenticationRequestType]
        );

        if (!validConfigJson) {
          console.error('Invalid configuration data. Please run "quikdb config".');
          return;
        }
        console.log('configuration data is valid.');
      }

      const auth = await authenticateCli(configJson as AuthenticationRequestType);

      if (!auth.status) {
        console.error('Failed to authenticate with the server.');
        return;
      }

      const principalAuth = authenticatePrincipal(username, principalId);

      if (!principalAuth) return;

      principal.data?.seedPhrase &&
        Tools.appendToConfigFile(
          'seedPhrase',
          principal.data?.seedPhrase as string,
          path.join(Tools.CONFIG_DIR, 'accessTokens')
        );
      Tools.appendToConfigFile(
        'accessToken',
        auth.data?.data?.accessToken,
        path.join(Tools.CONFIG_DIR, 'accessTokens')
      );

      shell.exec(`rm -rf ${quikdbDir}`, { silent: production });

      console.log({ homeDir });
      console.log({ path: quikdbDir });
      await Tools.fetchCode('https://github.com/quikdb/quikdb-app-beta', quikdbDir);

      if (shell.cd(quikdbDir).code !== 0) {
        console.error('Failed to change directory. Please check if the directory exists.');
        return;
      }

      const canisterUrl = deployToLocal(principalId);

      if (!canisterUrl) {
        return;
      }

      const payload = JSON.stringify({
        id: auth.data.data.project._id,
      });

      const encryptionResponse  = await encryptUserData(payload, projectTokenRef);

      const projectId = encryptionResponse.data.encryptedData;
      const token = auth.data?.data?.accessToken;

      shell.cd('~/.quikdb');

      const folderToZip = 'quikdb';
      const zipFileName = 'dist.zip';  

      const zipCommand = `zip -r ${zipFileName} ${folderToZip}`;

      const result = shell.exec(zipCommand, { silent: production });

      if (result.code === 0) {
        console.log('packaging success!');
      } else {
        console.error('packaging failed!');
      }

      await uploadProjectCode(projectId, token, distDir);

      const canisterDetails = Tools.parseURL(canisterUrl);

      const canisterPayload = {
        name: auth.data.data.project.name,
        type: auth.data.data.project.databaseVersion,
        url: canisterDetails.baseUrl,
        owner: auth.data.data.project.owner,
        canisterId: canisterDetails.canisterId,
        controllers: [principalId],
      };

      console.log({ canisterPayload });
    } else {
      console.log('No configuration file found.');
    }
  });

export { program };
