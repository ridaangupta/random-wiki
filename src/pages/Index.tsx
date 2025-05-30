
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ArticleDisplay from '@/components/ArticleDisplay';
import { fetchRandomArticle, processArticle } from '@/services/wikipediaService';
import { articleCache } from '@/services/articleCache';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [articleHistory, setArticleHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cache when component mounts
  useEffect(() => {
    articleCache.initializeCache();
  }, []);

  const handleDiscoverArticle = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching random article...');
      const article = await articleCache.getNextArticle('random');
      console.log('Got article from cache:', article.title);
      
      setCurrentArticle(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      // Fallback to direct fetch if cache fails
      try {
        const article = await fetchRandomArticle();
        const processedArticle = await processArticle(article);
        setCurrentArticle(processedArticle);
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to load article. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextArticle = async () => {
    if (currentArticle) {
      setArticleHistory(prev => [...prev, currentArticle]);
    }
    
    setIsLoading(true);
    try {
      console.log('Getting next random article from cache...');
      const article = await articleCache.getNextArticle('random');
      console.log('Got next article from cache:', article.title);
      setCurrentArticle(article);
    } catch (error) {
      console.error('Error fetching next article:', error);
      toast({
        title: "Error",
        description: "Failed to load next article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelatedArticle = async () => {
    if (!currentArticle) return;
    
    setIsLoading(true);
    try {
      console.log('Getting related article from cache...');
      const article = await articleCache.getNextArticle('related', currentArticle.title);
      console.log('Got related article from cache:', article.title);
      
      // Add current article to history before showing related one
      setArticleHistory(prev => [...prev, currentArticle]);
      setCurrentArticle(article);
    } catch (error) {
      console.error('Error fetching related article:', error);
      toast({
        title: "Error",
        description: "Failed to load related article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousArticle = () => {
    if (articleHistory.length > 0) {
      const previousArticle = articleHistory[articleHistory.length - 1];
      setArticleHistory(prev => prev.slice(0, -1));
      setCurrentArticle(previousArticle);
      
      // Clear cache when going back to avoid confusion
      articleCache.clearCache();
      // Reinitialize for future navigation
      articleCache.initializeCache();
    }
  };

  if (currentArticle) {
    return (
      <ArticleDisplay 
        article={currentArticle} 
        onNext={handleNextArticle}
        onRelated={handleRelatedArticle}
        onPrevious={handlePreviousArticle}
        canGoPrevious={articleHistory.length > 0}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">
            🔍 Random Wiki
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Discover fascinating articles from the world's largest encyclopedia
          </p>
        </div>
        
        <Button
          onClick={handleDiscoverArticle}
          disabled={isLoading}
          className="px-8 py-6 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Discovering...
            </>
          ) : (
            'Discover Random Article'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Index;
