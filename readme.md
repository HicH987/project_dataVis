# Node.js and Repository Setup

1. Go to the [Node.js website](https://nodejs.org/) and download the appropriate version for your operating system.
2. Run the installer and follow the prompts to install Node.js.
3. After installation, open a terminal or command prompt and verify that Node.js is installed by running the command
   ```bash
   node -v
   # Expected result : v<version number> e.g. v14.15.4
   ```
4. Now you can use npm package manager along with Node.js
5. Download the current repository.
6. Click the "Download" button and download the repository as a zip file.
7. Extract the downloaded file to the directory of your choice
8. Open the extracted repository directory with terminal
9. Run the following command to install all the dependencies specified in package.json
   ```bash
    npm install
   ```
10. Run the project in browser with the following commend
    ```bash
    npm run dev
    # Expected result :  ➜  Local: http://127.0.0.1:5173/
    ```
11. Open the URL result in browser.
