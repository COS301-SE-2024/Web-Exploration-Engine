import { ReportRecord } from '../app/models/ReportModels';
import { SeoAnalysis, ScraperResult, Summary } from '../app/models/ScraperModels';

export const mockSeoAnalysis: SeoAnalysis = {
  XMLSitemapAnalysis: {
    isSitemapValid: true,
    recommendations: "Your sitemap is valid and up to date. No changes required.",
  },
  canonicalTagAnalysis: {
    canonicalTag: "https://www.example.com",
    isCanonicalTagPresent: true,
    recommendations: "Canonical tag is properly set.",
  },
  headingAnalysis: {
    count: 6,
    headings: ["H1: Welcome", "H2: Our Services", "H2: Contact Us", "H3: Team", "H3: Testimonials", "H4: Footer"],
    recommendations: "Reduce the number of H3 tags to improve hierarchy.",
  },
  imageAnalysis: {
    errorUrls: ["https://www.example.com/image1.jpg", "https://www.example.com/image2.jpg"],
    missingAltTextCount: 2,
    nonOptimizedCount: 1,
    reasonsMap: {
      format: ["Image format not optimized for web."],
      other: ["Alt text missing in some images."],
      size: ["Image size exceeds optimal limits."],
    },
    recommendations: "Add alt text to all images, optimize size and format.",
    totalImages: 10,
  },
  indexabilityAnalysis: {
    isIndexable: true,
    recommendations: "Page is indexable. No action required.",
  },
  internalLinksAnalysis: {
    recommendations: "Ensure there are no broken internal links.",
    totalLinks: 20,
    uniqueLinks: 18,
  },
  lighthouseAnalysis: {
    scores: {
      accessibility: 95,
      bestPractices: 90,
      performance: 80,
    },
    diagnostics: {
      recommendations: [
        {
          title: "Reduce initial server response time",
          description: "Consider optimizing server response times to improve performance.",
          score: 65,
        },
        {
          title: "Use efficient images",
          description: "Compress images to reduce load time.",
          score: 50,
        },
      ],
    },
  },
  metaDescriptionAnalysis: {
    length: 155,
    recommendations: "Meta description is well-formed, no changes needed.",
    titleTag: "Home - Example Website",
  },
  mobileFriendlinessAnalysis: {
    isResponsive: true,
    recommendations: "Website is mobile-friendly and responsive.",
  },
  siteSpeedAnalysis: {
    loadTime: 3.5,
    recommendations: "Improve load time by optimizing CSS and JS files.",
  },
  structuredDataAnalysis: {
    count: 2,
    recommendations: "Structured data is valid and correctly implemented.",
  },
  titleTagsAnalysis: {
    isUrlWordsInDescription: false,
    length: 60,
    metaDescription: "The best example website for your needs.",
    recommendations: "Title tag length is optimal.",
  },
  uniqueContentAnalysis: {
    recommendations: "Ensure content remains unique and relevant.",
    textLength: 1500,
    uniqueWordsPercentage: 80,
    repeatedWords: [
      { word: "example", count: 5 },
      { word: "website", count: 3 },
    ],
  },
} as SeoAnalysis;

