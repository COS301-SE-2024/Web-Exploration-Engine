import { ScraperResult, Summary } from '../models/ScraperModels';

export function generateSummary(scraperResults: ScraperResult[]): Summary {
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

  const emotionsAreaSeries: { name: string; data: number[] }[] = [];

  let topNPSUrls: string[] = [];
  let topNPSScores: number[] = [];

  let topTrustIndexUrls: string[] = [];
  let topTrustIndexScores: number[] = [];

  let topRatingUrls: string[] = [];
  let topRatingScores: number[] = [];

  const totalStars: number[] = [0, 0, 0, 0, 0];
  const numberStars: number[] = [0, 0, 0, 0, 0];
  const averageStars: number[] = [];

  const socialMediaUrls: string[] = [];
  const socialMediaFacebookShareCount: number[] = [];
  const socialMediaFacebookCommentCount: number[] = [];
  const socialMediaFacebookReactionCount: number[] = [];

  const newsSentimentUrls: string[] = [];
  const newsSentimentPositive: number[] = [];
  const newsSentimentNeutral: number[] = [];
  const newsSentimentNegative: number[] = [];

  // news sentiment average for each url
  for (const result of scraperResults) {
    if (result.url && result.scrapeNews && result.scrapeNews.length > 0) {
      newsSentimentUrls.push(result.url);

      newsSentimentPositive.push(
        Math.round(
          (result.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.positive, 0) / result.scrapeNews.length) * 100
        )
      );
      
      newsSentimentNeutral.push(
        Math.round(
          (result.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.neutral, 0) / result.scrapeNews.length) * 100
        )
      );
      
      newsSentimentNegative.push(
        Math.round(
          (result.scrapeNews.reduce((sum, news) => sum + news.sentimentScores.negative, 0) / result.scrapeNews.length) * 100
        )
      );
    }
  }

  // social media metrics
  for (const result of scraperResults) {
    if (result.url && result.shareCountdata && result.shareCountdata.Facebook) {
      socialMediaUrls.push(result.url);
      socialMediaFacebookShareCount.push(result.shareCountdata.Facebook.share_count);
      socialMediaFacebookCommentCount.push(result.shareCountdata.Facebook.comment_count);
      socialMediaFacebookReactionCount.push(result.shareCountdata.Facebook.reaction_count);
    }
  }

  // Get top 3 NPS scores
  for (const result of scraperResults) {
    if (result.url && result.reviews !== undefined && result.reviews.NPS !== undefined && result.reviews.trustIndex !== undefined && result.reviews.rating !== undefined && result.reviews.starRatings !== undefined && result.reviews.starRatings.length > 0 ) {
      topNPSUrls.push(result.url);
      topNPSScores.push(result.reviews.NPS);

      topTrustIndexUrls.push(result.url);
      topTrustIndexScores.push(result.reviews.trustIndex);

      topRatingUrls.push(result.url);
      topRatingScores.push(result.reviews.rating);

      for (let i = 0; i < result.reviews.starRatings.length; i++) {
        numberStars[i] += 1;
        totalStars[i] += result.reviews.starRatings[i].numReviews;
      }
    }
  }

  // calculate the average for the review stars
  for (let i = 0; i < 5; i++) {
    if (numberStars[i] !== 0) {
      averageStars[i] = totalStars[i] / numberStars[i];
    }
  }

  const combinedNPS = topNPSUrls.map((url, index) => ({
    url,
    score: topNPSScores[index],
  }));

  const combinedTrustIndex = topTrustIndexUrls.map((url, index) => ({
    url,
    score: topTrustIndexScores[index],
  }));

  const combinedRating = topRatingUrls.map((url, index) => ({
    url,
    score: topRatingScores[index],
  }));

  combinedNPS.sort((a, b) => b.score - a.score);
  combinedTrustIndex.sort((a, b) => b.score - a.score);
  combinedRating.sort((a, b) => b.score - a.score);

  // Select the top 3 results
  // nps
  const top3NPSResults = combinedNPS.slice(0, 3);
  topNPSUrls = top3NPSResults.map(result => result.url);
  topNPSScores = top3NPSResults.map(result => result.score);
  // trust index
  const top3TrustIndexResults = combinedTrustIndex.slice(0, 3);
  topTrustIndexUrls = top3TrustIndexResults.map(result => result.url);
  topTrustIndexScores = top3TrustIndexResults.map(result => result.score);
  // rating
  const top3RatingResults = combinedRating.slice(0, 3);
  topRatingUrls = top3RatingResults.map(result => result.url);
  topRatingScores = top3RatingResults.map(result => result.score);

  // EMOTIONS AREA
  for (const result of scraperResults) {
    if (result.sentiment && JSON.stringify(result.sentiment.emotions) !== '{}') {
      emotionsAreaSeries.push({
        name: result.url,
        data: [
          Math.round(result.sentiment.emotions.anger * 100),
          Math.round(result.sentiment.emotions.disgust * 100),
          Math.round(result.sentiment.emotions.fear * 100),
          Math.round(result.sentiment.emotions.joy * 100),
          Math.round(result.sentiment.emotions.neutral * 100),
          Math.round(result.sentiment.emotions.sadness * 100),
          Math.round(result.sentiment.emotions.surprise * 100)
        ]
      });
    }
  }

  // META RADAR
  // get all the categories in the scrape result page
  for (const result of scraperResults) {
    if (result.industryClassification && result.industryClassification.zeroShotMetaDataClassify) {
      for (const metaIndustry of result.industryClassification.zeroShotMetaDataClassify) {
        if (!metaRadarCategories.includes(metaIndustry.label)) {
          metaRadarCategories.push(metaIndustry.label);
        }
      }
    }
  }

  // update scores for each corresponding category saved for each url
  for (const result of scraperResults) {
    metaRadarSeries.push({ name: result.url, data: new Array(metaRadarCategories.length).fill(0) });
  }

  for (const result of scraperResults) {
    if (result.industryClassification && result.industryClassification.zeroShotMetaDataClassify) {
      for (const metaIndustry of result.industryClassification.zeroShotMetaDataClassify) {
        const categoryIndex = metaRadarCategories.indexOf(metaIndustry.label);
        if (categoryIndex !== -1) {
          const seriesIndex = scraperResults.indexOf(result);
          metaRadarSeries[seriesIndex].data[categoryIndex] = (metaIndustry.score * 100);
        }
      }
    }
  }

  // DOMAIN RADAR
  // get all the categories in the scrape result page
  for (const result of scraperResults) {
    if (result.industryClassification && result.industryClassification.zeroShotDomainClassify) {
      for (const domainIndustry of result.industryClassification.zeroShotDomainClassify) {
        if (!domainRadarCategories.includes(domainIndustry.label)) {
          domainRadarCategories.push(domainIndustry.label);
        }
      }
    }
  }

  // update scores for each corresponding category saved for each url
  for (const result of scraperResults) {
    domainRadarSeries.push({ name: result.url, data: new Array(domainRadarCategories.length).fill(0) });
  }

  for (const result of scraperResults) {
    if (result.industryClassification && result.industryClassification.zeroShotDomainClassify) {
      for (const domainIndustry of result.industryClassification.zeroShotDomainClassify) {
        const categoryIndex = domainRadarCategories.indexOf(domainIndustry.label);
        if (categoryIndex !== -1) {
          const seriesIndex = scraperResults.indexOf(result);
          domainRadarSeries[seriesIndex].data[categoryIndex] = (domainIndustry.score * 100);
        }
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
    avgTime: avgTime,
    metaRadar: {
      categories: metaRadarCategories,
      series: metaRadarSeries,
    },
    domainRadar: {
      categories: domainRadarCategories,
      series: domainRadarSeries,
    },
    emotionsArea: {
      series: emotionsAreaSeries,
    },
    topNPS: {
      urls: topNPSUrls,
      scores: topNPSScores,
    },
    topTrustIndex: {
      urls: topTrustIndexUrls,
      scores: topTrustIndexScores,
    },
    topRating: {
      urls: topRatingUrls,
      scores: topRatingScores
    },
    averageStarRating: averageStars,
    socialMetrics: {
      urls: socialMediaUrls,
      facebookShareCount: socialMediaFacebookShareCount,
      facebookCommentCount: socialMediaFacebookCommentCount,
      facebookReactionCount: socialMediaFacebookReactionCount
    },
    newsSentiment: {
      urls: newsSentimentUrls,
      positive: newsSentimentPositive,
      neutral: newsSentimentNeutral,
      negative: newsSentimentNegative
    }
  }
}
