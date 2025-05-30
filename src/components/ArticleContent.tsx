
import React from 'react';
import { ArrowRight } from 'lucide-react';

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

interface ArticleContentProps {
  article: Article;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <article className="space-y-6 sm:space-y-8">
        {/* Title and Thumbnail */}
        <header className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight px-2">
            {article.title}
          </h1>
          
          {article.thumbnail && (
            <div className="flex justify-center">
              <img
                src={article.thumbnail.source}
                alt={article.title}
                className="max-w-full sm:max-w-sm rounded-lg shadow-md"
              />
            </div>
          )}
        </header>

        {/* Extract/Introduction */}
        {article.extract && (
          <div className="prose prose-base sm:prose-lg max-w-none">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light px-2 sm:px-0">
              {article.extract}
            </p>
          </div>
        )}

        {/* Sections */}
        {article.sections && article.sections.length > 0 && (
          <div className="space-y-6 sm:space-y-8">
            {article.sections.map((section, index) => (
              <section key={index} className="space-y-3 sm:space-y-4 px-2 sm:px-0">
                {section.title && (
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 border-b border-gray-200 pb-2">
                    {section.title}
                  </h2>
                )}
                
                {section.summary ? (
                  <div className="prose prose-base sm:prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {section.summary}
                    </p>
                  </div>
                ) : (
                  <div 
                    className="prose prose-base sm:prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </section>
            ))}
          </div>
        )}

        {/* Wikipedia Link */}
        <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
          <a
            href={article.content_urls.desktop.page}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
          >
            Read full article on Wikipedia
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </article>
    </div>
  );
};

export default ArticleContent;
