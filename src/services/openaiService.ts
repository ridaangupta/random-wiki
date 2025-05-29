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

export const generateRelatedTopics = async (title: string, content: string): Promise<string[]> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // For demo purposes, return some basic topics based on title analysis
    console.log('No OpenAI API key found, using basic topic extraction');
    return extractBasicTopics(title, content);
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
            content: 'You are a helpful assistant that identifies topics and categories for Wikipedia articles. Provide a list of 8-10 related topics that this article could fall under or be related to. Return only the topic names, one per line, without numbering or bullet points.'
          },
          {
            role: 'user',
            content: `Based on this Wikipedia article titled "${title}" with the following content: ${content}\n\nGenerate related topics and categories that someone interested in this article might also want to explore.`
          }
        ],
        max_tokens: 200,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const topicsText = data.choices[0]?.message?.content || '';
    
    // Parse the response into an array of topics
    const topics = topicsText
      .split('\n')
      .map((topic: string) => topic.trim())
      .filter((topic: string) => topic.length > 0 && !topic.match(/^\d+\./) && topic !== title)
      .slice(0, 10);
    
    return topics;
  } catch (error) {
    console.error('Error calling OpenAI API for topics:', error);
    return extractBasicTopics(title, content);
  }
};

const extractBasicTopics = (title: string, content: string): string[] => {
  // Basic topic extraction based on common patterns
  const topics: string[] = [];
  
  // Extract potential topics from title
  const titleWords = title.split(' ').filter(word => word.length > 3);
  
  // Look for category-like terms in content
  const categoryPatterns = [
    /category:\s*([^,\n]+)/gi,
    /type of\s+([^,\n]+)/gi,
    /related to\s+([^,\n]+)/gi,
    /part of\s+([^,\n]+)/gi
  ];
  
  categoryPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const topic = match.replace(pattern, '$1').trim();
        if (topic.length > 3 && topic.length < 50) {
          topics.push(topic);
        }
      });
    }
  });
  
  // Add some generic topics based on title
  if (titleWords.length > 0) {
    topics.push(`${titleWords[0]} studies`);
    topics.push(`History of ${titleWords[0]}`);
  }
  
  return topics.slice(0, 8);
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