export const mockReport: ScraperResult = {
  url: 'https://example.com',
  domainStatus: "live",
  robots: {
    baseUrl: 'https://example.com',
    allowedPaths: [],
    disallowedPaths: [],
    isUrlScrapable: true,
    isBaseUrlAllowed: true,
  },
  metadata: {
    title: 'Example',
    description: 'Example description',
    keywords: 'example, keywords',
    ogTitle: 'Example',
    ogDescription: 'Example description',
    ogImage: 'https://example.com/image.jpg',
  },
  industryClassification: {
    zeroShotMetaDataClassify: [
      // top 3 categories
      {
        label: 'Industry 1',
        score: 0.5,
      },
      {
        label: 'Industry 2',
        score: 0.4,
      },
      {
        label: 'Industry 3',
        score: 0.3,
      },
    ],
    zeroShotDomainClassify: [
      // top 3 categories
      {
        label: 'Domain Classification 1',
        score: 0.155,
      },
      {
        label: 'Domain Classification 2',
        score: 0.144,
      },
      {
        label: 'Domain Classification 3',
        score: 0.122,
      },
    ],
  },
  logo: 'https://example.com/logo.jpg',
  images: ['https://example.com/image.jpg'],
  slogan: 'Example slogan',
  contactInfo: {
    emails: ['example.com'],
    phones: ['123-456-7890'],
    socialLinks: [],
  },
  time: 0,
  addresses: ['123 Example St'],
  screenshot: 'https://example.com/screenshot.jpg',
  seoAnalysis: mockSeoAnalysis,
  sentiment: {
    sentimentAnalysis: {
      positive: 0.5,
      negative: 0.5,
      neutral: 0,
    },
    positiveWords: ['example'],
    negativeWords: ['example'],
    emotions: {
      neutral: 0,
      joy: 0,
      surprise: 0,
      anger: 0,
      disgust: 0,
      sadness: 0,
      fear: 0,
    }
  },
  scrapeNews: [
    {
      title: "Level up your Heritage Day with Nando’s tips for the perfect braai - CapeTown ETC",
      link: "https://news.google.com/rss/articles/CBMihAFBVV95cUxOVU9aT3l1aENfUHlOS0w2THl3RlZoOUZTU1RoZEcydU9LU1JaYlBpTDd2ZmQwbG1PMjRVbE5NTUR1RjJVOFVhTFg0bGphVmtYU28xTGhyTXRHQ045N0ZGQ2NmaXdReXVwSmRwcmMxaEJJV2lvSWZ4OEN1Tk4xNGFQMW03cGk?oc=5",
      source: "CapeTown ETC",
      pubDate: "Sun, 22 Sep 2024 13:00:56 GMT",
      sentimentScores: {
        positive: 0.7899376153945923,
        negative: 0.0015594614669680595,
        neutral: 0.2085028886795044
      }
    },
    {
      title: "Nando's Stick it out ad brings humour to South Africa's daily struggles - Bizcommunity.com",
      link: "https://news.google.com/rss/articles/CBMitAFBVV95cUxOT2M3dU9fMEEyNFdGNXZmUHVrenBiQjR6Y2o0NVljNnVZcDJTYktzdmtPVnVvRWpLUGRrNHh4OFRQVkN4cmJMZlJCNUxjU0ZNNHZwYXFzOGkzT0Vic09LcG5vQzFmSkZ5V1ZiRDU4RnAzNVJFaFFHclp5VlJZeXVpbGZPekFWYy16bmhMMFROYXpKOHFBdlItcDgtVEx4ZWhrQ2ZneE9vbGlMYkFUcmFHcDhEY2U?oc=5",
      source: "Bizcommunity.com",
      pubDate: "Thu, 12 Sep 2024 07:00:00 GMT",
      sentimentScores: {
        positive: 0.3234110176563263,
        negative: 0.005732724908739328,
        neutral: 0.670856237411499
      }
    },
    {
      title: "South African restaurant Nando's Peri-Peri prepares for first Austin opening while eyeing expansion - The Business Journals",
      link: "https://news.google.com/rss/articles/CBMimwFBVV95cUxNXzc2NlFuZDlwY2FZRXc4dFlxN2N1Rkxla2JZT2J4emtBY2pvblVuQzVoc2hKZUcxSDVBYWU3TU9XSUZZTmxqN3N4N0ozd0d4NUZ6QjlOc1Q5UWRJZTRvRTVUSHZNM0E1dGZ4azYtdEp4UERlUlJMTnlST0pkMzFPWmtJdzdWbWFuMnVZVVRfUjJLWnlyODRVV2dMMA?oc=5",
      source: "The Business Journals",
      pubDate: "Mon, 23 Sep 2024 12:56:00 GMT",
      sentimentScores: {
        positive: 0.09960536658763885,
        negative: 0.0022338044364005327,
        neutral: 0.8981608748435974
      }
    },
    {
      title: "The men behind Nando’s – South Africa’s global peri-peri chicken empire - BusinessTech",
      link: "https://news.google.com/rss/articles/CBMitwFBVV95cUxOVnlJbkhXalBkei1URzY3R3dkVmdDUTZTSF9NcDVFYWdmV3pyUVlXZF8ySkk3WVJCNGNMR0lwQ0lhNFhvM3lJbl9BSW0zbjViYXpDamhwOW50X2RaU0ZBUlVlQ3EybnpSZ2QwMWMxV2FZN0JEVWtrSmZaN3FPa2pGek9UdjZKOWkxblhLYlNzNUpvU29lX2twSThKdVFuaGRneUk5OTNyMDR3S1NpSUdTcUh1M0JiWEk?oc=5",
      source: "BusinessTech",
      pubDate: "Thu, 25 Jul 2024 07:00:00 GMT",
      sentimentScores: {
        positive: 0.020457826554775238,
        negative: 0.010590984486043453,
        neutral: 0.9689511060714722
      }
    },
    {
      title: "Nando’s is SA’s official support group — and releases new dish to prove it - TimesLIVE",
      link: "https://news.google.com/rss/articles/CBMixgFBVV95cUxNaWtIUHliTWREZkUxVlJnMHNOWl94ZGRYTnNKVnhVVWZKQThqRWZmZHUxVDlDZXl5aENJOW16RkF1eGxNZG5LR1VXRXN3N2VBNjQ4WjJFZmY0bTVNRW93NWlFTElINUh2c1pyTDVocjVIVmVWUW56eDhoWEtyLU8yX1AydTd1czM5WVBnZ1QwTFA5ODYyZHZxN1JkS3luXzRleHh4UkhXd2lha1NTcGJUd1lYaWc0N0lRaDlxOWV5Tm9ZY0E3UEHSAcsBQVVfeXFMUEdadVBzZjMwNmhRcUZkOHdBWGVyNzIzX1V0NlhzblVfOXg5cFNGQjhQUlM3a3dBMkZ5WHlfOHI3QUliMEREa05vN0Q0LWJpTEtGaFRqQmtUbG03eEZ6WFFFbWU3TFgtQzRDVXlaVEx0dzN6RzVVYjNhaU9ZRmxjU081OGhWbS1jM1hUWFlwbmdJRmktYlROQ1FWajYyVW5zamc5YUlva0ZLaDM0Wmc2OTlSa0xmRVdfMVlNRTc1dkIyQWZ6REUtVy1pUlk?oc=5",
      source: "TimesLIVE",
      pubDate: "Fri, 30 Aug 2024 07:00:00 GMT",
      sentimentScores: {
        positive: 0.32251447439193726,
        negative: 0.0028901200275868177,
        neutral: 0.6745954155921936
      }
    }
  ],
  shareCountdata: {
    Facebook: {
      comment_plugin_count: 0,
      total_count: 9250,
      og_object: null,
      comment_count: 714,
      share_count: 6631,
      reaction_count: 1905
    },
    Pinterest: 5
  },
  reviews: {
    rating: 1.65,
    numberOfReviews: 6,
    trustIndex: 2.8,
    NPS: -57,
    recommendationStatus: "",
    starRatings: [
      {
        stars: 5,
        numReviews: 580
      },
      {
        stars: 4,
        numReviews: 64
      },
      {
        stars: 3,
        numReviews: 61
      },
      {
        stars: 2,
        numReviews: 1342
      },
      {
        stars: 1,
        numReviews: 4112
      }
    ]
  }
}

