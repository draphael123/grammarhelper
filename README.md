# GrammarGuard - AI Writing Assistant Chrome Extension

![GrammarGuard Logo](icons/icon128.svg)

🌐 **Live Website**: https://grammarguard.vercel.app  
📦 **GitHub Repository**: https://github.com/draphael123/grammarhelper.git

## Overview

GrammarGuard is a powerful Chrome extension that works just like Grammarly, providing real-time grammar, spelling, and style checking across all websites. **Now with full Filipino (Tagalog) language support!** Write with confidence in English, Filipino, or both!

🆕 **NEW in v2.1**: Comprehensive Filipino/Tagalog grammar checking with 35+ rules, auto-detection, and bilingual support!

## Features

- ✅ **Real-Time Checking** - Get instant feedback as you type
- 🌐 **Works Everywhere** - Compatible with Gmail, Twitter, Google Docs, Facebook, and more
- 🇺🇸🇵🇭 **Bilingual Support** - **NEW!** English + Filipino (Tagalog) with auto-detection
- 📝 **Grammar & Spelling** - Advanced detection of grammar mistakes and spelling errors
- 🎨 **Style Suggestions** - Improve readability and tone
- 🔒 **Privacy First** - All checking happens locally on your device
- ⚡ **Lightning Fast** - Optimized for performance with no lag

## What We Check

### 🇺🇸 English Language
**Spelling Errors:**
- Misspelled words
- Common typos (teh → the, recieve → receive)
- Word confusions (their/there/they're, your/you're)

**Grammar Mistakes:**
- Subject-verb agreement
- Incorrect word usage
- Sentence structure issues
- Verb tense errors
- Pronoun usage

**Style & Formatting:**
- Punctuation placement
- Capitalization rules
- Spacing issues (double spaces, missing spaces)
- Readability enhancements

### 🇵🇭 Filipino/Tagalog Language **NEW!**
**70+ Grammar & Spelling Rules:**

**Spelling Corrections (40+ patterns):**
- **Text Speak** - `kase` → `kasi`, `nung` → `noong`, `sna` → `sana`
- **Common Misspellings** - `pwede` → `puwede`, `meron` → `mayroon`
- **Word Combinations** - `saakin` → `sa akin`, `sakanya` → `sa kanya`
- **Typos** - `kailagan` → `kailangan`, `kahpon` → `kahapon`

**Grammar Rules (30+ patterns):**
- **Ng vs Nang** - Proper usage detection (possession vs manner)
- **Din vs Rin / Daw vs Raw** - Automatic phonetic matching
- **Prefix Spacing** - Correct attachment (nag-, pag-, pinaka-, ka-...-an)
- **Redundancy** - Catches repeated words (mga mga → mga)
- **May vs Mayroon** - Context-aware suggestions

**Example Corrections:**
- Spelling: `kase` → `kasi`, `wla` → `wala`, `hndi` → `hindi`
- Prefix: `pag dating` → `pagdating`, `nag ka` → `nagka`
- Grammar: `gusto ko nang` → `gusto ko ng`
- Combinations: `saakin` → `sa akin`, `nasakanya` → `nasa kanya`

**Bilingual (Taglish) Support:**
- Checks mixed English-Filipino text
- Auto-detects dominant language
- Applies appropriate rules for each language

📖 **[Read more about Filipino support →](FILIPINO-SUPPORT.md)**

## Installation

### Method 1: Load Unpacked (Development)

1. **Download or Clone** this repository to your local machine

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in Google Chrome
   - Or click the puzzle icon → "Manage Extensions"

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `Grammerly clone` folder containing the extension files
   - The extension will now appear in your extensions list

5. **Start Using**
   - Click on any text field or contenteditable area on any website
   - Start typing and watch GrammarGuard work its magic!

### Method 2: Chrome Web Store (Coming Soon)

Once published to the Chrome Web Store, you'll be able to install with one click!

## How to Use

1. **Navigate to any website** with text input fields (Gmail, Twitter, Facebook, etc.)

2. **Click on a text field** to activate GrammarGuard

3. **Start typing** - errors will be underlined as you type:
   - Red dotted line = Spelling errors
   - Orange solid line = Grammar mistakes
   - Blue solid line = Capitalization issues
   - Purple dotted line = Spacing problems

4. **Click on any underlined error** to see suggestions

5. **Click "Accept"** to apply the correction or "Ignore" to dismiss

## Extension Structure

```
Grammerly clone/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── content.css           # Styling for error highlighting
├── background.js         # Background service worker
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── website/              # Promotional website
    ├── index.html
    ├── style.css
    └── script.js
```

## Technical Details

### Permissions
- `activeTab` - Access to the current tab
- `storage` - Save user preferences and statistics
- `contextMenus` - Right-click context menu integration
- `host_permissions` - Access to all URLs for checking

### Technologies Used
- **Manifest V3** - Latest Chrome extension format
- **Vanilla JavaScript** - No dependencies, fast and lightweight
- **CSS3** - Modern styling with animations
- **Service Workers** - Background processing

## Features in Detail

### Real-Time Analysis
The extension uses advanced pattern matching and rule-based algorithms to detect errors as you type, with minimal performance impact.

### Privacy
All text analysis happens locally in your browser. **No data is ever sent to external servers.** Your writing stays private.

### Statistics Tracking
View your writing stats in the popup:
- Total corrections found
- Words checked
- Error types breakdown
- Daily/weekly progress

## Customization

Click the extension icon to access settings:
- Enable/disable the extension
- Toggle specific error types
- Adjust checking sensitivity
- View statistics

## Browser Compatibility

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Other Chromium-based browsers

## Troubleshooting

### Extension not working?
1. Make sure the extension is enabled in `chrome://extensions`
2. Refresh the page you're trying to use it on
3. Check that Developer Mode is enabled if using unpacked version

### Errors not showing?
1. Click into the text field to activate checking
2. Type at least 3 characters for analysis to begin
3. Check if the extension icon shows the green checkmark

### Performance issues?
1. Disable other grammar/spell-check extensions
2. Clear browser cache and restart Chrome

## Development

Want to contribute or modify the extension?

1. Clone the repository
2. Make your changes
3. Test by loading the unpacked extension
4. Submit a pull request

### Adding New Grammar Rules

Edit `content.js` and add new rules to the `rules` array:

```javascript
{
  pattern: /your_regex_pattern/gi,
  replacement: 'corrected text',
  message: 'Error explanation',
  type: 'grammar' // or 'spelling', 'style', etc.
}
```

## Website

The extension comes with a beautiful promotional website located in the `website/` folder. Open `website/index.html` in your browser to view:

- Feature showcase
- Benefits and use cases
- Installation instructions
- Live demo
- User testimonials

## Roadmap

- [x] ✅ Multiple language support (English + Filipino)
- [x] ✅ Auto language detection
- [x] ✅ Custom dictionary support
- [x] ✅ Dark mode theme
- [x] ✅ Writing goals and tracking
- [ ] AI-powered suggestions using language models
- [ ] More Filipino regional languages (Bisaya, Ilokano)
- [ ] Spanish language support
- [ ] Tone detection (formal, casual, friendly)
- [ ] Browser sync across devices
- [ ] Advanced grammar rules
- [ ] Performance optimizations
- [ ] Chrome Web Store publication

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the FAQ on the website
- Contact us through the extension popup

## Credits

Created with ❤️ for better writing everywhere.

---

**Note**: This is a demonstration project inspired by Grammarly. For commercial use, please ensure compliance with all relevant terms and licenses.

