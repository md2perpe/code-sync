# CodeSync
A VSCode extension that syncs extensions using your favorite file synchronization service (OneDrive, Dropbox, Google Drive, etc.)

## Now support syncing all types of extensions!
CodeSync has been completely rewritten. It however is completely incompatible with CodeSync 1.x **and will delete CodeSync 1.x settings and CodeSync's 1.x sync directory if found**.

## Usage
1. Install CodeSync
2. Relaunch VSCode
3. VSCode will now prompt for the folder to where you want sync extensions. This should be a folder that syncs to your other computers.
4. VSCode will now import settings, keybindings, snippets, and extensions from your external folder.
5. Code!
6. When you quit VSCode, CodeSync will export your settings, keybindings, snippets, and extensions to your external folder.

## Commands
(All extensions are prefixed with "CodeSync: ")
- Import all: Import settings, keybindings, snippets, and extensions.
- Export all: Export settings, keybindings, snippets, and extensions.
- Import settings: Import settings.
- Export settings: Export settings.
- Import keybindings: Import keybindings.
- Export keybindings: Export keybindings.
- Import snippets: Import snippets.
- Export snippets: Export snippets.
- Import extensions: Import extensions.
- Export extensions: Export extensions.
- Exclude an installed extension: Exclude an installed extension from syncing to your external folder.
- Exclude an external extension: Exclude an external extension from syncing from your local installation.
- List excluded installed extensions: List excluded extensions that are installed locally.
- List excluded external extensions: List excluded extensions that are in your external folder.
- Remove an exclusion - Installed: Remove an exclusion from your local installation.
- Remove an exclusion - External: Remove an exclusion from your external folder.
- Toggle auto import: Toggle auto import upon VSCode launch.
- Toggle auto export: Toggle auto export upon VSCode launch.
- Toggle import/export settings: Toggle auto importing/exporting of settings.
- Toggle import/export keybindings: Toggle auto importing/exporting of keybindings.
- Toggle import/export snippets: Toggle auto importing/exporting of snippets.
- Toggle import/export extensions: Toggle auto importing/exporting of extensions.

## Contributing/Bugs
I've only tested this on Windows 10 with OneDrive. If you have any issues please report them using Issues. Thanks!
