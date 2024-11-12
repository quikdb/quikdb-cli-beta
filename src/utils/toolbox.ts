import shell from 'shelljs';
import simpleGit from 'simple-git';

const git = simpleGit();

export class Tools {
  constructor() {}

  static checkAndInstallDfx() {
    if (shell.which('dfx')) {
      console.log('dfx is already installed on your system.');
      return true;
    } else {
      console.log('dfx not found. Installing dfx...');
      return false;
    }
  }

  static async fetchCode(repo: string, localPath: string) {
    console.log(`cloning repository from ${repo}...`);
    await git.clone(repo, `./${localPath}`);
    console.log('Repository cloned successfully.');
  }
}
