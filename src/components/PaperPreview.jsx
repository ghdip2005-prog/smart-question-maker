import { forwardRef } from 'react';

const CQ_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];
const OPT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

function PaperPreview({ examInfo, sections, settings = {} }, ref) {
  const fontSize = settings.fontSize || 'text-sm';
  const fontFamily = settings.fontFamily || 'font-serif';
  const marginClass = settings.margin === 'wide' ? 'p-14' : settings.margin === 'narrow' ? 'p-6' : 'p-10';

  let qNum = 1;
  const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let secIdx = 0;

  const activeSections = [
    { key: 'mcq', label: 'Multiple Choice Questions' },
    { key: 'cq', label: 'Creative Questions' },
    { key: 'short', label: 'Short Questions' },
    { key: 'fillBlank', label: 'Fill in the Blanks' },
    { key: 'trueFalse', label: 'True or False' },
    { key: 'descriptive', label: 'Descriptive Questions' },
    { key: 'custom', label: sections.custom?.title || 'Other Questions' },
  ].filter(s => sections[s.key]?.enabled && sections[s.key]?.questions?.length > 0);

  return (
    <div
      ref={ref}
      id="print-area"
      className={`bg-white ${fontFamily} ${fontSize} text-black shadow-lg`}
      style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}
    >
      <div className={marginClass}>
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          {examInfo.logo && (
            <img src={examInfo.logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-2" />
          )}
          <h1 className="text-xl font-extrabold tracking-wide uppercase">
            {examInfo.centerName || 'Coaching Center Name'}
          </h1>
          <h2 className="text-base font-bold mt-1">
            {examInfo.examName || 'Examination'}
          </h2>
          <div className="mt-2 flex justify-center gap-8 text-sm">
            <span>Class: <strong>{examInfo.className || '___'}</strong></span>
            <span>Subject: <strong>{examInfo.subject || '___'}</strong></span>
          </div>
          <div className="flex justify-center gap-8 text-sm mt-1">
            {examInfo.date && <span>Date: <strong>{examInfo.date}</strong></span>}
            <span>Time: <strong>{examInfo.duration || '___'}</strong></span>
            <span>Full Marks: <strong>{examInfo.totalMarks || '___'}</strong></span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xs italic text-gray-600 mb-4 text-center">
          Answer all questions. Read each question carefully.
        </p>

        {/* Sections */}
        {activeSections.map(({ key, label }) => {
          const sec = sections[key];
          const letter = sectionLetters[secIdx++];
          return (
            <div key={key} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-sm uppercase tracking-wide border-b border-gray-400 pb-1 flex-1">
                  Section {letter}: {label}
                </h3>
              </div>

              {/* MCQ */}
              {key === 'mcq' && sec.questions.map((q, i) => (
                <div key={q.id} className="mb-3">
                  <p className="font-medium text-sm leading-relaxed">
                    {qNum++}. {q.question || <span className="text-gray-400 italic">Question text</span>}
                    {q.marks ? <span className="float-right font-normal text-xs">[ {q.marks} ]</span> : ''}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 mt-1 ml-4">
                    {q.options.map((opt, oi) => opt ? (
                      <p key={oi} className="text-sm">{OPT_LABELS[oi] || oi + 1}. {opt}</p>
                    ) : null)}
                  </div>
                </div>
              ))}

              {/* CQ */}
              {key === 'cq' && sec.questions.map((q, i) => (
                <div key={q.id} className="mb-5">
                  <p className="font-bold text-sm mb-1">{qNum++}. উদ্দীপক:</p>
                  {q.stimulus && (
                    <p className="text-sm ml-4 mb-2 italic border-l-2 border-gray-300 pl-3 leading-relaxed">
                      {q.stimulus}
                    </p>
                  )}
                  {q.subQuestions?.map((sq, si) => (
                    <p key={sq.id} className="text-sm ml-4 leading-relaxed mt-1">
                      {CQ_LABELS[si] || si + 1}. {sq.question}
                      {sq.marks ? <span className="float-right text-xs font-normal">[ {sq.marks} ]</span> : ''}
                    </p>
                  ))}
                </div>
              ))}

              {/* Short / Fill / TF / Desc / Custom */}
              {!['mcq', 'cq'].includes(key) && sec.questions.map(q => (
                <div key={q.id} className="mb-2">
                  <p className="text-sm leading-relaxed">
                    {qNum++}. {q.question || <span className="text-gray-400 italic">Question text</span>}
                    {q.marks ? <span className="float-right text-xs font-normal">[ {q.marks} ]</span> : ''}
                  </p>
                </div>
              ))}
            </div>
          );
        })}

        {activeSections.length === 0 && (
          <div className="text-center text-gray-300 py-16 text-sm">
            Add questions to see them appear here.
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-3 border-t border-gray-300 text-center text-xs text-gray-500">
          — End of Question Paper —
        </div>
      </div>
    </div>
  );
}

export default forwardRef(PaperPreview);

