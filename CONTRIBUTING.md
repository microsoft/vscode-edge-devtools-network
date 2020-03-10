# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

Contributions are always welcome! We only ask that you open an issue first so we can discuss the problem and solution. We don't want you to waste any time headed in the wrong direction.

## Getting started to build extension
* Clone this repo `git clone https://github.com/microsoft/vscode-edge-devtools-network`
* Run `npm install` in '/vscode-edge-devtools-network'
* On an administrator prompt execute the following commands (assuming your drive is located at C:\)
  * `mkdir c:\edge\src\out\Release\gen\devtools`
  * `mkdir c:\edge\src\third_party\devtools-frontend\src\front_end`
* Download a copy of the Microsoft Edge (Chromium) build from [https://thirdpartysource.microsoft.com](https://thirdpartysource.microsoft.com)
* **Open** the zip file
  * navigate to: `[ZIP_FILE]:\src\third_party\devtools-frontend\src\front_end`
  * copy the contents of the "front_end" folder and paste them into `c:\edge\src\third_party\devtools-frontend\src\front_end`
  * navigate to:`[ZIP_FILE]:\src\out\Release\gen\devtools`
  * copy the contents of the "devtools" folder and paste them into `c:\edge\src\out\Release\gen\devtools`
* Set the `EDGE_CHROMIUM_PATH` environment variable to `c:\edge\src` (assuming your drive is located at C:\)
* Set the `EDGE_CHROMIUM_OUT_DIR` environment variable to `Release`
* Run `npm run build` or `npm run watch` in '/vscode-edge-devtools-network'
* Open the directory in Visual Studio Code
* Click 'Run and Debug' icon in the left side bar or press Ctrl + Shift + D. Then, select 'Launch Extension' debug configuration option in the drop-down at the top.
* Press `F5` to launch the Visual Studio Code extension host environment and debug the extension. New Visual Studio Code window will be opened after build gets completed. Edge logo (Network extension) will show up in left side-bar in this new window.
* Click in the Edge logo (Network Extension). Then, click the '+' button to launch new tab in the browser or Ctrl + Shift + P and select 'Network for Microsoft Edge: Launch Edge and attach to a target' command to launch.
* New tab in the browser is opened with 'about:blank' which needs to be replaced with e.g. https://www.bing.com/
* In the extension all the requests made by above url will show up

## Getting started to run test
1. Follow above steps in 'Getting started to build extension'
2. <code>D:\Proj\Extension\vscode-edge-devtools-network>npm run test</code>

## Getting started to create .vsix to install or share extension
1. Follow above steps in 'Getting started to build extension'
2. Create .vsix by running <code>D:\Proj\Extension\vscode-edge-devtools-network>npm run package</code>

Here are a list of recommended Visual Studio Code extensions to use when developing for vscode-edge-devtools:
* [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
* [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)


## Testing
* There are a set of jest tests which can be run with `npm run test`.
* You may also run `npm run lint` separately to check your code against our tslint rules.
* Open the directory in VSCode
* Select `Launch Tests` debug configuration
* Press `F5` to attach the debugger and start the tests

## Issue tags
* "Bug": Something that should work is broken
* "Enhancement": AKA feature request - adds new functionality
* "Task": Something that needs to be done that doesn't really fix anything or add major functionality. Tests, engineering, documentation, etc.
