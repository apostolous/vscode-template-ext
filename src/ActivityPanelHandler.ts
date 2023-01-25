import * as vscode from "vscode";

function getWebviewOptions(): vscode.WebviewOptions {
	return {
		enableScripts: true,
	};
}

export class ActivityPanel implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    public static currentPanel: ActivityPanel | undefined;

    private _disposables: vscode.Disposable[] = [];

    public static readonly viewType = 'myextension';

    public dispose() {
		ActivityPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

    constructor(private readonly _panel: vscode.WebviewPanel, private readonly _extensionUri: vscode.Uri, private readonly _data?: any | null) {
        this._data = JSON.stringify(_data);
        // Listen for disposal
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._update(this._panel.webview);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update(this._panel.webview);
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    private _update(webview: vscode.Webview) {
        this._panel.webview.html = this._getHtmlForWebview(webview);
        console.log("Updating webview")
    }

    public static createOrShow(extensionUri: vscode.Uri, data?: any) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (ActivityPanel.currentPanel) {
            ActivityPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            ActivityPanel.viewType,
            'My Extension',
            column || vscode.ViewColumn.One,
            getWebviewOptions(),
        );

        ActivityPanel.currentPanel = new ActivityPanel(panel, extensionUri, data);
    }


    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });

    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.parse(`${this._extensionUri}/media/reset.css`)
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.parse(`${this._extensionUri}/media/vscode.css`)
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.parse(`${this._extensionUri}/out/compiled/activity.js`)
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.parse(`${this._extensionUri}/out/compiled/activity.css`)
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
            }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                    const data = ${this._data}
                </script>

			</head>
            <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}