# Changelog

All notable changes to GrammarGuard will be documented in this file.

## [2.1.0] - 2026-01-03

### 🇵🇭 Filipino Language Support - Major Feature!

#### Added
- **Full Filipino/Tagalog Language Support**: Comprehensive grammar and spelling checking for Filipino
  - **70+ Filipino-specific rules** (40+ spelling, 30+ grammar)
  - **40+ Spelling error patterns** including text speak, common misspellings, and word combinations
  - Automatic language detection (English, Filipino, or mixed)
  - Bilingual mode for Taglish (mixed English-Filipino)
  - Filipino error messages and explanations
  
- **Filipino Spelling Rules** (40+ patterns):
  - **Text Speak Detection** - kase → kasi, nung → noong, sna → sana, bka → baka, wla → wala, hndi → hindi, lng → lang, d2 → dito, yn → iyan, un → iyon, and 20+ more
  - **Common Misspellings** - pwede → puwede, meron → mayroon, kailagan → kailangan, kahpon → kahapon
  - **Word Combinations** - saakin → sa akin, sakanya → sa kanya, nasakin → nasa akin, and 10+ more patterns
  - **Prefix/Suffix Spacing** - nag ka → nagka, pag asa → pag-asa, may roon → mayroon
  
- **Filipino Grammar Rules** (30+ patterns):
  - **Ng vs Nang** - Proper usage detection and correction
  - **Din vs Rin / Daw vs Raw** - Phonetic-based suggestions
  - **Prefix Spacing** - Detects improper spacing in affixes (nag-, pag-, pinaka-, ka-...-an)
  - **Redundancy Detection** - Catches repeated words (mga mga → mga, ng ng → ng)
  - **May vs Mayroon** - Context-aware pronoun usage
  - **Hyphenation** - Proper use of hyphens (pag-asa)
  - **Capitalization** - First letter of sentences
  - **Spacing** - Extra space removal
  
- **Language Detection**:
  - Automatic language detection based on text markers
  - Manual language selection in settings (English, Filipino, Both, Auto)
  - Mixed-language (Taglish) support
  - Real-time language switching
  
- **Website Updates**:
  - New language feature card highlighting bilingual support
  - Language selector in interactive demo (🇺🇸 English / 🇵🇭 Filipino)
  - Filipino sample text for testing
  - Separate rule sets for each language
  
- **Documentation**:
  - **FILIPINO-SUPPORT.md** - Comprehensive Filipino feature guide
  - Updated README.md with bilingual support information
  - Filipino grammar rules documentation
  - Usage examples and comparisons

#### Technical Details
- **New Files**:
  - `filipino-rules.js` - 35+ Filipino grammar patterns
  - `language-detector.js` - Marker-based language detection
  - `FILIPINO-SUPPORT.md` - Complete documentation
  
- **Modified Files**:
  - `content-enhanced.js` - Multi-language rule selection
  - `manifest.json` - Added new script files
  - `options.html/js` - Language selection UI
  - `background.js` - Language preference storage
  - `website/index.html` - Language feature showcase
  - `website/script.js` - Demo language switching
  - `website/new-sections.css` - Language selector styling
  
- **Language Detection Algorithm**:
  - Scans for Filipino markers (ang, ng, mga, ko, mo, niya, etc.)
  - Scans for English markers (the, is, are, was, were, etc.)
  - Calculates language scores
  - Returns dominant language or "both" for mixed text

#### Performance
- Zero latency - Same speed as English checking
- No server calls - All processing local
- Privacy-first - Text never leaves device

#### Supported Platforms
Filipino checking works everywhere:
- Facebook, Twitter/X, Instagram
- Gmail, Outlook, Yahoo Mail
- Google Docs, Microsoft 365
- Slack, Discord, WhatsApp Web
- LinkedIn, Reddit
- Any website with text input!

### 📚 Resources
- Full documentation: `FILIPINO-SUPPORT.md`
- Try it live: https://grammarguard.vercel.app (select 🇵🇭 Filipino in demo)
- GitHub: https://github.com/draphael123/grammarhelper

---

## [1.1.0] - 2026-01-03

### 🎉 Major Website Overhaul

