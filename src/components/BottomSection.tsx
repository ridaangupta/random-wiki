
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
        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Related Articles Panel - Left */}
          <div className="col-span-1">
            <RelatedArticles articles={relatedArticles} />
          </div>

          {/* Similar Next Button and Save Button - Center */}
          <div className="col-span-1 flex flex-col items-center space-y-4">
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
            
            <SaveToCollectionButton article={article} />
          </div>

          {/* Related Topics Panel - Right */}
          <div className="col-span-1">
            <RelatedTopics topics={relatedTopics} isLoading={isLoadingTopics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;
