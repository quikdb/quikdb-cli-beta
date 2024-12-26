import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import shell from 'shelljs';
import * as readlineSync from 'readline-sync';
import { production, Tools } from '../utils';
import { program } from './init';
import { sampleAuthForIIRequest, sampleAuthRequest } from '../@types';
import { authenticatePrincipal, deployToLocal, getPrincipal, installDfx } from '../controllers';
import { authenticateCli, encryptUserData, uploadProjectCode } from '../http';
const homeDir = os.homedir();
const quikdbDir = path.resolve(homeDir, '.quikdb', 'quikdb');
const distDir = path.resolve(homeDir, '.quikdb', 'dist.zip');
program
    .command('install')
    .description('Checks if quikdb is installed, installs it if necessary')
    .action(async (options) => {
    let principalId;
    let password;
    if (fs.existsSync(Tools.CONFIG_FILE)) {
        const configData = fs.readFileSync(Tools.CONFIG_FILE, 'utf-8');
        const configJson = Tools.getConfigAsJson(configData);
        const identity = configJson?.identity;
        const username = configJson.username;
        const projectTokenRef = configJson?.projectTokenRef;
        if (!identity) {
            password = readlineSync.question('Please enter your account password: ');
            if (!password) {
                console.error('password is required to proceed.');
                return;
            }
            configJson.password = password;
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
        principalId = principal.data?.principalId;
        if (!identity)
            configJson.principalId = principalId;
        console.log({ configJson });
        /************* validating config json ************/
        if (identity) {
            const validConfigJson = Tools.hasProperties(configJson, Object.keys(sampleAuthForIIRequest));
            if (!validConfigJson) {
                console.error('Invalid configuration data. Please run "quikdb config".');
                return;
            }
            console.log('configuration data is valid for ii');
        }
        else {
            const validConfigJson = Tools.hasProperties(configJson, Object.keys(sampleAuthRequest));
            if (!validConfigJson) {
                console.error('Invalid configuration data. Please run "quikdb config".');
                return;
            }
            console.log('configuration data is valid.');
        }
        const auth = await authenticateCli(configJson);
        if (!auth.status) {
            console.error('Failed to authenticate with the server.');
            return;
        }
        const principalAuth = authenticatePrincipal(username, principalId);
        if (!principalAuth)
            return;
        principal.data?.seedPhrase &&
            Tools.appendToConfigFile('seedPhrase', principal.data?.seedPhrase);
        Tools.appendToConfigFile('accessToken', auth.data?.data?.accessToken);
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
        const encryptionResponse = await encryptUserData(payload, projectTokenRef);
        const projectId = encryptionResponse.data.encryptedData;
        const token = auth.data?.data?.accessToken;
        shell.cd('~/.quikdb');
        const folderToZip = 'quikdb';
        const zipFileName = 'dist.zip';
        const zipCommand = `zip -r ${zipFileName} ${folderToZip}`;
        const result = shell.exec(zipCommand, { silent: production });
        if (result.code === 0) {
            console.log('packaging success!');
        }
        else {
            console.error('packaging failed!');
        }
        await uploadProjectCode(projectId, token, distDir);
        const canisterDetails = Tools.parseURL(canisterUrl);
        const canisterPayload = {
            databaseVersion: auth.data.data.project.databaseVersion,
            url: canisterDetails.baseUrl,
            canisterId: canisterDetails.id,
            controllers: [principalId],
        };
        Tools.appendToConfigFile('canisterId', canisterPayload?.canisterId);
        Tools.appendToConfigFile('url', canisterPayload?.url);
        console.log({ canisterPayload });
    }
    else {
        console.log('No configuration file found.');
    }
});
export { program };
//# sourceMappingURL=prg.install.js.map