// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getTextFromFile } from "../../test/helpers";

describe("simpleView", () => {
    it("applyDrawerTabLocationPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "this._showDrawer.bind(this, false), 'drawer-view', true, true // code";
        let fileContents = getTextFromFile("ui/InspectorView.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyDrawerTabLocationPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(
            "this._showDrawer.bind(this, false), 'drawer-view', true, true, 'network.blocked-urls' // code");
    });

    it("applyMainTabTabLocationPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "InspectorFrontendHostInstance), 'panel', true, true, Root.Runtime.queryParam('panel') // code";
        let fileContents = getTextFromFile("ui/InspectorView.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyMainTabTabLocationPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual("InspectorFrontendHostInstance), 'panel', true, true, 'network' // code");
    });

    it("applySelectTabPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "selectTab(id, userGesture, forceFocus) { // code"
        let fileContents = getTextFromFile("ui/TabbedPane.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applySelectTabPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining("selectTab(id, userGesture, forceFocus) { if ("));
    });

    it("applyShowTabElementPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "_showTabElement(index, tab) { // code";
        let fileContents = getTextFromFile("ui/TabbedPane.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyShowTabElement(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining("_showTabElement(index, tab) { if ("));
    });

    it("applyInspectorCommonCssPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const comparableText = ":host-context(.platform-mac) .monospace,";
        let fileContents = getTextFromFile("shell.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyInspectorCommonCssPatch(fileContents);
        expect(result).not.toEqual(null);
        if (result) {
          expect(result.startsWith(".main-tabbed-pane")).toEqual(true);
          expect(result.endsWith(".monospace,")).toEqual(true);
        }
    });

    it("applyInspectorCommonCssPatch correctly changes text in release mode", async () => {
        const apply = await import("./simpleView");
        const comparableText = ":host-context(.platform-mac) .monospace,";
        let fileContents = getTextFromFile("shell.js");
        fileContents ? fileContents : comparableText;
        const result = apply.applyInspectorCommonCssPatch(comparableText, true);
        expect(result).not.toEqual(null);
        if (result) {
          expect(result.startsWith(".main-tabbed-pane")).toEqual(true);
          expect(result.endsWith(".monospace,")).toEqual(true);
          expect(result.indexOf("\\n") > -1).toEqual(true);
        }
    });
});
