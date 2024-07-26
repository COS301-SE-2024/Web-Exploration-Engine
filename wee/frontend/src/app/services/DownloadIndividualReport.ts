import jsPDF from 'jspdf';
import { TitleTagsAnalysis, SEOError, HeadingAnalysis } from '../models/ScraperModels';

interface SummaryInfo {
  title: string;
  description: string;
}

interface Classifications {
  label: string;
  score: number;
}

export const handleDownloadReport = (
  url: string | null,
  summaryInfo: SummaryInfo | undefined,
  websiteStatus: string,
  isCrawlable: boolean,
  industryClassification: Classifications | undefined,
  domainClassification: Classifications | undefined,
  addresses: string[],
  emails: string[],
  phones: string[],
  socialLinks: string[],
  titleTagAnalysis: TitleTagsAnalysis | SEOError | undefined,
  headingAnalysis: HeadingAnalysis | SEOError | undefined
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
    ['Industry', industryClassification?.label || 'N/A'],
    ['Confidence Score', isCrawlable ? `${(industryClassification?.score ? (industryClassification.score * 100).toFixed(2) : 0)}%` : 'N/A'],
    ['Domain Match', domainClassification?.label || 'N/A'],
    ['Confidence Score', isCrawlable ? `${(domainClassification?.score ? (domainClassification.score * 100).toFixed(2) : 0)}%` : 'N/A'],
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
     // ['Headings', headingAnalysis && 'headings' in headingAnalysis ? headingAnalysis.headings.join(', ') : 'N/A'],
      //['Recommendations', headingAnalysis && 'recommendations' in headingAnalysis ? headingAnalysis.recommendations : 'N/A']
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
