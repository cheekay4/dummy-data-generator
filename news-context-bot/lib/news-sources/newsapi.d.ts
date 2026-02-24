declare module 'newsapi' {
  interface NewsAPIArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }

  interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
  }

  interface EverythingOptions {
    q?: string;
    language?: string;
    from?: string;
    to?: string;
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    pageSize?: number;
    page?: number;
  }

  interface TopHeadlinesOptions {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  }

  class NewsAPI {
    constructor(apiKey: string);
    v2: {
      everything(options: EverythingOptions): Promise<NewsAPIResponse>;
      topHeadlines(options: TopHeadlinesOptions): Promise<NewsAPIResponse>;
    };
  }

  export = NewsAPI;
}
