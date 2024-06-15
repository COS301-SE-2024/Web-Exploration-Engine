import { generateSummary } from '../../src/app/services/SummaryService';
import { ScraperResult } from '../../src/app/models/ScraperModels';

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
        domainClass: { label: 'Unknown', score: 0 } 
      },
      logo: '',
      images: [],
      slogan: ''
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
        domainClass: { label: 'Unknown', score: 0 } 
      },
      logo: '',
      images: [],
      slogan: ''
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
        domainClass: { label: 'Unknown', score: 0 } 
      },
      logo: '',
      images: [],
      slogan: ''
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
        domainClass: { label: 'Unknown', score: 0 } 
      },
      logo: '',
      images: [],
      slogan: ''
    },
  ];

  it('should correctly summarize all live URLs', () => {
    scraperResults[0].domainStatus = 'live';
    scraperResults[1].domainStatus = 'live';
    scraperResults[2].domainStatus = 'live';
    scraperResults[3].domainStatus = 'live';

    const summary = generateSummary(scraperResults);
    expect(summary.domainStatus.live).toBe(4);
    expect(summary.domainStatus.parked).toBe(0);
    expect(summary.domainStatus.error).toBe(0);
  });

  it('should correctly summarize all parked URLs', () => {
    scraperResults[0].domainStatus = 'parked';
    scraperResults[1].domainStatus = 'parked';
    scraperResults[2].domainStatus = 'parked';
    scraperResults[3].domainStatus = 'parked';

    const summary = generateSummary(scraperResults);
    expect(summary.domainStatus.live).toBe(0);
    expect(summary.domainStatus.parked).toBe(4);
    expect(summary.domainStatus.error).toBe(0);
  });

  it('should correctly summarize mixed URL statuses', () => {
    scraperResults[0].domainStatus = 'live';
    scraperResults[1].domainStatus = 'parked';
    scraperResults[2].domainStatus = 'live';
    scraperResults[3].domainStatus = 'error';

    const summary = generateSummary(scraperResults);
    expect(summary.domainStatus.live).toBe(2);
    expect(summary.domainStatus.parked).toBe(1);
    expect(summary.domainStatus.error).toBe(1);
  });

  it('should correctly calculate industry classification percentages', () => {
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[2].industryClassification.metadataClass.label = 'Retail';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.industryPercentages).toEqual(expect.arrayContaining([
      { industry: 'Tech', percentage: '75.00' },
      { industry: 'Retail', percentage: '25.00' }
    ]));
  });

  it('should correctly calculate industry classification percentages with unknowns', () => {
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[2].industryClassification.metadataClass.label = 'Unknown';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.industryPercentages).toEqual(expect.arrayContaining([
      { industry: 'Tech', percentage: '75.00' },
      { industry: 'Unknown', percentage: '25.00' }
    ]));

    expect(summary.industryClassification.unclassifiedUrls).toEqual(expect.arrayContaining([
      'http://example3.com'
    ]));
  });

  it('should correctly calculate domain match percentages', () => {
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[0].industryClassification.domainClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.domainClass.label = 'Retail';
    scraperResults[2].industryClassification.metadataClass.label = 'Retail';
    scraperResults[2].industryClassification.domainClass.label = 'Unknown';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';
    scraperResults[3].industryClassification.domainClass.label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.domainMatch.percentageMatch).toBe('50.00');
    expect(summary.domainMatch.mismatchedUrls).toEqual(expect.arrayContaining([
      { url: 'http://example2.com', metadataClass: 'Tech', domainClass: 'Retail' },
      { url: 'http://example3.com', metadataClass: 'Retail', domainClass: 'Unknown' }
    ]));
  });


});