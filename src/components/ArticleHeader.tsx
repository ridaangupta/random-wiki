
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Loader2, User, LogOut, FolderOpen, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleCollectionsClick = () => {
    navigate('/collections');
  };

  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Mobile layout */}
        <div className="flex justify-between items-center sm:hidden">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🔍 Random Wiki
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={onNext}
              disabled={isLoadingNext}
              variant="outline"
              size="sm"
              className="p-2"
            >
              {isLoadingNext ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuItem disabled className="text-xs text-gray-500">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCollectionsClick}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Collections
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            🔍 Random Wiki
          </div>
          
          <div className="flex items-center gap-2">
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">
                      {user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuItem disabled className="text-xs text-gray-500">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCollectionsClick}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Collections
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default ArticleHeader;
