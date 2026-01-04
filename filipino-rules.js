// Filipino/Tagalog Grammar Rules for GrammarGuard

const filipinoRules = {
  // Common spelling mistakes
  spelling: [
    // Common misspelled Filipino words
    {
      pattern: /\bkahit\s+na\b/gi,
      replacement: 'kahit',
      message: 'Dapat "kahit" lang (isang salita)',
      explanation: 'Ang "kahit" ay isang salita lang, hindi "kahit na".',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\bpara\s+sa\b/gi,
      replacement: 'para sa',
      message: 'Tama na yan',
      explanation: 'Tamang spelling ng "para sa".',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bmga\s+tao\b/gi,
      replacement: 'mga tao',
      message: 'Tama na yan',
      explanation: 'Tamang spelling.',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bmeron\b/gi,
      replacement: 'mayroon',
      message: 'Dapat "mayroon" hindi "meron"',
      explanation: 'Ang tamang Filipino ay "mayroon", hindi "meron".',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\bdapat\s+lang\b/gi,
      replacement: 'dapat lang',
      message: 'Tama na yan',
      explanation: 'Tamang spelling.',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bkahit\s+saan\b/gi,
      replacement: 'kahit saan',
      message: 'Tama na yan',
      explanation: 'Tamang spelling ng "kahit saan".',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bmga\s+bagay\b/gi,
      replacement: 'mga bagay',
      message: 'Tama na yan',
      explanation: 'Tamang spelling.',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bsabi\s+nila\b/gi,
      replacement: 'sabi nila',
      message: 'Tama na yan',
      explanation: 'Tamang spelling.',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bkung\s+ano\b/gi,
      replacement: 'kung ano',
      message: 'Tama na yan',
      explanation: 'Tamang spelling ng "kung ano".',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bnasakin\b/gi,
      replacement: 'nasa akin',
      message: 'Dapat "nasa akin" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "nasa akin", hindi "nasakin".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bnasakanya\b/gi,
      replacement: 'nasa kanya',
      message: 'Dapat "nasa kanya" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "nasa kanya", hindi "nasakanya".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bnasakanila\b/gi,
      replacement: 'nasa kanila',
      message: 'Dapat "nasa kanila" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "nasa kanila", hindi "nasakanila".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bsaatin\b/gi,
      replacement: 'sa atin',
      message: 'Dapat "sa atin" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "sa atin", hindi "saatin".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bsakanya\b/gi,
      replacement: 'sa kanya',
      message: 'Dapat "sa kanya" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "sa kanya", hindi "sakanya".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bsakanila\b/gi,
      replacement: 'sa kanila',
      message: 'Dapat "sa kanila" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "sa kanila", hindi "sakanila".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bsaakin\b/gi,
      replacement: 'sa akin',
      message: 'Dapat "sa akin" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "sa akin", hindi "saakin".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bsaiyo\b/gi,
      replacement: 'sa iyo',
      message: 'Dapat "sa iyo" (dalawang salita)',
      explanation: 'Ang tamang pagbaybay ay "sa iyo", hindi "saiyo".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bpaano\s+ba\b/gi,
      replacement: 'paano ba',
      message: 'Tama na yan',
      explanation: 'Tamang spelling.',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bpwede\b/gi,
      replacement: 'puwede',
      message: 'Dapat "puwede" (may "u")',
      explanation: 'Ang tamang Filipino spelling ay "puwede", hindi "pwede".',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\bnung\b/gi,
      replacement: 'noong',
      message: 'Dapat "noong" hindi "nung"',
      explanation: 'Ang tamang Filipino ay "noong", hindi "nung".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bnangayari\b/gi,
      replacement: 'nangyari',
      message: 'Dapat "nangyari" hindi "nangayari"',
      explanation: 'Ang tamang spelling ay "nangyari".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bnangyayari\b/gi,
      replacement: 'nangyayari',
      message: 'Tama na yan',
      explanation: 'Tamang spelling ng "nangyayari".',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bpangyayari\b/gi,
      replacement: 'pangyayari',
      message: 'Tama na yan',
      explanation: 'Tamang spelling.',
      severity: 'none',
      category: 'spelling'
    },
    {
      pattern: /\bmasyado\b/gi,
      replacement: 'masyadong',
      message: 'Kulang ng "ng" - dapat "masyadong"',
      explanation: 'Dapat may "ng" sa dulo: "masyadong".',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\bnaman\s+po\b/gi,
      replacement: 'po naman',
      message: 'Dapat "po naman" ang ayos',
      explanation: 'Ang "po" ay dapat nauna sa "naman".',
      severity: 'minor',
      category: 'style'
    },
    {
      pattern: /\blng\b/gi,
      replacement: 'lang',
      message: 'Dapat "lang" hindi "lng"',
      explanation: 'Huwag gumamit ng shortcut sa formal writing.',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\bd2\b/gi,
      replacement: 'dito',
      message: 'Dapat "dito" hindi "d2"',
      explanation: 'Huwag gumamit ng text speak sa formal writing.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\byn\b/gi,
      replacement: 'iyan',
      message: 'Dapat "iyan" hindi "yn"',
      explanation: 'Huwag gumamit ng text speak sa formal writing.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bnag(\s+)ka(\w+)/gi,
      replacement: 'nagka$2',
      message: 'Walang puwang sa pagitan ng "nag" at "ka"',
      explanation: 'Ang unlaping "nagka-" ay dapat magkadikit.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bmga\s+mga\b/gi,
      replacement: 'mga',
      message: 'Hindi kailangan ng dalawang "mga"',
      explanation: 'Ang "mga" ay ginagamit lang nang isang beses para sa plural.',
      severity: 'critical',
      category: 'grammar'
    },
    {
      pattern: /\bng\s+ng\b/gi,
      replacement: 'ng',
      message: 'Hindi kailangan ng dalawang "ng"',
      explanation: 'Ang "ng" ay ginagamit lang nang isang beses.',
      severity: 'critical',
      category: 'grammar'
    },
    
    // Common Taglish corrections
    {
      pattern: /\bpero\s+pero\b/gi,
      replacement: 'pero',
      message: 'Hindi kailangan ng dalawang "pero"',
      explanation: 'Isang "pero" lang ang kailangan.',
      severity: 'medium',
      category: 'grammar'
    },
    {
      pattern: /\bkase\b/gi,
      replacement: 'kasi',
      message: 'Dapat "kasi" hindi "kase"',
      explanation: 'Ang tamang spelling ay "kasi".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bdapat\s+dapat\b/gi,
      replacement: 'dapat',
      message: 'Hindi kailangan ng dalawang "dapat"',
      explanation: 'Isang "dapat" lang ang kailangan.',
      severity: 'medium',
      category: 'grammar'
    },
    
    // Common misspellings
    {
      pattern: /\bgusto\s+ko\s+nang\b/gi,
      replacement: 'gusto ko ng',
      message: 'Dapat "ng" hindi "nang"',
      explanation: 'Gumamit ng "ng" para sa possession/need. "Nang" para sa manner/time.',
      severity: 'critical',
      category: 'grammar'
    },
    {
      pattern: /\bnang\s+maaga\b/gi,
      replacement: 'ng maaga',
      message: 'Dapat "ng" hindi "nang"',
      explanation: 'Gumamit ng "ng" bago ang adjective.',
      severity: 'critical',
      category: 'grammar'
    },
    {
      pattern: /\bpinaka\s+(\w+)/gi,
      replacement: 'pinaka$1',
      message: 'Walang puwang pagkatapos ng "pinaka"',
      explanation: 'Ang "pinaka-" ay unlapi na dumikit sa salita.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bpag\s+(\w+ing)\b/gi,
      replacement: 'pag$1',
      message: 'Walang puwang pagkatapos ng "pag"',
      explanation: 'Ang unlaping "pag-" ay dapat magkadikit sa salitang-ugat.',
      severity: 'critical',
      category: 'spelling'
    },
    
    // Ng vs Nang rules
    {
      pattern: /\bnang\s+(ako|ikaw|siya|kami|kayo|sila|ko|mo|niya|namin|natin|ninyo|nila)\b/gi,
      replacement: 'ng $1',
      message: 'Dapat "ng" bago ang pronoun',
      explanation: 'Gumamit ng "ng" bago ang mga panghalip.',
      severity: 'critical',
      category: 'grammar'
    },
    {
      pattern: /\bng\s+(mabilis|mabuti|maganda|masama|malaki|maliit|mahaba|maikli)\b/gi,
      replacement: 'nang $1',
      message: 'Dapat "nang" bago ang pang-uri (adjective)',
      explanation: 'Gumamit ng "nang" kung naglalarawan ng paraan.',
      severity: 'critical',
      category: 'grammar'
    },
    
    // Din vs Rin rules
    {
      pattern: /\b(d|t|s)\s+rin\b/gi,
      replacement: '$1 din',
      message: 'Dapat "din" pagkatapos ng d, t, o s',
      explanation: 'Gumamit ng "din" pagkatapos ng katinig na d, t, o s.',
      severity: 'medium',
      category: 'grammar'
    },
    {
      pattern: /\b(a|e|i|o|u|w|y|n)\s+din\b/gi,
      replacement: '$1 rin',
      message: 'Dapat "rin" pagkatapos ng patinig',
      explanation: 'Gumamit ng "rin" pagkatapos ng patinig (vowel).',
      severity: 'medium',
      category: 'grammar'
    },
    
    // Daw vs Raw rules
    {
      pattern: /\b(d|t|s)\s+raw\b/gi,
      replacement: '$1 daw',
      message: 'Dapat "daw" pagkatapos ng d, t, o s',
      explanation: 'Gumamit ng "daw" pagkatapos ng katinig na d, t, o s.',
      severity: 'medium',
      category: 'grammar'
    },
    {
      pattern: /\b(a|e|i|o|u|w|y|n)\s+daw\b/gi,
      replacement: '$1 raw',
      message: 'Dapat "raw" pagkatapos ng patinig',
      explanation: 'Gumamit ng "raw" pagkatapos ng patinig (vowel).',
      severity: 'medium',
      category: 'grammar'
    },
    
    // May vs Mayroon
    {
      pattern: /\bmayroon\s+ako\b/gi,
      replacement: 'may ako',
      message: 'Dapat "may" bago ang pronoun',
      explanation: 'Gumamit ng "may" + pronoun, o "mayroon" + predicate.',
      severity: 'medium',
      category: 'grammar'
    },
    
    // Common Taglish words to correct
    {
      pattern: /\bpag(\s+)dating\b/gi,
      replacement: 'pagdating',
      message: 'Walang puwang: "pagdating"',
      explanation: 'Ang "pag-" ay unlapi na dumikit sa salita.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bpaki(\s+)usap\b/gi,
      replacement: 'pakiusap',
      message: 'Walang puwang: "pakiusap"',
      explanation: 'Ang "paki-" ay unlapi na dumikit sa salita.',
      severity: 'critical',
      category: 'spelling'
    },
    
    // Capitalization
    {
      pattern: /(^|[.!?]\s+)([a-z])/g,
      replacement: (match, p1, p2) => p1 + p2.toUpperCase(),
      message: 'Dapat malaking letra sa simula ng pangungusap',
      explanation: 'Dapat nagsisimula ang pangungusap sa malaking letra.',
      severity: 'medium',
      category: 'capitalization'
    },
    
    // Spacing
    {
      pattern: /\s{2,}/g,
      replacement: ' ',
      message: 'Sobrang puwang',
      explanation: 'Isang puwang lang dapat sa pagitan ng mga salita.',
      severity: 'minor',
      category: 'spacing'
    },
    {
      pattern: /([.!?,])([A-Za-z])/g,
      replacement: '$1 $2',
      message: 'Kailangan ng puwang pagkatapos ng bantas',
      explanation: 'Dapat may puwang pagkatapos ng punctuation.',
      severity: 'medium',
      category: 'spacing'
    },
    
    // Common verb conjugation errors
    {
      pattern: /\bmag(\s+)(\w+)/gi,
      test: (match) => {
        // Only flag if it looks like it should be connected
        const parts = match.split(/\s+/);
        return parts.length > 1 && parts[1].length > 3;
      },
      replacement: 'mag$2',
      message: 'Walang puwang pagkatapos ng "mag"',
      explanation: 'Ang unlaping "mag-" ay dapat magkadikit sa salitang-ugat.',
      severity: 'critical',
      category: 'spelling'
    },
    
    // Po vs Opo
    {
      pattern: /\b(oo)\s+(po)\b/gi,
      replacement: 'opo',
      message: 'Dapat "opo" hindi "oo po"',
      explanation: 'Ang "opo" ay isang salita.',
      severity: 'minor',
      category: 'style'
    },
    
    // Hindi vs Wala
    {
      pattern: /\bhindi\s+mayroon\b/gi,
      replacement: 'wala',
      message: 'Dapat "wala" hindi "hindi mayroon"',
      explanation: 'Mas natural ang "wala" para sa negation ng existence.',
      severity: 'minor',
      category: 'style'
    },
    
    // Common prefix errors
    {
      pattern: /\bpag\s+ka\s+(\w+)/gi,
      replacement: 'pagka$1',
      message: 'Dapat "pagka" + salita',
      explanation: 'Ang "pagka-" ay unlapi na dumikit sa salita.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bka(\s+)(\w+)an\b/gi,
      replacement: 'ka$2an',
      message: 'Walang puwang sa "ka-...-an"',
      explanation: 'Ang "ka-" at "-an" ay dapat magkadikit sa salitang-ugat.',
      severity: 'critical',
      category: 'spelling'
    },
    
    // Specific Filipino word misspellings
    {
      pattern: /\bkailagan\b/gi,
      replacement: 'kailangan',
      message: 'Dapat "kailangan" (may "n")',
      explanation: 'Ang tamang spelling ay "kailangan", hindi "kailagan".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bkahpon\b/gi,
      replacement: 'kahapon',
      message: 'Dapat "kahapon" (may "a")',
      explanation: 'Ang tamang spelling ay "kahapon", hindi "kahpon".',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bbuks\b/gi,
      replacement: 'bukas',
      message: 'Dapat "bukas" hindi "buks"',
      explanation: 'Huwag gumamit ng shortcut sa formal writing.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bhapi\b/gi,
      replacement: 'happy',
      message: 'Dapat "happy" (English spelling)',
      explanation: 'Gumamit ng tamang English spelling.',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\bpra\b/gi,
      replacement: 'para',
      message: 'Dapat "para" hindi "pra"',
      explanation: 'Huwag gumamit ng shortcut.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bmga\s+tao\s+na\s+mga\b/gi,
      replacement: 'mga taong',
      message: 'Dapat "mga taong" para sa linking',
      explanation: 'Gumamit ng linker "-ng" sa halip na "na mga".',
      severity: 'medium',
      category: 'grammar'
    },
    {
      pattern: /\bsna\b/gi,
      replacement: 'sana',
      message: 'Dapat "sana" hindi "sna"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bbka\b/gi,
      replacement: 'baka',
      message: 'Dapat "baka" hindi "bka"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bun\b/gi,
      test: (match, fullText) => {
        // Only flag if it seems like it should be "iyon"
        const before = fullText.substring(0, fullText.indexOf(match));
        return /\s(ay|ang|yung)\s*$/i.test(before);
      },
      replacement: 'iyon',
      message: 'Dapat "iyon" hindi "un"',
      explanation: 'Huwag gumamit ng text speak sa formal writing.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bwla\b/gi,
      replacement: 'wala',
      message: 'Dapat "wala" hindi "wla"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bhndi\b/gi,
      replacement: 'hindi',
      message: 'Dapat "hindi" hindi "hndi"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bksama\b/gi,
      replacement: 'kasama',
      message: 'Dapat "kasama" hindi "ksama"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bgsto\b/gi,
      replacement: 'gusto',
      message: 'Dapat "gusto" hindi "gsto"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bdpt\b/gi,
      replacement: 'dapat',
      message: 'Dapat "dapat" hindi "dpt"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bkht\b/gi,
      replacement: 'kahit',
      message: 'Dapat "kahit" hindi "kht"',
      explanation: 'Huwag gumamit ng text speak.',
      severity: 'critical',
      category: 'spelling'
    },
    {
      pattern: /\bganda\b/gi,
      replacement: 'maganda',
      message: 'Kulang ang prefix - dapat "maganda"',
      explanation: 'Ang tamang salita ay "maganda", hindi "ganda" (unless possessive).',
      severity: 'medium',
      category: 'spelling'
    },
    {
      pattern: /\baking\s+bahay\b/gi,
      replacement: 'aking bahay',
      message: 'Tama na yan',
      explanation: 'Tamang Filipino.',
      severity: 'none',
      category: 'spelling'
    },
    
    // Double punctuation
    {
      pattern: /([!?]){2,}/g,
      replacement: '$1',
      message: 'Sobrang bantas',
      explanation: 'Isang bantas lang ang kailangan.',
      severity: 'minor',
      category: 'punctuation'
    },
    
    // Common colloquial to formal
    {
      pattern: /\bd ko\b/gi,
      replacement: 'ako',
      message: 'Dapat "ako" sa pormal na pagsulat',
      explanation: 'Gumamit ng "ako" sa halip na "d ko" sa pormal na pagsusulat.',
      severity: 'minor',
      category: 'style'
    },
    {
      pattern: /\bpag\s+asa\b/gi,
      replacement: 'pag-asa',
      message: 'Dapat may gitling: "pag-asa"',
      explanation: 'Ang salitang "pag-asa" ay may gitling.',
      severity: 'critical',
      category: 'spelling'
    }
  ],
  
  // Additional common spelling mistakes (for reference)
  commonMistakes: {
    // Text speak to proper Filipino
    'kase': 'kasi',
    'lng': 'lang',
    'nung': 'noong',
    'lng': 'lang',
    'd2': 'dito',
    'yn': 'iyan',
    'dn': 'din',
    'un': 'iyon',
    'sna': 'sana',
    'bka': 'baka',
    'kng': 'kung',
    'khit': 'kahit',
    'wla': 'wala',
    'hndi': 'hindi',
    'mga2': 'mga',
    'dto': 'dito',
    'dun': 'doon',
    'gsto': 'gusto',
    'ksama': 'kasama',
    
    // Improper word combinations
    'nasakin': 'nasa akin',
    'nasakanya': 'nasa kanya',
    'nasakanila': 'nasa kanila',
    'saakin': 'sa akin',
    'saiyo': 'sa iyo',
    'sakanya': 'sa kanya',
    'sakanila': 'sa kanila',
    'saatin': 'sa atin',
    'samin': 'sa amin',
    'sainyo': 'sa inyo',
    
    // Common misspellings
    'meron': 'mayroon',
    'pwede': 'puwede',
    'kailagan': 'kailangan',
    'kailan': 'kailan', // correct
    'paano': 'paano', // correct
    'bakit': 'bakit', // correct
    
    // Redundancies
    'po rin': 'rin po',
    'naman po': 'po naman',
    'ang mga mga': 'ang mga',
    'sa mga sa': 'sa mga',
    'ng ng': 'ng',
    'na na': 'na',
    'mga mga': 'mga',
    
    // Prefix spacing issues
    'nag ka': 'nagka',
    'pinaka ': 'pinaka',
    'pag ': 'pag',
    'mag ': 'mag',
    'ka ': 'ka',
    'pag ka': 'pagka'
  },
  
  // Language-specific messages
  messages: {
    noErrors: 'Walang error na natagpuan',
    errorsFound: 'May {count} error na natagpuan',
    applying: 'Inilalapat...',
    applied: 'Nailapat na',
    ignore: 'Huwag pansinin',
    addToDictionary: 'Idagdag sa diksyunaryo',
    checkingText: 'Sinusuri ang teksto...',
    readabilityScore: 'Puntos ng Readability',
    criticalError: 'Malubhang error',
    mediumError: 'Katamtamang error',
    minorError: 'Maliit na error'
  }
};

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = filipinoRules;
}

