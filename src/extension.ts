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

    let importAllDisposable = vscode.commands.registerCommand('codeSync.importAll', codeSync.importAll);
    let exportAllDisposable = vscode.commands.registerCommand('codeSync.exportAll', codeSync.exportAll);
    
    let importSettingsDisposable = vscode.commands.registerCommand('codeSync.importSettings', codeSync.importSettings);
    let exportSettingsDisposable = vscode.commands.registerCommand('codeSync.exportSettings', codeSync.exportSettings);
    
    let importKeybindingsDisposable = vscode.commands.registerCommand('codeSync.importKeybindings', codeSync.importKeybindings);
    let exportKeybindingsDisposable = vscode.commands.registerCommand('codeSync.exportKeybindings', codeSync.exportKeybindings);
    
    let importSnippetsDisposable = vscode.commands.registerCommand('codeSync.importSnippets', codeSync.importSnippets);
    let exportSnippetsDisposable = vscode.commands.registerCommand('codeSync.exportSnippets', codeSync.exportSnippets);
    
    let ifCanManageExtensions = (fn) => {
        return () => {
            if (codeSync.CanManageExtensions) {
                fn();
            }
            else {
                vscode.window.showWarningMessage(helpers.getCodePathWarningMessage());
            }
        };
    });
            
    let importExtensionsDisposable = vscode.commands.registerCommand('codeSync.importExtensions', ifCanManageExtensions(codeSync.importExtensions));
    let exportExtensionsDisposable = vscode.commands.registerCommand('codeSync.exportExtensions', ifCanManageExtensions(codeSync.exportExtensions));

    let listExcludedInstalledDisposable = vscode.commands.registerCommand('codeSync.listExcludedInstalled', codeSync.displayExcludedInstalledPackages);
    let listExcludedExternalDisposable  = vscode.commands.registerCommand('codeSync.listExcludedExternal',  codeSync.displayExcludedExternalPackages);
    
    let addExcludedInstalledDisposable = vscode.commands.registerCommand('codeSync.addExcludedInstalled', codeSync.addExcludedInstalledPackage);
    let addExcludedExternalDisposable  = vscode.commands.registerCommand('codeSync.addExcludedExternal',  codeSync.addExcludedExternalPackage);
    
    let removeExcludedInstalledDisposable = vscode.commands.registerCommand('codeSync.removeExcludedInstalled', codeSync.removeExcludedInstalledPackage);
    let removeExcludedExternalDisposable  = vscode.commands.registerCommand('codeSync.removeExcludedExternal',  codeSync.removeExcludedExternalPackage);
    
    
    let toggleSetting = (setting : string) => {
        return async () => {
            await codeSync.toggleSetting(setting, codeSync.Settings.Settings[setting]);
        }
    };
    
    let toggleAutoImportDisposable = vscode.commands.registerCommand('codeSync.toggleAutoImport', toggleSetting('autoImport'));
    let toggleAutoExportDisposable = vscode.commands.registerCommand('codeSync.toggleAutoExport', toggleSetting('autoExport'));
    let toggleImportSettingsDisposable = vscode.commands.registerCommand('codeSync.toggleImportSettings', toggleSetting('importSettings'));
    let toggleImportKeybindingsDisposable = vscode.commands.registerCommand('codeSync.toggleImportKeybindings', toggleSetting('importKeybindings'));
    let toggleImportSnippetsDisposable = vscode.commands.registerCommand('codeSync.toggleImportSnippets', toggleSetting('importSnippets'));
    let toggleImportExtensionsDisposable = vscode.commands.registerCommand('codeSync.toggleImportExtensions', toggleSetting('importExtensions')();
    });
    
    let setSyncPathDisposable = vscode.commands.registerCommand('codeSync.setSyncPath', codeSync.setExternalSyncPath);
    let toggleStatusBarDisposable = vscode.commands.registerCommand('codeSync.toggleStatusBar', codeSync.toggleStatusBarIcon);

    context.subscriptions.push(
        importAllDisposable,
        exportAllDisposable,
        importSettingsDisposable,
        exportSettingsDisposable,
        importKeybindingsDisposable,
        exportKeybindingsDisposable,
        importSnippetsDisposable,
        exportSnippetsDisposable,
        importExtensionsDisposable,
        exportExtensionsDisposable,
        listExcludedInstalledDisposable,
        listExcludedExternalDisposable,
        addExcludedInstalledDisposable,
        addExcludedExternalDisposable,
        removeExcludedInstalledDisposable,
        removeExcludedExternalDisposable,
        toggleAutoImportDisposable,
        toggleAutoExportDisposable,
        toggleImportSettingsDisposable,
        toggleImportKeybindingsDisposable,
        toggleImportSnippetsDisposable,
        toggleImportExtensionsDisposable,
        setSyncPathDisposable,
        toggleStatusBarDisposable
    );
}

export function deactivate() {
    if (codeSync.CanManageExtensions) {
        if (codeSync.Settings.Settings.autoExport) {
            codeSync.exportExtensions();
        }
    }
}
