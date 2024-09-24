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
        XMLSitemapAnalysis: { error: 'Error Message' },
        lighthouseAnalysis: { error: 'Error Message' },
        siteSpeedAnalysis: { error: 'Error Message' },
        canonicalTagAnalysis: { error: 'Error Message' },
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
        indexabilityAnalysis: { error: 'Error Message' },
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
        mobileFriendlinessAnalysis: { error: 'Error Message' },
        structuredDataAnalysis: { error: 'Error Message' },
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
          total_count: 19320,
          og_object: null,
          comment_count: 180,
          share_count: 7037,
          reaction_count: 12103
        },
        Pinterest: 1
      },
      reviews: {
        rating: 1.83,
        numberOfReviews: 1,
        trustIndex: 2.7,
        NPS: -58,
        recommendationStatus: "Unlikely",
        starRatings: [
          {
            stars: 5,
            numReviews: 298
          },
          {
            stars: 4,
            numReviews: 35
          },
          {
            stars: 3,
            numReviews: 22
          },
          {
            stars: 2,
            numReviews: 131
          },
          {
            stars: 1,
            numReviews: 1280
          }
        ]
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
        domainClass: { label: 'Unknown', score: 0 },
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
        XMLSitemapAnalysis: { error: 'Error Message' },
        lighthouseAnalysis: { error: 'Error Message' },
        siteSpeedAnalysis: { error: 'Error Message' },
        canonicalTagAnalysis: { error: 'Error Message' },
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
        indexabilityAnalysis: { error: 'Error Message' },
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
        mobileFriendlinessAnalysis: { error: 'Error Message' },
        structuredDataAnalysis: { error: 'Error Message' },
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
        domainClass: { label: 'Unknown', score: 0 },
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
        XMLSitemapAnalysis: { error: 'Error Message' },
        lighthouseAnalysis: { error: 'Error Message' },
        siteSpeedAnalysis: { error: 'Error Message' },
        canonicalTagAnalysis: { error: 'Error Message' },
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
        indexabilityAnalysis: { error: 'Error Message' },
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
        mobileFriendlinessAnalysis: { error: 'Error Message' },
        structuredDataAnalysis: { error: 'Error Message' },
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
      },
      scrapeNews: [
        {
          title: "Big Nedbank outage - MyBroadband",
          link: "https://news.google.com/rss/articles/CBMieEFVX3lxTFBVQWpBY1R2eDZ1NG5jSk9lVkVUcy1QNFNURWMxWmdCQXp4NGF0MG1rdklEak81NzNha3dqTkZPMTByTmpUcFVNNHV2Q1BsenpjRFc3aS16aTF3UHMxWlZrcU1SOWMxdF8wTHhhMmVYd3QyczExWVhaWA?oc=5",
          source: "MyBroadband",
          pubDate: "Mon, 23 Sep 2024 07:33:31 GMT",
          sentimentScores: {
            positive: 0.006228324957191944,
            negative: 0.9154652953147888,
            neutral: 0.07830633968114853
          }
        },
        {
          title: "Nedbank restores services after brief Monday outage - TechCentral",
          link: "https://news.google.com/rss/articles/CBMifkFVX3lxTE5Pd2NLc2llaGlLTlptOUZtbWxlQU1UMExZS3NlZGVnV2pzeEJnVVhZZHlvb1RjRnl1cGVnM1d5RG1fS1puUmk1YWd2ejBNdFZaaXBoeEZYUDFUN0Vfek9Ra0FnTDdnWWFsWkxrb3lyZXo2THZGUmZ1RmR0RzlRUQ?oc=5",
          source: "TechCentral",
          pubDate: "Mon, 23 Sep 2024 09:51:29 GMT",
          sentimentScores: {
            positive: 0.05459664389491081,
            negative: 0.010278829373419285,
            neutral: 0.9351245760917664
          }
        }
      ],
      shareCountdata: {
        Facebook: {
          comment_plugin_count: 0,
          total_count: 33690,
          og_object: null,
          comment_count: 589,
          share_count: 15790,
          reaction_count: 17311
        },
        Pinterest: 0
      },
      reviews: {
        rating: 1.54,
        numberOfReviews: 28,
        trustIndex: 1.9,
        NPS: -86,
        recommendationStatus: "Unlikely",
        starRatings: [
          {
            stars: 5,
            numReviews: 2271
          },
          {
            stars: 4,
            numReviews: 213
          },
          {
            stars: 3,
            numReviews: 271
          },
          {
            stars: 2,
            numReviews: 5316
          },
          {
            stars: 1,
            numReviews: 20604
          }
        ]
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
        domainClass: { label: 'Unknown', score: 0 },
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
        XMLSitemapAnalysis: { error: 'Error Message' },
        lighthouseAnalysis: { error: 'Error Message' },
        siteSpeedAnalysis: { error: 'Error Message' },
        canonicalTagAnalysis: { error: 'Error Message' },
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
        indexabilityAnalysis: { error: 'Error Message' },
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
        mobileFriendlinessAnalysis: { error: 'Error Message' },
        structuredDataAnalysis: { error: 'Error Message' },
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
      },
      scrapeNews: [
        {
          title: "Big Nedbank outage - MyBroadband",
          link: "https://news.google.com/rss/articles/CBMieEFVX3lxTFBVQWpBY1R2eDZ1NG5jSk9lVkVUcy1QNFNURWMxWmdCQXp4NGF0MG1rdklEak81NzNha3dqTkZPMTByTmpUcFVNNHV2Q1BsenpjRFc3aS16aTF3UHMxWlZrcU1SOWMxdF8wTHhhMmVYd3QyczExWVhaWA?oc=5",
          source: "MyBroadband",
          pubDate: "Mon, 23 Sep 2024 07:33:31 GMT",
          sentimentScores: {
            positive: 0.006228324957191944,
            negative: 0.9154652953147888,
            neutral: 0.07830633968114853
          }
        },
        {
          title: "Nedbank restores services after brief Monday outage - TechCentral",
          link: "https://news.google.com/rss/articles/CBMifkFVX3lxTE5Pd2NLc2llaGlLTlptOUZtbWxlQU1UMExZS3NlZGVnV2pzeEJnVVhZZHlvb1RjRnl1cGVnM1d5RG1fS1puUmk1YWd2ejBNdFZaaXBoeEZYUDFUN0Vfek9Ra0FnTDdnWWFsWkxrb3lyZXo2THZGUmZ1RmR0RzlRUQ?oc=5",
          source: "TechCentral",
          pubDate: "Mon, 23 Sep 2024 09:51:29 GMT",
          sentimentScores: {
            positive: 0.05459664389491081,
            negative: 0.010278829373419285,
            neutral: 0.9351245760917664
          }
        }
      ],
      shareCountdata: {
        Facebook: {
          comment_plugin_count: 0,
          total_count: 14063,
          og_object: null,
          comment_count: 841,
          share_count: 3032,
          reaction_count: 10190
        },
        Pinterest: 3
      },
      reviews: {
        rating: 1.56,
        numberOfReviews: 1,
        trustIndex: 2.2,
        NPS: -77,
        recommendationStatus: "Unlikely",
        starRatings: [
          {
            stars: 5,
            numReviews: 162
          },
          {
            stars: 4,
            numReviews: 28
          },
          {
            stars: 3,
            numReviews: 38
          },
          {
            stars: 2,
            numReviews: 239
          },
          {
            stars: 1,
            numReviews: 1389
          }
        ]
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

  it('should correctly identify weak classifications', () => {
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
      { name: 'http://example1.com', data: [90, 80, 80, 0, 0, 0] },
      { name: 'http://example2.com', data: [0, 0, 0, 60, 50, 30] },
      { name: 'http://example3.com', data: [50, 0, 0, 0, 20, 70] },
      { name: 'http://example4.com', data: [0, 50, 0, 0, 10, 90] },
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
      { name: 'http://example1.com', data: [90, 80, 80, 0, 0, 0] },
      { name: 'http://example2.com', data: [0, 0, 0, 60, 50, 30] },
      { name: 'http://example3.com', data: [50, 0, 0, 0, 20, 70] },
      { name: 'http://example4.com', data: [0, 50, 0, 0, 10, 90] },
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
      { name: 'http://example1.com', data: [1, 20, 0, 2, 88, 0, 10] },
      { name: 'http://example2.com', data: [1, 0, 1, 17, 77, 1, 10] },
      { name: 'http://example3.com', data: [1, 0, 1, 17, 77, 1, 10] },
      { name: 'http://example4.com', data: [0, 0, 0, 27, 44, 1, 26] },
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
      { name: 'http://example1.com', data: [1, 20, 0, 2, 88, 0, 10] },
      { name: 'http://example4.com', data: [0, 0, 0, 27, 44, 1, 26] },
    ]));

  });

  it('top 3 NPS scores', () => {
    const summary = generateSummary(scraperResults);

    const expectedTopNPSUrls = [
      "http://example2.com",
      "http://example1.com",
      "http://example4.com",
    ];

    const expectedTopNPSScores = [-57, -58, -77]; 

    expect(summary.topNPS).toEqual({
      urls: expectedTopNPSUrls,
      scores: expectedTopNPSScores,
    });
  });

  it('top 3 TrustIndex scores', () => {
    const summary = generateSummary(scraperResults);

    const expectedTopTrustIndexUrls = [
      "http://example2.com",
      "http://example1.com",
      "http://example4.com",
    ];

    const expectedTopTrustIndexScores = [2.8, 2.7, 2.2]; 

    expect(summary.topTrustIndex).toEqual({
      urls: expectedTopTrustIndexUrls,
      scores: expectedTopTrustIndexScores,
    });
  });

  it('top 3 Rating scores', () => {
    const summary = generateSummary(scraperResults);

    const expectedTopRatingUrls = [
      "http://example1.com",
      "http://example2.com",
      "http://example4.com",
    ];

    const expectedTopRatingScores = [1.83, 1.65, 1.56]; 

    expect(summary.topRating).toEqual({
      urls: expectedTopRatingUrls,
      scores: expectedTopRatingScores,
    });
  });

  it('average star ratings', () => {
    const summary = generateSummary(scraperResults);
    expect(summary.averageStarRating).toEqual(
      [827.75, 85, 98, 1757, 6846.25]
    )
  });

});