import { ScrapeResult } from "../models/scraperModels";
import { ScheduleResult, ScheduleTaskResponse } from "../models/scheduleTaskModels";

export const mockScrapeResult: ScrapeResult = {
  url: "https://www.example.com",
  domainStatus: "active",
  robots: {
    baseUrl: "https://www.example.com",
    allowedPaths: ["/about", "/products"],
    disallowedPaths: ["/admin", "/private"],
    isUrlScrapable: true,
    isBaseUrlAllowed: true
  },
  metadata: {
    title: "Example Website",
    description: "This is an example website for testing purposes.",
    keywords: "example, website, test",
    ogTitle: "Example Website - Home",
    ogDescription: "Welcome to the example website.",
    ogImage: "https://www.example.com/og-image.jpg"
  },
  industryClassification: {
    zeroShotMetaDataClassify: [
      { label: "Technology", score: 0.85 },
      { label: "E-commerce", score: 0.75 }
    ],
    zeroShotDomainClassify: [
      { label: "Retail", score: 0.90 },
      { label: "Software", score: 0.70 }
    ]
  },
  logo: "https://www.example.com/logo.png",
  images: [
    "https://www.example.com/image1.jpg",
    "https://www.example.com/image2.jpg"
  ],
  slogan: "Innovation meets simplicity",
  contactInfo: {
    emails: ["contact@example.com"],
    phones: ["+1234567890"],
    socialLinks: ["https://www.facebook.com/example", "https://twitter.com/example"]
  },
  addresses: ["123 Example Street, Example City, EX 12345"],
  screenshot: "https://www.example.com/screenshot.png",
  seoAnalysis: {
    titleLength: 50,
    descriptionLength: 150,
    keywordsFound: ["example", "website", "test"]
  },
  sentiment: {
    sentimentAnalysis: {
      positive: 0.8,
      negative: 0.1,
      neutral: 0.1
    },
    positiveWords: ["great", "innovative", "fantastic"],
    negativeWords: ["slow"],
    emotions: {
      joy: 0.75,
      surprise: 0.15,
      anger: 0.05,
      sadness: 0.05
    }
  },
  scrapeNews: [
    {
      title: "Example launches new product",
      link: "https://www.example.com/news/product-launch",
      source: "Example News",
      pubDate: "2024-09-15",
      sentimentScores: {
        positive: 0.9,
        negative: 0.05,
        neutral: 0.05
      }
    },
    {
      title: "Example partners with another company",
      link: "https://www.example.com/news/partnership",
      source: "Example News",
      pubDate: "2024-09-10"
    }
  ],
  shareCountdata: {
    Facebook: {
      comment_plugin_count: 20,
      total_count: 100,
      og_object: {},
      comment_count: 10,
      share_count: 50,
      reaction_count: 40
    },
    Pinterest: 30
  },
  time: 1200,
  reviews: {
    rating: 4.5,
    numberOfReviews: 150,
    trustIndex: 90,
    NPS: 70,
    recommendationStatus: "Highly recommended",
    starRatings: [
      { stars: 5, numReviews: 100 },
      { stars: 4, numReviews: 30 },
      { stars: 3, numReviews: 15 },
      { stars: 2, numReviews: 5 },
      { stars: 1, numReviews: 0 }
    ]
  }
};

export const emptyResultHistory: ScheduleResult = {
  commentCount: [],
  shareCount: [],
  reactionCount: [],
  totalEngagement: [],
  pinCount: [],
  rating: [],
  numReviews: [],
  trustIndex: [],
  newsSentiment: {
    positiveAvg: [],
    negativeAvg: [],
    neutralAvg: [],
  },
  NPS: [],
  recommendationStatus: [],
  starRatings: [],
  siteSpeed: [],
  performanceScore: [],
  accessibilityScore: [],
  bestPracticesScore: [],
  timestampArr: []
};

export const schedules: ScheduleTaskResponse[] = [{ 
    id: '1', 
    user_id: '1', 
    url: 'http://example.com', 
    frequency: 'daily', 
    next_scrape: '2021-01-01T00:00:00.000Z', 
    updated_at: '2021-01-01T00:00:00.000Z', 
    created_at: '2021-01-01T00:00:00.000Z', 
    result_history: emptyResultHistory,
    keywords: [],
    keyword_results: [],
  },
  { 
    id: '2', 
    user_id: '1', 
    url: 'http://example.org', 
    frequency: 'weekly', 
    next_scrape: '2021-01-01T00:00:00.000Z', 
    updated_at: '2021-01-01T00:00:00.000Z', 
    created_at: '2021-01-01T00:00:00.000Z', 
    result_history: emptyResultHistory,
    keywords: [],
    keyword_results: [],
  }
];

export const scheduleWithKeyword: ScheduleTaskResponse[] = [{
  id: '1',
  user_id: '1',
  url: 'http://example.com',
  frequency: 'daily',
  next_scrape: '2021-01-01T00:00:00.000Z',
  updated_at: '2021-01-01T00:00:00.000Z',
  created_at: '2021-01-01T00:00:00.000Z',
  result_history: emptyResultHistory,
  keywords: ['example'],
  keyword_results: []
}];

