export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' }
];

/**
 * Translates English text to a target language.
 * Supports RapidAPI Google Translate and MyMemory API fallback.
 * 
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'es')
 * @param {object} apiConfig - Configuration details { mode: 'demo' | 'rapidapi', apiKey: string }
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang, apiConfig) {
  if (!text || !text.trim()) return '';

  const { mode, apiKey } = apiConfig;

  if (mode === 'rapidapi') {
    if (!apiKey || !apiKey.trim()) {
      throw new Error('RapidAPI Key is missing. Please configure it in settings or use Demo Mode.');
    }

    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
    const params = new URLSearchParams();
    params.append('q', text);
    params.append('target', targetLang);
    params.append('source', 'en');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
          'x-rapidapi-key': apiKey.trim()
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.message || errorData?.error?.message || `HTTP error ${response.status}`;
        throw new Error(`RapidAPI Error: ${errorMessage}`);
      }

      const data = await response.json();
      const translatedText = data?.data?.translations?.[0]?.translatedText;
      
      if (!translatedText) {
        throw new Error('Unable to extract translation from RapidAPI response.');
      }

      // Google Translate response may contain HTML entities (e.g., &#39; or &quot;), decode them
      return decodeHTMLEntities(translatedText);
    } catch (err) {
      console.error('RapidAPI Translation failed:', err);
      throw err;
    }
  } else {
    // Free Demo Mode using MyMemory API
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`MyMemory API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Check for MyMemory status code success (200)
      if (data.responseStatus !== 200) {
        throw new Error(`MyMemory API Error: ${data.responseDetails || 'Translation failed'}`);
      }

      const translatedText = data?.responseData?.translatedText;
      if (!translatedText) {
        throw new Error('No translation returned from MyMemory API.');
      }

      return decodeHTMLEntities(translatedText);
    } catch (err) {
      console.error('MyMemory API Translation failed:', err);
      throw new Error(`Demo Mode translation failed: ${err.message}. Check your internet connection.`);
    }
  }
}

/**
 * Decodes HTML entities commonly returned by translation APIs
 */
function decodeHTMLEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

/**
 * Fetches the pronunciation (romanization/transliteration) of the translated text
 */
export async function getPronunciation(text, targetLang) {
  if (!text || !text.trim()) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    let transliteration = '';
    if (data && data[0]) {
       for (let i = 0; i < data[0].length; i++) {
           if (data[0][i][2] && typeof data[0][i][2] === 'string') {
               transliteration += data[0][i][2] + ' ';
           }
       }
    }
    return transliteration.trim();
  } catch (e) {
    console.error('Failed to get pronunciation:', e);
    return '';
  }
}

