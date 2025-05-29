
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
        
        // Look for various Wikipedia link patterns
        const anchors = tempDiv.querySelectorAll('a[href]');
        console.log(`Found ${anchors.length} total links in section: ${section.title}`);
        
        let wikiLinksCount = 0;
        anchors.forEach(anchor => {
          const href = anchor.getAttribute('href');
          const title = anchor.textContent?.trim();
          
          if (href && title) {
            let articleTitle = null;
            
            // Handle different Wikipedia URL patterns
            if (href.includes('/wiki/')) {
              // Full or relative Wikipedia URLs
              articleTitle = href.split('/wiki/')[1]?.replace(/_/g, ' ');
            } else if (href.startsWith('./')) {
              // Relative URLs starting with ./
              articleTitle = href.substring(2).replace(/_/g, ' ');
            } else if (href.startsWith('#')) {
              // Skip anchor links
              return;
            }
            
            // Filter out unwanted links
            if (articleTitle && 
                !articleTitle.includes(':') && 
                !articleTitle.includes('#') &&
                !articleTitle.startsWith('File:') &&
                !articleTitle.startsWith('Category:') &&
                !articleTitle.startsWith('Template:') &&
                !articleTitle.startsWith('Help:') &&
                !articleTitle.startsWith('Special:') &&
                articleTitle !== article.title &&
                articleTitle.length > 2) {
              
              // Decode URL encoding
              try {
                articleTitle = decodeURIComponent(articleTitle);
              } catch (e) {
                // If decoding fails, use as is
              }
              
              links.add(articleTitle);
              wikiLinksCount++;
              console.log('Added related article:', articleTitle);
            }
          }
        });
        
        console.log(`Found ${wikiLinksCount} valid Wikipedia links in section: ${section.title}`);
      });
    }
    
    const relatedArticles = Array.from(links).slice(0, 15);
    console.log(`Total unique related articles found: ${relatedArticles.length}`);
    console.log('Related articles:', relatedArticles);
    
    return relatedArticles;
  }, [article]);
};
