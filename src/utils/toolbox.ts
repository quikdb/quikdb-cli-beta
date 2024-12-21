import shell from 'shelljs';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

const git = simpleGit();

export class Tools {
  static CONFIG_DIR = path.join((process.env.HOME || process.env.USERPROFILE) as string, '.quikdb');
  static CONFIG_FILE = path.join(this.CONFIG_DIR, 'config');

  constructor() {}

  static ensureConfigDirectory() {
    if (!fs.existsSync(this.CONFIG_DIR)) {
      fs.mkdirSync(this.CONFIG_DIR, { recursive: true });
      console.log(`Created config directory: ${this.CONFIG_DIR}`);
    }
  }

  static appendToConfigFile(key: string, value: string, filePath?: string) {
    this.ensureConfigDirectory();

    const configEntry = `${key}: ${value}\n`;

    try {
      if (filePath) {
        fs.writeFileSync(filePath, configEntry);
        return;
      }
      fs.appendFileSync(this.CONFIG_FILE, configEntry);
      console.log(`Appended to config: ${key} = ${value}`);
    } catch (error) {
      console.error('Error appending to configuration file:', error);
    }
  }

  static getConfigAsJson(configData: string): object {
    const configJson: { [key: string]: string } = {};

    const lines = configData.split('\n');

    lines.forEach((line: string) => {
      if (line.trim()) {
        const [key, value] = line.split(':').map((str: string) => str.trim());
        if (key && value) {
          configJson[key] = value;
        }
      }
    });

    return configJson;
  }

  static isOfType<T>(obj: any, typeCheck: (obj: any) => obj is T): boolean {
    return typeCheck(obj);
  }

  static hasProperties<T>(obj: any, properties: (keyof T)[]): boolean {
    return properties.every((property) => property in obj);
  }

  static checkAndInstallDfx() {
    if (shell.which('dfx')) {
      console.log('quikdb is already installed on your system.');
      return true;
    } else {
      console.log('quikdb not found. Installing quikdb...');
      return false;
    }
  }

  static async fetchCode(repo: string, localPath: string) {
    console.log('connecting to manager.');
    await git.clone(repo, `${localPath}`);
  }

  /**
   * Extracts query parameters and base URL from a given URL.
   */
  static parseURL(url: string) {
    const baseUrl = url.split('?')[0];

    const queryString = url.split('?')[1];

    if (!queryString) {
      return { baseUrl, canisterId: null, id: null };
    }

    const params = queryString.split('&');
    let canisterId = null;
    let id = null;

    params.forEach((param) => {
      const [key, value] = param.split('=');
      if (key === 'canisterId') {
        canisterId = value;
      } else if (key === 'id') {
        id = value;
      }
    });

    return { baseUrl, canisterId, id };
  }
}
