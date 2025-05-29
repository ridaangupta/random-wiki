
import { summarizeText } from './openaiService';

export interface WikipediaArticle {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
  sections?: Array<{
    title: string;
    content: string;
    summary?: string;
  }>;
}

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1';

export const fetchRandomArticle = async (): Promise<WikipediaArticle> => {
  try {
    console.log('Fetching random article summary...');
    const summaryResponse = await fetch(`${WIKIPEDIA_API_BASE}/page/random/summary`);
    
    if (!summaryResponse.ok) {
      throw new Error(`Failed to fetch random article: ${summaryResponse.status}`);
    }
    
    const summary = await summaryResponse.json();
    console.log('Random article summary:', summary.title);

    return {
      title: summary.title,
      extract: summary.extract,
      thumbnail: summary.thumbnail,
      content_urls: summary.content_urls,
    };
  } catch (error) {
    console.error('Error fetching random article:', error);
    throw error;
  }
};

export const fetchArticleContent = async (title: string): Promise<string> => {
  try {
    console.log('Fetching full content for:', title);
    const encodedTitle = encodeURIComponent(title);
    const response = await fetch(`${WIKIPEDIA_API_BASE}/page/html/${encodedTitle}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article content: ${response.status}`);
    }
    
    const html = await response.text();
    return html;
  } catch (error) {
    console.error('Error fetching article content:', error);
    throw error;
  }
};

export const parseArticleHTML = (html: string): Array<{ title: string; content: string }> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const sections: Array<{ title: string; content: string }> = [];
  
  // Get all section headings and content
  const headings = doc.querySelectorAll('h2, h3');
  
  headings.forEach((heading, index) => {
    const sectionTitle = heading.textContent?.trim() || '';
    
    // Skip certain sections that are typically not useful
    if (sectionTitle.match(/^(References|External links|See also|Notes)$/i)) {
      return;
    }
    
    let content = '';
    let currentElement = heading.nextElementSibling;
    
    // Collect content until the next heading
    while (currentElement && !currentElement.matches('h2, h3')) {
      if (currentElement.matches('p')) {
        content += currentElement.innerHTML + ' ';
      }
      currentElement = currentElement.nextElementSibling;
    }
    
    if (content.trim()) {
      sections.push({
        title: sectionTitle,
        content: content.trim()
      });
    }
  });
  
  return sections.slice(0, 5); // Limit to first 5 sections for performance
};

export const processArticle = async (article: WikipediaArticle): Promise<WikipediaArticle> => {
  try {
    // Try to get full content and parse it
    const html = await fetchArticleContent(article.title);
    const sections = parseArticleHTML(html);
    
    console.log(`Parsed ${sections.length} sections, starting summarization...`);
    
    // Summarize each section
    const summarizedSections = await Promise.all(
      sections.map(async (section, index) => {
        try {
          console.log(`Summarizing section ${index + 1}: ${section.title}`);
          const summary = await summarizeText(section.content);
          return {
            ...section,
            summary
          };
        } catch (error) {
          console.error(`Failed to summarize section "${section.title}":`, error);
          return section; // Return original content if summarization fails
        }
      })
    );
    
    return {
      ...article,
      sections: summarizedSections
    };
  } catch (error) {
    console.error('Error processing article:', error);
    // Return original article if processing fails
    return article;
  }
};
