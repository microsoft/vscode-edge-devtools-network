// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getTextFromFile } from "../../test/helpers";

describe("simpleView", () => {
    it("revealInVSCode calls openInEditor", async () => {
        const apply = await import("./simpleView");
        const expected = {
            columnNumber: 0,
            lineNumber: 0,
            omitFocus: false,
            uiSourceCode: {
                _url: "http://bing.com",
            },
        };
        const mockOpen = jest.fn();
        (global as any).InspectorFrontendHost = {
            openInEditor: mockOpen,
        };

        await apply.revealInVSCode(expected, expected.omitFocus);

        expect(mockOpen).toHaveBeenCalled();
    });

    // it("applyCommonRevealerPatch correctly changes text", async () => {
    //     const comparableText =  "Common.Revealer.reveal = function(revealable, omitFocus) { // code";
    //     let fileContents = getTextFromFile("common/Revealer.js");

    //     // The file was not found, so test that at least the text is being replaced.
    //     fileContents = fileContents ? fileContents : comparableText;
    //     const apply = await import("./simpleView");
    //     const result = apply.applyCommonRevealerPatch(fileContents);
    //     expect(result).not.toEqual(null);
    //     expect(result).toEqual(
    //         expect.stringContaining("Common.Revealer.reveal = function revealInVSCode(revealable, omitFocus) {"));
    // });

    it("applyInspectorViewPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        // const result = apply.applyInspectorViewPatch(
        //     "handleAction(context, actionId) { // code");
        // expect(result).toEqual("handleAction(context, actionId) { return false; // code");

        // const result2 = apply.applyInspectorViewPatch(
        //     "handleAction(context,actionId) { // code");
        // expect(result2).toEqual("handleAction(context, actionId) { return false; // code");

        const comparableText3 = "this._showDrawer.bind(this, false), 'drawer-view', true, true // code";
        let fileContents3 = getTextFromFile("ui/ui.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents3 = fileContents3 ? fileContents3 : comparableText3;
        const result3 = apply.applyDrawerTabLocationPatch(fileContents3);
        expect(result3).not.toEqual(null);
        expect(result3).toEqual(
            "this._showDrawer.bind(this, false), 'drawer-view', true, true, 'network.blocked-urls' // code");

        const comparableText4 = "InspectorFrontendHostInstance), 'panel', true, true, Root.Runtime.queryParam('panel') // code";
        let fileContents4 = getTextFromFile("ui/ui.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents4 = fileContents4 ? fileContents4 : comparableText4;
        const result4 = apply.applyMainTabTabLocationPatch(fileContents4);
        expect(result4).not.toEqual(null);
        expect(result4).toEqual("InspectorFrontendHostInstance), 'panel', true, true, 'network' // code");
    });

    // it("applyMainViewPatch correctly changes text", async () => {
    //     const apply = await import("./simpleView");
    //     const result = apply.applyMainViewPatch("const moreTools = getExtensions();");
    //     expect(result).toEqual("const moreTools = { defaultSection: () => ({ appendItem: () => {} }) };");
    // });

    it("applySelectTabPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "selectTab(id, userGesture, forceFocus) { // code"
        let fileContents = getTextFromFile("ui/TabbedPane.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applySelectTabPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining("selectTab(id, userGesture, forceFocus) { if ("));

        const comparableText2 = "selectTab(id,userGesture, forceFocus) { // code";
        let fileContents2 = getTextFromFile("ui/TabbedPane.js");
        fileContents2 = fileContents2 ? fileContents2 : comparableText2;
        const result2 = apply.applySelectTabPatch(fileContents2);
        expect(result2).not.toEqual(null);
        expect(result2).toEqual(expect.stringContaining("selectTab(id, userGesture, forceFocus) { if ("));
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
