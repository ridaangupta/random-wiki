
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import RelatedArticles from './RelatedArticles';
import RelatedTopics from './RelatedTopics';
import SaveToCollectionButton from './SaveToCollectionButton';

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
}

interface BottomSectionProps {
  relatedArticles: string[];
  relatedTopics: string[];
  onRelated: () => void;
  isLoading: boolean;
  isLoadingTopics?: boolean;
  article: Article;
}

const BottomSection: React.FC<BottomSectionProps> = ({
  relatedArticles,
  relatedTopics,
  onRelated,
  isLoading,
  isLoadingTopics = false,
  article
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="pt-8 border-t border-gray-200">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 items-start">
          {/* Center content first on mobile, left on desktop */}
          <div className="order-2 lg:order-1 lg:col-span-1 w-full">
            <RelatedArticles articles={relatedArticles} />
          </div>

          {/* Main buttons - always first on mobile, center on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col items-center space-y-3 w-full">
            <Button
              onClick={onRelated}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Finding related...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Similar Next</span>
                </>
              )}
            </Button>
            
            <SaveToCollectionButton article={article} />
          </div>

          {/* Right content last on mobile, right on desktop */}
          <div className="order-3 lg:order-3 lg:col-span-1 w-full">
            <RelatedTopics topics={relatedTopics} isLoading={isLoadingTopics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;
