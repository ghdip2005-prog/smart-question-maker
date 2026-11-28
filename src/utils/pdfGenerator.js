import html2pdf from 'html2pdf.js';

const CQ_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];
const OPT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFontConfig(settings = {}) {
  const sizeMap = {
    'text-xs': { base: '12px', h1: '18px', h2: '14px', sec: '13px', meta: '11.5px' },
    'text-sm': { base: '13.5px', h1: '20px', h2: '15px', sec: '14px', meta: '12.5px' },
    'text-base': { base: '15px', h1: '22px', h2: '16.5px', sec: '15.5px', meta: '13.5px' },
  };
  const sizes = sizeMap[settings.fontSize] || sizeMap['text-sm'];

  const familyMap = {
    'font-serif': "'Noto Serif Bengali', 'Noto Sans Bengali', 'Times New Roman', Georgia, serif",
    'font-sans': "'Inter', 'Noto Sans Bengali', 'Hind Siliguri', Arial, sans-serif",
    'font-mono': "'Noto Sans Bengali', 'Courier New', Courier, monospace",
  };
  const fontFamily = familyMap[settings.fontFamily] || familyMap['font-serif'];

  const marginMap = {
    narrow: 12,
    normal: 18,
    wide: 24,
  };
  const marginMm = marginMap[settings.margin] || 18;

  return { sizes, fontFamily, marginMm };
}

