/**
 * Utility functions for API key validation
 */

// List of invalid placeholder values for API keys
const INVALID_PLACEHOLDERS = [
  'your_openai_api_key_here',
  'PASTE_YOUR_OPENAI_API_KEY_HERE',
  'your_huggingface_api_key_here',
  'your_stripe_secret_key_here',
  'your_stripe_webhook_secret_here',
  'your_xai_api_key_here'
];

/**
 * Check if a value is a valid API key (not a placeholder)
 * @param {string} value - The value to check
 * @returns {boolean} - True if valid, false if placeholder or empty
 */
function isValidApiKey(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  const trimmedValue = value.trim();
  
  // Check if it's empty
  if (trimmedValue.length === 0) {
    return false;
  }
  
  // Check if it's a known placeholder
  if (INVALID_PLACEHOLDERS.includes(trimmedValue)) {
    return false;
  }
  
  return true;
}

/**
 * Check if OpenAI API key is properly configured
 * @param {string} apiKey - The OpenAI API key to validate
 * @returns {boolean} - True if valid OpenAI key, false otherwise
 */
function isValidOpenAIKey(apiKey) {
  if (!isValidApiKey(apiKey)) {
    return false;
  }
  
  // OpenAI keys should start with 'sk-'
  return apiKey.startsWith('sk-');
}

/**
 * Check if a key looks like it has the correct format
 * @param {string} key - The key to check
 * @param {string} expectedPrefix - Expected prefix (e.g., 'sk-', 'hf_')
 * @returns {boolean} - True if format matches
 */
function hasValidFormat(key, expectedPrefix) {
  return isValidApiKey(key) && key.startsWith(expectedPrefix);
}

module.exports = {
  isValidApiKey,
  isValidOpenAIKey,
  hasValidFormat,
  INVALID_PLACEHOLDERS
};
