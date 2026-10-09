import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyNote } from '../types';
import { generateStudyNoteFromAi } from '../services/aiService';
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  Star,
  Trash2,
  Edit3,
  Bookmark,
  Share2,
  Folder,
  Tag,
  Check,
  Download,
  BookOpen,
  X
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, languageMode, showNotification } = useApp();
  const isAr = languageMode === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(notes[0] || null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSummary, setEditSummary] = useState('');

  // AI Note Generator Modal State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorTopic, setGeneratorTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Arterial', 'Aorta', 'Carotid', 'Venous', 'Trauma', 'Dialysis'];

  const filteredNotes = notes.filter(n => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleStartEdit = (note: StudyNote) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.detailedContent);
    setEditSummary(note.summary);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    updateNote(selectedNote.id, {
      title: editTitle,
      summary: editSummary,
      detailedContent: editContent,
    });
    setSelectedNote(prev => prev ? { ...prev, title: editTitle, summary: editSummary, detailedContent: editContent } : null);
    setIsEditing(false);
  };

  const handleCreateEmptyNote = () => {
    const newNote: StudyNote = {
      id: 'note-' + Date.now(),
      title: 'New Vascular Surgical Note',
      category: 'Arterial',
      tags: ['Clinical Notes', 'Surgical Pearls'],
      summary: 'Personal surgical and clinical study observations.',
      keyPoints: ['Initial clinical assessment.', 'Operative findings.'],
      detailedContent: `# New Vascular Surgical Note\n\n## Overview\nDocument your clinical case pearls, surgical exposures, and guideline notes here.\n\n## Operative Strategy\n- Landmark 1\n- Vessel exposure`,
      references: ["Rutherford's Vascular Surgery 10th Ed."],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addNote(newNote);
    setSelectedNote(newNote);
    handleStartEdit(newNote);
  };

  const handleGenerateAiNote = async () => {
    if (!generatorTopic.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const generatedNote = await generateStudyNoteFromAi(generatorTopic, languageMode);
      addNote(generatedNote);
      setSelectedNote(generatedNote);
      setIsGeneratorOpen(false);
      setGeneratorTopic('');
      showNotification(`Generated high-yield study note: "${generatedNote.title}"`);
    } catch (err) {
      showNotification('Failed to generate note. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = (note: StudyNote) => {
    const blob = new Blob([note.detailedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Note exported as Markdown file.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
            <FileText className="w-4 h-4" />
            <span>{isAr ? 'دفتر الملاحظات السريرية والجراحية' : 'Surgical Notes & High-Yield Knowledge Base'}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isAr ? 'الملاحظات الطبية التخصصية' : 'Medical Notes Workspace'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'احفظ الشروحات الذكية، أنشئ ملاحظات فائقة الأهمية للامتحانات، ونظّم ملفاتك حسب فروع الجراحة.'
              : 'Create, edit, organize, and export high-yield surgical study notes generated by AI or written manually.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-purple-950/40 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'توليد مذكرة بالذكاء الاصطناعي' : 'Generate Study Note'}</span>
          </button>

          <button
            onClick={handleCreateEmptyNote}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold text-xs sm:text-sm transition border border-slate-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'ملاحظة جديدة' : 'New Note'}</span>
          </button>
        </div>
      </div>

      {/* Mobile view segmented control (< lg) */}
      <div className="lg:hidden flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileView === 'list'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isAr ? `قائمة الملاحظات (${filteredNotes.length})` : `Notes List (${filteredNotes.length})`}</span>
        </button>
        <button
          onClick={() => setMobileView('detail')}
          disabled={!selectedNote}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 ${
            mobileView === 'detail'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isAr ? 'عرض وتعديل الملاحظة' : 'View & Edit'}</span>
        </button>
      </div>

      {/* Main 2-column layout: Notes List on Left, Active Note Editor/Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Filters & Note List (4 cols) */}
        <div className={`lg:col-span-4 space-y-4 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث في الملاحظات والوسوم...' : 'Search notes or tags...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes list */}
          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                No notes found in this category. Click "Generate Study Note" to create one instantly.
              </div>
            ) : (
              filteredNotes.map(n => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNote(n);
                      setIsEditing(false);
                      setMobileView('detail');
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-850 border-teal-500/70 shadow-lg'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-teal-400 font-semibold">
                        {n.category}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          updateNote(n.id, { isFavorite: !n.isFavorite });
                        }}
                        className={`p-1 rounded-md transition ${
                          n.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {isAr && n.titleAr ? n.titleAr : n.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {n.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                      <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                      <span className="text-teal-400 font-mono text-[10px]">
                        {n.references.length} references
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Note Viewer / Editor (8 cols) */}
        <div className={`lg:col-span-8 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          {/* Mobile Back to List button */}
          <div className="lg:hidden mb-3">
            <button
              onClick={() => setMobileView('list')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>{isAr ? '← العودة لقائمة الملاحظات' : '← Back to Notes List'}</span>
            </button>
          </div>
          {selectedNote ? (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Header and Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold">
                      {selectedNote.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Last edited {new Date(selectedNote.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full text-xl sm:text-2xl font-extrabold text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-hidden"
                    />
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {isAr && selectedNote.titleAr ? selectedNote.titleAr : selectedNote.title}
                    </h3>
                  )}
                </div>

                {/* Edit, Delete, Export Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(selectedNote)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                      title="Edit Note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleExportMarkdown(selectedNote)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                    title="Export as Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this study note?')) {
                        deleteNote(selectedNote.id);
                        setSelectedNote(null);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer border border-slate-700"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags & Key Points */}
              <div className="flex flex-wrap gap-1.5">
                {selectedNote.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-750 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-teal-400" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>

              {/* Content Body */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Summary:
                    </label>
                    <textarea
                      value={editSummary}
                      onChange={e => setEditSummary(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl p-3 border border-slate-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Detailed Content (Markdown):
                    </label>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={14}
                      className="w-full font-mono text-xs bg-slate-800 text-slate-200 rounded-xl p-3 border border-slate-700 focus:outline-hidden leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none text-slate-200 space-y-4 font-sans leading-relaxed">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs sm:text-sm">
                    <strong className="text-teal-400 block mb-1">Executive Summary:</strong>
                    {selectedNote.summary}
                  </div>

                  {selectedNote.surgicalPearls && selectedNote.surgicalPearls.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs sm:text-sm space-y-1">
                      <strong className="text-amber-400 block mb-1">Surgical Pearls & Pitfalls:</strong>
                      {selectedNote.surgicalPearls.map((p, i) => (
                        <p key={i}>• {p}</p>
                      ))}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-sm leading-relaxed pt-2">
                    {selectedNote.detailedContent}
                  </div>

                  {/* References footer */}
                  {selectedNote.references && selectedNote.references.length > 0 && (
                    <div className="pt-6 border-t border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Cited Medical References</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-slate-400 font-mono">
                        {selectedNote.references.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Select a Study Note to Review</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Select an existing note from the list on the left, create an empty note, or click "Generate Study Note" to create a structured note with AI.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Note Generator Modal (PRD Section 20) */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'توليد مذكرة دراسية ذكية' : 'AI Study Note Generator'}
                </h3>
              </div>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter any vascular topic. The AI will synthesize an exhaustive high-yield note containing: Definition, Etiology, Clinical presentation, Classification, Diagnosis, Management, Complications, Exam pearls, Surgical pearls, and exact citations.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Vascular Topic:
              </label>
              <input
                type="text"
                placeholder="e.g. Acute Mesenteric Ischemia, WIfI Classification, Thoracic Outlet Syndrome..."
                value={generatorTopic}
                onChange={e => setGeneratorTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-hidden focus:border-purple-500"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiNote}
                disabled={!generatorTopic.trim() || isGenerating}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  generatorTopic.trim() && !isGenerating
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Pearls...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
