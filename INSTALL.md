# Installation Guide for GrammarGuard

## Quick Start

Follow these steps to install and use the GrammarGuard Chrome extension:

### Step 1: Prepare the Extension

1. Make sure you have all the extension files in the `Grammerly clone` folder
2. **Important**: Convert the icon files from SVG to PNG
   - Open `icons/convert-icons.html` in your web browser
   - Click "Download PNG" for each icon size (16, 48, and 128)
   - Save the PNG files in the `icons/` folder, replacing the placeholder files

### Step 2: Open Chrome Extensions Page

1. Open Google Chrome browser
2. Type `chrome://extensions/` in the address bar and press Enter
3. Or click the three-dot menu → More Tools → Extensions

### Step 3: Enable Developer Mode

1. Look for the **Developer mode** toggle in the top-right corner
2. Click to enable it
3. You should now see additional options appear

### Step 4: Load the Extension

1. Click the **"Load unpacked"** button
2. Navigate to your `Grammerly clone` folder
3. Select the folder and click **"Select Folder"** or **"Open"**
4. The extension should now appear in your extensions list

### Step 5: Verify Installation

1. You should see the GrammarGuard icon with a green checkmark
2. The extension card should show:
   - Name: "GrammarGuard - Writing Assistant"
   - Version: 1.0.0
   - Status: Enabled
3. Pin the extension to your toolbar by clicking the puzzle icon and pinning GrammarGuard

### Step 6: Test the Extension

1. Navigate to any website with text input (e.g., Gmail, Twitter)
2. Click on a text field or textarea
3. Type some text with intentional errors, for example:
   ```
   Their are many benefits to using grammarly. Your going to love it!
   ```
4. You should see errors underlined:
   - "Their are" → Grammar error (should be "There are")
   - "Your going" → Grammar error (should be "You're going")
5. Click on any underlined error to see suggestions

## Troubleshooting

### Icons Not Showing?

If you see generic puzzle icons instead of the green checkmark:

1. Make sure you converted the SVG icons to PNG using `icons/convert-icons.html`
2. Verify the PNG files are in the `icons/` folder
3. Reload the extension:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the GrammarGuard card

### Extension Not Working?

If the extension doesn't detect errors:

1. **Refresh the page** you're testing on (the extension needs to inject into new pages)
2. **Check if enabled**: Look for the green checkmark badge on the extension icon
3. **Check console for errors**:
   - Right-click on the page → Inspect
   - Go to the Console tab
   - Look for any error messages
4. **Verify permissions**: Make sure the extension has permission to access the site
5. **Try a different site**: Some sites block extensions; try Gmail or Twitter

### Extension Loads But No Underlines Appear?

1. Make sure you're clicking INTO a text field (it activates on focus)
2. Type at least 3 characters for analysis to begin
3. Check if other grammar extensions are interfering (disable them temporarily)
4. Try reloading the extension:
   - Go to `chrome://extensions/`
   - Click the refresh icon
   - Reload the webpage

### Permission Errors?

If you see errors about permissions:

1. The extension requests access to all URLs (necessary to work everywhere)
2. Click "Allow" when Chrome asks for permissions
3. If you denied permissions, fix it by:
   - Right-click the extension icon
   - Select "Manage Extension"
   - Go to "Site access"
   - Select "On all sites"

## Using the Extension

### Basic Usage

1. **Navigate** to any website with text input
2. **Click** on a text field or contenteditable area
3. **Type** normally - errors will be underlined as you go
4. **Click** underlined errors to see suggestions
5. **Accept** corrections with one click, or ignore them

### Understanding Error Types

| Underline Style | Error Type | Color |
|----------------|------------|-------|
| Dotted red | Spelling errors | Red |
| Solid orange | Grammar mistakes | Orange |
| Solid blue | Capitalization | Blue |
| Dotted purple | Spacing issues | Purple |

### Extension Popup

Click the extension icon to see:
- **Toggle switch**: Enable/disable the extension
- **Statistics**: Corrections found, words checked
- **Error breakdown**: By type (spelling, grammar, style)
- **Status**: Active/Inactive indicator

### Keyboard Shortcuts (Coming Soon)

Future versions will support:
- `Ctrl+Shift+G`: Toggle extension
- `Ctrl+Shift+C`: Check current text
- `Alt+Enter`: Accept first suggestion

## Advanced Configuration

### Customizing Rules

To add or modify grammar rules:

1. Open `content.js` in a text editor
2. Find the `rules` array (around line 82)
3. Add your custom rule:
   ```javascript
   {
     pattern: /your pattern/gi,
     replacement: 'fixed text',
     message: 'Description of the error',
     type: 'grammar' // or 'spelling', 'style', etc.
   }
   ```
4. Save the file
5. Reload the extension in `chrome://extensions/`

### Changing Colors

To customize underline colors:

1. Open `content.css`
2. Modify the color values:
   ```css
   .grammar-guard-spelling {
     border-color: #your-color;
   }
   ```
3. Save and reload the extension

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "GrammarGuard - Writing Assistant"
3. Click **"Remove"**
4. Confirm the removal

## Support

If you encounter issues:

1. Check this guide first
2. Review the main README.md
3. Check the browser console for error messages
4. Try disabling other extensions temporarily
5. Restart Chrome and try again

## Next Steps

- Explore the promotional website: Open `website/index.html`
- Read the full documentation: See `README.md`
- Customize the extension to your needs
- Share feedback and suggestions!

---

**Happy Writing! ✍️**

