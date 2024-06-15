import { ScraperResult, Summary } from '../models/ScraperModels';

export function generateSummary( scraperResults: ScraperResult[]): Summary {
  const numResults = scraperResults.length;

  // Domain status counts
  let parked = 0;
  let live = 0;
  let error = 0;

  // industry classification counts
  const industryCounts: Record<string, number> = {};
  let noClassificationCount = 0;
  const unclassified: string[] = [];
  let industryPercentages: { industry: string; percentage: string }[] = [];
  const weakClassification: { url: string; metadataClass: string; score: number }[] = [];
  
  // domain match classification
  let numMatched = 0;
  const mismatchedUrls: { url: string; metadataClass: string; domainClass: string }[] = [];

  for (const result of scraperResults) {
    // count number of parked vs live sites
    if (result.domainStatus === 'parked') {
      parked++;
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

  industryPercentages = Object.entries(industryCounts).map(
    ([industry, count]) => ({
      industry,
      percentage: (((count as number) / numResults) * 100).toFixed(2),
    })
  );

  if (noClassificationCount > 0) {
    const noClassificationPercentage = (
      (noClassificationCount / numResults) *
      100
    ).toFixed(2);
    industryPercentages.push({
      industry: 'Unknown',
      percentage: noClassificationPercentage,
    });
  }

  const percentageMatch = ((numMatched / numResults) * 100).toFixed(2);

  return {
    domainStatus: {
      parked,
      live,
      error,
    },
    industryClassification: {
      unclassifiedUrls: unclassified,
      industryPercentages,
      weakClassification,
    },
    domainMatch: {
      percentageMatch,
      mismatchedUrls,
    },
  }
}
