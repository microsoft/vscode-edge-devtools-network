
<h1 align="center">
  <br>
  Visual Studio Code - Network for Microsoft Edge (Chromium)
  <br>
</h1>

<h4 align="center">Show Edge browser Network tool inside Visual Studio Code editor and use it to know details about network requests.</h4>

A Visual Studio Code extension that allows to use the Edge browser Network tool from within the editor. The Network tool will connect to an instance of Microsoft Edge giving the ability to see network requests details.

**Note**: This extension only supports Microsoft Edge (Chromium)

![Network for Microsoft Edge - Demo](demo.gif)

# Using the Extension
## Getting Started
For use inside Visual Studio Code:

1. Install any channel (Canary/Dev/etc.) of [Microsoft Edge (Chromium)](https://aka.ms/edgeinsider).
1. Install the extension.
1. Open the folder containing the project to work on.

## Using the tools
The extension operates in two modes - it can launch an instance of Microsoft Edge navigated to your app, or it can attach to a running instance of Microsoft Edge. Both modes requires you to be serving your web application from local web server, which is started from either a Visual Studio Code task or from your command-line. Using the `url` parameter you simply tell Visual Studio Code which URL to either open or launch in the browser.

#### Other optional launch config fields
* `browserPath`: The full path to the browser executable that will be launched. If not specified the most stable channel of Microsoft Edge (Chromium) will be launched from the default install location instead.
* `hostname`: By default the extension searches for debuggable instances using `localhost`. If you are hosting your web app on a remote machine you can specify the hostname using this setting.
* `port`: By default the extension will set the remote-debugging-port to `9222`. Use this option to specify a different port on which to connect.

### Launching the browser via the side bar view
* Start Microsoft Edge via the side bar
  * Click the `Network for Microsoft Edge` view in the side bar.
  * Click the `Open a new tab` icon to launch the browser (if it isn't open yet) and open a new tab.
* Attach the Network tool via the side bar view
  * Click the `Attach` icon next to the tab to open the Network tool.

### Launching the browser manually
* Start Microsoft Edge with remote-debugging enabled on port 9222:
  * `msedge.exe --remote-debugging-port=9222`
  * Navigate the browser to the desired URL.
* Attach the Network tool via a command:
  * Run the command `Network for Microsoft Edge: Attach to a target`
  * Select a target from the drop down.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

See [CONTRIBUTING.md](https://github.com/microsoft/vscode-edge-devtools-network/blob/master/CONTRIBUTING.md) for more information.

# Other information
## Data/Telemetry
This project collects usage data and sends it to Microsoft to help improve our products and services. Read [Microsoft's privacy statement](https://privacy.microsoft.com/en-US/privacystatement) to learn more.

## Reporting Security Issues

Security issues and bugs should be reported privately, via email, to the Microsoft Security
Response Center (MSRC) at [secure@microsoft.com](mailto:secure@microsoft.com). You should
receive a response within 24 hours. If for some reason you do not, please follow up via
email to ensure we received your original message. Further information, including the
[MSRC PGP](https://technet.microsoft.com/en-us/security/dn606155) key, can be found in
the [Security TechCenter](https://technet.microsoft.com/en-us/security/default).

