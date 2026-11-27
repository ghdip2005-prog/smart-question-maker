import { BookOpen, FileText, Settings, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, onNewPaper }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: 'editor', label: 'New Paper', icon: PlusCircle },
    { id: 'library', label: 'My Papers', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg leading-none">Smart</span>
            <span className="font-bold text-blue-600 text-lg leading-none"> QP Maker</span>
            <p className="text-xs text-gray-400 leading-none">Question Paper Generator</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); if (id === 'editor') onNewPaper?.(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 space-y-1">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMenuOpen(false); if (id === 'editor') onNewPaper?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

