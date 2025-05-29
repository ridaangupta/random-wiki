
import { useMemo } from 'react';

interface Article {
  title: string;
  sections?: Array<{
    title: string;
    content: string;
    summary?: string;
  }>;
}

export const useRelatedArticles = (article: Article) => {
  return useMemo(() => {
    const links = new Set<string>();
    
    // Extract links from sections
    if (article.sections) {
      article.sections.forEach(section => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = section.content;
        
        const anchors = tempDiv.querySelectorAll('a[href*="/wiki/"]');
        anchors.forEach(anchor => {
          const href = anchor.getAttribute('href');
          const title = anchor.textContent?.trim();
          
          if (href && title && !href.includes(':') && !href.includes('#')) {
            // Extract article title from Wikipedia URL
            const articleTitle = href.split('/wiki/')[1]?.replace(/_/g, ' ');
            if (articleTitle && articleTitle !== article.title) {
              links.add(articleTitle);
            }
          }
        });
      });
    }
    
    return Array.from(links).slice(0, 15); // Limit to 15 related articles
  }, [article]);
};
