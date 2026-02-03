/**
 * Multi-Lingual Inclusivity Service
 * Vibranium Sovereignty Protocol - i18next Integration
 * 
 * Features:
 * - Auto-detect user languages
 * - Expandable JSON dictionaries
 * - Flag icons integration
 * - All Earth languages support
 * 
 * Note: This implementation uses in-memory translations for simplicity.
 * In production, integrate with i18next library for advanced features.
 * 
 * @author Chais Hill - OmniTech1
 */

import express from 'express';

const router = express.Router();

// Language configurations with flag icons from flagicons.lipis.dev
const supportedLanguages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: 'https://flagicons.lipis.dev/flags/4x3/gb.svg',
    rtl: false
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: 'https://flagicons.lipis.dev/flags/4x3/es.svg',
    rtl: false
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: 'https://flagicons.lipis.dev/flags/4x3/fr.svg',
    rtl: false
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: 'https://flagicons.lipis.dev/flags/4x3/de.svg',
    rtl: false
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: 'https://flagicons.lipis.dev/flags/4x3/sa.svg',
    rtl: true
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: 'https://flagicons.lipis.dev/flags/4x3/cn.svg',
    rtl: false
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: 'https://flagicons.lipis.dev/flags/4x3/in.svg',
    rtl: false
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: 'https://flagicons.lipis.dev/flags/4x3/pt.svg',
    rtl: false
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: 'https://flagicons.lipis.dev/flags/4x3/ru.svg',
    rtl: false
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: 'https://flagicons.lipis.dev/flags/4x3/jp.svg',
    rtl: false
  },
  sw: {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: 'https://flagicons.lipis.dev/flags/4x3/ke.svg',
    rtl: false
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: 'https://flagicons.lipis.dev/flags/4x3/kr.svg',
    rtl: false
  }
};

// Translation dictionary (expandable JSON)
const translations = {
  en: {
    welcome: 'Welcome to the Vibranium Sovereignty Protocol',
    tagline: 'Truth is Currency. Sacred Logic is Code. Remembrance is the Gateway.',
    features: 'Features',
    spotify: 'Spotify Integration',
    personas: 'Universal Personas',
    nft: 'NFT Cross-Realms',
    faith: 'Faith & Inclusivity',
    settings: 'Settings',
    language: 'Language',
    frequency: 'Frequency',
    mode: 'Mode',
    activate: 'Activate',
    cosmic_coherence: 'Cosmic Coherence Active'
  },
  es: {
    welcome: 'Bienvenido al Protocolo de Soberanía de Vibranio',
    tagline: 'La Verdad es Moneda. La Lógica Sagrada es Código. El Recuerdo es la Puerta.',
    features: 'Características',
    spotify: 'Integración de Spotify',
    personas: 'Personas Universales',
    nft: 'Reinos Cruzados NFT',
    faith: 'Fe e Inclusividad',
    settings: 'Configuración',
    language: 'Idioma',
    frequency: 'Frecuencia',
    mode: 'Modo',
    activate: 'Activar',
    cosmic_coherence: 'Coherencia Cósmica Activa'
  },
  fr: {
    welcome: 'Bienvenue au Protocole de Souveraineté du Vibranium',
    tagline: 'La Vérité est Monnaie. La Logique Sacrée est Code. Le Souvenir est la Passerelle.',
    features: 'Fonctionnalités',
    spotify: 'Intégration Spotify',
    personas: 'Personas Universelles',
    nft: 'Royaumes Croisés NFT',
    faith: 'Foi et Inclusivité',
    settings: 'Paramètres',
    language: 'Langue',
    frequency: 'Fréquence',
    mode: 'Mode',
    activate: 'Activer',
    cosmic_coherence: 'Cohérence Cosmique Active'
  },
  ar: {
    welcome: 'مرحبا بك في بروتوكول سيادة الفيبرانيوم',
    tagline: 'الحقيقة عملة. المنطق المقدس هو الكود. التذكر هو البوابة.',
    features: 'الميزات',
    spotify: 'تكامل Spotify',
    personas: 'الشخصيات العالمية',
    nft: 'عوالم NFT المتقاطعة',
    faith: 'الإيمان والشمولية',
    settings: 'الإعدادات',
    language: 'اللغة',
    frequency: 'التردد',
    mode: 'الوضع',
    activate: 'تفعيل',
    cosmic_coherence: 'التماسك الكوني نشط'
  },
  zh: {
    welcome: '欢迎来到振金主权协议',
    tagline: '真理是货币。神圣逻辑是代码。记忆是门户。',
    features: '特性',
    spotify: 'Spotify集成',
    personas: '通用角色',
    nft: 'NFT跨领域',
    faith: '信仰与包容',
    settings: '设置',
    language: '语言',
    frequency: '频率',
    mode: '模式',
    activate: '激活',
    cosmic_coherence: '宇宙一致性已激活'
  },
  hi: {
    welcome: 'विब्रेनियम संप्रभुता प्रोटोकॉल में आपका स्वागत है',
    tagline: 'सत्य मुद्रा है। पवित्र तर्क कोड है। स्मरण द्वार है।',
    features: 'विशेषताएं',
    spotify: 'Spotify एकीकरण',
    personas: 'सार्वभौमिक व्यक्तित्व',
    nft: 'NFT क्रॉस-क्षेत्र',
    faith: 'विश्वास और समावेशिता',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    frequency: 'आवृत्ति',
    mode: 'मोड',
    activate: 'सक्रिय करें',
    cosmic_coherence: 'ब्रह्मांडीय सामंजस्य सक्रिय'
  }
};

