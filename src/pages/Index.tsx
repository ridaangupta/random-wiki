
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ArticleDisplay from '@/components/ArticleDisplay';
import { fetchRandomArticle, processArticle } from '@/services/wikipediaService';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscoverArticle = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching random article...');
      const article = await fetchRandomArticle();
      console.log('Fetched article:', article.title);
      
      const processedArticle = await processArticle(article);
      console.log('Processed article with', processedArticle.sections?.length || 0, 'sections');
      
      setCurrentArticle(processedArticle);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: "Error",
        description: "Failed to load article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextArticle = () => {
    setCurrentArticle(null);
    handleDiscoverArticle();
  };

  if (currentArticle) {
    return <ArticleDisplay article={currentArticle} onNext={handleNextArticle} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-gray-900 tracking-tight">
            Wikipedia Explorer
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
