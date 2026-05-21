const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getMealSuggestions = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is required.' });
    }

    const { caloriesLeft, proteinLeft, preferences = '' } = req.body;

    if (caloriesLeft === undefined || proteinLeft === undefined) {
      return res.status(400).json({ message: 'caloriesLeft and proteinLeft are required.' });
    }

    const calories = Number(caloriesLeft);
    const protein = Number(proteinLeft);

    if (Number.isNaN(calories) || Number.isNaN(protein)) {
      return res.status(400).json({ message: 'caloriesLeft and proteinLeft must be numbers.' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `You are a nutrition expert. Suggest exactly 3 meals for someone with these remaining macros:
- Calories remaining: ${calories} kcal
- Protein remaining: ${protein}g
${preferences ? `- Food preferences: ${preferences}` : ''}

Respond ONLY with a valid JSON array, no extra text, no markdown, and no backticks.
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
]`
        }
      ]
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('AI response was empty or malformed.');
    }

    const cleaned = text.replace(/```json|```/g, '').trim();
    const meals = JSON.parse(cleaned);

    res.json(meals);
  } catch (error) {
    console.log('AI Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMealSuggestions };