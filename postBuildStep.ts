// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as fse from "fs-extra";
import path from "path";
import { applyContentSecurityPolicyPatch } from "./src/host/polyfills/inspectorContentPolicy";
import {
    applyDrawerTabLocationPatch,
    applyInspectorCommonCssPatch,
    applyMainTabTabLocationPatch,
    applySelectTabPatch,
    applyShowTabElement,
} from "./src/host/polyfills/simpleView";

async function copyFile(srcDir: string, outDir: string, name: string) {
    await fse.copy(
        path.join(srcDir, name),
        path.join(outDir, name),
    );
}

async function copyStaticFiles(debugMode: boolean) {
    // Copy the static html file to the out directory

    // Copy the static css file to the out directory
    const commonSrcDir = "./src/common/";
    const commonOutDir = "./out/common/";
    await fse.ensureDir(commonOutDir);
    await copyFile(commonSrcDir, commonOutDir, "styles.css");

    // Must set environment variables EDGE_CHROMIUM_PATH and EDGE_CHROMIUM_OUT_DIR
    // E.g. set EDGE_CHROMIUM_PATH=F:/git/Edge/src
    //      set EDGE_CHROMIUM_OUT_DIR=debug_x64
    // See CONTRIBUTING.md for more details

    const toolsSrcDir =
        `${process.env.EDGE_CHROMIUM_PATH}/third_party/devtools-frontend/src/front_end/`;
    if (!isDirectory(toolsSrcDir)) {
        throw new Error(`Could not find Microsoft Edge (Chromium) DevTools path at '${toolsSrcDir}'. ` +
            "Did you set the EDGE_CHROMIUM_PATH environment variable?");
    }

    const toolsGenDir =
        `${process.env.EDGE_CHROMIUM_PATH}/out/${process.env.EDGE_CHROMIUM_OUT_DIR}/gen/devtools/`;
    if (!isDirectory(toolsGenDir)) {
        throw new Error(`Could not find Microsoft Edge (Chromium) output path at '${toolsGenDir}'. ` +
            "Did you set the EDGE_CHROMIUM_OUT_DIR environment variable?");
    }

    const toolsResDir =
        `${process.env.EDGE_CHROMIUM_PATH}/out/${process.env.EDGE_CHROMIUM_OUT_DIR}/resources/inspector/`;

    // Copy the devtools to the out directory
    const toolsOutDir = "./out/tools/front_end/";
    await fse.ensureDir(toolsOutDir);
    await fse.copy(toolsSrcDir, toolsOutDir);

    // Copy the devtools generated files to the out directory
    await fse.copy(toolsGenDir, toolsOutDir);

    // Copy the optional devtools resource files to the out directory
    if (isDirectory(toolsResDir)) {
        await copyFile(toolsResDir, toolsOutDir, "InspectorBackendCommands.js");
        await copyFile(toolsResDir, toolsOutDir, "SupportedCSSProperties.js");
    }

    // Patch older versions of the webview with our workarounds
    await patchFilesForWebView(toolsOutDir, debugMode);
}

async function patchFilesForWebView(toolsOutDir: string, debugMode: boolean) {
    if (!debugMode) {
      // tslint:disable-next-line:no-console
      console.log('Patching files for release version');
      await patchFileForWebView("shell.js", toolsOutDir, true, [
        applyInspectorCommonCssPatch
      ]);
      await patchFileForWebView("inspector.html", toolsOutDir, true, [applyContentSecurityPolicyPatch]);
      await patchFileForWebView("ui/TabbedPane.js", toolsOutDir, false, [applySelectTabPatch, applyShowTabElement]);
      await patchFileForWebView("ui/InspectorView.js", toolsOutDir, false, [
        applyDrawerTabLocationPatch,
        applyMainTabTabLocationPatch,
      ]);
    } else {
      await patchFileForWebView("inspector.html", toolsOutDir, true, [applyContentSecurityPolicyPatch]);
      await patchFileForWebView("ui/TabbedPane.js", toolsOutDir, false, [applySelectTabPatch, applyShowTabElement]);
      await patchFileForWebView("ui/InspectorView.js", toolsOutDir, false, [
        applyDrawerTabLocationPatch,
        applyMainTabTabLocationPatch,
      ]);
    }
}

async function patchFileForWebView(
    filename: string,
    dir: string,
    isRelease: boolean,
    patches: Array<(content: string, isRelease?: boolean) => string | null>) {
    const file = path.join(dir, filename);

    // Ignore missing files
    if (!await fse.pathExists(file)) {
        const template = `An expected file was not found: ${file}`;
        throw new Error(template);
    }

    // Read in the file
    let content = (await fse.readFile(file)).toString();

    // Apply each patch in order
    patches.forEach((patchFunction) => {
        const patchResult: string | null = patchFunction(content, isRelease);
        if (patchResult) {
            content = patchResult;
        } else {
            const template = `An expected function was not patched correctly: ${patchFunction} on file: ${filename}`;
            throw new Error(template);
        }
    });

    // Write out the final content
    await fse.writeFile(file, content);
}

function isDirectory(fullPath: string) {
    try {
        return fse.statSync(fullPath).isDirectory();
    } catch {
        return false;
    }
}

function main() {
  let debugMode = false;
  if (process.argv && process.argv.length === 3 && process.argv[2] === "debug") {
      debugMode = true;
  }

  copyStaticFiles(debugMode);
}

main();
