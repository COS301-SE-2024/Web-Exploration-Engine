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
      slogan: '',
      time: 0
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
      slogan: '',
      time: 0
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
      slogan: '',
      time: 0
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
      slogan: '',
      time: 0,
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
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[2].industryClassification.metadataClass.label = 'Retail';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.industryPercentages).toEqual(
      {
        industries: ['Tech', 'Retail'],
        percentages: [75, 25]
      }
    );
  });

  it('should correctly calculate industry classification percentages with unknowns', () => {
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[2].industryClassification.metadataClass.label = 'Unknown';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';

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
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[0].industryClassification.domainClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.domainClass.label = 'Retail';
    scraperResults[2].industryClassification.metadataClass.label = 'Retail';
    scraperResults[2].industryClassification.domainClass.label = 'Unknown';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';
    scraperResults[3].industryClassification.domainClass.label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.domainMatch.percentageMatch).toBe(50);
    expect(summary.domainMatch.mismatchedUrls).toEqual(expect.arrayContaining([
      { url: 'http://example2.com', metadataClass: 'Tech', domainClass: 'Retail' },
      { url: 'http://example3.com', metadataClass: 'Retail', domainClass: 'Unknown' }
    ]));
  });

  it('should correctly calculate domain match percentages with no mismatches', () => {
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[0].industryClassification.domainClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.domainClass.label = 'Tech';
    scraperResults[2].industryClassification.metadataClass.label = 'Retail';
    scraperResults[2].industryClassification.domainClass.label = 'Retail';
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';
    scraperResults[3].industryClassification.domainClass.label = 'Tech';

    const summary = generateSummary(scraperResults);
    expect(summary.domainMatch.percentageMatch).toBe(100);
    expect(summary.domainMatch.mismatchedUrls).toEqual(expect.arrayContaining([]));
  });

  it('should correctly identify weak classifications' , () => {
    scraperResults[0].industryClassification.metadataClass.label = 'Tech';
    scraperResults[0].industryClassification.metadataClass.score = 0.4;
    scraperResults[1].industryClassification.metadataClass.label = 'Tech';
    scraperResults[1].industryClassification.metadataClass.score = 0.6;
    scraperResults[2].industryClassification.metadataClass.label = 'Retail';
    scraperResults[2].industryClassification.metadataClass.score = 0.4;
    scraperResults[3].industryClassification.metadataClass.label = 'Tech';
    scraperResults[3].industryClassification.metadataClass.score = 0.6;

    const summary = generateSummary(scraperResults);
    expect(summary.industryClassification.weakClassification).toEqual(expect.arrayContaining([
      { url: 'http://example1.com', metadataClass: 'Tech', score: 0.4 },
      { url: 'http://example3.com', metadataClass: 'Retail', score: 0.4 }
    ]));
  });


});