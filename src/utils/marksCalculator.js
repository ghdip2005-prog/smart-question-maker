// Marks calculation utilities

export function calcMCQMarks(questions) {
  return questions.reduce((sum, q) => sum + (parseFloat(q.marks) || 0), 0);
}

export function calcCQMarks(questions) {
  return questions.reduce((sum, q) => {
    const subTotal = (q.subQuestions || []).reduce((s, sq) => s + (parseFloat(sq.marks) || 0), 0);
    return sum + subTotal;
  }, 0);
}

export function calcSectionMarks(questions) {
  return questions.reduce((sum, q) => sum + (parseFloat(q.marks) || 0), 0);
}

export function calcTotalQuestionMarks(sections) {
  let total = 0;
  if (sections.mcq?.enabled) total += calcMCQMarks(sections.mcq.questions || []);
  if (sections.cq?.enabled) total += calcCQMarks(sections.cq.questions || []);
  if (sections.short?.enabled) total += calcSectionMarks(sections.short.questions || []);
  if (sections.fillBlank?.enabled) total += calcSectionMarks(sections.fillBlank.questions || []);
  if (sections.trueFalse?.enabled) total += calcSectionMarks(sections.trueFalse.questions || []);
  if (sections.descriptive?.enabled) total += calcSectionMarks(sections.descriptive.questions || []);
  if (sections.custom?.enabled) total += calcSectionMarks(sections.custom.questions || []);
  return total;
}

export function marksStatus(totalMarks, questionMarks) {
  const diff = parseFloat(totalMarks) - questionMarks;
  if (Math.abs(diff) < 0.01) return { status: 'ok', message: '' };
  if (diff > 0) return { status: 'under', message: `${diff} marks remaining` };
  return { status: 'over', message: `${Math.abs(diff)} marks over limit` };
}

