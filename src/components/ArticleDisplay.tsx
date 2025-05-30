
import React from 'react';
import ArticleHeader from './ArticleHeader';
import ArticleContent from './ArticleContent';
import BottomSection from './BottomSection';
import { useRelatedArticles } from '@/hooks/useRelatedArticles';
import { useRelatedTopics } from '@/hooks/useRelatedTopics';

interface Article {
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

interface ArticleDisplayProps {
  article: Article;
  onNext: () => void;
  onRelated: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  isLoading?: boolean;
}

const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ 
  article, 
  onNext, 
  onRelated,
  onPrevious, 
  canGoPrevious,
  isLoading = false
}) => {
  const relatedArticles = useRelatedArticles(article);
  const { topics: relatedTopics, isLoading: isLoadingTopics } = useRelatedTopics(article);

  return (
    <div className="min-h-screen bg-white">
      <ArticleHeader
        onNext={onNext}
        onPrevious={onPrevious}
        canGoPrevious={canGoPrevious}
        isLoadingNext={isLoading}
      />
      
      <ArticleContent article={article} />
      
      <BottomSection
        relatedArticles={relatedArticles}
        relatedTopics={relatedTopics}
        onRelated={onRelated}
        isLoading={isLoading}
        isLoadingTopics={isLoadingTopics}
      />
    </div>
  );
};

export default ArticleDisplay;
