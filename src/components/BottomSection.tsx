
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import RelatedArticles from './RelatedArticles';

interface BottomSectionProps {
  relatedArticles: string[];
  onRelated: () => void;
  isLoading: boolean;
}

const BottomSection: React.FC<BottomSectionProps> = ({
  relatedArticles,
  onRelated,
  isLoading
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="pt-8 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Related Articles Panel - Left */}
          <div className="col-span-1">
            <RelatedArticles articles={relatedArticles} />
          </div>

          {/* Similar Next Button - Center */}
          <div className="col-span-1 flex justify-center items-center">
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

          {/* Reserved Space for Future Panel - Right */}
          <div className="col-span-1">
            {/* Space reserved for future panel */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;
