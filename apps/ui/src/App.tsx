import { useState } from 'react';
import Endpoints from './pages/Endpoints';
import SendEvent from './pages/SendEvent';
import Deliveries from './pages/Deliveries';
import { Send, Activity, Box, Github } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'events' | 'deliveries'>('endpoints');

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', icon: Box },
    { id: 'deliveries', label: 'Deliveries', icon: Activity },
    { id: 'events', label: 'Send Event', icon: Send },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
                <Box className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                  WebhookDrop
                </span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-tighter">
                  Engine Beta
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-1.5 font-medium text-sm text-gray-600">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      "px-4 py-2 rounded-lg transition-all flex items-center gap-2",
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <a href="https://github.com" target="_blank" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {activeTab === 'endpoints' && 'Manage your webhook receiver URLs and signing secrets.'}
            {activeTab === 'deliveries' && 'Track real-time webhook attempts and failure states.'}
            {activeTab === 'events' && 'Simulate incoming events and fan-out deliveries.'}
          </p>
        </div>

        <div className="animate-in fade-in duration-500">
          {activeTab === 'endpoints' && <Endpoints />}
          {activeTab === 'deliveries' && <Deliveries />}
          {activeTab === 'events' && <SendEvent />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 WebhookDrop Engine. Built for reliability and observability.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
