// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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

    it("applyCommonRevealerPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const result = apply.applyCommonRevealerPatch(
            "Common.Revealer.reveal = function(revealable, omitFocus) { // code");
        expect(result).toEqual(
            expect.stringContaining("Common.Revealer.reveal = function revealInVSCode(revealable, omitFocus) {"));
    });

    it("applyInspectorViewPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const result = apply.applyInspectorViewPatch(
            "handleAction(context, actionId) { // code");
        expect(result).toEqual("handleAction(context, actionId) { return false; // code");

        const result2 = apply.applyInspectorViewPatch(
            "handleAction(context,actionId) { // code");
        expect(result2).toEqual("handleAction(context, actionId) { return false; // code");

        const result3 = apply.applyDrawerTabLocationPatch(
            "this._showDrawer.bind(this, false), 'drawer-view', true, true // code");
        expect(result3).toEqual(
            "this._showDrawer.bind(this, false), 'drawer-view', true, true, 'network.blocked-urls' // code");

        const result4 = apply.applyMainTabTabLocationPatch(
            "InspectorFrontendHostInstance), 'panel', true, true, Root.Runtime.queryParam('panel') // code");
        expect(result4).toEqual("InspectorFrontendHostInstance), 'panel', true, true, 'network' // code");
    });

    it("applyMainViewPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const result = apply.applyMainViewPatch("const moreTools = getExtensions();");
        expect(result).toEqual("const moreTools = { defaultSection: () => ({ appendItem: () => {} }) };");
    });

    it("applySelectTabPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const result = apply.applySelectTabPatch("selectTab(id, userGesture, forceFocus) { // code");
        expect(result).toEqual(expect.stringContaining("selectTab(id, userGesture, forceFocus) { if ("));

        const result2 = apply.applySelectTabPatch("selectTab(id,userGesture, forceFocus) { // code");
        expect(result2).toEqual(expect.stringContaining("selectTab(id, userGesture, forceFocus) { if ("));
    });

    it("applyShowTabElementPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const result = apply.applyShowTabElement("_showTabElement(index, tab) { // code");
        expect(result).toEqual(expect.stringContaining("_showTabElement(index, tab) { if ("));
    });

    it("applyInspectorCommonCssPatch correctly changes text", async () => {
        const expectedCss = ":host-context(.platform-mac) .monospace,";
        const apply = await import("./simpleView");
        const result = apply.applyInspectorCommonCssPatch(expectedCss);
        expect(result.startsWith(".main-tabbed-pane")).toEqual(true);
        expect(result.endsWith(".monospace,")).toEqual(true);
    });

    it("applyInspectorCommonCssPatch correctly changes text in release mode", async () => {
        const expectedCss = ":host-context(.platform-mac) .monospace,";
        const apply = await import("./simpleView");
        const result = apply.applyInspectorCommonCssPatch(expectedCss, true);
        expect(result.startsWith(".main-tabbed-pane")).toEqual(true);
        expect(result.endsWith(".monospace,")).toEqual(true);
        expect(result.indexOf("\\n") > -1).toEqual(true);
    });
});
