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
  
  // domain match classification
  let numMatched = 0;
  const mismatchedUrls: { url: string; metadataClass: string; domainClass: string }[] = [];

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

    // calculate industry classification percentages
    if (result.industryClassification && 
      result.industryClassification.metadataClass.label && 
      result.industryClassification.metadataClass.label !== 'Unknown') {
      const industry = result.industryClassification.metadataClass.label;
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
      if (result.industryClassification.metadataClass.score < 0.5) {
        weakClassification.push({
          url: result.url,
          metadataClass: result.industryClassification.metadataClass.label,
          score: result.industryClassification.metadataClass.score,
        });
      }
    } else {
      noClassificationCount++;
      unclassified.push(result.url);
    }
 
    // domain match classification
    if (result.industryClassification && 
      result.industryClassification.domainClass.label && 
      result.industryClassification.metadataClass.label) {
      const domainClass = result.industryClassification.domainClass.label;
      const metadataClass = result.industryClassification.metadataClass.label;
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
  }
}
