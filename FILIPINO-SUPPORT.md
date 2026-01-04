# 🇵🇭 Filipino Language Support

GrammarGuard v2.1 now includes comprehensive support for **Filipino (Tagalog)** language checking!

## Features

### Bilingual Grammar & Spell Checking
- ✅ **English** - Complete grammar, spelling, and style checking
- ✅ **Filipino (Tagalog)** - Comprehensive Filipino grammar rules
- ✅ **Auto-Detection** - Automatically detects which language you're writing in
- ✅ **Mixed Language** - Supports Taglish (mixed English and Filipino)

### Filipino-Specific Rules

#### 1. **Ng vs Nang**
The extension correctly identifies when to use "ng" vs "nang":
- ✅ `gusto ko ng` (possession/need) 
- ❌ `gusto ko nang` 
- ✅ `nang mabilis` (manner/adverb)
- ❌ `ng mabilis`

#### 2. **Din vs Rin / Daw vs Raw**
Automatic detection of proper usage based on preceding sound:
- ✅ `ako rin` (after vowel)
- ❌ `ako din`
- ✅ `siya din` (after d, t, s)
- ❌ `siya rin`

#### 3. **Prefix Spacing**
Detects when prefixes should be attached to root words:
- ✅ `nagkaroon` (nag + ka + roon)
- ❌ `nag ka roon`
- ✅ `pinakamabuti` (pinaka + mabuti)
- ❌ `pinaka mabuti`
- ✅ `pagdating` (pag + dating)
- ❌ `pag dating`

#### 4. **Redundant Words**
Catches common redundancies:
- ✅ `mga estudyante`
- ❌ `mga mga estudyante`
- ✅ `ng bansa`
- ❌ `ng ng bansa`

#### 5. **Common Misspellings**
- ✅ `kasi` 
- ❌ `kase`
- ✅ `pag-asa` (with hyphen)
- ❌ `pag asa`

#### 6. **May vs Mayroon**
Proper usage with pronouns:
- ✅ `may ako`
- ❌ `mayroon ako`
- ✅ `mayroon akong libro` (with predicate)

#### 7. **Style Improvements**
- Suggests `wala` instead of `hindi mayroon`
- Capitalizes first letter of sentences
- Removes extra spacing

## How to Use

### 1. Settings Page
1. Click the GrammarGuard icon in your browser
2. Go to "Options" or "Settings"
3. Under "Language / Wika", select:
   - **🇺🇸 English** - Check only English
   - **🇵🇭 Filipino (Tagalog)** - Check only Filipino
   - **🌐 Auto-Detect** - Automatically detect language
   - **🌍 Both** - Check both languages simultaneously

### 2. Auto-Detection
When set to "Auto-Detect", GrammarGuard will:
- Analyze your text for language markers
- Automatically apply the appropriate grammar rules
- Switch seamlessly between English and Filipino

### 3. Writing in Taglish
GrammarGuard supports mixed-language writing (Taglish):
- Use the "Both" setting to check both languages
- Common in informal communication, social media, and messaging

## Examples

### Before GrammarGuard
```
Ang mga mga estudyante ay nag ka roon ng magandang resulta. Gusto ko nang 
magpunta sa palengke kase kailangan ko rin ng mga pamili. Pag dating namin 
doon, bibili kami ng mga prutas.
```

### After GrammarGuard
```
Ang mga estudyante ay nagkaroon ng magandang resulta. Gusto ko ng 
magpunta sa palengke kasi kailangan ko din ng mga pamili. Pagdating namin 
doon, bibili kami ng mga prutas.
```

## Error Messages

All error messages are displayed in **Filipino** when checking Filipino text:
- **Malubhang error** - Critical error (must fix)
- **Katamtamang error** - Medium error (should fix)
- **Maliit na error** - Minor error (optional)

Error messages are contextual and explain the rule:
```
❌ mga mga
✅ mga
💡 Hindi kailangan ng dalawang "mga"
📚 Ang "mga" ay ginagamit lang nang isang beses para sa plural.
```

## Supported Platforms

Filipino checking works everywhere GrammarGuard works:
- ✅ Facebook
- ✅ Twitter/X
- ✅ Gmail
- ✅ Google Docs
- ✅ Slack
- ✅ WhatsApp Web
- ✅ Messenger
- ✅ LinkedIn
- ✅ Reddit
- ✅ Any website with text input!

## Website Demo

Try the interactive demo on our website:
1. Go to https://grammarguard.vercel.app
2. Scroll to the "Try It Live!" section
3. Select **🇵🇭 Filipino (Tagalog)** from the dropdown
4. Click "Load Sample Text" to see Filipino error detection in action
5. Or type your own Filipino text!

## Grammar Rules Covered

GrammarGuard checks for **35+ Filipino grammar rules** including:

### Morphology
- Affixes (unlapi, gitlapi, hulapi, kabilaan)
- Prefix attachment (mag-, pag-, ka-, -in, -an)
- Reduplication

### Syntax
- Word order
- Linkers (na, -ng)
- Markers (ang, ng, sa)

### Orthography
- Proper use of "ng" vs "nang"
- "din" vs "rin", "daw" vs "raw"
- Hyphenation (pag-asa, etc.)
- Capitalization

### Style
- Redundancy removal
- Formality suggestions
- Natural phrasing

## Technical Details

### Language Detection Algorithm
GrammarGuard uses a **marker-based detection system**:
1. Scans text for Filipino markers (ang, ng, mga, ko, mo, etc.)
2. Scans text for English markers (the, is, are, etc.)
3. Calculates language scores
4. Determines primary language or mixed-language status

### Performance
- **Instant detection** - No server calls, all local
- **Zero latency** - Same speed as English checking
- **Privacy-first** - Text never leaves your device

### File Structure
```
filipino-rules.js      - 35+ Filipino grammar rules
language-detector.js   - Automatic language detection
content-enhanced.js    - Integrated multi-language support
options.html           - Language settings UI
```

## Future Improvements

We're continuously improving Filipino support. Planned features:
- [ ] More regional variations (Bisaya, Ilokano)
- [ ] Advanced style suggestions
- [ ] Tone detection (formal vs casual)
- [ ] More idiomatic expressions
- [ ] Grammar explanations in Filipino
- [ ] Bisaya/Cebuano support
- [ ] Ilokano support

## Feedback

We want to make GrammarGuard the best Filipino grammar checker!

**Help us improve:**
- Report false positives/negatives
- Suggest additional rules
- Share your experience

**Contact:**
- GitHub Issues: https://github.com/draphael123/grammarhelper/issues
- Add label: `filipino-language`

## Credits

Developed with input from native Filipino speakers and language experts. Special thanks to the Filipino developer community!

---

**Salamat sa paggamit ng GrammarGuard!** 🇵🇭

*Thank you for using GrammarGuard!*

