import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType, HeadingLevel
} from 'docx';
import { saveAs } from 'file-saver';

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: String(text || ''), ...opts })],
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: 80 },
  });
}

function boldPara(text, align = AlignmentType.CENTER) {
  return new Paragraph({
    children: [new TextRun({ text: String(text || ''), bold: true, size: 26 })],
    alignment: align,
    spacing: { after: 80 },
  });
}

export async function generateDOCX(examInfo, sections) {
  const children = [];

  // Header
  children.push(boldPara(examInfo.centerName || 'Coaching Center', AlignmentType.CENTER));
  children.push(new Paragraph({
    children: [new TextRun({ text: examInfo.examName || 'Examination', bold: true, size: 24 })],
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `Class: ${examInfo.className || ''}    Subject: ${examInfo.subject || ''}`, size: 22 })],
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
  }));
  const dateStr = examInfo.date ? `Date: ${examInfo.date}    ` : '';
  children.push(new Paragraph({
    children: [new TextRun({ text: `${dateStr}Time: ${examInfo.duration || ''}    Full Marks: ${examInfo.totalMarks || ''}`, size: 22 })],
    alignment: AlignmentType.CENTER, spacing: { after: 160 },
  }));

  // Divider paragraph
  children.push(new Paragraph({ children: [new TextRun({ text: '─'.repeat(60) })], spacing: { after: 120 } }));

  let qNum = 1;

  // MCQ
  if (sections.mcq?.enabled && sections.mcq.questions?.length > 0) {
    children.push(boldPara('Section A: Multiple Choice Questions', AlignmentType.LEFT));
    sections.mcq.questions.forEach(q => {
      children.push(para(`${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, { bold: false, size: 22 }));
      const opts = ['A', 'B', 'C', 'D'];
      (q.options || []).forEach((opt, oi) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: `    ${opts[oi] || oi + 1}. ${opt}`, size: 22 })],
          spacing: { after: 40 },
        }));
      });
      children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 80 } }));
      qNum++;
    });
  }

  // CQ
  if (sections.cq?.enabled && sections.cq.questions?.length > 0) {
    children.push(boldPara('Section B: Creative Questions', AlignmentType.LEFT));
    sections.cq.questions.forEach(q => {
      children.push(para(`${qNum}. উদ্দীপক:`, { bold: true, size: 22 }));
      if (q.stimulus) children.push(para(`    ${q.stimulus}`, { size: 22 }));
      const labels = ['ক', 'খ', 'গ', 'ঘ'];
      (q.subQuestions || []).forEach((sq, si) => {
        children.push(para(`    ${labels[si] || si + 1}. ${sq.question}  [${sq.marks || 0}]`, { size: 22 }));
      });
      children.push(new Paragraph({ children: [new TextRun('')], spacing: { after: 120 } }));
      qNum++;
    });
  }

  // Short
  if (sections.short?.enabled && sections.short.questions?.length > 0) {
    children.push(boldPara('Section C: Short Questions', AlignmentType.LEFT));
    sections.short.questions.forEach(q => {
      children.push(para(`${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, { size: 22 }));
      qNum++;
    });
  }

  // Fill Blank
  if (sections.fillBlank?.enabled && sections.fillBlank.questions?.length > 0) {
    children.push(boldPara('Section D: Fill in the Blanks', AlignmentType.LEFT));
    sections.fillBlank.questions.forEach(q => {
      children.push(para(`${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, { size: 22 }));
      qNum++;
    });
  }

  // True/False
  if (sections.trueFalse?.enabled && sections.trueFalse.questions?.length > 0) {
    children.push(boldPara('Section E: True or False', AlignmentType.LEFT));
    sections.trueFalse.questions.forEach(q => {
      children.push(para(`${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, { size: 22 }));
      qNum++;
    });
  }

  // Descriptive
  if (sections.descriptive?.enabled && sections.descriptive.questions?.length > 0) {
    children.push(boldPara('Section F: Descriptive Questions', AlignmentType.LEFT));
    sections.descriptive.questions.forEach(q => {
      children.push(para(`${qNum}. ${q.question}${q.marks ? `  [${q.marks}]` : ''}`, { size: 22 }));
      qNum++;
    });
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4 in twips
          margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
        }
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${examInfo.centerName || 'QuestionPaper'}_${examInfo.subject || 'Subject'}.docx`;
  saveAs(blob, fileName.replace(/\s+/g, '_'));
}

