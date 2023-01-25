import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { ActivityPanel } from './ActivityPanelHandler';

export function activate(context: vscode.ExtensionContext) {

	// Register the Sidebar Panel
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"myextension-sidebar",
			sidebarProvider
		)
	);

	context.subscriptions.push(vscode.commands.registerCommand(
		"myextension.start", () => {
			ActivityPanel.createOrShow(context.extensionUri);
		}
	));

		context.subscriptions.push(
		vscode.commands.registerCommand("mycmd.refresh", async () => {
			/* WhatEverPanel.kill();
			WhatEverPanl.createOrShow(context.extensionUri); */
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.myextension-sidebar-view");
			setTimeout(() => {
				vscode.commands.executeCommand(
				"workbench.action.webview.openDeveloperTools"
				);
				}, 500);
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() { }