export const mockReportSummary: Summary = {
  domainStatus: [200, 404],
  domainErrorStatus: 1,
  industryClassification: {
    unclassifiedUrls: ['https://www.example.com'],
    industryPercentages: {
      industries: ['E-commerce', 'Unknown'],
      percentages: [75, 25],
    },
    weakClassification: [
      {
        url: 'https://www.example3.com',
        metadataClass: 'E-commerce',
        score: 21,
      },
    ],
  },
  domainMatch: {
    percentageMatch: 75,
    mismatchedUrls: [
      {
        url: 'https://www.example.com',
        metadataClass: 'Automotive',
        domainClass: 'Unknown',
      },
    ],
  },
  totalUrls: 3,
  parkedUrls: ['https://www.example2.com'],
  scrapableUrls: 2,
  avgTime: 100,
  metaRadar: {
    categories: ['example1', 'example2'],
    series: [
      {
        name: 'example1',
        data: [50, 50],
      },
      {
        name: 'example2',
        data: [50, 50],
      },
    ],
  },
  domainRadar: {
    categories: ['example1', 'example2'],
    series: [
      {
        name: 'example1',
        data: [50, 50],
      },
      {
        name: 'example2',
        data: [50, 50],
      },
    ],
  },
  emotionsArea: {
    series: [
      {
        name: 'example1',
        data: [50, 50],
      },
      {
        name: 'example2',
        data: [50, 50],
      },
    ],
  },
  topNPS : {
    urls: [
      "http://example2.com",
      "http://example1.com",
      "http://example4.com",
    ],
    scores: [-57, -58, -77]
  },
  topTrustIndex : {
    urls: [
      "http://example2.com",
      "http://example1.com",
      "http://example4.com",
    ],
    scores: [2.8, 2.7, 2.2]
  },
  topRating : {
    urls: [
      "http://example1.com",
      "http://example2.com",
      "http://example4.com",
    ],
    scores: [1.83, 1.65, 1.56]
  },
  averageStarRating: [827.75, 85, 98, 1757, 6846.25],
  socialMetrics: {
    urls: ["http://example1.com", "http://example2.com", "http://example3.com", "http://example4.com"],
    facebookShareCount: [7037, 6631, 15790, 3032],
    facebookCommentCount: [180,714,589,841],
    facebookReactionCount: [12103, 1905,17311,10190],
  },
  newsSentiment: {
    urls: ["http://example1.com", "http://example2.com", "http://example3.com", "http://example4.com"],
    positive: [31,31,3,3],
    neutral: [68,68,51,51],
    negative: [0,0,46,46]
  }
}

export const mockReports: ReportRecord[] = [
  {
    id: 0,
    userId: '1ad80d59-e8b1-426c-8254-4cb96abc4857',
    reportName: 'Test Report',
    reportData: mockReport,
    isSummary: false,
    savedAt: '2021-01-01',
  },
];

export const mockSummaries: ReportRecord[] = [
  {
    id: 1,
    userId: '48787157-7555-4104-bafc-e2c95bbaa959',
    reportName: 'Test Summary',
    reportData: mockReportSummary,
    isSummary: true,
    savedAt: '2021-01-01',
  },
]

