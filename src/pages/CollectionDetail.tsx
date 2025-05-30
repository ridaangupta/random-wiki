
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Trash2, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { fetchArticleContent, parseArticleHTML, processArticle } from '@/services/wikipediaService';

interface SavedArticle {
  id: string;
  article_title: string;
  article_url: string;
  extract: string | null;
  thumbnail_url: string | null;
  notes: string | null;
  saved_at: string;
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
}

const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && collectionId) {
      fetchCollectionAndArticles();
    }
  }, [user, collectionId]);

  const fetchCollectionAndArticles = async () => {
    try {
      // Fetch collection details
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .single();

      if (collectionError) throw collectionError;
      setCollection(collectionData);

      // Fetch saved articles in this collection
      const { data: articlesData, error: articlesError } = await supabase
        .from('saved_articles')
        .select('*')
        .eq('collection_id', collectionId)
        .order('saved_at', { ascending: false });

      if (articlesError) throw articlesError;
      setArticles(articlesData || []);
    } catch (error) {
      console.error('Error fetching collection data:', error);
      toast({
        title: "Error",
        description: "Failed to load collection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to remove this article from the collection?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Article removed from collection",
      });

      setArticles(articles.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to remove article",
        variant: "destructive",
      });
    }
  };

  const handleRandomWikiSummary = async (article: SavedArticle) => {
    try {
      // Create a basic article object from the saved article data
      const basicArticle = {
        title: article.article_title,
        extract: article.extract || '',
        thumbnail: article.thumbnail_url ? {
          source: article.thumbnail_url,
          width: 150,
          height: 150
        } : undefined,
        content_urls: {
          desktop: {
            page: article.article_url
          }
        }
      };

      // Process the article to get sections and summaries
      const processedArticle = await processArticle(basicArticle);
      
      // Navigate to home page with the processed article
      navigate('/', { 
        state: { 
          preloadedArticle: processedArticle 
        } 
      });
    } catch (error) {
      console.error('Error processing article for summary:', error);
      toast({
        title: "Error",
        description: "Failed to load article summary. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRandomWikiUrl = (title: string) => {
    return `/?article=${encodeURIComponent(title)}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view collections</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading collection...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
          <Button onClick={() => navigate('/collections')}>Back to Collections</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/collections')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            {collection.description && (
              <p className="text-gray-600 mt-2">{collection.description}</p>
            )}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No articles saved yet</h2>
            <p className="text-gray-600 mb-6">Start saving articles to this collection from the main page</p>
            <Button onClick={() => navigate('/')}>Browse Articles</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {article.article_title}
                      </CardTitle>
                      {article.extract && (
                        <CardDescription className="text-sm">
                          {article.extract.length > 200 
                            ? `${article.extract.slice(0, 200)}...` 
                            : article.extract}
                        </CardDescription>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRandomWikiSummary(article)}
                          className="flex items-center gap-2"
                        >
                          <BookOpen className="h-4 w-4" />
                          Random Wiki Summary
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(article.article_url, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Wikipedia Article
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 ml-4">
                      {article.thumbnail_url && (
                        <img 
                          src={article.thumbnail_url} 
                          alt={article.article_title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {article.notes && (
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-1">Your notes:</p>
                      <p className="text-sm text-gray-600">{article.notes}</p>
                    </div>
                  </CardContent>
                )}
                <CardContent className="pt-2">
                  <p className="text-xs text-gray-500">
                    Saved {new Date(article.saved_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
