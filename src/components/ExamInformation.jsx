import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

export default function ExamInformation({ examInfo, setExamInfo }) {
  const logoRef = useRef();

  function handleChange(field, value) {
    setExamInfo(prev => ({ ...prev, [field]: value }));
  }

  function handleLogo(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleChange('logo', ev.target.result);
    reader.readAsDataURL(file);
  }

  const fields = [
    { key: 'centerName', label: 'Coaching Center Name', placeholder: 'e.g. ABC Academic Care', type: 'text' },
    { key: 'className', label: 'Class / Grade', placeholder: 'e.g. Class 8', type: 'text' },
    { key: 'subject', label: 'Subject Name', placeholder: 'e.g. Mathematics', type: 'text' },
    { key: 'examName', label: 'Examination Name', placeholder: 'e.g. Monthly Test', type: 'text' },
    { key: 'date', label: 'Exam Date', placeholder: '', type: 'date' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 2 Hours', type: 'text' },
    { key: 'totalMarks', label: 'Total Marks', placeholder: 'e.g. 100', type: 'number' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center text-xs font-bold">1</span>
        Exam Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className={key === 'centerName' || key === 'examName' ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
              type={type}
              value={examInfo[key] || ''}
              onChange={e => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition"
            />
          </div>
        ))}

        {/* Logo Upload */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Coaching Center Logo (Optional)</label>
          <div className="flex items-center gap-3">
            {examInfo.logo ? (
              <div className="relative">
                <img src={examInfo.logo} alt="Logo" className="w-16 h-16 object-contain border border-gray-200 rounded-lg bg-gray-50" />
                <button
                  onClick={() => handleChange('logo', '')}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </button>
            )}
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
          </div>
        </div>
      </div>
    </div>
  );
}

