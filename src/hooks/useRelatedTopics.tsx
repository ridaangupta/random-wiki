
import { useMemo } from 'react';
import { generateRelatedTopics } from '@/services/openaiService';

interface Article {
  title: string;
  extract: string;
  sections?: Array<{
    title: string;
    content: string;
    originalContent: string;
    summary?: string;
  }>;
}

export const useRelatedTopics = (article: Article) => {
  return useMemo(() => {
    console.log('Generating related topics for:', article.title);
    
    // Create a summary of the article content for topic generation
    let articleSummary = article.extract || '';
    
    if (article.sections && article.sections.length > 0) {
      // Use the first few sections' summaries or content
      const sectionContent = article.sections
        .slice(0, 3)
        .map(section => section.summary || section.content.substring(0, 200))
        .join(' ');
      
      articleSummary = articleSummary + ' ' + sectionContent;
    }
    
    // Generate topics asynchronously
    generateRelatedTopics(article.title, articleSummary.substring(0, 1000))
      .then(topics => {
        console.log('Generated topics:', topics);
        return topics;
      })
      .catch(error => {
        console.error('Error generating topics:', error);
        return [];
      });
    
    // Return empty array initially, topics will be generated asynchronously
    return [];
  }, [article]);
};
