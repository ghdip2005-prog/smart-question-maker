import jsPDF from 'jspdf';

function addWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach(line => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export async function generatePDF(examInfo, sections) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const marginL = 20, marginR = 20;
  const contentW = pageW - marginL - marginR;
  let y = 20;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const centerName = examInfo.centerName || 'Coaching Center';
  doc.text(centerName, pageW / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(13);
  doc.text(examInfo.examName || 'Examination', pageW / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Class: ${examInfo.className || ''}    Subject: ${examInfo.subject || ''}`, pageW / 2, y, { align: 'center' });
  y += 6;

  const dateStr = examInfo.date ? `Date: ${examInfo.date}    ` : '';
  doc.text(`${dateStr}Time: ${examInfo.duration || ''}    Full Marks: ${examInfo.totalMarks || ''}`, pageW / 2, y, { align: 'center' });
  y += 5;

  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  let qNum = 1;

  // MCQ Section
  if (sections.mcq?.enabled && sections.mcq.questions?.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Section A: Multiple Choice Questions`, marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    sections.mcq.questions.forEach((q, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      const qLine = `${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`;
      y = addWrappedText(doc, qLine, marginL, y, contentW, 6);
      const opts = ['A', 'B', 'C', 'D'];
      (q.options || []).forEach((opt, oi) => {
        if (y > 265) { doc.addPage(); y = 20; }
        y = addWrappedText(doc, `  ${opts[oi] || oi + 1}. ${opt}`, marginL + 4, y, contentW - 4, 6);
      });
      y += 3;
      qNum++;
    });
    y += 4;
  }

  // CQ Section
  if (sections.cq?.enabled && sections.cq.questions?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Section B: Creative Questions`, marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    sections.cq.questions.forEach((q, i) => {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      y = addWrappedText(doc, `${qNum}. উদ্দীপক:`, marginL, y, contentW, 6);
      doc.setFont('helvetica', 'normal');
      if (q.stimulus) {
        y = addWrappedText(doc, q.stimulus, marginL + 4, y, contentW - 4, 6);
      }
      const labels = ['ক', 'খ', 'গ', 'ঘ'];
      (q.subQuestions || []).forEach((sq, si) => {
        if (y > 265) { doc.addPage(); y = 20; }
        const label = labels[si] || String.fromCharCode(2453 + si);
        y = addWrappedText(doc, `${label}. ${sq.question}  [${sq.marks || 0}]`, marginL + 4, y, contentW - 4, 6);
      });
      y += 4;
      qNum++;
    });
    y += 4;
  }

  // Short Questions
  if (sections.short?.enabled && sections.short.questions?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Section C: Short Questions`, marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    sections.short.questions.forEach(q => {
      if (y > 265) { doc.addPage(); y = 20; }
      y = addWrappedText(doc, `${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, marginL, y, contentW, 6);
      y += 2;
      qNum++;
    });
    y += 4;
  }

  // Fill in the Blanks
  if (sections.fillBlank?.enabled && sections.fillBlank.questions?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Section D: Fill in the Blanks`, marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    sections.fillBlank.questions.forEach(q => {
      if (y > 265) { doc.addPage(); y = 20; }
      y = addWrappedText(doc, `${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, marginL, y, contentW, 6);
      y += 2;
      qNum++;
    });
    y += 4;
  }

  // True/False
  if (sections.trueFalse?.enabled && sections.trueFalse.questions?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Section E: True or False`, marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    sections.trueFalse.questions.forEach(q => {
      if (y > 265) { doc.addPage(); y = 20; }
      y = addWrappedText(doc, `${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, marginL, y, contentW, 6);
      y += 2;
      qNum++;
    });
    y += 4;
  }

  // Descriptive
  if (sections.descriptive?.enabled && sections.descriptive.questions?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Section F: Descriptive Questions`, marginL, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    sections.descriptive.questions.forEach(q => {
      if (y > 265) { doc.addPage(); y = 20; }
      y = addWrappedText(doc, `${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, marginL, y, contentW, 6);
      y += 2;
      qNum++;
    });
  }

  // Page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Page ${p} of ${totalPages}`, pageW / 2, 290, { align: 'center' });
  }

  const fileName = `${examInfo.centerName || 'QuestionPaper'}_${examInfo.subject || 'Subject'}.pdf`;
  doc.save(fileName.replace(/\s+/g, '_'));
}

