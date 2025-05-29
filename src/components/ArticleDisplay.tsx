import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Loader2, Sparkles, ExternalLink } from 'lucide-react';

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

  const handleNext = async () => {
    setIsLoadingNext(true);
    await onNext();
    setIsLoadingNext(false);
  };

  // Extract related articles from the content
  const relatedArticles = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            🔍 Random Wiki
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoadingNext}
              variant="outline"
              className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              {isLoadingNext ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Next Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="space-y-8">
          {/* Title and Thumbnail */}
          <header className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
              {article.title}
            </h1>
            
            {article.thumbnail && (
              <div className="flex justify-center">
                <img
                  src={article.thumbnail.source}
                  alt={article.title}
                  className="max-w-sm rounded-lg shadow-md"
                />
              </div>
            )}
          </header>

          {/* Extract/Introduction */}
          {article.extract && (
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                {article.extract}
              </p>
            </div>
          )}

          {/* Sections */}
          {article.sections && article.sections.length > 0 && (
            <div className="space-y-8">
              {article.sections.map((section, index) => (
                <section key={index} className="space-y-4">
                  {section.title && (
                    <h2 className="text-2xl font-medium text-gray-900 border-b border-gray-200 pb-2">
                      {section.title}
                    </h2>
                  )}
                  
                  {section.summary ? (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {section.summary}
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </section>
              ))}
            </div>
          )}

          {/* Wikipedia Link */}
          <div className="text-center pt-8 border-t border-gray-200">
            <a
              href={article.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              Read full article on Wikipedia
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          {/* Related Articles Panel */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relatedArticles.map((articleTitle, index) => (
                    <a
                      key={index}
                      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:bg-white px-3 py-2 rounded transition-colors text-sm border border-transparent hover:border-blue-200"
                    >
                      {articleTitle}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Article Button */}
          <div className="text-center pt-8">
            <Button
              onClick={onRelated}
              disabled={isLoading}
              className="px-8 py-6 text-lg font-medium bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding related article...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Similar Next
                </>
              )}
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDisplay;
