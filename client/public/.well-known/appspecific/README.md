# Chrome DevTools Workspace Configuration

This directory contains the configuration file for Chrome DevTools "Automatic Workspace Folders" feature.

## What is this?

The `com.chrome.devtools.json` file enables Chrome DevTools to automatically connect to your project files for live editing and debugging. This allows you to:

- Edit source files directly in Chrome DevTools
- Have changes persist to your actual project files
- Automatically connect/disconnect when navigating between projects

## Documentation

For more information, see the official Chrome DevTools documentation:
https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md#solution

## Configuration

The `com.chrome.devtools.json` file contains:

- `workspace.root`: Absolute path to your project directory
- `workspace.uuid`: Unique identifier for this workspace

### ⚠️ Important: Update the Root Path

**Before using this configuration, you MUST update the `root` path in `com.chrome.devtools.json` to match your system:**

1. Open `com.chrome.devtools.json`
2. Replace `/Users/anaestrada/Stuff/newsletter` with your actual project path
3. The path should point to your newsletter project root directory

**Example:**

```json
{
  "workspace": {
    "root": "/path/to/your/project",
    "uuid": "r4nD0m-Uu1D"
  }
}
```

**Why?** The current path is specific to the original developer's machine. Chrome DevTools needs the absolute path to your local project directory to enable live editing.

## How it works

1. Chrome DevTools automatically requests `/.well-known/appspecific/com.chrome.devtools.json` when you have DevTools open on localhost
2. If the file exists and is valid, DevTools connects to the specified workspace
3. You can then edit files directly in DevTools and changes are saved to your project

## Requirements

- Chrome M-135 or later
- Feature flags enabled (if using older versions):
  - `chrome://flags#devtools-project-settings`
  - `chrome://flags#devtools-automatic-workspace-folders`
- Running on localhost (feature only works on localhost)

[Source](https://github.com/nuxt/nuxt/issues/31978#issuecomment-2869622575)
