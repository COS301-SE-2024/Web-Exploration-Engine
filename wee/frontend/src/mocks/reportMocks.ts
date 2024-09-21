import { ReportRecord } from '../models/ReportModels';
import { SeoAnalysis, ScraperResult, Summary } from '../models/ScraperModels';

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
          label: 'example',
          score: 0.1,
        },
        {
          label: 'example',
          score: 0.1,
        },
        {
          label: 'example',
          score: 0.1,
        },
     ],
      zeroShotDomainClassify: [
        // top 3 categories
          {
            label: 'example',
            score: 0.1,
          },
          {
            label: 'example',
            score: 0.1,
          },
          {
            label: 'example',
            score: 0.1,
          },
      ],
    },
    logo: 'https://example.com/logo.jpg',
    images: ['https://example.com/image.jpg'],
    slogan: 'Example slogan',
    contactInfo: {
      emails: ['example.com'],
      phones: ['123-456-7890'],
      socialLinks: ['https://example.com'],
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
    reportName: 'Test Report',
    reportData: mockReportSummary,
    isSummary: true,
    savedAt: '2021-01-01',
  },
]

