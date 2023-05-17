/*
 * @Descripttion: 
 * @Author: wanganqi
 * @Date: 2023-05-05 11:20:13
 * @LastEditors: wanganqi
 * @LastEditTime: 2023-05-17 08:38:49
 */
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('mapper-format.helloWorld', () => {
			vscode.window.showInformationMessage("welcome to the Mapper Format tool!");
			let panel = vscode.window.createWebviewPanel(
				'mapperFormat',
				'Mapper Format',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
			panel.webview.html = getWebviewContent(context, 'index.html');
		})
	);
}


function getWebviewContent(context: vscode.ExtensionContext, templatePath: string) {
	const resourcePath = path.join(context.extensionPath, templatePath);
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
	html = html.replace(/(<link.+?href="|<script.+?src="|<iframe.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		if ($2.indexOf("https://") < 0) return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
		else return $1 + $2 + '"';
	});
	return html;
}
