import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (results) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(5, 150, 105); // Primary green
  doc.text('Smart Crop Decision Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);

  // Top Recommendation Details
  const topCrop = results.recommendations[0];
  
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55);
  doc.text('1. Primary Recommendation', 20, 45);
  
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text(`Crop: ${topCrop.crop.toUpperCase()}`, 20, 55);
  
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`Confidence Score: ${topCrop.confidence}%`, 20, 63);
  doc.text(`Expected Profit: Rs. ${topCrop.expectedProfit} per acre`, 20, 71);
  
  // Reason
  doc.setFont('helvetica', 'bold');
  doc.text('Why this crop?', 20, 82);
  doc.setFont('helvetica', 'normal');
  const splitReason = doc.splitTextToSize(topCrop.reason, 170);
  doc.text(splitReason, 20, 90);
  
  // Fertilizer Roadmap
  let yPos = 90 + (splitReason.length * 6) + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fertilizer & Growth Roadmap:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  
  yPos += 8;
  doc.text(`Pre-sowing: ${topCrop.fertilizerRoadmap.pre_sowing}`, 25, yPos);
  yPos += 8;
  doc.text(`Growth stage: ${topCrop.fertilizerRoadmap.growth_stage}`, 25, yPos);
  yPos += 8;
  doc.text(`Harvest stage: ${topCrop.fertilizerRoadmap.harvest_stage}`, 25, yPos);
  
  yPos += 15;
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  
  // Alternate Recommendations Table
  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Alternate Crop Options', 20, yPos);
  
  const tableData = results.recommendations.slice(1).map((rec, index) => [
    `Option ${index + 2}`,
    rec.crop.toUpperCase(),
    `${rec.confidence}%`,
    `Rs. ${rec.expectedProfit}`
  ]);
  
  doc.autoTable({
    startY: yPos + 6,
    head: [['Rank', 'Crop', 'Confidence', 'Est. Profit/Acre']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [5, 150, 105] }
  });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('This is an AI-generated advisory. Please consult local agronomists for confirmation.', 105, 280, { align: 'center' });
  
  // Save
  doc.save('Crop_Recommendation_Report.pdf');
};
