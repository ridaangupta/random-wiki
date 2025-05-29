
// OpenAI service for text summarization
// Note: In a production app, this should be handled server-side to protect API keys

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

let openaiApiKey: string | null = null;

// Check if we have the API key (for now, we'll use a simple localStorage approach)
const getApiKey = (): string | null => {
  if (openaiApiKey) return openaiApiKey;
  
  openaiApiKey = localStorage.getItem('openai_api_key');
  return openaiApiKey;
};

export const setApiKey = (apiKey: string): void => {
  openaiApiKey = apiKey;
  localStorage.setItem('openai_api_key', apiKey);
};

export const summarizeText = async (text: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // For demo purposes, return a simple truncation
    console.log('No OpenAI API key found, using simple text processing');
    return truncateToSentences(text, 3);
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes Wikipedia content. Provide clear, concise summaries that preserve important facts and maintain readability. Keep summaries to 2-3 sentences.'
          },
          {
            role: 'user',
            content: `Summarize this Wikipedia section in 2-3 clear, informative sentences while preserving all important facts: ${text}`
          }
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || truncateToSentences(text, 3);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fallback to simple text processing
    return truncateToSentences(text, 3);
  }
};

const truncateToSentences = (text: string, maxSentences: number): string => {
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Split by sentence endings
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  return sentences.slice(0, maxSentences).join('. ') + '.';
};

export const promptForApiKey = (): string | null => {
  const apiKey = prompt(
    'To enable AI summarization, please enter your OpenAI API key:\n\n' +
    'You can get one at: https://platform.openai.com/api-keys\n\n' +
    '(This will be stored locally in your browser)'
  );
  
  if (apiKey && apiKey.trim()) {
    setApiKey(apiKey.trim());
    return apiKey.trim();
  }
  
  return null;
};