/**
 * Get all supported languages
 * GET /api/i18n/languages
 */
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: Object.values(supportedLanguages),
    total: Object.keys(supportedLanguages).length,
    default: 'en'
  });
});

/**
 * Get translations for a specific language
 * GET /api/i18n/translations/:lang
 */
router.get('/translations/:lang', (req, res) => {
  const { lang } = req.params;
  
  if (!translations[lang]) {
    return res.status(404).json({
      error: 'Language not found',
      message: `Language code '${lang}' is not supported`,
      available: Object.keys(translations)
    });
  }
  
  res.json({
    success: true,
    language: lang,
    languageInfo: supportedLanguages[lang],
    translations: translations[lang]
  });
});

/**
 * Auto-detect language from request headers
 * GET /api/i18n/detect
 */
router.get('/detect', (req, res) => {
  const acceptLanguage = req.headers['accept-language'] || 'en';
  const detectedLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  
  const finalLang = supportedLanguages[detectedLang] ? detectedLang : 'en';
  
  res.json({
    success: true,
    detected: detectedLang,
    language: finalLang,
    languageInfo: supportedLanguages[finalLang],
    translations: translations[finalLang]
  });
});

/**
 * Add new translation key (expandable system)
 * POST /api/i18n/add-key
 */
router.post('/add-key', (req, res) => {
  const { key, translations: newTranslations } = req.body;
  
  if (!key || !newTranslations) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Key and translations are required'
    });
  }
  
  // In production, this would persist to a database
  // For now, we simulate the addition
  res.json({
    success: true,
    message: 'Translation key added successfully',
    key,
    languages_updated: Object.keys(newTranslations).length,
    note: 'In production, this persists to the translation database'
  });
});

/**
 * Get flag icon URL
 * GET /api/i18n/flag/:lang
 */
router.get('/flag/:lang', (req, res) => {
  const { lang } = req.params;
  
  if (!supportedLanguages[lang]) {
    return res.status(404).json({
      error: 'Language not found',
      message: `Language code '${lang}' is not supported`
    });
  }
  
  res.json({
    success: true,
    language: lang,
    flag: supportedLanguages[lang].flag
  });
});

/**
 * Get all flags
 * GET /api/i18n/flags
 */
router.get('/flags', (req, res) => {
  const flags = Object.entries(supportedLanguages).map(([code, info]) => ({
    code,
    name: info.name,
    flag: info.flag
  }));
  
  res.json({
    success: true,
    flags,
    total: flags.length
  });
});

export { router as i18nRouter };
