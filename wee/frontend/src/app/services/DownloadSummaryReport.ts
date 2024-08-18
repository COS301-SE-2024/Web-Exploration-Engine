import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async (summaryReport: any, weakClassification: any[], parkedUrls: string[], mismatchedUrls: any[]) => {
    if (!summaryReport) {
        console.error("Summary report is undefined");
        return;
    }

    const doc = new jsPDF();
    let currentPage = 1;

    const addPageNumber = (pageNumber: number) => {
        doc.setFontSize(10);
        doc.text(`Page ${pageNumber-1}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    };

    const title = 'Web Exploration Engine Summary Report';
    const titleWidth = doc.getStringUnitWidth(title) * 20 / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.setFontSize(20);
    doc.text(title, x, 20);

    const startY = 30;
    const margin = 14;
    const headerHeight = 10;
    const rowHeight = 10;
    const columnWidth = [60, 190];

    const drawLine = (lineY: number): void => {
        doc.setDrawColor(200, 200, 200);
        doc.line(0, lineY - 1, margin + columnWidth[0] + columnWidth[1], lineY - 1);
    };

    doc.setFontSize(14);
    doc.setFillColor(47, 139, 87);
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);

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

    const rows = [
        ['Total URLs', summaryReport.totalUrls?.toString() || 'N/A'],
        ['Scrapable URLs', summaryReport.scrapableUrls?.toString() || 'N/A'],
        ['Average Time',  `${summaryReport.avgTime?.toString() || 'N/A'} seconds`],
    ];

    let y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    rows.forEach(row => {
        const [category, info] = row;
        const categoryLines = splitText(category, columnWidth[0] - 4);
        const infoLines = splitText(info, columnWidth[1] - 4);

        categoryLines.forEach((line, i) => {
            doc.text(line, margin + 2, y + (i * rowHeight) + 7);
        });
        infoLines.forEach((line, i) => {
            doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
        });

        drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);

        y += Math.max(categoryLines.length, infoLines.length) * rowHeight;

        if (y > 270) {
            doc.addPage();
            addPageNumber(++currentPage);
            y = 20;
            doc.text('Category', margin + 2, y + 7);
            doc.text('Information', margin + columnWidth[0] + 2, y + 7);
            y += headerHeight;
        }
    });

    addPageNumber(++currentPage);

    const addChartToPDF = async () => {
        const captureChart = async (chartId: string, title: string, yPosition: number) => {
            const chartElement = document.getElementById(chartId);
            if (chartElement) {

                const elementWidth = chartElement.offsetWidth || 1920; 
                const elementHeight = chartElement.offsetHeight || 1080;

                const pageWidth = doc.internal.pageSize.width - 40; 
                const pageHeight = doc.internal.pageSize.height - yPosition - 20; 
        
                const aspectRatio = elementWidth / elementHeight;
        
                let finalWidth, finalHeight;
        
                if (elementWidth > pageWidth || elementHeight > pageHeight) {
                    if (pageWidth / aspectRatio <= pageHeight) {
                        finalWidth = pageWidth;
                        finalHeight = pageWidth / aspectRatio;
                    } else {
                        finalHeight = pageHeight;
                        finalWidth = pageHeight * aspectRatio;
                    }
                } else {
                    finalWidth = elementWidth;
                    finalHeight = elementHeight;
                }
        
                const canvas = await html2canvas(chartElement, {
                    width: elementWidth,
                    height: elementHeight,
                    scale: 2, 
                });
        
                const imgData = canvas.toDataURL('image/png');
        
                doc.addPage();
                addPageNumber(++currentPage);
                doc.setFontSize(18);
                doc.text(title, 20, 20);
        
                doc.addImage(imgData, 'PNG', 20, yPosition, finalWidth, finalHeight);
            }
        };
             
        await captureChart('pie-chart', 'Industry Classification Distribution', 30);
        if (weakClassification && weakClassification.length > 0) {
            const lowConfidenceUrls = weakClassification
                .filter(item => item.score < 0.5)
                .map(item => item.url);
    
            if (lowConfidenceUrls.length > 0) {
                doc.addPage();
                addPageNumber(++currentPage);
                doc.setFontSize(18);
                doc.text('Low Confidence URLs (Confidence Score < 50%)', 20, 20);
                doc.setFontSize(12);
                lowConfidenceUrls.forEach((url, index) => {
                    const y = 30 + index * 10;
                    doc.text(`${index + 1}. ${url}`, 20, y);
                });
            }
        }
    
        await captureChart('bar-chart', 'Website Status Distribution', 30);
        if (parkedUrls && parkedUrls.length > 0) {
            doc.addPage();
            addPageNumber(++currentPage);
            doc.setFontSize(12);
            doc.text('Parked URLs', 20, 20);
    
            parkedUrls.forEach((url, index) => {
                const y = 30 + index * 10;
                doc.text(`${index + 1}. ${url}`, 20, y);
            });
        }
    
        await captureChart('radial-chart', 'Domain Match Distribution', 30);
        if (mismatchedUrls && mismatchedUrls.length > 0) {
            doc.addPage();
            addPageNumber(++currentPage);
            doc.setFontSize(12);
            doc.text('Mismatched URLs', 20, 20);
    
            let currentY = 30;
            const lineHeight = 10;
            const maxLinesPerPage = Math.floor((doc.internal.pageSize.height - 30) / lineHeight);
    
            mismatchedUrls.forEach((item, index) => {
                const lines = doc.splitTextToSize(`${index + 1}. ${item.url} - Meta: ${item.metadataClass}, Domain: ${item.domainClass}`, doc.internal.pageSize.width - 40);
    
                if (lines) {
                    lines.forEach((line: string, lineIndex: number) => {
                        if (currentY + lineHeight > doc.internal.pageSize.height - 20) {
                            doc.addPage();
                            addPageNumber(++currentPage);
                            doc.setFontSize(12);
                            doc.text('Mismatched URLs (Continued)', 20, 20);
                            currentY = 30;
                        }
                        doc.text(line, 20, currentY);
                        currentY += lineHeight;
                    });
                } else {
                    console.error('splitTextToSize returned undefined for item:', item);
                }
            });
        }
        await captureChart('radar-chart', 'Industry and Domain Classification Distribution', 30);
        await captureChart('area-chart', 'Emotion Confidence Classification Distribution', 30);
    };        

    await addChartToPDF();
    doc.save('website-summary-report.pdf');
};
