const { GoogleGenerativeAI, GoogleGenerativeAIFetchError } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_RETRY_ATTEMPTS = 4;
const DEFAULT_RETRY_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRetryDelay = (retryDelay) => {
  if (!retryDelay) return null;

  if (typeof retryDelay === 'string') {
    const seconds = parseFloat(retryDelay.replace(/s$/, ''));
    return Number.isFinite(seconds) ? seconds * 1000 : null;
  }

  if (typeof retryDelay === 'number') {
    return retryDelay > 1000 ? retryDelay : retryDelay * 1000;
  }

  if (retryDelay.seconds != null) {
    return Number(retryDelay.seconds) * 1000;
  }

  return null;
};

const extractRetryDelayFromError = (error) => {
  if (!error || !Array.isArray(error.details)) return null;

  for (const detail of error.details) {
    if (detail['@type']?.includes('RetryInfo') && detail.retryDelay) {
      return parseRetryDelay(detail.retryDelay);
    }
  }

  return null;
};

const isRetryableError = (error) => {
  if (!(error instanceof GoogleGenerativeAIFetchError)) return false;
  return [429, 502, 503, 504].includes(error.status);
};

const retryWithBackoff = async (fn, attempts = DEFAULT_RETRY_ATTEMPTS) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === attempts) {
        break;
      }

      const retryMs = extractRetryDelayFromError(error) ?? DEFAULT_RETRY_DELAY_MS * 2 ** (attempt - 1);
      console.warn(`Retryable AI error (#${attempt}) - waiting ${retryMs}ms before retrying.`, error.status || error.message);
      await sleep(retryMs);
    }
  }

  throw lastError;
};

const getMealSuggestions = async (req, res) => {
  const { caloriesLeft, proteinLeft, preferences } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: 'Missing GEMINI_API_KEY in environment. Set it in .env.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a nutrition expert. Suggest exactly 3 meals for someone with these remaining macros for the day:
    - Calories remaining: ${caloriesLeft} kcal
    - Protein remaining: ${proteinLeft}g
    ${preferences ? `- Food preferences: ${preferences}` : ''}
    
    Respond ONLY with a valid JSON array, no extra text, no markdown, no backticks.
    Format exactly like this:
    [
      {
        "name": "Meal Name",
        "calories": 300,
        "protein": 25,
        "carbs": 20,
        "fat": 10,
        "description": "Brief description"
      }
    ]`;

    const result = await retryWithBackoff(() => model.generateContent(prompt));
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const meals = JSON.parse(cleaned);

    res.json(meals);
  } catch (error) {
    console.error('AI Error:', error);

    if (error instanceof GoogleGenerativeAIFetchError && error.status === 429) {
      return res.status(429).json({
        message: 'Gemini API quota exceeded. Check your Google Cloud billing/quotas or use a different API key/provider.'
      });
    }

    return res.status(500).json({ message: error.message || 'Unknown AI error' });
  }
};

module.exports = { getMealSuggestions };