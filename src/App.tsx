import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';
import { BooksCatalogModal } from './components/BooksCatalogModal';
import { ContactDeveloperModal } from './components/ContactDeveloperModal';
import { PhonePermissionsModal } from './components/PhonePermissionsModal';
import { PhonePermissionsBanner } from './components/PhonePermissionsBanner';
import { DashboardView } from './components/DashboardView';
import { AiTutorView } from './components/AiTutorView';
import { SearchView } from './components/SearchView';
import { LibraryView } from './components/LibraryView';
import { NotesView } from './components/NotesView';
import { FlashcardsView } from './components/FlashcardsView';
import { McqExamView } from './components/McqExamView';
import { ClinicalCaseView } from './components/ClinicalCaseView';
import { AnatomyView } from './components/AnatomyView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isBooksCatalogOpen,
    setIsBooksCatalogOpen,
    isContactDeveloperOpen,
    setIsContactDeveloperOpen,
    isPhonePermissionsOpen,
    setIsPhonePermissionsOpen
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tutor':
        return <AiTutorView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'notes':
        return <NotesView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'mcq':
        return <McqExamView />;
      case 'cases':
        return <ClinicalCaseView />;
      case 'anatomy':
        return <AnatomyView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <PhonePermissionsBanner onOpenModal={() => setIsPhonePermissionsOpen(true)} />
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      <CommandPalette />
      <MedicalDisclaimerModal />
      <BooksCatalogModal isOpen={isBooksCatalogOpen} onClose={() => setIsBooksCatalogOpen(false)} />
      <ContactDeveloperModal isOpen={isContactDeveloperOpen} onClose={() => setIsContactDeveloperOpen(false)} />
      <PhonePermissionsModal isOpen={isPhonePermissionsOpen} onClose={() => setIsPhonePermissionsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
