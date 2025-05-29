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
    originalContent: string;
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

export const fetchRelatedArticle = async (currentTitle: string): Promise<WikipediaArticle> => {
  try {
    console.log('Fetching related article for:', currentTitle);
    
    // First, try to get the page content to extract categories or related links
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=categories|links&titles=${encodeURIComponent(currentTitle)}&cllimit=5&pllimit=10`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`Failed to fetch page info: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    const page = Object.values(searchData.query.pages)[0] as any;
    
    let relatedTitle = null;
    
    // Try to find a related article from the links
    if (page.links && page.links.length > 0) {
      // Filter out common navigation pages and pick a random related link
      const filteredLinks = page.links.filter((link: any) => 
        !link.title.includes(':') && // Exclude special pages
        !link.title.startsWith('List of') &&
        link.title !== currentTitle
      );
      
      if (filteredLinks.length > 0) {
        const randomLink = filteredLinks[Math.floor(Math.random() * filteredLinks.length)];
        relatedTitle = randomLink.title;
      }
    }
    
    // If no related link found, try using categories
    if (!relatedTitle && page.categories && page.categories.length > 0) {
      const category = page.categories[0].title.replace('Category:', '');
      const categorySearchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=20`
      );
      
      if (categorySearchResponse.ok) {
        const categoryData = await categorySearchResponse.json();
        const members = categoryData.query.categorymembers.filter((member: any) => 
          member.title !== currentTitle && !member.title.includes(':')
        );
        
        if (members.length > 0) {
          const randomMember = members[Math.floor(Math.random() * members.length)];
          relatedTitle = randomMember.title;
        }
      }
    }
    
    // If still no related article, fall back to random
    if (!relatedTitle) {
      console.log('No related article found, falling back to random');
      return await fetchRandomArticle();
    }
    
    console.log('Found related article:', relatedTitle);
    
    // Fetch the summary for the related article
    const summaryResponse = await fetch(`${WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(relatedTitle)}`);
    
    if (!summaryResponse.ok) {
      console.log('Failed to fetch related article summary, falling back to random');
      return await fetchRandomArticle();
    }
    
    const summary = await summaryResponse.json();
    
    return {
      title: summary.title,
      extract: summary.extract,
      thumbnail: summary.thumbnail,
      content_urls: summary.content_urls,
    };
  } catch (error) {
    console.error('Error fetching related article:', error);
    // Fallback to random article
    return await fetchRandomArticle();
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

export const parseArticleHTML = (html: string): Array<{ title: string; content: string; originalContent: string }> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const sections: Array<{ title: string; content: string; originalContent: string }> = [];
  
  // Get all section headings and content
  const headings = doc.querySelectorAll('h2, h3');
  
  headings.forEach((heading, index) => {
    const sectionTitle = heading.textContent?.trim() || '';
    
    // Skip certain sections that are typically not useful
    if (sectionTitle.match(/^(References|External links|See also|Notes)$/i)) {
      return;
    }
    
    let content = '';
    let originalContent = '';
    let currentElement = heading.nextElementSibling;
    
    // Collect content until the next heading
    while (currentElement && !currentElement.matches('h2, h3')) {
      if (currentElement.matches('p')) {
        content += currentElement.innerHTML + ' ';
        originalContent += currentElement.innerHTML + ' ';
      }
      currentElement = currentElement.nextElementSibling;
    }
    
    if (content.trim()) {
      sections.push({
        title: sectionTitle,
        content: content.trim(),
        originalContent: originalContent.trim()
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
    
    // Summarize each section while preserving original content
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
