import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function newSubQ() { return { id: Date.now() + Math.random(), question: '', marks: 1 }; }
function newCQ() {
  return {
    id: Date.now() + Math.random(),
    stimulus: '',
    subQuestions: [
      { id: Date.now() + 1, question: '', marks: 1 },
      { id: Date.now() + 2, question: '', marks: 2 },
      { id: Date.now() + 3, question: '', marks: 3 },
      { id: Date.now() + 4, question: '', marks: 4 },
    ]
  };
}

const CQ_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];

export default function CQEditor({ questions, setQuestions }) {
  const [collapsed, setCollapsed] = useState({});

  function addCQ() { setQuestions(prev => [...prev, newCQ()]); }
  function removeCQ(id) { setQuestions(prev => prev.filter(q => q.id !== id)); }
  function updateCQ(id, field, value) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  }
  function addSubQ(cqId) {
    setQuestions(prev => prev.map(q =>
      q.id === cqId ? { ...q, subQuestions: [...q.subQuestions, newSubQ()] } : q
    ));
  }
  function removeSubQ(cqId, sqId) {
    setQuestions(prev => prev.map(q =>
      q.id === cqId ? { ...q, subQuestions: q.subQuestions.filter(s => s.id !== sqId) } : q
    ));
  }
  function updateSubQ(cqId, sqId, field, value) {
    setQuestions(prev => prev.map(q =>
      q.id === cqId
        ? { ...q, subQuestions: q.subQuestions.map(s => s.id === sqId ? { ...s, [field]: value } : s) }
        : q
    ));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center text-xs font-bold">CQ</span>
          Creative Questions (সৃজনশীল)
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{questions.length}</span>
        </h2>
        <button onClick={addCQ} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition">
          <Plus className="w-3.5 h-3.5" /> Add CQ
        </button>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
          No CQs added yet. Click "Add CQ" to start.
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden">
            {/* CQ Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-b border-gray-100">
              <span className="text-sm font-bold text-emerald-700">প্রশ্ন {idx + 1}</span>
              <div className="flex-1" />
              <button onClick={() => setCollapsed(c => ({ ...c, [q.id]: !c[q.id] }))} className="p-1 text-gray-400 hover:text-gray-700">
                {collapsed[q.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button onClick={() => removeCQ(q.id)} className="p-1 text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {!collapsed[q.id] && (
              <div className="p-4 space-y-3 bg-white">
                {/* Stimulus */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">উদ্দীপক / Stimulus Text</label>
                  <textarea
                    value={q.stimulus}
                    onChange={e => updateCQ(q.id, 'stimulus', e.target.value)}
                    placeholder="Enter stimulus / উদ্দীপক লিখুন..."
                    rows={3}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg resize-none outline-none focus:ring-1 focus:ring-emerald-400 bg-gray-50"
                  />
                </div>

                {/* Sub-questions */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500">Sub-questions</label>
                  {q.subQuestions.map((sq, si) => (
                    <div key={sq.id} className="flex items-center gap-2">
                      <span className="text-sm font-bold text-emerald-600 w-5">{CQ_LABELS[si] || si + 1}.</span>
                      <input
                        value={sq.question}
                        onChange={e => updateSubQ(q.id, sq.id, 'question', e.target.value)}
                        placeholder={`Sub-question ${CQ_LABELS[si] || si + 1}`}
                        className="flex-1 text-sm px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                      <input
                        type="number"
                        value={sq.marks}
                        onChange={e => updateSubQ(q.id, sq.id, 'marks', e.target.value)}
                        min="0"
                        className="w-14 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                      {q.subQuestions.length > 1 && (
                        <button onClick={() => removeSubQ(q.id, sq.id)} className="text-gray-300 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {q.subQuestions.length < 6 && (
                    <button onClick={() => addSubQ(q.id)} className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 ml-7">
                      <Plus className="w-3 h-3" /> Add Sub-question
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button onClick={addCQ} className="mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition">
          <Plus className="w-4 h-4" /> Add Another CQ
        </button>
      )}
    </div>
  );
}

