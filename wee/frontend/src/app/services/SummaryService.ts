import { ScraperResult, Summary } from '../models/ScraperModels';

export function generateSummary( scraperResults: ScraperResult[]): Summary {
  const numResults = scraperResults.length;

  // Domain status counts
  let parked = 0;
  let live = 0;
  let error = 0;
  const parkedUrls: string[] = [];
  // industry classification counts
  const industryCounts: Record<string, number> = {};
  let noClassificationCount = 0;
  const unclassified: string[] = [];
  const industries: string[] = [];
  const industryPercentages: number[] = [];
  const weakClassification: { url: string; metadataClass: string; score: number }[] = [];

  const metaRadarCategories: string[] = [];
  const metaRadarSeries: { name: string; data: number[] }[] = [];
  
  const domainRadarCategories: string[] = [];
  const domainRadarSeries: { name: string; data: number[] }[] = [];

  // META RADAR
  // get all the categories in the scrape result page
  for (const result of scraperResults) {
    for (const metaIndustry of result.industryClassification.zeroShotMetaDataClassify) {
      if (!metaRadarCategories.includes(metaIndustry.label)) {
        metaRadarCategories.push(metaIndustry.label);
      }
    }
  }

  // update scores for each corresponding category saved for each url
  for (const result of scraperResults) {
    metaRadarSeries.push({ name: result.url, data: new Array(metaRadarCategories.length).fill(0) });
  }

  for (const result of scraperResults) {
    for (const metaIndustry of result.industryClassification.zeroShotMetaDataClassify) {
      const categoryIndex = metaRadarCategories.indexOf(metaIndustry.label);
      if (categoryIndex !== -1) {
        const seriesIndex = scraperResults.indexOf(result);
        metaRadarSeries[seriesIndex].data[categoryIndex] = (metaIndustry.score * 100);
      }
    }
  }

  // DOMAIN RADAR
  // get all the categories in the scrape result page
  for (const result of scraperResults) {
    for (const domainIndustry of result.industryClassification.zeroShotDomainClassify) {
      if (!domainRadarCategories.includes(domainIndustry.label)) {
        domainRadarCategories.push(domainIndustry.label);
      }
    }
  }

  // update scores for each corresponding category saved for each url
  for (const result of scraperResults) {
    domainRadarSeries.push({ name: result.url, data: new Array(domainRadarCategories.length).fill(0) });
  }

  for (const result of scraperResults) {
    for (const domainIndustry of result.industryClassification.zeroShotDomainClassify) {
      const categoryIndex = domainRadarCategories.indexOf(domainIndustry.label);
      if (categoryIndex !== -1) {
        const seriesIndex = scraperResults.indexOf(result);
        domainRadarSeries[seriesIndex].data[categoryIndex] = (domainIndustry.score * 100);
      }
    }
  }  

  // domain match classification
  let numMatched = 0;
  const mismatchedUrls: { url: string; metadataClass: string; domainClass: string }[] = [];
  // Count of URLs that can be scraped
  let numScrapableUrls = 0;
  let totalTime = 0;
  for (const result of scraperResults) {
    // count number of parked vs live sites
    if (result.domainStatus === 'parked') {
      parked++;
      parkedUrls.push(result.url);
    } else if (result.domainStatus === 'live') {
      live++;
    } else {
      error++;
    }

    // Check if the URL can be scraped

    if (result.robots && 'isUrlScrapable' in result.robots && result.robots.isUrlScrapable) {
      numScrapableUrls++;
    } else {
      error++;
    }
    
    
    // calculate industry classification percentages
    if (result.industryClassification && 
      result.industryClassification.zeroShotMetaDataClassify[0].label && 
      result.industryClassification.zeroShotMetaDataClassify[0].label !== 'Unknown') {
      const industry = result.industryClassification.zeroShotMetaDataClassify[0].label;
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
      if (result.industryClassification.zeroShotMetaDataClassify[0].score < 0.5) {
        weakClassification.push({
          url: result.url,
          metadataClass: result.industryClassification.zeroShotMetaDataClassify[0].label,
          score: result.industryClassification.zeroShotMetaDataClassify[0].score,
        });
      }
    } else {
      noClassificationCount++;
      unclassified.push(result.url);
    }
 
    // domain match classification
    if (result.industryClassification && 
      result.industryClassification.zeroShotDomainClassify[0].label && 
      result.industryClassification.zeroShotMetaDataClassify[0].label) {
      const domainClass = result.industryClassification.zeroShotDomainClassify[0].label;
      const metadataClass = result.industryClassification.zeroShotMetaDataClassify[0].label;
      if (domainClass === metadataClass) {
        numMatched++;
      } else {
        mismatchedUrls.push({
          url: result.url,
          metadataClass,
          domainClass,
        });
      }

    }
    console.log(`URL: ${result.url}, Time: ${result.time}`);
    totalTime += result.time;
  }

  for (const industry in industryCounts) {
    const percentage = parseFloat(((industryCounts[industry] / numResults) * 100).toFixed(2));
    industries.push(industry);
    industryPercentages.push(percentage);
  }

  if (noClassificationCount > 0) {
    const noClassificationPercentage = parseFloat((
      (noClassificationCount / numResults) *
      100
    ).toFixed(2));
    industries.push('Unknown');
    industryPercentages.push(noClassificationPercentage);
  }

  const percentageMatch = parseFloat(((numMatched / numResults) * 100).toFixed(2));
  const avgTime = parseFloat((totalTime / numResults).toFixed(2));

  console.log(`Total Time: ${totalTime}, Number of Results: ${numResults}, Average Time: ${avgTime}`);
  
  return {
    domainStatus: [live, parked],
    domainErrorStatus: error,
    industryClassification: {
      unclassifiedUrls: unclassified,
      industryPercentages: {
        industries,
        percentages: industryPercentages,
      },

      weakClassification,
    },
    domainMatch: {
      percentageMatch,
      mismatchedUrls,
    },
    totalUrls: numResults,
    parkedUrls,
    scrapableUrls: numScrapableUrls,
    avgTime:avgTime,
    metaRadar: {
      categories: metaRadarCategories,
      series: metaRadarSeries,
    },
    domainRadar: {
      categories: domainRadarCategories,
      series: domainRadarSeries,
    }
  }
}
