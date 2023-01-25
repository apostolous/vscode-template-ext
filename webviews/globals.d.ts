/// <reference types="svelte" />

import * as _vscode from "vscode";

declare global {
    const data: any;
    const tsvscode: {
        postMessage: ({ type: string, value: any }) => void;
    };
    const SE: {
        init: (options: Object) => void;
        authenticate: (options: Object) => void;
    };
}