function buildPaperHTML(examInfo, sections, settings = {}) {
  const { sizes, fontFamily } = getFontConfig(settings);

  const activeSections = [
    { key: 'mcq', label: 'Multiple Choice Questions' },
    { key: 'cq', label: 'Creative Questions' },
    { key: 'short', label: 'Short Questions' },
    { key: 'fillBlank', label: 'Fill in the Blanks' },
    { key: 'trueFalse', label: 'True or False' },
    { key: 'descriptive', label: 'Descriptive Questions' },
    { key: 'custom', label: sections.custom?.title || 'Other Questions' },
  ].filter(s => sections[s.key]?.enabled && sections[s.key]?.questions?.length > 0);

  const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let qNum = 1;
  let secIdx = 0;

  const logoHtml = examInfo.logo
    ? `<div style="margin-bottom: 8px;"><img src="${examInfo.logo}" alt="Logo" style="width: 56px; height: 56px; object-fit: contain; display: inline-block;" /></div>`
    : '';

  const dateHtml = examInfo.date
    ? `<span>Date: <strong>${escapeHtml(examInfo.date)}</strong></span>`
    : '';

  const sectionsHtml = activeSections
    .map(({ key, label }) => {
      const sec = sections[key];
      const letter = sectionLetters[secIdx++] || '';
      let bodyHtml = '';

      if (key === 'mcq') {
        bodyHtml = sec.questions
          .map(q => {
            const currentNum = qNum++;
            const marksHtml = q.marks
              ? `<span style="flex-shrink: 0; white-space: nowrap; font-size: ${sizes.meta}; font-weight: 500; color: #111827;">[ ${escapeHtml(q.marks)} ]</span>`
              : '';
            const opts = (q.options || [])
              .map((opt, oi) =>
                opt
                  ? `<div style="font-size: ${sizes.base}; line-height: 1.55; padding: 2px 0; overflow-wrap: break-word; word-break: break-word;">${OPT_LABELS[oi] || oi + 1}. ${escapeHtml(opt)}</div>`
                  : ''
              )
              .filter(Boolean)
              .join('');

            return `
              <div class="qp-question" style="margin-bottom: 11px; break-inside: avoid; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                  <div style="flex: 1; min-width: 0; font-weight: 500; line-height: 1.6; overflow-wrap: break-word; word-break: break-word;">${currentNum}. ${escapeHtml(q.question || '')}</div>
                  ${marksHtml}
                </div>
                ${opts ? `<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; row-gap: 2px; margin-top: 4px; padding-left: 18px;">${opts}</div>` : ''}
              </div>
            `;
          })
          .join('');
      } else if (key === 'cq') {
        bodyHtml = sec.questions
          .map(q => {
            const currentNum = qNum++;
            const stimulusHtml = q.stimulus
              ? `<div style="margin: 4px 0 8px 16px; padding-left: 10px; border-left: 2px solid #9ca3af; font-style: normal; line-height: 1.65; white-space: pre-wrap; overflow-wrap: break-word; word-break: break-word;">${escapeHtml(q.stimulus)}</div>`
              : '';
            const subsHtml = (q.subQuestions || [])
              .map((sq, si) => {
                const label = CQ_LABELS[si] || si + 1;
                const sqMarks = sq.marks
                  ? `<span style="flex-shrink: 0; white-space: nowrap; font-size: ${sizes.meta}; color: #111827;">[ ${escapeHtml(sq.marks)} ]</span>`
                  : '';
                return `
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding-left: 16px; margin-top: 4px; break-inside: avoid; page-break-inside: avoid;">
                    <div style="flex: 1; min-width: 0; line-height: 1.6; overflow-wrap: break-word; word-break: break-word;">${label}. ${escapeHtml(sq.question || '')}</div>
                    ${sqMarks}
                  </div>
                `;
              })
              .join('');

            return `
              <div class="qp-question" style="margin-bottom: 16px; break-inside: avoid; page-break-inside: avoid;">
                <div style="font-weight: 700; line-height: 1.6; margin-bottom: 2px;">${currentNum}. উদ্দীপক:</div>
                ${stimulusHtml}
                ${subsHtml}
              </div>
            `;
          })
          .join('');
      } else {
        bodyHtml = sec.questions
          .map(q => {
            const currentNum = qNum++;
            const marksHtml = q.marks
              ? `<span style="flex-shrink: 0; white-space: nowrap; font-size: ${sizes.meta}; color: #111827;">[ ${escapeHtml(q.marks)} ]</span>`
              : '';
            return `
              <div class="qp-question" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; break-inside: avoid; page-break-inside: avoid;">
                <div style="flex: 1; min-width: 0; line-height: 1.6; overflow-wrap: break-word; word-break: break-word;">${currentNum}. ${escapeHtml(q.question || '')}</div>
                ${marksHtml}
              </div>
            `;
          })
          .join('');
      }

      return `
        <div style="margin-bottom: 18px;">
          <h3 style="font-size: ${sizes.sec}; font-weight: 700; border-bottom: 1px solid #6b7280; padding-bottom: 4px; margin: 0 0 10px 0; letter-spacing: 0; break-after: avoid; page-break-after: avoid;">
            Section ${letter}: ${escapeHtml(label)}
          </h3>
          ${bodyHtml}
        </div>
      `;
    })
    .join('');

  return `
    <div id="pdf-paper-root" style="
      width: 100%;
      background-color: #ffffff;
      color: #000000;
      font-family: ${fontFamily};
      font-size: ${sizes.base};
      line-height: 1.6;
      letter-spacing: 0;
      word-spacing: normal;
      font-kerning: normal;
      font-variant-ligatures: normal;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    ">
      <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 14px;">
        ${logoHtml}
        <h1 style="font-size: ${sizes.h1}; font-weight: 700; margin: 0; line-height: 1.35; letter-spacing: 0; color: #000000;">
          ${escapeHtml(examInfo.centerName || 'Coaching Center Name')}
        </h1>
        <h2 style="font-size: ${sizes.h2}; font-weight: 700; margin: 4px 0 0 0; line-height: 1.35; letter-spacing: 0; color: #000000;">
          ${escapeHtml(examInfo.examName || 'Examination')}
        </h2>
        <div style="margin-top: 8px; display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; font-size: ${sizes.meta}; color: #111827;">
          <span>Class: <strong>${escapeHtml(examInfo.className || '___')}</strong></span>
          <span>Subject: <strong>${escapeHtml(examInfo.subject || '___')}</strong></span>
        </div>
        <div style="margin-top: 4px; display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; font-size: ${sizes.meta}; color: #111827;">
          ${dateHtml}
          <span>Time: <strong>${escapeHtml(examInfo.duration || '___')}</strong></span>
          <span>Full Marks: <strong>${escapeHtml(examInfo.totalMarks || '___')}</strong></span>
        </div>
      </div>

      <p style="font-size: ${sizes.meta}; font-style: italic; color: #4b5563; text-align: center; margin: 0 0 14px 0;">
        Answer all questions. Read each question carefully.
      </p>

      ${sectionsHtml || '<div style="text-align: center; color: #9ca3af; padding: 40px 0;">No questions added.</div>'}

      <div style="margin-top: 22px; padding-top: 8px; border-top: 1px solid #d1d5db; text-align: center; font-size: 11px; color: #6b7280;">
        — End of Question Paper —
      </div>
    </div>
  `;
}

async function waitForFonts(doc) {
  try {
    if (doc.fonts) {
      await Promise.race([
        Promise.all([
          doc.fonts.ready,
          doc.fonts.load('400 14px "Noto Sans Bengali"'),
          doc.fonts.load('700 14px "Noto Sans Bengali"'),
          doc.fonts.load('400 14px "Noto Serif Bengali"'),
          doc.fonts.load('700 14px "Noto Serif Bengali"'),
          doc.fonts.load('400 14px "Inter"'),
          doc.fonts.load('700 14px "Inter"'),
        ]),
        new Promise(resolve => setTimeout(resolve, 4000)),
      ]);
    }
  } catch {
    // Fallback gracefully if font API throws offline
  }
}

export async function generatePDF(examInfo, sections, settings = {}) {
  const { marginMm } = getFontConfig(settings);

  // Use an isolated iframe so Tailwind v4 oklch() stylesheets never break html2canvas
  // and preview scaling / UI styles never leak into the exported PDF.
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = '794px'; // A4 width at 96 DPI
  iframe.style.height = '1123px';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`<!doctype html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; letter-spacing: normal; }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  ${buildPaperHTML(examInfo, sections, settings)}
</body>
</html>`);
    iframeDoc.close();

    // Wait for fonts and images inside iframe
    await waitForFonts(iframeDoc);
    await new Promise(resolve => setTimeout(resolve, 150));

    const rootEl = iframeDoc.getElementById('pdf-paper-root');
    const contentWidthPx = Math.round(((210 - marginMm * 2) / 25.4) * 96);
    rootEl.style.width = `${contentWidthPx}px`;

    const fileName = `${examInfo.centerName || 'QuestionPaper'}_${examInfo.subject || 'Subject'}.pdf`.replace(/\s+/g, '_');

    const opt = {
      margin: [marginMm, marginMm, marginMm + 4, marginMm],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        letterRendering: false,
        windowWidth: contentWidthPx,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
    };

    const worker = html2pdf().set(opt).from(rootEl).toPdf();
    const pdf = await worker.get('pdf');

    const totalPages = pdf.internal.getNumberOfPages();
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Page ${p} of ${totalPages}`, pageW / 2, pageH - 8, { align: 'center' });
    }

    pdf.save(fileName);
  } finally {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  }
}
