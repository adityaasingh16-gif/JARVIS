import React from 'react';
import { useJarvisStore } from './stores/jarvisStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { HUDStatusBar } from './components/layout/HUDStatusBar';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { ResearchPage } from './pages/ResearchPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { ComputerPage } from './pages/ComputerPage';
import { MemoryPage } from './pages/MemoryPage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { activePage } = useJarvisStore();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <ChatPage />;
      case 'research':
        return <ResearchPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'developer':
        return <DeveloperPage />;
      case 'computer':
        return <ComputerPage />;
      case 'memory':
        return <MemoryPage />;
      case 'tasks':
        return <TasksPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080C14] text-slate-100 font-sans overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-[#080C14] overflow-hidden flex flex-col relative">
          {renderPage()}
        </main>
      </div>
      <HUDStatusBar />
    </div>
  );
};

export default App;
