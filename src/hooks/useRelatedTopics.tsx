
import { useState, useEffect } from 'react';
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

export const useRelatedTopics = (article: Article | undefined) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!article) {
      console.log('No article provided for topic generation');
      return;
    }

    console.log('Starting topic generation for:', article.title);
    setIsLoading(true);
    setTopics([]); // Clear previous topics
    
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
      .then(generatedTopics => {
        console.log('Generated topics:', generatedTopics);
        setTopics(generatedTopics);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error generating topics:', error);
        setTopics([]);
        setIsLoading(false);
      });
  }, [article?.title]); // Depend on article title to regenerate when article changes

  return { topics, isLoading };
};
