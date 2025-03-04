const i18n = require('i18n'); // Import the i18n library

// Initialize i18n configuration
i18n.configure({
  locales: ['en', 'ur', 'roman_ur'], 
  directory: __dirname + '/../locales',
  defaultLocale: 'en',
  cookie: 'locale', 
  queryParameter: 'lang', 
  autoReload: true, 
  syncFiles: true, 
});

// Middleware function to detect the language
const detectLanguage = (req, res, next) => {
  // Check for a language in the query parameter (e.g., ?lang=en)
  const lang = req.query.lang || req.cookies.locale || req.headers['accept-language']?.split(',')[0] || 'en';
  
  // Set the language for i18n
  i18n.setLocale(lang);
  
  // Proceed to the next middleware or route handler
  next();
};

module.exports = detectLanguage;
