// Local Storage utilities
const STORAGE_KEY = 'sqpm_papers';
const DRAFT_KEY = 'sqpm_draft';

export function getAllPapers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function savePaper(paper) {
  const papers = getAllPapers();
  const existing = papers.findIndex(p => p.id === paper.id);
  const updated = { ...paper, updatedAt: new Date().toISOString() };
  if (existing >= 0) papers[existing] = updated;
  else papers.unshift({ ...updated, createdAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  return updated;
}

export function deletePaper(id) {
  const papers = getAllPapers().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
}

export function duplicatePaper(id) {
  const papers = getAllPapers();
  const original = papers.find(p => p.id === id);
  if (!original) return null;
  const copy = {
    ...original,
    id: generateId(),
    examInfo: { ...original.examInfo, examName: original.examInfo.examName + ' (Copy)' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  papers.unshift(copy);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  return copy;
}

export function saveDraft(data) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
}

export function getDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); }
  catch { return null; }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function generateId() {
  return `paper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

