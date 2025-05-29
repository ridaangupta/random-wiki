
import { useMemo } from 'react';

interface Article {
  title: string;
  sections?: Array<{
    title: string;
    content: string;
    originalContent: string;
    summary?: string;
  }>;
}

export const useRelatedArticles = (article: Article) => {
  return useMemo(() => {
    console.log('Extracting related articles from:', article.title);
    const links = new Set<string>();
    
    // Extract links from sections using original content
    if (article.sections) {
      console.log(`Processing ${article.sections.length} sections for links`);
      
      article.sections.forEach(section => {
        const tempDiv = document.createElement('div');
        // Use originalContent which contains the raw HTML with links
        tempDiv.innerHTML = section.originalContent || section.content;
        
        const anchors = tempDiv.querySelectorAll('a[href*="/wiki/"]');
        console.log(`Found ${anchors.length} wiki links in section: ${section.title}`);
        
        anchors.forEach(anchor => {
          const href = anchor.getAttribute('href');
          const title = anchor.textContent?.trim();
          
          if (href && title && !href.includes(':') && !href.includes('#')) {
            // Extract article title from Wikipedia URL
            const articleTitle = href.split('/wiki/')[1]?.replace(/_/g, ' ');
            if (articleTitle && articleTitle !== article.title) {
              links.add(articleTitle);
              console.log('Added related article:', articleTitle);
            }
          }
        });
      });
    }
    
    const relatedArticles = Array.from(links).slice(0, 15);
    console.log(`Total related articles found: ${relatedArticles.length}`);
    
    return relatedArticles;
  }, [article]);
};
