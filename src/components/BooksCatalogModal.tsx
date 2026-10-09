import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReferenceDocument } from '../types';
import {
  BookOpen,
  Library,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  Upload,
  X,
  ExternalLink,
  BookMarked,
  Filter
} from 'lucide-react';

export const BooksCatalogModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { references, setSelectedDocForReader, setActiveTab, setTutorInitialPrompt, setSearchInitialQuery, languageMode } = useApp();
  const isAr = languageMode === 'ar';

  const [filterType, setFilterType] = useState<'all' | 'textbook' | 'guideline' | 'user'>('all');
  const [searchDocQuery, setSearchDocQuery] = useState('');

  if (!isOpen) return null;

  const filtered = references.filter(doc => {
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'user'
        ? doc.isUserUploaded
        : doc.type === filterType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.authors.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.chapters.some(c => c.title.toLowerCase().includes(searchDocQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalPages = references.reduce((acc, doc) => acc + doc.totalPages, 0);
  const totalChapters = references.reduce((acc, doc) => acc + doc.chaptersCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-850 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 font-bold shadow-lg shadow-teal-950/40 shrink-0">
              <Library className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-extrabold text-white truncate">
                  {isAr ? 'الكتب والمراجع المفهرسة بالتطبيق' : 'Uploaded & Available Medical References'}
                </h3>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-mono font-bold border border-teal-500/30 shrink-0">
                  {references.length} {isAr ? 'كتب ومراجع' : 'Books Active'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {isAr
                  ? `إجمالي ${totalPages.toLocaleString()} صفحة مفهرسة عبر ${totalChapters} فصلاً في قاعدة بيانات البحث الذكي`
                  : `${totalPages.toLocaleString()} total pages indexed across ${totalChapters} chapters in active RAG vector database`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث في أسماء الكتب والمراجع المتاحة...' : 'Search available books or guidelines...'}
              value={searchDocQuery}
              onChange={e => setSearchDocQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'textbook', 'guideline', 'user'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterType === tab
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-750'
                }`}
              >
                {tab === 'all'
                  ? isAr ? 'الكل' : 'All'
                  : tab === 'textbook'
                  ? isAr ? 'الكتب الكبرى' : 'Textbooks'
                  : tab === 'guideline'
                  ? isAr ? 'الإرشادات' : 'Guidelines'
                  : isAr ? 'مرفوعة بواسطتي' : 'User Uploads'}
              </button>
            ))}
          </div>
        </div>

        {/* Books List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {filtered.map(doc => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 hover:border-teal-500/50 transition shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    doc.type === 'textbook'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {doc.type}
                  </span>
                  {doc.edition && (
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {doc.edition}
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isAr ? 'مفهرس بالكامل في البحث الذكي' : 'Vector Indexed & Active'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-400">
                  {doc.authors} • {doc.year} • {doc.totalPages} {isAr ? 'صفحة' : 'Pages'} • {doc.chaptersCount} {isAr ? 'فصلاً' : 'Chapters'}
                </p>

                {/* Chapter Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.chapters.slice(0, 3).map(ch => (
                    <span
                      key={ch.chapterNumber}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      Ch {ch.chapterNumber}: {ch.title.split(':')[0]}
                    </span>
                  ))}
                  {doc.chapters.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-teal-400 font-bold">
                      +{doc.chapters.length - 3} {isAr ? 'فصول أخرى' : 'more'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedDocForReader(doc);
                    onClose();
                    setActiveTab('library');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isAr ? 'تصفح الفصول' : 'Browse'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('search');
                    setSearchInitialQuery(doc.shortTitle);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isAr ? 'بحث بالكتاب' : 'Search Book'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{isAr ? 'يتم البحث تلقائياً في كل هذه المراجع عند كتابة أي سؤال' : 'Every query automatically searches across all these references simultaneously'}</span>
          <button
            onClick={() => {
              onClose();
              setActiveTab('library');
            }}
            className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isAr ? 'رفع مرجع إضافي (PDF)' : 'Upload New Reference'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
