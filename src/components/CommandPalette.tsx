import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  BookOpen,
  Sparkles,
  FileText,
  BrainCircuit,
  HelpCircle,
  Columns,
  Activity,
  Layers,
  X,
  Languages,
  Library,
  Globe
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setTutorInitialPrompt,
    setSearchInitialQuery,
    setLanguageMode,
    languageMode,
    references,
    setIsBooksCatalogOpen
  } = useApp();

  const isAr = languageMode === 'ar';
  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const commands = [
    {
      id: 'cmd-books-catalog',
      title: isAr
        ? `عرض جميع الكتب والمراجع المرفوعة (${references.length} كتب ومراجع)`
        : `View all uploaded & available books (${references.length} references)`,
      category: 'Reference Library',
      icon: Library,
      action: () => {
        setIsBooksCatalogOpen(true);
      }
    },
    {
      id: 'cmd-tutor-ali',
      title: 'Explain Acute Limb Ischemia (ALI)',
      category: 'AI Tutor',
      icon: Sparkles,
      action: () => {
        setTutorInitialPrompt('Explain Acute Limb Ischemia, the 6 Ps, Rutherford classification, and emergency surgical protocol.');
        setActiveTab('tutor');
      }
    },
    {
      id: 'cmd-tutor-aaa',
      title: 'Explain Abdominal Aortic Aneurysm repair thresholds',
      category: 'AI Tutor',
      icon: Sparkles,
      action: () => {
        setTutorInitialPrompt('What are the indications, diameter thresholds, and EVAR suitability criteria for Abdominal Aortic Aneurysm (AAA)?');
        setActiveTab('tutor');
      }
    },
    {
      id: 'cmd-compare-esvs-ruth',
      title: 'Compare References: Rutherford vs ESVS on ALI Management',
      category: 'Reference Comparison',
      icon: Columns,
      action: () => {
        setActiveTab('search');
        setSearchInitialQuery('Compare acute limb ischemia between Rutherford and ESVS');
      }
    },
    {
      id: 'cmd-mcqs',
      title: 'Generate High-Yield Vascular MCQs',
      category: 'Practice',
      icon: HelpCircle,
      action: () => {
        setActiveTab('mcq');
      }
    },
    {
      id: 'cmd-flashcards',
      title: 'Review Spaced Repetition Flashcards',
      category: 'Study',
      icon: BrainCircuit,
      action: () => {
        setActiveTab('flashcards');
      }
    },
    {
      id: 'cmd-anatomy',
      title: 'Explore Femoral & SFA Surgical Anatomy',
      category: 'Anatomy Explorer',
      icon: Layers,
      action: () => {
        setActiveTab('anatomy');
      }
    },
    {
      id: 'cmd-case-ali',
      title: 'Launch Clinical Simulation: Acute Leg Ischemia Case',
      category: 'Simulation',
      icon: Activity,
      action: () => {
        setActiveTab('cases');
      }
    },
    {
      id: 'cmd-create-note',
      title: 'Create a New Vascular Surgical Note',
      category: 'Notes',
      icon: FileText,
      action: () => {
        setActiveTab('notes');
      }
    },
    {
      id: 'cmd-open-library',
      title: 'Browse Rutherford & ESVS Guidelines Library',
      category: 'Reference Library',
      icon: BookOpen,
      action: () => {
        setActiveTab('library');
      }
    },
    {
      id: 'cmd-toggle-lang',
      title: languageMode === 'en' ? 'Switch to Arabic + English Medical Terms' : 'Switch to English Mode',
      category: 'Language',
      icon: Languages,
      action: () => {
        setLanguageMode(languageMode === 'en' ? 'bilingual' : 'en');
      }
    }
  ];

  const filtered = commands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="relative flex items-center border-b border-slate-800 px-4">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'ابحث في كل الكتب، الإنترنت الحي، أو اكتب سؤالاً...'
                : 'Search across all books & live web, or type a command...'
            }
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {/* Dynamic Search across All Books & Web if user typed something */}
          {query.trim().length > 0 && (
            <div className="space-y-1 pb-1 mb-1 border-b border-slate-800">
              <button
                onClick={() =>
                  handleAction(() => {
                    setSearchInitialQuery(query.trim());
                    setActiveTab('search');
                  })
                }
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-teal-200 group-hover:text-white">
                      {isAr
                        ? `بحث في كل الكتب (${references.length}) + الإنترنت عن "${query}"`
                        : `Search all ${references.length} books + Live Web for "${query}"`}
                    </p>
                    <p className="text-xs text-teal-400/80">
                      {isAr ? 'بحث فوري في كل المراجع ومقالات PubMed' : 'Simultaneous RAG across all textbooks & online PubMed literature'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-teal-300 font-bold">↵ Search</span>
              </button>

              <button
                onClick={() =>
                  handleAction(() => {
                    setTutorInitialPrompt(query.trim());
                    setActiveTab('tutor');
                  })
                }
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {isAr ? `اسأل المعلم الذكي عن "${query}"` : `Ask AI Tutor: "${query}"`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isAr ? 'شرح سريري مفصل ومصنف' : 'Structured clinical explanation'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">↵ Ask</span>
              </button>
            </div>
          )}

          {filtered.length === 0 && !query.trim() ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No matching commands.
            </div>
          ) : (
            filtered.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleAction(cmd.action)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-800/80 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-teal-400 group-hover:bg-teal-500/20 group-hover:text-teal-300 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {cmd.title}
                      </p>
                      <p className="text-xs text-slate-500">{cmd.category}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    Select ↵
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">ESC</kbd> to close</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">⌘K</kbd> anywhere</span>
        </div>
      </div>
    </div>
  );
};
