# quikdb-cli-beta

Here's a step-by-step tutorial based on the steps you took to resolve the issue of `quikdb` not being found in your terminal:

### Step-by-Step Guide to Resolving `quikdb` Not Found Issue

1. **Verify Package Installation:**
   First, check if `quikdb-cli-beta` is installed globally by running:

   ```bash
   npm list -g quikdb-cli-beta
   ```

   You should see an output similar to:

   ```
   /Users/mac/.nvm/versions/node/v18.19.1/lib
   └─┬ quikdb-cli-beta@2.3.7
     └── quikdb-cli-beta@2.3.7 deduped
   ```

   This confirms that the package is installed.

2. **Check Global Binary Directory:**
   You attempted to find the global binary directory using:

   ```bash
   npm bin -g
   ```

   However, the correct command on some npm versions might not work. To check where the global npm binaries are located, you can try:

   ```bash
   npm root -g
   ```

   This will show you the global installation directory, like:

   ```
   /Users/mac/.nvm/versions/node/v18.19.1/lib/node_modules
   ```

   The global executables (such as `quikdb`) are typically found in the `bin` subdirectory of the path returned.

3. **List Files in the Bin Directory:**
   To ensure `quikdb` is in the global binary path, list the contents of the `bin` directory:

   ```bash
   ls /Users/mac/.nvm/versions/node/v18.19.1/bin
   ```

   You should see `quikdb` in the list of executables:

   ```
   cdk                     npm                     pm2-runtime             serve
   cdk8s                   npx                     pnpm                    quikdb
   ```

4. **Update `PATH`:**
   The next step is to ensure that the global binary directory is included in your system’s `PATH`. To do this, run:

   ```bash
   export PATH="$PATH:/Users/mac/.nvm/versions/node/v18.19.1/bin"
   ```

   Then, make sure the changes are persistent by adding the export command to your `~/.zshrc` file (if you're using `zsh`):

   ```bash
   echo 'export PATH="$PATH:/Users/mac/.nvm/versions/node/v18.19.1/bin"' >> ~/.zshrc
   ```

   After adding this line, reload your shell configuration:

   ```bash
   source ~/.zshrc
   ```

5. **Uninstall and Reinstall the Package:**
   If the above steps still don't resolve the issue, you can try uninstalling and reinstalling the `quikdb-cli-beta` package:

   ```bash
   npm uninstall -g quikdb-cli-beta
   npm install -g quikdb-cli-beta
   ```

   This ensures that any issues with the package installation are cleared up.

6. **Verify `quikdb` Command:**
   After the reinstall, verify that the `quikdb` command is now recognized by running:

   ```bash
   which quikdb
   ```

   You should now see the correct path to the `quikdb` executable, for example:

   ```
   /Users/mac/.nvm/versions/node/v18.19.1/bin/quikdb
   ```

7. **Test `quikdb` Command:**
   Finally, you can try running the `quikdb` command to ensure it works:

   ```bash
   quikdb install
   ```

   If everything is set up correctly, you should not see the "command not found" error anymore.
