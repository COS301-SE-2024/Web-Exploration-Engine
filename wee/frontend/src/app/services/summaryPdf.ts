import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Summary } from '../models/ScraperModels';
import { Response } from 'express';

@Injectable()
export class PdfGeneratorService {
  generateSummaryPdf(summary: Summary): Buffer {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    let buffer: Buffer;

    doc.on('data', (chunk) => {
      buffer = Buffer.concat([buffer || Buffer.alloc(0), chunk]);
    });

    doc.on('end', () => {
      // The buffer contains the PDF data
    });

    // Add title
    doc.fontSize(20).text('Scraper Summary Report', { align: 'center' });

    // Add domain status
    doc.fontSize(14).text(`Domain Status: Live (${summary.domainStatus[1]}), Parked (${summary.domainStatus[0]})`);
    doc.text(`Errors: ${summary.domainErrorStatus}`);

    // Add industry classification
    doc.addPage().fontSize(16).text('Industry Classification');
    summary.industryClassification.industryPercentages.industries.forEach((industry, index) => {
      doc.fontSize(12).text(`${industry}: ${summary.industryClassification.industryPercentages.percentages[index]}%`);
    });
    if (summary.industryClassification.weakClassification.length > 0) {
      doc.addPage().fontSize(14).text('Weak Classification');
      summary.industryClassification.weakClassification.forEach(item => {
        doc.fontSize(12).text(`URL: ${item.url}, Metadata Class: ${item.metadataClass}, Score: ${item.score}`);
      });
    }

    // Add domain match
    doc.addPage().fontSize(16).text('Domain Match Classification');
    doc.fontSize(12).text(`Percentage Match: ${summary.domainMatch.percentageMatch}%`);
    if (summary.domainMatch.mismatchedUrls.length > 0) {
      doc.addPage().fontSize(14).text('Mismatched URLs');
      summary.domainMatch.mismatchedUrls.forEach(item => {
        doc.fontSize(12).text(`URL: ${item.url}, Metadata Class: ${item.metadataClass}, Domain Class: ${item.domainClass}`);
      });
    }

    // Add summary statistics
    doc.addPage().fontSize(16).text('Summary Statistics');
    doc.fontSize(12).text(`Total URLs: ${summary.totalUrls}`);
    doc.text(`Scrapable URLs: ${summary.scrapableUrls}`);
    doc.text(`Average Time: ${summary.avgTime}ms`);
    doc.text(`Parked URLs Count: ${summary.parkedUrls.length}`);

    doc.end();

    return buffer;
  }

  async downloadSummaryPdf(summary: Summary, res: Response): Promise<void> {
    const pdfBuffer = this.generateSummaryPdf(summary);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="summary-report.pdf"');
    res.end(pdfBuffer);
  }
}
