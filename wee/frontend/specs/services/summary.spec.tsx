import { generateSummary } from '../../src/app/services/SummaryService';
import { ScraperResult } from '../../src/app/models/ScraperModels';

jest.mock('../../src/app/context/ScrapingContext', () => ({
  useScrapingContext: jest.fn(),
}));

describe('SummaryService', () => {
  const scraperResults: ScraperResult[] = [
    { 
      url: 'http://example1.com', 
      domainStatus: 'live', 
      robots: {
        baseUrl: 'http://example1.com',
        allowedPaths: [],
        disallowedPaths: [],
        isUrlScrapable: true,
        isBaseUrlAllowed: true
      },
      metadata: {
        title: 'Example 1',
        description: 'This is an example',
        keywords: 'example',
        ogTitle: 'Example 1',
        ogDescription: 'This is an example',
        ogImage: 'http://example1.com/image.jpg'
      },
      industryClassification: { 
        metadataClass: { label: 'Unknown', score: 0 }, 
        domainClass: { label: 'Unknown', score: 0 },
        zeroShotMetaDataClassify: [
          {
              "label": "Finance and Banking",
              "score": 68
          },
          {
              "label": "Utilities",
              "score": 19
          },
          {
              "label": "Marine Resources",
              "score": 18
          }
        ],
        zeroShotDomainClassify: [
          {
              "label": "Finance and Banking",
              "score": 69
          },
          {
              "label": "Marine and Shipping",
              "score": 16
          },
          {
              "label": "Logistics and Supply Chain Management",
              "score": 14
          }
        ]
      },
      logo: '',
      images: [],
      slogan: '',
      time: 0,
      screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      addresses: ['15 Troye Street, Johannesburg, Gauteng'],
      contactInfo: {
          emails: [],
          phones: [],
          socialLinks: [
              "https://www.facebook.com/AbsaSouthAfrica/",
              "https://twitter.com/AbsaSouthAfrica",
              "https://www.linkedin.com/company/absa/"
          ]
      },
      sentiment: {
        sentimentAnalysis: {
          positive: 0.94,
          negative: 0.001,
          neutral: 0.05,
        },
        positiveWords: ['Flame', '100%', 'choice'],
        negativeWords: ['Nothing', 'slaps'],
        emotions: {
          neutral: 0.88,
          joy: 0.02,
          surprise: 0.1,
          anger: 0.01,
          disgust: 0.2,
          sadness: 0.003,
          fear: 0.002,
        },
      },
      seoAnalysis: {
        XMLSitemapAnalysis: {error: 'Error Message'},
        lighthouseAnalysis: {error: 'Error Message'},
        siteSpeedAnalysis: {error: 'Error Message'},
        canonicalTagAnalysis: {error: 'Error Message'},
        headingAnalysis: {
            count: 2,
            headings: ['HeadingOne', 'HeadingTwo'],
            recommendations: 'This is a heading recommendation',
        },
        imageAnalysis: {
            errorUrls: [],
            missingAltTextCount: 11,
            nonOptimizedCount: 3,
            reasonsMap: {
                format: ['https://www.exampleOne.com/coast.png', 'https://www.exampleTwo.com/lion.svg', 'https://www.exampleThree.com/ocean.jpg'],
                other: [],
                size: [],
            },
            recommendations: '11 images are missing alt text. 3 images are not optimized.',
            totalImages: 27,
        },
        indexabilityAnalysis: {error: 'Error Message'},
        internalLinksAnalysis: {
            recommendations: 'This is the internal linking recommendation',
            totalLinks: 17,
            uniqueLinks: 9,
        },
        metaDescriptionAnalysis: {
            length: 80,
            recommendations: "Title tag length should be between 50 and 60 characters.",
            titleTag: "South African Online Computer Store",
        },
        mobileFriendlinessAnalysis: {error: 'Error Message'},
        structuredDataAnalysis: {error: 'Error Message'},
        titleTagsAnalysis: {
            isUrlWordsInDescription: false,
            length: 88,
            metaDescription: "Buy computers, hardware, software, laptops & more from South Africa's best online store.",
            recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: wootware.',
        },
        uniqueContentAnalysis: {
            recommendations: '',
            textLength: 743,
            uniqueWordsPercentage: 41.72,
            repeatedWords: [
                {
                    word: 'repeatedWordsOne',
                    count: 19,
                }
            ]
        },
      }
    },
    { 
      url: 'http://example2.com', 
      domainStatus: 'parked', 
      robots: {
        baseUrl: 'http://example1.com',
        allowedPaths: [],
        disallowedPaths: [],
        isUrlScrapable: true,
        isBaseUrlAllowed: true
      },
      metadata: {
        title: 'Example 1',
        description: 'This is an example',
        keywords: 'example',
        ogTitle: 'Example 1',
        ogDescription: 'This is an example',
        ogImage: 'http://example1.com/image.jpg'
      },
      industryClassification: { 
        metadataClass: { label: 'Unknown', score: 0 }, 
        domainClass: { label: 'Unknown', score: 0 } ,
        zeroShotMetaDataClassify: [
          {
              "label": "Restaurants",
              "score": 86
          },
          {
              "label": "Hospitality",
              "score": 54
          },
          {
              "label": "Retail and Consumer Goods",
              "score": 29
          }
        ],
        zeroShotDomainClassify: [
          {
              "label": "Fitness and Wellness",
              "score": 23
          },
          {
              "label": "Marine and Shipping",
              "score": 17
          },
          {
              "label": "Utilities",
              "score": 13
          }
        ]
      },
      logo: '',
      images: [],
      slogan: '',
      time: 0,
      screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      addresses: ['15 Troye Street, Johannesburg, Gauteng'],
      contactInfo: {
          emails: [],
          phones: [],
          socialLinks: [
              "https://www.facebook.com/AbsaSouthAfrica/",
              "https://twitter.com/AbsaSouthAfrica",
              "https://www.linkedin.com/company/absa/"
          ]
      },
      sentiment: {
        sentimentAnalysis: {
          positive: 0.82,
          negative: 0.002,
          neutral: 0.18,
        },
        positiveWords: ['your', 'journey'],
        negativeWords: ['Nedbank'],
        emotions: {
          neutral: 0.77,
          joy: 0.17,
          surprise: 0.1,
          anger: 0.006,
          disgust: 0.002,
          sadness: 0.007,
          fear: 0.014,
        },
      },
      seoAnalysis: {
        XMLSitemapAnalysis: {error: 'Error Message'},
        lighthouseAnalysis: {error: 'Error Message'},
        siteSpeedAnalysis: {error: 'Error Message'},
        canonicalTagAnalysis: {error: 'Error Message'},
        headingAnalysis: {
            count: 2,
            headings: ['HeadingOne', 'HeadingTwo'],
            recommendations: 'This is a heading recommendation',
        },
        imageAnalysis: {
            errorUrls: [],
            missingAltTextCount: 11,
            nonOptimizedCount: 3,
            reasonsMap: {
                format: ['https://www.exampleOne.com/coast.png', 'https://www.exampleTwo.com/lion.svg', 'https://www.exampleThree.com/ocean.jpg'],
                other: [],
                size: [],
            },
            recommendations: '11 images are missing alt text. 3 images are not optimized.',
            totalImages: 27,
        },
        indexabilityAnalysis: {error: 'Error Message'},
        internalLinksAnalysis: {
            recommendations: 'This is the internal linking recommendation',
            totalLinks: 17,
            uniqueLinks: 9,
        },
        metaDescriptionAnalysis: {
            length: 80,
            recommendations: "Title tag length should be between 50 and 60 characters.",
            titleTag: "South African Online Computer Store",
        },
        mobileFriendlinessAnalysis: {error: 'Error Message'},
        structuredDataAnalysis: {error: 'Error Message'},
        titleTagsAnalysis: {
            isUrlWordsInDescription: false,
            length: 88,
            metaDescription: "Buy computers, hardware, software, laptops & more from South Africa's best online store.",
            recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: wootware.',
        },
        uniqueContentAnalysis: {
            recommendations: '',
            textLength: 743,
            uniqueWordsPercentage: 41.72,
            repeatedWords: [
                {
                    word: 'repeatedWordsOne',
                    count: 19,
                }
            ]
        },
      }
    },
    { 
      url: 'http://example3.com', 
      domainStatus: 'error', 
      robots: {
        baseUrl: 'http://example1.com',
        allowedPaths: [],
        disallowedPaths: [],
        isUrlScrapable: true,
        isBaseUrlAllowed: true
      },
      metadata: {
        title: 'Example 1',
        description: 'This is an example',
        keywords: 'example',
        ogTitle: 'Example 1',
        ogDescription: 'This is an example',
        ogImage: 'http://example1.com/image.jpg'
      },
      industryClassification: { 
        metadataClass: { label: 'Unknown', score: 0 }, 
        domainClass: { label: 'Unknown', score: 0 } ,
        zeroShotMetaDataClassify: [
          {
              "label": "Restaurants",
              "score": 60
          },
          {
              "label": "Hospitality",
              "score": 38
          },
          {
              "label": "Retail and Consumer Goods",
              "score": 16
          }
        ],
        zeroShotDomainClassify: [
          {
              "label": "Fitness and Wellness",
              "score": 17
          },
          {
              "label": "Arts and Culture",
              "score": 15
          },
          {
              "label": "Retail and Consumer Goods",
              "score": 14
          }
      ]
      },
      logo: '',
      images: [],
      slogan: '',
      time: 0,
      screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      addresses: ['15 Troye Street, Johannesburg, Gauteng'],
      contactInfo: {
          emails: [],
          phones: [],
          socialLinks: [
              "https://www.facebook.com/AbsaSouthAfrica/",
              "https://twitter.com/AbsaSouthAfrica",
              "https://www.linkedin.com/company/absa/"
          ]
      },
      sentiment: {
        sentimentAnalysis: {
          positive: 0.98,
          negative: 0.005,
          neutral: 0.01,
        },
        positiveWords: ['Life', 'Welcome', 'entire', 'enjoy', 'together'],
        negativeWords: [],
        emotions: {
          neutral: 0.77,
          joy: 0.17,
          surprise: 0.1,
          anger: 0.005,
          disgust: 0.002,
          sadness: 0.007,
          fear: 0.014,
        },
      },
      seoAnalysis: {
        XMLSitemapAnalysis: {error: 'Error Message'},
        lighthouseAnalysis: {error: 'Error Message'},
        siteSpeedAnalysis: {error: 'Error Message'},
        canonicalTagAnalysis: {error: 'Error Message'},
        headingAnalysis: {
            count: 2,
            headings: ['HeadingOne', 'HeadingTwo'],
            recommendations: 'This is a heading recommendation',
        },
        imageAnalysis: {
            errorUrls: [],
            missingAltTextCount: 11,
            nonOptimizedCount: 3,
            reasonsMap: {
                format: ['https://www.exampleOne.com/coast.png', 'https://www.exampleTwo.com/lion.svg', 'https://www.exampleThree.com/ocean.jpg'],
                other: [],
                size: [],
            },
            recommendations: '11 images are missing alt text. 3 images are not optimized.',
            totalImages: 27,
        },
        indexabilityAnalysis: {error: 'Error Message'},
        internalLinksAnalysis: {
            recommendations: 'This is the internal linking recommendation',
            totalLinks: 17,
            uniqueLinks: 9,
        },
        metaDescriptionAnalysis: {
            length: 80,
            recommendations: "Title tag length should be between 50 and 60 characters.",
            titleTag: "South African Online Computer Store",
        },
        mobileFriendlinessAnalysis: {error: 'Error Message'},
        structuredDataAnalysis: {error: 'Error Message'},
        titleTagsAnalysis: {
            isUrlWordsInDescription: false,
            length: 88,
            metaDescription: "Buy computers, hardware, software, laptops & more from South Africa's best online store.",
            recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: wootware.',
        },
        uniqueContentAnalysis: {
            recommendations: '',
            textLength: 743,
            uniqueWordsPercentage: 41.72,
            repeatedWords: [
                {
                    word: 'repeatedWordsOne',
                    count: 19,
                }
            ]
        },
      }
    },
    { 
      url: 'http://example4.com', 
      domainStatus: 'live', 
      robots: {
        baseUrl: 'http://example4.com',
        allowedPaths: [],
        disallowedPaths: [],
        isUrlScrapable: true,
        isBaseUrlAllowed: true
      },
      metadata: {
        title: 'Example 1',
        description: 'This is an example',
        keywords: 'example',
        ogTitle: 'Example 1',
        ogDescription: 'This is an example',
        ogImage: 'http://example1.com/image.jpg'
      },
      industryClassification: { 
        metadataClass: { label: 'Unknown', score: 0 }, 
        domainClass: { label: 'Unknown', score: 0 } ,
        zeroShotMetaDataClassify: [
          {
              "label": "Retail and Consumer Goods",
              "score": 20
          },
          {
              "label": "Logistics and Supply Chain Management",
              "score": 13
          },
          {
              "label": "Utilities",
              "score": 13
          }
        ],
        zeroShotDomainClassify: [
          {
              "label": "Marine and Shipping",
              "score": 17
          },
          {
              "label": "Fitness and Wellness",
              "score": 13
          },
          {
              "label": "Logistics and Supply Chain Management",
              "score": 14
          }
      ]
      },
      logo: '',
      images: [],
      slogan: '',
      time: 0,
      screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      addresses: ['15 Troye Street, Johannesburg, Gauteng'],
      contactInfo: {
          emails: [],
          phones: [],
          socialLinks: [
              "https://www.facebook.com/AbsaSouthAfrica/",
              "https://twitter.com/AbsaSouthAfrica",
              "https://www.linkedin.com/company/absa/"
          ]
      },
      sentiment: {
        sentimentAnalysis: {
          positive: 0.98,
          negative: 0.001,
          neutral: 0.015,
        },
        positiveWords: ['best', 'everyone', 'good', 'Famous', 'Take', 'Quick'],
        negativeWords: [],
        emotions: {
          neutral: 0.44,
          joy: 0.27,
          surprise: 0.26,
          anger: 0.004,
          disgust: 0.002,
          sadness: 0.007,
          fear: 0.002,
        },
      },
      seoAnalysis: {
        XMLSitemapAnalysis: {error: 'Error Message'},
        lighthouseAnalysis: {error: 'Error Message'},
        siteSpeedAnalysis: {error: 'Error Message'},
        canonicalTagAnalysis: {error: 'Error Message'},
        headingAnalysis: {
            count: 2,
            headings: ['HeadingOne', 'HeadingTwo'],
            recommendations: 'This is a heading recommendation',
        },
        imageAnalysis: {
            errorUrls: [],
            missingAltTextCount: 11,
            nonOptimizedCount: 3,
            reasonsMap: {
                format: ['https://www.exampleOne.com/coast.png', 'https://www.exampleTwo.com/lion.svg', 'https://www.exampleThree.com/ocean.jpg'],
                other: [],
                size: [],
            },
            recommendations: '11 images are missing alt text. 3 images are not optimized.',
            totalImages: 27,
        },
        indexabilityAnalysis: {error: 'Error Message'},
        internalLinksAnalysis: {
            recommendations: 'This is the internal linking recommendation',
            totalLinks: 17,
            uniqueLinks: 9,
        },
        metaDescriptionAnalysis: {
            length: 80,
            recommendations: "Title tag length should be between 50 and 60 characters.",
            titleTag: "South African Online Computer Store",
        },
        mobileFriendlinessAnalysis: {error: 'Error Message'},
        structuredDataAnalysis: {error: 'Error Message'},
        titleTagsAnalysis: {
            isUrlWordsInDescription: false,
            length: 88,
            metaDescription: "Buy computers, hardware, software, laptops & more from South Africa's best online store.",
            recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: wootware.',
        },
        uniqueContentAnalysis: {
            recommendations: '',
            textLength: 743,
            uniqueWordsPercentage: 41.72,
            repeatedWords: [
                {
                    word: 'repeatedWordsOne',
                    count: 19,
                }
            ]
        },
      }
    },
  ];

  it('should correctly summarize all live URLs', () => {
    scraperResults[0].domainStatus = 'live';
    scraperResults[1].domainStatus = 'live';
    scraperResults[2].domainStatus = 'live';
    scraperResults[3].domainStatus = 'live';

    const summary = generateSummary(scraperResults);
    expect(summary.domainStatus[0]).toBe(4);
    expect(summary.domainStatus[1]).toBe(0);
    expect(summary.domainErrorStatus).toBe(0);
  });

  it('should correctly summarize all parked URLs', () => {
    scraperResults[0].domainStatus = 'parked';
    scraperResults[1].domainStatus = 'parked';
    scraperResults[2].domainStatus = 'parked';
    scraperResults[3].domainStatus = 'parked';

    const summary = generateSummary(scraperResults);
    expect(summary.domainStatus[0]).toBe(0);
    expect(summary.domainStatus[1]).toBe(4);
    expect(summary.domainErrorStatus).toBe(0);
  });

  it('should correctly summarize mixed URL statuses', () => {
    scraperResults[0].domainStatus = 'live';
    scraperResults[1].domainStatus = 'parked';
    scraperResults[2].domainStatus = 'live';
    scraperResults[3].domainStatus = 'error';

    const summary = generateSummary(scraperResults);
    expect(summary.domainStatus[0]).toBe(2);
    expect(summary.domainStatus[1]).toBe(1);
    expect(summary.domainErrorStatus).toBe(1);
  });

  it('should correctly calculate industry classification percentages', () => {
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].label = 'Retail';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.industryPercentages).toEqual(
      {
        industries: ['Tech', 'Retail'],
        percentages: [75, 25]
      }
    );
  });

  it('should correctly calculate industry classification percentages with unknowns', () => {
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].label = 'Unknown';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.industryPercentages).toEqual(
      {
        industries: ['Tech', 'Unknown'],
        percentages: [75, 25]
      }
    );

    expect(summary.industryClassification.unclassifiedUrls).toEqual(expect.arrayContaining([
      'http://example3.com'
    ]));
  });

  it('should correctly calculate domain match percentages', () => {
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[0].industryClassification.zeroShotDomainClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotDomainClassify[0].label = 'Retail';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].label = 'Retail';
    scraperResults[2].industryClassification.zeroShotDomainClassify[0].label = 'Unknown';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[3].industryClassification.zeroShotDomainClassify[0].label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.domainMatch.percentageMatch).toBe(50);
    expect(summary.domainMatch.mismatchedUrls).toEqual(expect.arrayContaining([
      { url: 'http://example2.com', metadataClass: 'Tech', domainClass: 'Retail' },
      { url: 'http://example3.com', metadataClass: 'Retail', domainClass: 'Unknown' }
    ]));
  });

  it('should correctly calculate domain match percentages with no mismatches', () => {
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[0].industryClassification.zeroShotDomainClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotDomainClassify[0].label = 'Tech';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].label = 'Retail';
    scraperResults[2].industryClassification.zeroShotDomainClassify[0].label = 'Retail';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[3].industryClassification.zeroShotDomainClassify[0].label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.domainMatch.percentageMatch).toBe(100);
    expect(summary.domainMatch.mismatchedUrls).toEqual(expect.arrayContaining([]));
  });

  it('should correctly identify weak classifications' , () => {
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].score = 0.4;
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].score = 0.6;
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].label = 'Retail';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].score = 0.4;
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].score = 0.6;

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.weakClassification).toEqual(expect.arrayContaining([
      { url: 'http://example1.com', metadataClass: 'Tech', score: 0.4 },
      { url: 'http://example3.com', metadataClass: 'Retail', score: 0.4 }
    ]));
  });

  it('manipulate zero shot metadata data for radar graph', () => {
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].label = 'Tech';
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[0].score = 0.9;
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[1].label = 'Telecomms';
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[1].score = 0.8;
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[2].label = 'E-commerce';
    scraperResults[0].industryClassification.zeroShotMetaDataClassify[2].score = 0.8;

    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].label = 'Restuarants';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[0].score = 0.6;
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[1].label = 'Hospitality';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[1].score = 0.5;
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[2].label = 'Retail';
    scraperResults[1].industryClassification.zeroShotMetaDataClassify[2].score = 0.3;

    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].label = 'Retail';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[0].score = 0.7;
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[1].label = 'Tech';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[1].score = 0.5;
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[2].label = 'Hospitality';
    scraperResults[2].industryClassification.zeroShotMetaDataClassify[2].score = 0.2;

    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].label = 'Retail';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[0].score = 0.9;
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[1].label = 'Telecomms';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[1].score = 0.5;
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[2].label = 'Hospitality';
    scraperResults[3].industryClassification.zeroShotMetaDataClassify[2].score = 0.1;

    const summary = generateSummary(scraperResults);
    expect(summary.metaRadar.categories).toEqual(expect.arrayContaining([
      'Tech', 'Telecomms', 'E-commerce', 'Restuarants', 'Hospitality', 'Retail'
    ]));

    expect(summary.metaRadar.series).toEqual(expect.arrayContaining([
      {name: 'http://example1.com', data:[90, 80, 80, 0, 0, 0]},
      {name: 'http://example2.com', data:[0, 0, 0, 60, 50, 30]},
      {name: 'http://example3.com', data:[50, 0, 0, 0, 20, 70]},
      {name: 'http://example4.com', data:[0, 50, 0, 0, 10, 90]},
    ]));
  });

  it('manipulate zero shot domain data for radar graph', () => {
    scraperResults[0].industryClassification.zeroShotDomainClassify[0].label = 'Tech';
    scraperResults[0].industryClassification.zeroShotDomainClassify[0].score = 0.9;
    scraperResults[0].industryClassification.zeroShotDomainClassify[1].label = 'Telecomms';
    scraperResults[0].industryClassification.zeroShotDomainClassify[1].score = 0.8;
    scraperResults[0].industryClassification.zeroShotDomainClassify[2].label = 'E-commerce';
    scraperResults[0].industryClassification.zeroShotDomainClassify[2].score = 0.8;

    scraperResults[1].industryClassification.zeroShotDomainClassify[0].label = 'Restuarants';
    scraperResults[1].industryClassification.zeroShotDomainClassify[0].score = 0.6;
    scraperResults[1].industryClassification.zeroShotDomainClassify[1].label = 'Hospitality';
    scraperResults[1].industryClassification.zeroShotDomainClassify[1].score = 0.5;
    scraperResults[1].industryClassification.zeroShotDomainClassify[2].label = 'Retail';
    scraperResults[1].industryClassification.zeroShotDomainClassify[2].score = 0.3;

    scraperResults[2].industryClassification.zeroShotDomainClassify[0].label = 'Retail';
    scraperResults[2].industryClassification.zeroShotDomainClassify[0].score = 0.7;
    scraperResults[2].industryClassification.zeroShotDomainClassify[1].label = 'Tech';
    scraperResults[2].industryClassification.zeroShotDomainClassify[1].score = 0.5;
    scraperResults[2].industryClassification.zeroShotDomainClassify[2].label = 'Hospitality';
    scraperResults[2].industryClassification.zeroShotDomainClassify[2].score = 0.2;

    scraperResults[3].industryClassification.zeroShotDomainClassify[0].label = 'Retail';
    scraperResults[3].industryClassification.zeroShotDomainClassify[0].score = 0.9;
    scraperResults[3].industryClassification.zeroShotDomainClassify[1].label = 'Telecomms';
    scraperResults[3].industryClassification.zeroShotDomainClassify[1].score = 0.5;
    scraperResults[3].industryClassification.zeroShotDomainClassify[2].label = 'Hospitality';
    scraperResults[3].industryClassification.zeroShotDomainClassify[2].score = 0.1;

    const summary = generateSummary(scraperResults);
    expect(summary.domainRadar.categories).toEqual(expect.arrayContaining([
      'Tech', 'Telecomms', 'E-commerce', 'Restuarants', 'Hospitality', 'Retail'
    ]));

    expect(summary.domainRadar.series).toEqual(expect.arrayContaining([
      {name: 'http://example1.com', data:[90, 80, 80, 0, 0, 0]},
      {name: 'http://example2.com', data:[0, 0, 0, 60, 50, 30]},
      {name: 'http://example3.com', data:[50, 0, 0, 0, 20, 70]},
      {name: 'http://example4.com', data:[0, 50, 0, 0, 10, 90]},
    ]));
  });

  it('emotions sentiment analysis data for area graph', () => {
    scraperResults[0].sentiment.emotions = {
      neutral: 0.88,
      joy: 0.02,
      surprise: 0.1,
      anger: 0.01,
      disgust: 0.2,
      sadness: 0.003,
      fear: 0.002,
    };

    scraperResults[1].sentiment.emotions = {
      neutral: 0.77,
      joy: 0.17,
      surprise: 0.1,
      anger: 0.006,
      disgust: 0.002,
      sadness: 0.007,
      fear: 0.014,
    };

    scraperResults[2].sentiment.emotions = {
      neutral: 0.77,
      joy: 0.17,
      surprise: 0.1,
      anger: 0.005,
      disgust: 0.002,
      sadness: 0.007,
      fear: 0.014,
    };

    scraperResults[3].sentiment.emotions = {
      neutral: 0.44,
      joy: 0.27,
      surprise: 0.26,
      anger: 0.004,
      disgust: 0.002,
      sadness: 0.007,
      fear: 0.002,
    }

    const summary = generateSummary(scraperResults);
    expect(summary.emotionsArea.series).toEqual(expect.arrayContaining([
      {name: 'http://example1.com', data:[1, 20, 0, 2, 88, 0, 10]},
      {name: 'http://example2.com', data:[1, 0, 1, 17, 77, 1, 10]},
      {name: 'http://example3.com', data:[1, 0, 1, 17, 77, 1, 10]},
      {name: 'http://example4.com', data:[0, 0, 0, 27, 44, 1, 26]},
    ]));

  });

  it('emotions sentiment analysis data for area graph with some undefined emotions', () => {
    scraperResults[0].sentiment.emotions = {
      neutral: 0.88,
      joy: 0.02,
      surprise: 0.1,
      anger: 0.01,
      disgust: 0.2,
      sadness: 0.003,
      fear: 0.002,
    };

    scraperResults[1].sentiment.emotions = {};

    scraperResults[2].sentiment.emotions = {};

    scraperResults[3].sentiment.emotions = {
      neutral: 0.44,
      joy: 0.27,
      surprise: 0.26,
      anger: 0.004,
      disgust: 0.002,
      sadness: 0.007,
      fear: 0.002,
    }

    const summary = generateSummary(scraperResults);
    expect(summary.emotionsArea.series).toEqual(expect.arrayContaining([
      {name: 'http://example1.com', data:[1, 20, 0, 2, 88, 0, 10]},
      {name: 'http://example4.com', data:[0, 0, 0, 27, 44, 1, 26]},
    ]));

  });

});