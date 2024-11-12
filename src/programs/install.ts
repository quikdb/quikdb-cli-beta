import { authenticatePrincipal, createPrincipal, deployToLocal, deployToProduction, installDfx, setOwner } from "../controllers";
import { Tools } from "../utils";
import { program } from "./init";

program
  .command('install')
  .description('Checks if quikdb is installed, installs it if necessary')
  .option('-u, --username <username>', 'Username for the principal')
  .option('-l, --local')
  .option('-m, --mainnet')
  .action(async (options) => {
    if (!options.username) {
      console.error('Username is required. Use the -u or --username option.');
      return;
    }
    const isDfxInstalled = Tools.checkAndInstallDfx();
    if (!isDfxInstalled) {
      installDfx();
    }
    const createPrincipalResponse = await createPrincipal(options.username);
    if (createPrincipalResponse.status) authenticatePrincipal(options.principal);
    else return;
    await Tools.fetchCode('https://github.com/quikdb', 'canister');
    let canisterData: any; // remove any;
    if (options.local) canisterData = deployToLocal(options.canister);
    else if (options.mainnet) canisterData = await deployToProduction(options.canister);
    setOwner(canisterData.name, createPrincipalResponse.data as string);
  });

export { program };