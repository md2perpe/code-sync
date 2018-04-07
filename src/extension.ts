'use strict';
import * as vscode from 'vscode';
import * as cs from './cs';
import * as helpers from './helpers';
import {Logger} from './logger';

var logger: Logger;
var codeSync: cs.CodeSync;

export async function activate(context: vscode.ExtensionContext) {
    logger = new Logger('extension');
    codeSync = new cs.CodeSync(cs.vsCodeExtensionDir, cs.codeSyncExtensionDir, '');
    codeSync.CanManageExtensions = helpers.isCodeOnPath();
    if (!codeSync.CanManageExtensions) {
        await vscode.window.showWarningMessage(helpers.getCodePathWarningMessage());
    }
    codeSync.Active = true;
    if (codeSync.Active) {
        await codeSync.checkForSettings();
        codeSync.startFileWatcher();
        if (codeSync.Settings.Settings.autoImport) {
            codeSync.importSettings();
            await codeSync.importKeybindings();
            await codeSync.importSnippets();
            if (codeSync.CanManageExtensions) {
                codeSync.importExtensions();
                if (codeSync.Settings.Settings.autoExport) {
                    codeSync.exportExtensions();
                }
            }
        }
        codeSync.setStatusBarIcon();
    }

    
    function ifCanManageExtensions(fn) {
        return () => {
            if (codeSync.CanManageExtensions) {
                fn();
            }
            else {
                vscode.window.showWarningMessage(helpers.getCodePathWarningMessage());
            }
        };
    }
    
    function toggleSettings(setting : string) {
        return async () => {
            await codeSync.toggleSetting(setting, codeSync.Settings.Settings[setting]);
        }
    }
    
    context.subscriptions.push(
        
        vscode.commands.registerCommand('codeSync.importAll', codeSync.importAll),
        vscode.commands.registerCommand('codeSync.exportAll', codeSync.exportAll),
    
        vscode.commands.registerCommand('codeSync.importSettings', codeSync.importSettings),
        vscode.commands.registerCommand('codeSync.exportSettings', codeSync.exportSettings),
    
        vscode.commands.registerCommand('codeSync.importKeybindings', codeSync.importKeybindings),
        vscode.commands.registerCommand('codeSync.exportKeybindings', codeSync.exportKeybindings),
    
        vscode.commands.registerCommand('codeSync.importSnippets', codeSync.importSnippets),
        vscode.commands.registerCommand('codeSync.exportSnippets', codeSync.exportSnippets),
    
        vscode.commands.registerCommand('codeSync.importExtensions', ifCanManageExtensions(codeSync.importExtensions)),
        vscode.commands.registerCommand('codeSync.exportExtensions', ifCanManageExtensions(codeSync.exportExtensions)),

        vscode.commands.registerCommand('codeSync.listExcludedInstalled', codeSync.displayExcludedInstalledPackages),
        vscode.commands.registerCommand('codeSync.listExcludedExternal',  codeSync.displayExcludedExternalPackages),
    
        vscode.commands.registerCommand('codeSync.addExcludedInstalled', codeSync.addExcludedInstalledPackage),
        vscode.commands.registerCommand('codeSync.addExcludedExternal',  codeSync.addExcludedExternalPackage),
    
        vscode.commands.registerCommand('codeSync.removeExcludedInstalled', codeSync.removeExcludedInstalledPackage),
        vscode.commands.registerCommand('codeSync.removeExcludedExternal',  codeSync.removeExcludedExternalPackage),
    
        vscode.commands.registerCommand('codeSync.toggleAutoImport', toggleSetting('autoImport')),
        vscode.commands.registerCommand('codeSync.toggleAutoExport', toggleSetting('autoExport')),
                                        
        vscode.commands.registerCommand('codeSync.toggleImportSettings',    toggleSetting('importSettings')),
        vscode.commands.registerCommand('codeSync.toggleImportKeybindings', toggleSetting('importKeybindings')),
        vscode.commands.registerCommand('codeSync.toggleImportSnippets',    toggleSetting('importSnippets')),
        vscode.commands.registerCommand('codeSync.toggleImportExtensions',  toggleSetting('importExtensions')),
    
        vscode.commands.registerCommand('codeSync.setSyncPath',     codeSync.setExternalSyncPath),
        vscode.commands.registerCommand('codeSync.toggleStatusBar', codeSync.toggleStatusBarIcon),
    
    );

}

export function deactivate() {
    if (codeSync.CanManageExtensions) {
        if (codeSync.Settings.Settings.autoExport) {
            codeSync.exportExtensions();
        }
    }
}
