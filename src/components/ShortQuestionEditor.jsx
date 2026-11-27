import { Plus, Trash2 } from 'lucide-react';

function newQ() { return { id: Date.now() + Math.random(), question: '', marks: 2 }; }

export default function ShortQuestionEditor({ title, color, questions, setQuestions, placeholder }) {
  function add() { setQuestions(prev => [...prev, newQ()]); }
  function remove(id) { setQuestions(prev => prev.filter(q => q.id !== id)); }
  function update(id, field, value) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  }

  const colorMap = {
    blue: { badge: 'bg-blue-100 text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', ring: 'focus:ring-blue-400', border: 'hover:border-blue-400 hover:text-blue-500' },
    amber: { badge: 'bg-amber-100 text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600', ring: 'focus:ring-amber-400', border: 'hover:border-amber-400 hover:text-amber-500' },
    rose: { badge: 'bg-rose-100 text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700', ring: 'focus:ring-rose-400', border: 'hover:border-rose-400 hover:text-rose-500' },
    violet: { badge: 'bg-violet-100 text-violet-600', btn: 'bg-violet-600 hover:bg-violet-700', ring: 'focus:ring-violet-400', border: 'hover:border-violet-400 hover:text-violet-500' },
    slate: { badge: 'bg-slate-100 text-slate-600', btn: 'bg-slate-600 hover:bg-slate-700', ring: 'focus:ring-slate-400', border: 'hover:border-slate-400 hover:text-slate-500' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${c.badge}`}>{title}</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{questions.length}</span>
        </h2>
        <button onClick={add} className={`flex items-center gap-1.5 px-3 py-1.5 ${c.btn} text-white rounded-lg text-xs font-medium transition`}>
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
          No questions yet. Click "Add" to start.
        </div>
      )}

      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div key={q.id} className="flex items-center gap-2 group">
            <span className="text-xs font-bold text-gray-400 w-6 shrink-0">{idx + 1}.</span>
            <input
              value={q.question}
              onChange={e => update(q.id, 'question', e.target.value)}
              placeholder={placeholder || 'Enter question...'}
              className={`flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-1 ${c.ring} bg-gray-50`}
            />
            <input
              type="number"
              value={q.marks}
              onChange={e => update(q.id, 'marks', e.target.value)}
              min="0"
              placeholder="Marks"
              className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-2 text-center outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button onClick={() => remove(q.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <button onClick={add} className={`mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 ${c.border} transition`}>
          <Plus className="w-4 h-4" /> Add Another
        </button>
      )}
    </div>
  );
}

