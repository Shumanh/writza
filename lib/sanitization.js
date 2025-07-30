
// Input sanitization utilities using validator.js
import validator from "validator";

// Input sanitization functions using validator.js
export const sanitizeInput = {
  // Sanitize username: escape HTML, trim whitespace, replace spaces with underscores
  username: (username) => {
    if (!username || typeof username !== 'string') return '';
    return validator.escape(validator.trim(username)).replace(/\s+/g, "_");
  },
  
  // Sanitize email: normalize email format, escape HTML chars
  email: (email) => {
    if (!email || typeof email !== 'string') return '';
    const normalizedEmail = validator.normalizeEmail(email, {
      gmail_lowercase: true,
      gmail_remove_dots: false,
      outlookdotcom_lowercase: true,
      yahoo_lowercase: true,
      icloud_lowercase: true
    });
    return normalizedEmail || validator.escape(validator.trim(email.toLowerCase()));
  },
  
  // General text sanitizer: escape HTML, trim whitespace
  text: (text) => {
    if (!text || typeof text !== 'string') return '';
    return validator.escape(validator.trim(text));
  },
  
  // Sanitize names: escape HTML, trim, remove extra spaces
  name: (name) => {
    if (!name || typeof name !== 'string') return '';
    return validator.escape(validator.trim(name)).replace(/\s+/g, ' ');
  }
};