import { Trash2, Copy, Edit2, FileText, Clock } from 'lucide-react';
import { getAllPapers, deletePaper, duplicatePaper } from '../utils/storage';
import { useState } from 'react';

export default function PaperLibrary({ onLoad, onToast, refreshKey }) {
  const papers = getAllPapers();
  const [confirmDelete, setConfirmDelete] = useState(null);

  function handleDelete(id) {
    deletePaper(id);
    onToast('Paper deleted.', 'success');
    setConfirmDelete(null);
    window.dispatchEvent(new Event('storage'));
  }

  function handleDuplicate(id) {
    duplicatePaper(id);
    onToast('Paper duplicated!', 'success');
    window.dispatchEvent(new Event('storage'));
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FileText className="w-14 h-14 text-gray-200 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400">No saved papers yet</h3>
        <p className="text-sm text-gray-400 mt-1">Create a new question paper and save it to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Question Papers</h2>
      <div className="grid gap-4">
        {papers.map(paper => (
          <div key={paper.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{paper.examInfo?.examName || 'Untitled Paper'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {paper.examInfo?.centerName && `${paper.examInfo.centerName} · `}
                {paper.examInfo?.subject && `${paper.examInfo.subject} · `}
                {paper.examInfo?.className && `Class ${paper.examInfo.className}`}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {paper.updatedAt ? new Date(paper.updatedAt).toLocaleString() : 'Unknown date'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onLoad(paper)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDuplicate(paper.id)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmDelete(paper.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-gray-900 text-base mb-2">Delete Paper?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

