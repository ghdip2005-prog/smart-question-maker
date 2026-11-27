import { useRef } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { generateDOCX } from '../utils/docxGenerator';

export default function ExportButtons({ examInfo, sections, onToast }) {
  const printRef = useRef();

  async function handlePDF() {
    try {
      onToast('Generating PDF...', 'info');
      await generatePDF(examInfo, sections);
      onToast('PDF downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      onToast('PDF generation failed: ' + e.message, 'error');
    }
  }

  async function handleDOCX() {
    try {
      onToast('Generating Word document...', 'info');
      await generateDOCX(examInfo, sections);
      onToast('Word document downloaded!', 'success');
    } catch (e) {
      console.error(e);
      onToast('DOCX generation failed: ' + e.message, 'error');
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handlePDF}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition shadow-sm hover:shadow-md"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </button>

      <button
        onClick={handleDOCX}
        className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-medium transition shadow-sm hover:shadow-md"
      >
        <FileText className="w-4 h-4" />
        Download DOCX
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium transition shadow-sm hover:shadow-md"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
    </div>
  );
}