#### Added
- **FAQ Section**: Comprehensive frequently asked questions
- **Interactive Live Demo**: Try grammar checking directly on the website
- **Use Cases Section**: Tailored examples for students, professionals, content creators, and non-native speakers
- **Before/After Showcase**: Real-world examples of text improvements
- **Comparison Table**: Feature comparison with Grammarly and other tools
- **How It Works Section**: Technical details about local processing
- **Changelog/Roadmap**: Version history and future plans
- **Social Proof Section**: Statistics, GitHub stars badge, browser compatibility badges
- **SEO Optimization**: Complete meta tags for Google, Facebook, and Twitter
- **Favicon**: Custom SVG favicon with gradient design
- **Vibrant Color Scheme**: Enhanced UI with gradients and animations throughout

### 🚀 Extension Enhancements

#### Added
- **Yellow Highlighting**: Errors now have yellow background for better visibility
- **Extended Site Support**: Improved compatibility with:
  - Slack (Quill editor and new Slate editor)
  - Gmail (compose and reply boxes)
  - Google Docs
  - Any site with contenteditable elements
  - Role-based textbox detection
- **30+ New Grammar Rules**: Including:
  - "should of" → "should have"
  - "could of" → "could have"
  - "would of" → "would have"
  - "your" vs "you're" detection
  - "to" vs "too" detection
  - "than" vs "then" detection
  - "affect" vs "effect" context-based detection
- **25+ New Spelling Rules**: Common misspellings like:
  - weird, believe, achieve, necessary
  - occurred, beginning, until, writing
  - truly, grateful, argument, environment
  - recommend, accommodate, embarrass, publicly
  - conscious, and more
- **Error Count Badge**: Visual indicator showing number of errors found
- **Errors List View**: Click badge to see all errors with one-click fixes
- **Improved Error Detection**: Better pattern matching and context awareness
- **Enhanced Visual Feedback**: Pulsing badge animation, better tooltips

### 🎨 UI/UX Improvements
- **Gradient Backgrounds**: Multiple colorful gradient sections
- **Hover Animations**: Enhanced card and button interactions
- **Floating Download Button**: Sticky download button after scrolling
- **Download Notifications**: Toast notifications when download starts
- **Smooth Scrolling**: Enhanced navigation experience
- **GitHub Stars Integration**: Live star count from repository
- **Number Animations**: Animated statistics counters
- **FAQ Accordion**: Expandable/collapsible answers
- **Responsive Design**: Optimized for mobile and tablet
- **Accessibility**: Improved keyboard navigation and screen reader support

### 🔧 Technical Improvements
- **Better Regex Patterns**: More accurate error detection
- **Context-Aware Rules**: Some rules check surrounding text
- **Duplicate Prevention**: Filters out overlapping errors
- **Performance**: Optimized checking algorithms
- **Debounced Input**: Reduced CPU usage during typing
- **Local Storage**: Better settings persistence

### 📚 Documentation
- **WEBSITE-UPDATES.md**: Detailed documentation of all changes
- **CHANGELOG.md**: This file
- **Updated README.md**: Live URLs and new features
- **Enhanced Installation Guide**: More detailed instructions

## [1.0.0] - 2026-01-03

### Initial Release

#### Features
- Real-time grammar checking
- Spelling error detection
- Style suggestions
- Works on all websites
- Privacy-first (local processing)
- Visual error highlighting
- One-click corrections
- Statistics tracking
- Extension popup UI
- Promotional website
- GitHub repository
- Vercel deployment

#### Supported Error Types
- Spelling errors
- Grammar mistakes
- Capitalization issues
- Spacing problems
- Punctuation errors

#### Platform Support
- Google Chrome (v88+)
- Microsoft Edge
- Brave Browser
- Opera
- All Chromium-based browsers

---

## Upcoming in v1.2

### Planned Features
- Custom dictionary support
- Dark mode theme
- Keyboard shortcuts (Ctrl+Shift+G to toggle)
- Export/import settings
- Writing goals and analytics
- Tone detection (formal/casual)
- Multiple language support (Spanish, French, German)
- Performance improvements
- Chrome Web Store publication

---

## Contributing

We welcome contributions! See our [GitHub repository](https://github.com/draphael123/grammarhelper) for:
- Bug reports
- Feature requests
- Code contributions
- Documentation improvements

---

**Website**: https://grammarguard.vercel.app  
**Repository**: https://github.com/draphael123/grammarhelper  
**Version**: 2.1.0  
**Last Updated**: January 3, 2026

