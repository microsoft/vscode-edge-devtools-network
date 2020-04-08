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
    const pattern = /Common\.Revealer\.reveal\s*=\s*function\(revealable,\s*omitFocus\)\s*{/g;
    if (content.match(pattern)) {
        return content.replace(pattern, `Common.Revealer.reveal = ${revealInVSCode.toString().slice(0, -1)}`);
    } else {
        return null;
    }
}

export function applyInspectorViewPatch(content: string) {
    const pattern = /handleAction\(context,\s*actionId\)\s*{/g;
    if (content.match(pattern)) {
        return content.replace(pattern, 'handleAction(context, actionId) { return false;');
    } else {
        return null;
    }
}

export function applyMainViewPatch(content: string) {
    const pattern = /const moreTools\s*=\s*[^;]+;/g;
    if (content.match(pattern)) {
        return content.replace(pattern, 'const moreTools = { defaultSection: () => ({ appendItem: () => {} }) };');
    } else {
        return null;
    }
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

    const pattern = /selectTab\(id,\s*userGesture,\s*forceFocus\)\s*{/g;
    if (content.match(pattern)) {
        return content.replace(pattern, `selectTab\(id, userGesture, forceFocus\) { if (${condition}) return false;`);
    } else {
        return null;
    }
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

    const pattern = /_showTabElement\(index,\s*tab\)\s*{/g;
    if (content.match(pattern)) {
        return content.replace(pattern, `_showTabElement\(index, tab\) { if (${condition}) return false;`);
    } else {
        return null;
    }
}

export function applyDrawerTabLocationPatch(content: string) {
    const pattern = /this._showDrawer.bind\s*\(this,\s*false\),\s*'drawer-view',\s*true,\s*true/g;
    if (content.match(pattern)) {
        return content.replace(pattern, `this._showDrawer.bind\(this, false\), 'drawer-view', true, true, 'network.blocked-urls'`);
    } else {
        return null;
    }
}

export function applyMainTabTabLocationPatch(content: string) {
    const pattern = /InspectorFrontendHostInstance\),\s*'panel',\s*true,\s*true,\s*Root.Runtime.queryParam\('panel'\)/g;
    if (content.match(pattern)) {
        return content.replace(pattern, `InspectorFrontendHostInstance\), 'panel', true, true, 'network'`);
    } else {
        return null;
    }
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

    let result;
    const pattern = /(:host-context\(\.platform-mac\)\s*\.monospace,)/g
    if (content.match(pattern)) {
        result = content.replace(pattern, `${addCSS}${separator} $1`);
    } else {
        return null;
    }

    const replaceFocusTabSlider =
        `.tabbed-pane-tab-slider .enabled {
            display: none !important;
        }`.replace(/\n/g, separator);

    const tabbedPanePattern = /(\.tabbed-pane-tab-slider\s*\.enabled\s*\{([^\}]*)?\})/g;
    if (result.match(tabbedPanePattern)) {
        return result.replace(tabbedPanePattern, replaceFocusTabSlider);
    } else {
        return null;
    }
}
