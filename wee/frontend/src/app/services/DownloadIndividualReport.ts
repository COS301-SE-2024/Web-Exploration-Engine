import jsPDF from 'jspdf';
import { TitleTagsAnalysis, SEOError, HeadingAnalysis, ImageAnalysis,LightHouseAnalysis, InternalLinksAnalysis,MetaDescriptionAnalysis,SiteSpeedAnalysis,MobileFriendlinessAnalysis, UniqueContentAnalysis, IndustryClassificationCriteria, SentimentAnalysis,XMLSitemapAnalysis,CanonicalTagAnalysis,IndexabilityAnalysis,StructuredDataAnalysis,ScrapeNews, Reviews,ShareCountData} from '../models/ScraperModels';

interface SummaryInfo {
  title: string;
  description: string;
}
export const handleDownloadReport = (
  url: string | null,
  summaryInfo: SummaryInfo | undefined,
  websiteStatus: string,
  isCrawlable: boolean,
  industryClassification: IndustryClassificationCriteria[] | undefined,
  domainClassification: IndustryClassificationCriteria[] | undefined,
  addresses: string[],
  emails: string[],
  phones: string[],
  socialLinks: string[],
  titleTagAnalysis: TitleTagsAnalysis | SEOError | undefined,
  headingAnalysis: HeadingAnalysis | SEOError | undefined,
  imageAnalysis: ImageAnalysis | SEOError | undefined,
  internalLinksAnalysis: InternalLinksAnalysis | SEOError | undefined,
  metaDescriptionAnalysis: MetaDescriptionAnalysis | SEOError | undefined,
  uniqueContentAnalysis: UniqueContentAnalysis | SEOError | undefined,
  sentimentAnalysis: SentimentAnalysis |undefined,
  xMLSitemapAnalysis: XMLSitemapAnalysis | SEOError |undefined,
  canonicalTagAnalysis: CanonicalTagAnalysis | SEOError |undefined,
  indexabilityAnalysis: IndexabilityAnalysis | SEOError |undefined,  
  siteSpeedAnalysis: SiteSpeedAnalysis | SEOError |undefined,
  structuredDataAnalysis: StructuredDataAnalysis | SEOError |undefined,
  mobileFriendlinessAnalysis: MobileFriendlinessAnalysis | SEOError |undefined,
  lighthouseAnalysis: LightHouseAnalysis | SEOError |undefined,
  scrapeNews: ScrapeNews[]  |undefined,
  reviews: Reviews  |undefined,
  shareCountData : ShareCountData | undefined,
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  const title = 'Web Exploration Engine Individual Report';
  const titleWidth = doc.getStringUnitWidth(title) * 20 / doc.internal.scaleFactor;
  const x = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(title, x, 20);

  // Define table positions and dimensions
  const startY = 30;
  const margin = 14;
  const headerHeight = 10;
  const rowHeight = 10;
  const columnWidth = [60, 190];

  // Function to draw a horizontal line
  const drawLine = (lineY: number): void => {
    doc.setDrawColor(200, 200, 200); // Light grey color
    doc.line(0, lineY - 1, margin + columnWidth[0] + columnWidth[1], lineY - 1); 
  };

  // Draw Table Header
  const darkTealGreenR = 47; 
  const darkTealGreenG = 139; 
  const darkTealGreenB = 87; 
  doc.setFontSize(14);
  doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
  doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', margin + 2, startY + 7);
  doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

  // Function to split text into lines that fit within a max width
  const splitText = (text: string, maxWidth: number): string[] => {
    const lines = [];
    let line = '';
    const words = text.split(' ');

    for (const word of words) {
      const testLine = line + (line.length > 0 ? ' ' : '') + word;
      const testWidth = doc.getStringUnitWidth(testLine) * 20 / doc.internal.scaleFactor;

      if (testWidth > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      lines.push(line);
    }

    return lines;
  };

  // Draw Table Rows
  const rows = [
    ['URL', url || 'N/A'],
    ['Title', summaryInfo?.title || 'N/A'],
    ['Description', summaryInfo?.description || 'N/A'],
    ['Website Status', websiteStatus || 'N/A'],
    ['Crawlable', isCrawlable ? 'Yes' : 'No'],
    ['Industry', industryClassification ?  industryClassification[0].label : 'N/A'],
    ['Confidence Score', isCrawlable ? `${(industryClassification && industryClassification[0].score ? (industryClassification[0].score * 100).toFixed(2) : 0)}%` : 'N/A'],
    ['Domain Match', domainClassification ? domainClassification[0].label : 'N/A'],
    ['Confidence Score', isCrawlable ? `${(domainClassification && domainClassification[0].score ? (domainClassification[0].score * 100).toFixed(2) : 0)}%` : 'N/A'],
    ['Addresses', addresses.length > 0 ? addresses.join(', ') : 'No addresses available'],
    ['Emails', emails.length > 0 ? emails.join(', ') : 'No emails available'],
    ['Phones', phones.length > 0 ? phones.join(', ') : 'No phone numbers available'],
    ['Social Links', socialLinks.length > 0 ? socialLinks.join(', ') : 'No social links available']
  ];

  let y = startY + headerHeight;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  rows.forEach(row => {
    const [category, info] = row;
    const categoryLines = splitText(String(category), columnWidth[0] - 4);
    const infoLines = splitText(String(info), columnWidth[1] - 4);

    categoryLines.forEach((line, i) => {
      doc.text(line, margin + 2, y + (i * rowHeight) + 7);
    });
    infoLines.forEach((line, i) => {
      doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
    });

    // Draw line after each row
    drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

    y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

    if (y > 270) { // Check if the y position exceeds the page limit
      doc.addPage();
      y = 20; // Reset y position on the new page
      doc.text('Category', margin + 2, y + 7);
      doc.text('Information', margin + columnWidth[0] + 2, y + 7);
      y += headerHeight;
    }
  });

  // Title Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title2 = 'Title Analysis';
  const titleWidth2 = doc.getStringUnitWidth(title2) * 20 / doc.internal.scaleFactor;
  const x2 = (doc.internal.pageSize.width - titleWidth2) / 2;
  doc.text(title2, x2, 20);
  
  if (titleTagAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

    const titleTagAnalysisRows = [
      ['Meta Description', titleTagAnalysis && 'metaDescription' in titleTagAnalysis ? titleTagAnalysis.metaDescription : 'N/A'],
      ['URL Words in Description', titleTagAnalysis && 'isUrlWordsInDescription' in titleTagAnalysis ? (titleTagAnalysis.isUrlWordsInDescription ? 'Yes' : 'No') : 'N/A'],
      ['Length', titleTagAnalysis && 'length' in titleTagAnalysis ? `${titleTagAnalysis.length}` : 'N/A'],
      ['Recommendations', titleTagAnalysis && 'recommendations' in titleTagAnalysis ? titleTagAnalysis.recommendations : 'N/A']
    ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    titleTagAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }

  // Heading Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title3 = 'Heading Analysis';
  const titleWidth3 = doc.getStringUnitWidth(title3) * 20 / doc.internal.scaleFactor;
  const x3 = (doc.internal.pageSize.width - titleWidth3) / 2;
  doc.text(title3, x3, 20);
  
  
  if (headingAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

    const headingAnalysisRows = [
      ['Count', headingAnalysis && 'count' in headingAnalysis ? `${headingAnalysis.count}` : 'N/A'],
      ['Headings', headingAnalysis && 'headings' in headingAnalysis ? headingAnalysis.headings.join(', ') : 'N/A'],
      ['Recommendations', headingAnalysis && 'recommendations' in headingAnalysis ? headingAnalysis.recommendations : 'N/A']
    ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    headingAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
  //Image Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title4 = 'Image Analysis';
  const titleWidth4 = doc.getStringUnitWidth(title4) * 20 / doc.internal.scaleFactor;
  const x4 = (doc.internal.pageSize.width - titleWidth4) / 2;
  doc.text(title4, x4, 20);
  
  
  if (imageAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const imageAnalysisRows = [
      ['Total Images', imageAnalysis && 'totalImages' in imageAnalysis ? `${imageAnalysis.totalImages}` : 'N/A'],
      ['Missing Alt Text Count', imageAnalysis && 'missingAltTextCount' in imageAnalysis ? `${imageAnalysis.missingAltTextCount}` : 'N/A'],
      ['Non-Optimized Count', imageAnalysis && 'nonOptimizedCount' in imageAnalysis ? `${imageAnalysis.nonOptimizedCount}` : 'N/A'],
      //['Error URLs', imageAnalysis && 'errorUrls' in imageAnalysis ? imageAnalysis.errorUrls.join(', ') : 'N/A'],
      //['Reasons Map', imageAnalysis && 'reasonsMap' in imageAnalysis ? JSON.stringify(imageAnalysis.reasonsMap) : 'N/A'],
      ['Recommendations', imageAnalysis && 'recommendations' in imageAnalysis ? imageAnalysis.recommendations : 'N/A']
    ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    imageAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }

  //
    //Internal Linking  Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title5 = 'Internal Linking Analysis';
  const titleWidth5 = doc.getStringUnitWidth(title5) * 20 / doc.internal.scaleFactor;
  const x5 = (doc.internal.pageSize.width - titleWidth5) / 2;
  doc.text(title5, x5, 20);
  
  
  if (internalLinksAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const internalLinksAnalysisRows = [
      ['Total Links', internalLinksAnalysis && 'totalLinks' in internalLinksAnalysis ? `${internalLinksAnalysis.totalLinks}` : 'N/A'],
      ['Unique Links', internalLinksAnalysis && 'uniqueLinks' in internalLinksAnalysis ? `${internalLinksAnalysis.uniqueLinks}` : 'N/A'],
      ['Recommendations', internalLinksAnalysis && 'recommendations' in internalLinksAnalysis ? internalLinksAnalysis.recommendations : 'N/A']
    ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    internalLinksAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }

  //
      //Meta DatA Description Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title6 = 'Meta Data Description Analysis';
  const titleWidth6 = doc.getStringUnitWidth(title6) * 20 / doc.internal.scaleFactor;
  const x6 = (doc.internal.pageSize.width - titleWidth6) / 2;
  doc.text(title6, x6, 20);
  
  
  if (metaDescriptionAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const metaDescriptionAnalysisRows = [
      ['Title Tag', metaDescriptionAnalysis && 'titleTag' in metaDescriptionAnalysis ? metaDescriptionAnalysis.titleTag : 'N/A'],
      ['Length', metaDescriptionAnalysis && 'length' in metaDescriptionAnalysis ? `${metaDescriptionAnalysis.length}` : 'N/A'],
      ['Recommendations', metaDescriptionAnalysis && 'recommendations' in metaDescriptionAnalysis ? metaDescriptionAnalysis.recommendations : 'N/A']
    ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    metaDescriptionAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }

  //
  //uNIQUE cONtent Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title7 = 'Unique Content Analysis';
  const titleWidth7 = doc.getStringUnitWidth(title7) * 20 / doc.internal.scaleFactor;
  const x7 = (doc.internal.pageSize.width - titleWidth7) / 2;
  doc.text(title7, x7, 20);
  
  
  if (uniqueContentAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const uniqueContentAnalysisRows = [
        ['Text Length', uniqueContentAnalysis && 'textLength' in uniqueContentAnalysis ? `${uniqueContentAnalysis.textLength}` : 'N/A'],
        ['Unique Words Percentage', uniqueContentAnalysis && 'uniqueWordsPercentage' in uniqueContentAnalysis ? `${uniqueContentAnalysis.uniqueWordsPercentage.toFixed(2)}%` : 'N/A'],
        ['Repeated Words', uniqueContentAnalysis && 'repeatedWords' in uniqueContentAnalysis ? uniqueContentAnalysis.repeatedWords.map(word => `${word.word}: ${word.count}`).join(', ') : 'N/A'],
      ['Recommendations', uniqueContentAnalysis && 'recommendations' in uniqueContentAnalysis ? uniqueContentAnalysis.recommendations : 'N/A'],

    ];
    

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    uniqueContentAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
//XML Sitemap
  doc.addPage();
  doc.setFontSize(20);
  const title9 = 'XML Sitemap Analysis';
  const titleWidth9 = doc.getStringUnitWidth(title9) * 20 / doc.internal.scaleFactor;
  const x9 = (doc.internal.pageSize.width - titleWidth9) / 2;
  doc.text(title9, x9, 20);
  
  
  if (xMLSitemapAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const xMLSitemapAnalysisRows = [
        ['Validated', xMLSitemapAnalysis && 'isSitemapValid' in xMLSitemapAnalysis ? `${xMLSitemapAnalysis.isSitemapValid}` : 'N/A'],
        ['Recommendations', xMLSitemapAnalysis && 'recommendations' in xMLSitemapAnalysis ? xMLSitemapAnalysis.recommendations : 'N/A']
    ];
    

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    xMLSitemapAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
//Canonical tags
doc.addPage();
doc.setFontSize(20);
const title10= 'Canonical tag Analysis';
const titleWidth10 = doc.getStringUnitWidth(title10) * 20 / doc.internal.scaleFactor;
const x10 = (doc.internal.pageSize.width - titleWidth10) / 2;
doc.text(title10, x10, 20);


if (canonicalTagAnalysis) {
  doc.setFontSize(14);
  doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); 
  doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', margin + 2, startY + 7);
  doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
  const canonicalTagAnalysisRows = [
      ['Is Present', canonicalTagAnalysis && 'isCanonicalTagPresent' in canonicalTagAnalysis ? `${canonicalTagAnalysis.isCanonicalTagPresent}` : 'N/A'],
      ['Recommendations', canonicalTagAnalysis && 'recommendations' in canonicalTagAnalysis ? canonicalTagAnalysis.recommendations : 'N/A']
  ];
  

  y = startY + headerHeight;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  canonicalTagAnalysisRows.forEach(row => {
    const [category, info] = row;
    const categoryLines = splitText(String(category), columnWidth[0] - 4);
    const infoLines = splitText(String(info), columnWidth[1] - 4);

    categoryLines.forEach((line, i) => {
      doc.text(line, margin + 2, y + (i * rowHeight) + 7);
    });
    infoLines.forEach((line, i) => {
      doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
    });

    // Draw line after each row
    drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

    y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

    if (y > 270) { // Check if the y position exceeds the page limit
      doc.addPage();
      y = 20; // Reset y position on the new page
      doc.text('Category', margin + 2, y + 7);
      doc.text('Information', margin + columnWidth[0] + 2, y + 7);
      y += headerHeight;
    }
  });
}
//Indexibillity analysis
  doc.addPage();
  doc.setFontSize(20);
  const title11 = 'Indexability Analysis';
  const titleWidth11 = doc.getStringUnitWidth(title11) * 20 / doc.internal.scaleFactor;
  const x11 = (doc.internal.pageSize.width - titleWidth11) / 2;
  doc.text(title11, x11, 20);
  
  
  if (indexabilityAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const indexabilityAnalysisRows = [
        ['Indexable', indexabilityAnalysis && 'isIndexable' in indexabilityAnalysis ? `${indexabilityAnalysis.isIndexable}` : 'N/A'],
        ['Recommendations', indexabilityAnalysis && 'recommendations' in indexabilityAnalysis ? indexabilityAnalysis.recommendations : 'N/A']
    ];
    

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    indexabilityAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
//SiteSpeed
  doc.addPage();
  doc.setFontSize(20);
  const title12 = 'Site Speed Analysis';
  const titleWidth12 = doc.getStringUnitWidth(title12) * 20 / doc.internal.scaleFactor;
  const x12 = (doc.internal.pageSize.width - titleWidth12) / 2;
  doc.text(title12, x12, 20);
  
  
  if (siteSpeedAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const siteSpeedAnalysisRows = [
        ['Load Time', siteSpeedAnalysis && 'loadTime' in siteSpeedAnalysis ? `${siteSpeedAnalysis.loadTime}` : 'N/A'],
        ['Recommendations', siteSpeedAnalysis && 'recommendations' in siteSpeedAnalysis ? siteSpeedAnalysis.recommendations : 'N/A']
    ];
    

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    siteSpeedAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
//
//Structured data
doc.addPage();
doc.setFontSize(20);
const title13 = 'Structured data Analysis';
const titleWidth13 = doc.getStringUnitWidth(title13) * 20 / doc.internal.scaleFactor;
const x13 = (doc.internal.pageSize.width - titleWidth13) / 2;
doc.text(title13, x13, 20);


if (structuredDataAnalysis) {
  doc.setFontSize(14);
  doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
  doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', margin + 2, startY + 7);
  doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
  const structuredDataAnalysisRows = [
      ['Count', structuredDataAnalysis && 'count' in structuredDataAnalysis ? `${structuredDataAnalysis.count}` : 'N/A'],
      ['Recommendations', structuredDataAnalysis && 'recommendations' in structuredDataAnalysis ? structuredDataAnalysis.recommendations : 'N/A']
  ];
  

  y = startY + headerHeight;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  structuredDataAnalysisRows.forEach(row => {
    const [category, info] = row;
    const categoryLines = splitText(String(category), columnWidth[0] - 4);
    const infoLines = splitText(String(info), columnWidth[1] - 4);

    categoryLines.forEach((line, i) => {
      doc.text(line, margin + 2, y + (i * rowHeight) + 7);
    });
    infoLines.forEach((line, i) => {
      doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
    });

    // Draw line after each row
    drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

    y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

    if (y > 270) { // Check if the y position exceeds the page limit
      doc.addPage();
      y = 20; // Reset y position on the new page
      doc.text('Category', margin + 2, y + 7);
      doc.text('Information', margin + columnWidth[0] + 2, y + 7);
      y += headerHeight;
    }
  });
}
//Mobile friendliness
doc.addPage();
doc.setFontSize(20);
const title14 = 'Mobile friendliness Analysis';
const titleWidth14 = doc.getStringUnitWidth(title14) * 20 / doc.internal.scaleFactor;
const x14 = (doc.internal.pageSize.width - titleWidth14) / 2;
doc.text(title14, x14, 20);


if (mobileFriendlinessAnalysis) {
  doc.setFontSize(14);
  doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
  doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', margin + 2, startY + 7);
  doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
  const mobileFriendlinessAnalysisRows = [
      ['Responsive', mobileFriendlinessAnalysis && 'isResponsive' in mobileFriendlinessAnalysis ? `${mobileFriendlinessAnalysis.isResponsive}` : 'N/A'],
      ['Recommendations', mobileFriendlinessAnalysis && 'recommendations' in mobileFriendlinessAnalysis ? mobileFriendlinessAnalysis.recommendations : 'N/A']
  ];
  

  y = startY + headerHeight;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  mobileFriendlinessAnalysisRows.forEach(row => {
    const [category, info] = row;
    const categoryLines = splitText(String(category), columnWidth[0] - 4);
    const infoLines = splitText(String(info), columnWidth[1] - 4);

    categoryLines.forEach((line, i) => {
      doc.text(line, margin + 2, y + (i * rowHeight) + 7);
    });
    infoLines.forEach((line, i) => {
      doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
    });

    // Draw line after each row
    drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

    y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

    if (y > 270) { // Check if the y position exceeds the page limit
      doc.addPage();
      y = 20; // Reset y position on the new page
      doc.text('Category', margin + 2, y + 7);
      doc.text('Information', margin + columnWidth[0] + 2, y + 7);
      y += headerHeight;
    }
  });
}
//Lighthouse
doc.addPage();
doc.setFontSize(20);
const title15 = 'Lighthouse Analysis';
const titleWidth15 = doc.getStringUnitWidth(title15) * 20 / doc.internal.scaleFactor;
const x15 = (doc.internal.pageSize.width - titleWidth15) / 2;
doc.text(title15, x15, 20);


if (lighthouseAnalysis) {
  doc.setFontSize(14);
  doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
  doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', margin + 2, startY + 7);
  doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
  const lighthouseAnalysisRows = [
    ['Accessibility Score', lighthouseAnalysis && 'scores' in lighthouseAnalysis ? lighthouseAnalysis.scores.accessibility : 'N/A'],
    ['Best Practices Score', lighthouseAnalysis && 'scores' in lighthouseAnalysis ? lighthouseAnalysis.scores.bestPractices : 'N/A'],
    ['Performance Score', lighthouseAnalysis && 'scores' in lighthouseAnalysis ? lighthouseAnalysis.scores.performance : 'N/A'],
    // ...(
    //   lighthouseAnalysis && lighthouseAnalysis.diagnostics && lighthouseAnalysis.diagnostics.recommendations.length > 0
    //   ? lighthouseAnalysis.diagnostics.recommendations.map(recommendations => [
    //       recommendations.title,
    //       recommendations.description,
    //       `Score: ${recommendations.score}`,
    //       recommendations.displayValue !== undefined ? `Display Value: ${recommendations.displayValue}` : ''
    //     ])
    //   : [['Recommendations', 'No recommendations available']]
    // )
  ];
  

  y = startY + headerHeight;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  lighthouseAnalysisRows.forEach(row => {
    const [category, info] = row;
    const categoryLines = splitText(String(category), columnWidth[0] - 4);
    const infoLines = splitText(String(info), columnWidth[1] - 4);

    categoryLines.forEach((line, i) => {
      doc.text(line, margin + 2, y + (i * rowHeight) + 7);
    });
    infoLines.forEach((line, i) => {
      doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
    });

    // Draw line after each row
    drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

    y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

    if (y > 270) { // Check if the y position exceeds the page limit
      doc.addPage();
      y = 20; // Reset y position on the new page
      doc.text('Category', margin + 2, y + 7);
      doc.text('Information', margin + columnWidth[0] + 2, y + 7);
      y += headerHeight;
    }
  });
}
///Sentiment
doc.addPage();
  doc.setFontSize(20);
  const title8= 'Sentiment Analysis';
  const titleWidth8 = doc.getStringUnitWidth(title8) * 20 / doc.internal.scaleFactor;
  const x8 = (doc.internal.pageSize.width - titleWidth8) / 2;
  doc.text(title8, x8, 20);
  
  
  if (sentimentAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
    const sentiment = sentimentAnalysis && 'sentimentAnalysis' in sentimentAnalysis 
    ? `${Object.keys(sentimentAnalysis.sentimentAnalysis)[0]}: ${(Object.values(sentimentAnalysis.sentimentAnalysis)[0] * 100).toFixed(2)}%`
    : 'N/A';
  
  const positiveWords = sentimentAnalysis && 'positiveWords' in sentimentAnalysis 
      ? sentimentAnalysis.positiveWords.join(', ') 
      : 'N/A';

  const negativeWords = sentimentAnalysis && 'negativeWords' in sentimentAnalysis 
      ? sentimentAnalysis.negativeWords.join(', ') 
      : 'N/A';

      const emotion = sentimentAnalysis && 'emotions' in sentimentAnalysis 
      ? `${Object.keys(sentimentAnalysis.emotions)[0]}: ${(Object.values(sentimentAnalysis.emotions)[0] * 100).toFixed(2)}%`
      : 'N/A';
  
  const sentimentAnalysisRows = [
      ['Sentiment', sentiment],
      ['Positive Words', positiveWords],
      ['Negative Words', negativeWords],
      ['Emotion', emotion],
  ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    sentimentAnalysisRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
  
  // Review Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title16 = 'Review Analysis';
  const titleWidth16 = doc.getStringUnitWidth(title16) * 20 / doc.internal.scaleFactor;
  const x16 = (doc.internal.pageSize.width - titleWidth16) / 2;
  doc.text(title16, x16, 20);
  
  
  if (headingAnalysis) {
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

    const reviewRows = [
      ['NPS', reviews && 'NPS' in reviews ? `${reviews.NPS}` : 'N/A'],
      ['Number Of Reviews', reviews && 'numberOfReviews' in reviews ? `${reviews.numberOfReviews}` : 'N/A'],
      ['Rating', reviews && 'rating' in reviews ? `${reviews.rating}` : 'N/A'],
      ['Recommendation Status', reviews && 'recommendationStatus' in reviews ? `${reviews.recommendationStatus}` : 'N/A'],
      ['TrustIndex', reviews && 'trustIndex' in reviews ? `${reviews.trustIndex}` : 'N/A'],
    ];

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    reviewRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
  //
  
  // SahredCount Analysis
  doc.addPage();
  doc.setFontSize(20);
  const title17 = 'Social Media Metrics';
  const titleWidth17 = doc.getStringUnitWidth(title17) * 20 / doc.internal.scaleFactor;
  const x17 = (doc.internal.pageSize.width - titleWidth17) / 2;
  doc.text(title17, x17, 20);
  
  if (shareCountData) {
    console.log('shareCountData:', shareCountData);
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

    const shareCountDataRows = [
      ['Facebook', shareCountData && shareCountData.Facebook && 'total_count' in shareCountData.Facebook ? shareCountData.Facebook.total_count : 'N/A'],
      ['Pinterest', shareCountData && 'Pinterest' in shareCountData ? shareCountData.Pinterest : 'N/A'],
    ];    

    y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    shareCountDataRows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(String(category), columnWidth[0] - 4);
      const infoLines = splitText(String(info), columnWidth[1] - 4);

      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });

      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  }
//  
doc.addPage();
doc.setFontSize(20);
const title19 = 'News Analysis';
const titleWidth19 = doc.getStringUnitWidth(title19) * 20 / doc.internal.scaleFactor;
const x19 = (doc.internal.pageSize.width - titleWidth19) / 2;
doc.text(title19, x19, 20);


if (scrapeNews) {
  doc.setFontSize(14);
  doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
  doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', margin + 2, startY + 7);
  doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

  const scrapeNewsRows = scrapeNews.map(news => [
    news.link || 'N/A',
    news.pubDate || 'N/A',
    news.sentimentScores ? JSON.stringify(news.sentimentScores) : 'N/A',
    news.source || 'N/A',
    news.title || 'N/A'
  ]);
   

  y = startY + headerHeight;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  scrapeNewsRows.forEach(row => {
    row.forEach((cell, index) => {
      // Get the text to render and split it into lines if needed
      const lines = splitText(String(cell), columnWidth[index] - 4);
      
      lines.forEach((line, i) => {
        // Calculate the position for each column based on the index
        const xPos = margin + (index === 0 ? 2 : columnWidth.slice(0, index).reduce((a, b) => a + b, 0) + 2);
        doc.text(line, xPos, y + (i * rowHeight) + 7);
      });
    });
  
    // Draw a horizontal line after the row for separation
    drawLine(y + rowHeight + 3);
  
    // Increment y position by the height of the row
    y += rowHeight;
  
    // Add a new page if y exceeds the page height
    if (y > 270) {
      doc.addPage();
      y = 20; // Reset y position on the new page
      doc.text('Category', margin + 2, y + 7);
      doc.text('Information', margin + columnWidth[0] + 2, y + 7);
      y += headerHeight;
    }
  });
  }
//
  const cleanFilename = (url: string | null): string => {
    if (!url) return 'website-summary-report';
    let filename = url.replace('http://', '').replace('https://', '');
    filename = filename.split('').map(char => {
      return ['/', ':', '*', '?', '"', '<', '>', '|'].includes(char) ? '_' : char;
    }).join('');
    return filename.length > 50 ? filename.substring(0, 50) : filename;
  };

  const filename = cleanFilename(url);
  doc.save(`${filename}.pdf`);
};
