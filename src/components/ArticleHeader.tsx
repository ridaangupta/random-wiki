
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

interface ArticleHeaderProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  isLoadingNext: boolean;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  onNext,
  onPrevious,
  canGoPrevious,
  isLoadingNext
}) => {
  return (
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
            onClick={onNext}
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
  );
};

export default ArticleHeader;
