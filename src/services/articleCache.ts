
import { fetchRandomArticle, fetchRelatedArticle, processArticle, WikipediaArticle } from './wikipediaService';

export type ArticleType = 'random' | 'related';

interface CachedArticle {
  article: WikipediaArticle;
  type: ArticleType;
  relatedTo?: string;
}

class ArticleCacheService {
  private cache: CachedArticle[] = [];
  private isPreloading = false;
  private maxCacheSize = 2;

  async getNextArticle(type: ArticleType = 'random', relatedTo?: string): Promise<WikipediaArticle> {
    console.log(`Getting next article of type: ${type}`);
    
    // Try to get from cache first
    const cachedIndex = this.cache.findIndex(cached => 
      cached.type === type && 
      (type === 'random' || cached.relatedTo === relatedTo)
    );

    if (cachedIndex !== -1) {
      console.log('Found article in cache, returning instantly');
      const cachedArticle = this.cache.splice(cachedIndex, 1)[0];
      
      // Trigger prefetch of next article
      this.prefetchNext(type, relatedTo);
      
      return cachedArticle.article;
    }

    // If not in cache, fetch normally
    console.log('Article not in cache, fetching...');
    const article = await this.fetchAndProcessArticle(type, relatedTo);
    
    // Start prefetching for next time
    this.prefetchNext(type, relatedTo);
    
    return article;
  }

  private async fetchAndProcessArticle(type: ArticleType, relatedTo?: string): Promise<WikipediaArticle> {
    let rawArticle: WikipediaArticle;
    
    if (type === 'related' && relatedTo) {
      rawArticle = await fetchRelatedArticle(relatedTo);
    } else {
      rawArticle = await fetchRandomArticle();
    }
    
    return await processArticle(rawArticle);
  }

  private async prefetchNext(type: ArticleType, relatedTo?: string): Promise<void> {
    if (this.isPreloading || this.cache.length >= this.maxCacheSize) {
      return;
    }

    this.isPreloading = true;
    console.log(`Prefetching next ${type} article...`);

    try {
      // Prefetch a random article (most common case)
      if (!this.cache.some(cached => cached.type === 'random')) {
        const randomArticle = await this.fetchAndProcessArticle('random');
        this.cache.push({
          article: randomArticle,
          type: 'random'
        });
        console.log('Prefetched random article:', randomArticle.title);
      }

      // If we have space and are dealing with related articles, prefetch one more
      if (type === 'related' && relatedTo && this.cache.length < this.maxCacheSize) {
        const relatedArticle = await this.fetchAndProcessArticle('related', relatedTo);
        this.cache.push({
          article: relatedArticle,
          type: 'related',
          relatedTo
        });
        console.log('Prefetched related article:', relatedArticle.title);
      }
    } catch (error) {
      console.error('Error prefetching article:', error);
    } finally {
      this.isPreloading = false;
    }
  }

  initializeCache(): void {
    console.log('Initializing article cache...');
    // Start prefetching random articles right away
    this.prefetchNext('random');
  }

  clearCache(): void {
    console.log('Clearing article cache');
    this.cache = [];
    this.isPreloading = false;
  }

  getCacheStatus(): { size: number; isPreloading: boolean } {
    return {
      size: this.cache.length,
      isPreloading: this.isPreloading
    };
  }
}

// Export a singleton instance
export const articleCache = new ArticleCacheService();
