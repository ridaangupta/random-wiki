
import React, { useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Handle touch events for swipe gestures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return;
      
      const distance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50; // Minimum distance for a swipe

      // Swipe left (next article)
      if (distance > minSwipeDistance && !isLoading) {
        onNext();
      }
      
      // Swipe right (previous article)
      if (distance < -minSwipeDistance && canGoPrevious) {
        onPrevious();
      }

      // Reset values
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNext, onPrevious, canGoPrevious, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white touch-pan-y"
    >
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
        article={article}
      />
    </div>
  );
};

export default ArticleDisplay;
