// Filipino/Tagalog Grammar Rules for GrammarGuard

const filipinoRules = {
  // Common spelling mistakes
  spelling: [
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
  
  // Additional common mistakes
  commonMistakes: {
    'kase': 'kasi',
    'lng': 'lang',
    'po rin': 'rin po',
    'naman po': 'po naman',
    'ang mga mga': 'ang mga',
    'sa mga sa': 'sa mga',
    'ng ng': 'ng',
    'na na': 'na'
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

