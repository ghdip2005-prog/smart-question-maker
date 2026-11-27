import { Type, Layout, Maximize } from 'lucide-react';

export default function SettingsPanel({ settings, setSettings }) {
  function update(key, value) { setSettings(prev => ({ ...prev, [key]: value })); }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Paper Settings</h2>

      <div className="space-y-5">
        {/* Font Size */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type className="w-4 h-4 text-blue-500" /> Font Size
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'text-xs', label: 'Small' },
              { value: 'text-sm', label: 'Medium' },
              { value: 'text-base', label: 'Large' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => update('fontSize', opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  settings.fontSize === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type className="w-4 h-4 text-blue-500" /> Font Family
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'font-serif', label: 'Serif (Times)' },
              { value: 'font-sans', label: 'Sans-serif' },
              { value: 'font-mono', label: 'Monospace' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => update('fontFamily', opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  settings.fontFamily === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Margins */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Maximize className="w-4 h-4 text-blue-500" /> Page Margins
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'narrow', label: 'Narrow' },
              { value: 'normal', label: 'Normal' },
              { value: 'wide', label: 'Wide' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => update('margin', opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  settings.margin === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

