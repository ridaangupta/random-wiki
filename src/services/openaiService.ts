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
    // For demo purposes, return enhanced topics based on content analysis
    console.log('No OpenAI API key found, using enhanced topic extraction');
    return extractEnhancedTopics(title, content);
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
            content: `You are an expert at identifying diverse, meaningful topics related to Wikipedia articles. Generate 8-10 specific, actionable topics that someone interested in this article would want to explore further.

GUIDELINES:
- Focus on specific concepts, fields, applications, and related phenomena
- Avoid generic terms like "History of X", "X studies", "Research on X"
- Include scientific fields, related technologies, key figures, applications, and interdisciplinary connections
- Make topics specific enough to correspond to actual Wikipedia articles
- Prioritize topics that represent different aspects and perspectives
- Format as proper nouns when appropriate

GOOD EXAMPLES: "Quantum entanglement", "Marie Curie", "CRISPR gene editing", "Urban planning", "Behavioral economics"
BAD EXAMPLES: "Physics studies", "History of science", "Research methods", "General theory"`
          },
          {
            role: 'user',
            content: `Article: "${title}"\n\nContent: ${content}\n\nGenerate specific, diverse topics (not generic "studies" or "history" terms) that would interest readers of this article. Return only topic names, one per line.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const topicsText = data.choices[0]?.message?.content || '';
    
    // Parse and filter the response
    const topics = topicsText
      .split('\n')
      .map((topic: string) => topic.trim())
      .filter((topic: string) => topic.length > 0 && !topic.match(/^\d+\./) && topic !== title)
      .filter((topic: string) => !isGenericTopic(topic))
      .slice(0, 10);
    
    return topics.length > 0 ? topics : extractEnhancedTopics(title, content);
  } catch (error) {
    console.error('Error calling OpenAI API for topics:', error);
    return extractEnhancedTopics(title, content);
  }
};

const isGenericTopic = (topic: string): boolean => {
  const genericPatterns = [
    /\bstudies?\b/i,
    /\bhistory of\b/i,
    /\bresearch\b/i,
    /\banalysis\b/i,
    /\btheory\b$/i,
    /\bmethods?\b/i,
    /\bapproaches?\b/i,
    /\bgeneral\b/i
  ];
  
  return genericPatterns.some(pattern => pattern.test(topic));
};

const extractEnhancedTopics = (title: string, content: string): string[] => {
  const topics: Set<string> = new Set();
  
  // Extract proper nouns and capitalize them properly
  const properNouns = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  properNouns.forEach(noun => {
    if (noun.length > 3 && noun !== title && !isCommonWord(noun)) {
      topics.add(noun);
    }
  });
  
  // Extract scientific and technical terms
  const technicalTerms = content.match(/\b[a-z]+(?:ology|ography|ometry|physics|chemistry|biology|ics|ism|tion)\b/gi) || [];
  technicalTerms.forEach(term => {
    if (term.length > 5) {
      topics.add(capitalizeFirst(term));
    }
  });
  
  // Extract compound terms with specific patterns
  const compoundTerms = content.match(/\b[A-Z][a-z]+\s+(?:effect|principle|law|theory|model|system|process|method|technique)\b/g) || [];
  compoundTerms.forEach(term => topics.add(term));
  
  // Extract field-specific patterns
  const fieldPatterns = [
    /\b(?:quantum|molecular|cellular|digital|artificial|machine|computer|environmental|social|economic|political)\s+[a-z]+/gi,
    /\b[A-Z][a-z]+\s+(?:engineering|science|technology|computing|mathematics|physics|chemistry|biology)/gi
  ];
  
  fieldPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => topics.add(match));
  });
  
  // Add some contextual topics based on content analysis
  if (content.toLowerCase().includes('computer') || content.toLowerCase().includes('algorithm')) {
    topics.add('Computer Science');
    topics.add('Artificial Intelligence');
  }
  
  if (content.toLowerCase().includes('cell') || content.toLowerCase().includes('genetic')) {
    topics.add('Molecular Biology');
    topics.add('Genetics');
  }
  
  if (content.toLowerCase().includes('energy') || content.toLowerCase().includes('force')) {
    topics.add('Physics');
    topics.add('Thermodynamics');
  }
  
  if (content.toLowerCase().includes('economic') || content.toLowerCase().includes('market')) {
    topics.add('Economics');
    topics.add('Market Theory');
  }
  
  // Convert to array and filter
  const topicArray = Array.from(topics)
    .filter(topic => !isGenericTopic(topic))
    .filter(topic => topic.length > 3 && topic.length < 50)
    .slice(0, 8);
  
  return topicArray;
};

const isCommonWord = (word: string): boolean => {
  const commonWords = new Set([
    'The', 'This', 'That', 'These', 'Those', 'When', 'Where', 'Why', 'How', 'What',
    'Many', 'Some', 'Most', 'All', 'Other', 'Such', 'More', 'Less', 'Very', 'Much',
    'Also', 'Only', 'Just', 'Even', 'Still', 'Now', 'Then', 'Here', 'There',
    'First', 'Second', 'Last', 'Next', 'Previous', 'New', 'Old', 'Large', 'Small'
  ]);
  return commonWords.has(word);
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
