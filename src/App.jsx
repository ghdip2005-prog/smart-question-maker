import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import ExamInformation from './components/ExamInformation';
import MCQEditor from './components/MCQEditor';
import CQEditor from './components/CQEditor';
import ShortQuestionEditor from './components/ShortQuestionEditor';
import PaperPreview from './components/PaperPreview';
import ExportButtons from './components/ExportButtons';
import PaperLibrary from './components/PaperLibrary';
import SettingsPanel from './components/SettingsPanel';
import { savePaper, saveDraft, getDraft, generateId } from './utils/storage';
import { calcTotalQuestionMarks, marksStatus } from './utils/marksCalculator';

// Default state factories
function defaultExamInfo() {
  return { centerName: '', className: '', subject: '', examName: '', date: '', duration: '', totalMarks: '', logo: '' };
}
function defaultSections() {
  return {
    mcq:        { enabled: true,  questions: [] },
    cq:         { enabled: true,  questions: [] },
    short:      { enabled: true,  questions: [] },
    fillBlank:  { enabled: false, questions: [] },
    trueFalse:  { enabled: false, questions: [] },
    descriptive:{ enabled: false, questions: [] },
    custom:     { enabled: false, title: 'Other Questions', questions: [] },
  };
}

// Toast component
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast-enter px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white max-w-xs ${
            t.type === 'success' ? 'bg-emerald-600' :
            t.type === 'error'   ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [paperId, setPaperId] = useState(generateId());
  const [examInfo, setExamInfo] = useState(defaultExamInfo());
  const [sections, setSections] = useState(defaultSections());
  const [settings, setSettings] = useState({ fontSize: 'text-sm', fontFamily: 'font-serif', margin: 'normal' });
  const [toasts, setToasts] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [libKey, setLibKey] = useState(0);
  const previewRef = useRef();

  // Auto-save draft every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft({ paperId, examInfo, sections });
    }, 30000);
    return () => clearInterval(timer);
  }, [paperId, examInfo, sections]);

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setExamInfo(draft.examInfo || defaultExamInfo());
      setSections(draft.sections || defaultSections());
      setPaperId(draft.paperId || generateId());
    }
  }, []);

  // Track dirty state
  useEffect(() => { setIsDirty(true); }, [examInfo, sections]);

  function addToast(message, type = 'info') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }

  function handleSave() {
    const paper = { id: paperId, examInfo, sections };
    savePaper(paper);
    saveDraft({ paperId, examInfo, sections });
    setIsDirty(false);
    setLibKey(k => k + 1);
    addToast('Paper saved successfully!', 'success');
  }

  function handleNewPaper() {
    if (isDirty && !window.confirm('Unsaved changes will be lost. Continue?')) return;
    setPaperId(generateId());
    setExamInfo(defaultExamInfo());
    setSections(defaultSections());
    setIsDirty(false);
    setActiveTab('editor');
    addToast('New paper created.', 'info');
  }

  function handleLoadPaper(paper) {
    if (isDirty && !window.confirm('Unsaved changes will be lost. Load this paper?')) return;
    setPaperId(paper.id);
    setExamInfo(paper.examInfo || defaultExamInfo());
    setSections(paper.sections || defaultSections());
    setIsDirty(false);
    setActiveTab('editor');
    addToast('Paper loaded for editing.', 'success');
  }

  function handleReset() {
    if (!window.confirm('Reset all data? This cannot be undone.')) return;
    setExamInfo(defaultExamInfo());
    setSections(defaultSections());
    setIsDirty(false);
    addToast('Form reset.', 'info');
  }

  function setSectionQuestions(key, updater) {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], questions: typeof updater === 'function' ? updater(prev[key].questions) : updater }
    }));
  }

  function toggleSection(key) {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  }

  const totalQMarks = calcTotalQuestionMarks(sections);
  const { status: marksState, message: marksMsg } = marksStatus(examInfo.totalMarks, totalQMarks);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onNewPaper={handleNewPaper} />

      {/* Library Tab */}
      {activeTab === 'library' && (
        <PaperLibrary onLoad={handleLoadPaper} onToast={addToast} refreshKey={libKey} />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <SettingsPanel settings={settings} setSettings={setSettings} />
      )}

      {/* Editor Tab */}
      {activeTab === 'editor' && (
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex flex-col xl:flex-row gap-6 items-start">

            {/* LEFT: Editor Panel */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Top Action Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Question Paper Editor</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Fill in the details and add questions section by section.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 bg-gray-100 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                  >
                    💾 Save Paper
                  </button>
                  {isDirty && <span className="text-xs text-amber-500 font-medium">● Unsaved changes</span>}
                </div>
              </div>

              {/* Marks Status Bar */}
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                marksState === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' :
                marksState === 'over' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <span>Total Question Marks: <strong>{totalQMarks}</strong></span>
                {examInfo.totalMarks && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span>Paper Total: <strong>{examInfo.totalMarks}</strong></span>
                    {marksMsg && <span className="ml-auto text-xs">⚠ {marksMsg}</span>}
                    {marksState === 'ok' && <span className="ml-auto text-xs">✓ Marks match!</span>}
                  </>
                )}
              </div>

              {/* Exam Info */}
              <ExamInformation examInfo={examInfo} setExamInfo={setExamInfo} />

              {/* Section Toggles */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Enable / Disable Sections</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'mcq', label: 'MCQ' },
                    { key: 'cq', label: 'Creative (CQ)' },
                    { key: 'short', label: 'Short Questions' },
                    { key: 'fillBlank', label: 'Fill in Blanks' },
                    { key: 'trueFalse', label: 'True/False' },
                    { key: 'descriptive', label: 'Descriptive' },
                    { key: 'custom', label: 'Custom' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleSection(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                        sections[key]?.enabled
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      {sections[key]?.enabled ? '✓ ' : '+ '}{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Editors */}
              {sections.mcq?.enabled && (
                <MCQEditor
                  questions={sections.mcq.questions}
                  setQuestions={q => setSectionQuestions('mcq', q)}
                />
              )}
              {sections.cq?.enabled && (
                <CQEditor
                  questions={sections.cq.questions}
                  setQuestions={q => setSectionQuestions('cq', q)}
                />
              )}
              {sections.short?.enabled && (
                <ShortQuestionEditor
                  title="Short Questions" color="blue"
                  questions={sections.short.questions}
                  setQuestions={q => setSectionQuestions('short', q)}
                  placeholder="Enter short question..."
                />
              )}
              {sections.fillBlank?.enabled && (
                <ShortQuestionEditor
                  title="Fill in the Blanks" color="amber"
                  questions={sections.fillBlank.questions}
                  setQuestions={q => setSectionQuestions('fillBlank', q)}
                  placeholder="e.g. The capital of Bangladesh is ___."
                />
              )}
              {sections.trueFalse?.enabled && (
                <ShortQuestionEditor
                  title="True / False" color="rose"
                  questions={sections.trueFalse.questions}
                  setQuestions={q => setSectionQuestions('trueFalse', q)}
                  placeholder="Enter true/false statement..."
                />
              )}
              {sections.descriptive?.enabled && (
                <ShortQuestionEditor
                  title="Descriptive Questions" color="violet"
                  questions={sections.descriptive.questions}
                  setQuestions={q => setSectionQuestions('descriptive', q)}
                  placeholder="Enter descriptive question..."
                />
              )}
              {sections.custom?.enabled && (
                <ShortQuestionEditor
                  title={sections.custom.title || 'Custom Questions'} color="slate"
                  questions={sections.custom.questions}
                  setQuestions={q => setSectionQuestions('custom', q)}
                  placeholder="Enter question..."
                />
              )}

              {/* Export Buttons (bottom of editor) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Export Question Paper</h3>
                <ExportButtons examInfo={examInfo} sections={sections} onToast={addToast} />
              </div>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="xl:w-[480px] 2xl:w-[560px] shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-700">Live Preview</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">A4 Format</span>
                </div>
                <div className="overflow-auto max-h-[85vh] rounded-2xl shadow-xl border border-gray-200 bg-gray-100 p-3">
                  <div className="transform origin-top-left" style={{ transform: 'scale(0.62)', transformOrigin: 'top left', width: '161%' }}>
                    <PaperPreview ref={previewRef} examInfo={examInfo} sections={sections} settings={settings} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
