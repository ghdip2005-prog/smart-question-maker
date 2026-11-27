import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function newMCQ() {
  return { id: Date.now() + Math.random(), question: '', options: ['', '', '', ''], marks: 1, answer: '' };
}

export default function MCQEditor({ questions, setQuestions }) {
  const [collapsed, setCollapsed] = useState({});

  function addQuestion() {
    setQuestions(prev => [...prev, newMCQ()]);
  }

  function removeQuestion(id) {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  function updateQuestion(id, field, value) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  }

  function updateOption(id, idx, value) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      const opts = [...q.options];
      opts[idx] = value;
      return { ...q, options: opts };
    }));
  }

  function addOption(id) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, options: [...q.options, ''] } : q));
  }

  function removeOption(id, idx) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      const opts = q.options.filter((_, i) => i !== idx);
      return { ...q, options: opts };
    }));
  }

  const optLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-md flex items-center justify-center text-xs font-bold">MCQ</span>
          Multiple Choice Questions
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{questions.length}</span>
        </h2>
        <button
          onClick={addQuestion}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add MCQ
        </button>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
          No MCQs added yet. Click "Add MCQ" to start.
        </div>
      )}

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id} className="border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
            {/* Question Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100">
              <span className="text-xs font-bold text-gray-400 w-6">{idx + 1}.</span>
              <input
                value={q.question}
                onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                placeholder="Enter MCQ question here..."
                className="flex-1 text-sm bg-transparent border-none outline-none text-gray-800 placeholder-gray-300"
              />
              <input
                type="number"
                value={q.marks}
                onChange={e => updateQuestion(q.id, 'marks', e.target.value)}
                placeholder="Marks"
                min="0"
                className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-1 text-center bg-gray-50 outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={() => setCollapsed(c => ({ ...c, [q.id]: !c[q.id] }))}
                className="p-1 text-gray-400 hover:text-gray-700 rounded"
              >
                {collapsed[q.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button onClick={() => removeQuestion(q.id)} className="p-1 text-red-400 hover:text-red-600 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Options */}
            {!collapsed[q.id] && (
              <div className="p-3 space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 w-5">{optLabels[oi] || oi + 1}.</span>
                    <input
                      value={opt}
                      onChange={e => updateOption(q.id, oi, e.target.value)}
                      placeholder={`Option ${optLabels[oi] || oi + 1}`}
                      className="flex-1 text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(q.id, oi)} className="text-gray-300 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-1">
                  {q.options.length < 6 && (
                    <button onClick={() => addOption(q.id)} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-gray-400">Correct Answer (not shown on paper):</span>
                    <select
                      value={q.answer}
                      onChange={e => updateQuestion(q.id, 'answer', e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1 outline-none bg-white"
                    >
                      <option value="">—</option>
                      {q.options.map((_, oi) => (
                        <option key={oi} value={optLabels[oi]}>{optLabels[oi]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button
          onClick={addQuestion}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition"
        >
          <Plus className="w-4 h-4" /> Add Another MCQ
        </button>
      )}
    </div>
  );
}

