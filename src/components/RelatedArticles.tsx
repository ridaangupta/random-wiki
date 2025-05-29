
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface RelatedArticlesProps {
  articles: string[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <ExternalLink className="mr-2 h-4 w-4" />
        Related Articles
      </h3>
      <div className="space-y-2">
        {articles.slice(0, 8).map((articleTitle, index) => (
          <a
            key={index}
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:text-blue-700 hover:bg-white px-3 py-2 rounded transition-colors text-sm border border-transparent hover:border-blue-200"
          >
            {articleTitle}
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
