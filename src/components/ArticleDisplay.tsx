
import React, { useState } from 'react';
import ArticleHeader from './ArticleHeader';
import ArticleContent from './ArticleContent';
import BottomSection from './BottomSection';
import { useRelatedArticles } from '@/hooks/useRelatedArticles';

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
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const relatedArticles = useRelatedArticles(article);

  const handleNext = async () => {
    setIsLoadingNext(true);
    await onNext();
    setIsLoadingNext(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <ArticleHeader
        onNext={handleNext}
        onPrevious={onPrevious}
        canGoPrevious={canGoPrevious}
        isLoadingNext={isLoadingNext}
      />
      
      <ArticleContent article={article} />
      
      <BottomSection
        relatedArticles={relatedArticles}
        onRelated={onRelated}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ArticleDisplay;
