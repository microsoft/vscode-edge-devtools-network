// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ToolsHost from "../toolsHost";

declare var InspectorFrontendHost: ToolsHost;

interface IRevealable {
    lineNumber: number;
    columnNumber: number;
    uiSourceCode: {
        _url: string;
    };
}

export function revealInVSCode(revealable: IRevealable | undefined, omitFocus: boolean) {
    if (revealable && revealable.uiSourceCode && revealable.uiSourceCode._url) {
        InspectorFrontendHost.openInEditor(
            revealable.uiSourceCode._url,
            revealable.lineNumber,
            revealable.columnNumber,
            omitFocus,
        );
    }

    return Promise.resolve();
}

export function applyCommonRevealerPatch(content: string) {
    return content.replace(
        /Common\.Revealer\.reveal\s*=\s*function\(revealable,\s*omitFocus\)\s*{/g,
        `Common.Revealer.reveal = ${revealInVSCode.toString().slice(0, -1)}`);
}

export function applyInspectorViewPatch(content: string) {
    return content
        .replace(
            /handleAction\(context,\s*actionId\)\s*{/g,
            "handleAction(context, actionId) { return false;");
}

export function applyMainViewPatch(content: string) {
    return content.replace(
        /const moreTools\s*=\s*[^;]+;/g,
        "const moreTools = { defaultSection: () => ({ appendItem: () => {} }) };");
}

export function applySelectTabPatch(content: string) {
    const networkTabs = [
        "network",
        "network.blocked-urls",
        "network.search-network-tab",
        "headers",
        "preview",
        "response",
        "timing",
        "initiator",
        "cookies",
        "eventSource",
        "webSocketFrames",
        "preferences",
        "workspace",
        "experiments",
        "blackbox",
        "devices",
        "throttling-conditions",
        "emulation-geolocations",
        "Shortcuts",
    ];

    const condition = networkTabs.map((tab) => {
        return `id !== '${tab}'`;
    }).join(" && ");

    return content.replace(
        /selectTab\(id,\s*userGesture,\s*forceFocus\)\s*{/g,
        `selectTab\(id, userGesture, forceFocus\) { if (${condition}) return false;`);
}

export function applyShowTabElement(content: string) {
    const networkTabs = [
        "network",
        "network.blocked-urls",
        "network.search-network-tab",
        "headers",
        "preview",
        "response",
        "timing",
        "initiator",
        "cookies",
        "eventSource",
        "webSocketFrames",
        "preferences",
        "workspace",
        "experiments",
        "blackbox",
        "devices",
        "throttling-conditions",
        "emulation-geolocations",
        "Shortcuts",
    ];

    const condition = networkTabs.map((tab) => {
        return `tab._id !== '${tab}'`;
    }).join(" && ");

    return content.replace(
        /_showTabElement\(index,\s*tab\)\s*{/g,
        `_showTabElement\(index, tab\) { if (${condition}) return false;`);
}

export function applyDrawerTabLocationPatch(content: string) {
    return content.replace(
        /this._showDrawer.bind\s*\(this,\s*false\),\s*'drawer-view',\s*true,\s*true/g,
        `this._showDrawer.bind\(this, false\), 'drawer-view', true, true, 'network.blocked-urls'`);
}

export function applyMainTabTabLocationPatch(content: string) {
    return content.replace(
        /InspectorFrontendHostInstance\),\s*'panel',\s*true,\s*true,\s*Root.Runtime.queryParam\('panel'\)/g,
        `InspectorFrontendHostInstance\), 'panel', true, true, 'network'`);
}

export function applyInspectorCommonCssPatch(content: string, isRelease?: boolean) {
    const separator = (isRelease ? "\\n" : "\n"); // Release css is embedded in js

    const hideTopHeader =
        `.main-tabbed-pane .tabbed-pane-header {
            visibility: hidden !important;
        }`.replace(/\n/g, separator);

    const hideInspectBtn =
        `.toolbar-button[aria-label='Select an element in the page to inspect it'] {
            display: none !important;
        }`.replace(/\n/g, separator);

    const unHideScreenCastBtn =
        `.toolbar-button[aria-label='Toggle screencast'] {
            visibility: visible !important;
        }`.replace(/\n/g, separator);

    const topHeaderCSS =
        hideTopHeader +
        hideInspectBtn +
        unHideScreenCastBtn;

    const hideMoreToolsBtn =
        `.toolbar-button[aria-label='More Tools'] {
            display: none !important;
        }`.replace(/\n/g, separator);

    const drawerCSS = hideMoreToolsBtn;

    const hideExportHarBtn =
        `.toolbar-button[aria-label='Export HAR...'] {
            display: none !important;
        }`.replace(/\n/g, separator);

    const hidePrettyPrintBtn =
        `.toolbar-button[aria-label='Pretty print'] {
            display: none !important;
        }`.replace(/\n/g, separator);

    const hideSomeContextMenuItems =
        `.soft-context-menu-separator,
        .soft-context-menu-item[aria-label='Open in new tab'],
        .soft-context-menu-item[aria-label='Open in Sources panel'],
        .soft-context-menu-item[aria-label='Clear browser cache'],
        .soft-context-menu-item[aria-label='Clear browser cookies'],
        .soft-context-menu-item[aria-label='Save all as HAR with content'],
        .soft-context-menu-item[aria-label='Save as...'] {
            display: none !important;
        }`.replace(/\n/g, separator);

    const networkCSS =
        hideExportHarBtn +
        hidePrettyPrintBtn +
        hideSomeContextMenuItems;

    const addCSS =
        topHeaderCSS +
        drawerCSS +
        networkCSS;

    let result = content.replace(
        /(:host-context\(\.platform-mac\)\s*\.monospace,)/g,
        `${addCSS}${separator} $1`);

    const replaceFocusTabSlider =
        `.tabbed-pane-tab-slider .enabled {
            display: none !important;
        }`.replace(/\n/g, separator);

    result = result.replace(
        /(\.tabbed-pane-tab-slider\s*\.enabled\s*\{([^\}]*)?\})/g,
        replaceFocusTabSlider);
    return result;
}
