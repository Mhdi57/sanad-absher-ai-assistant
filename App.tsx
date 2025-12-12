import React, { useState } from 'react';
import AbsherHome from './components/AbsherHome';
import SanadChat from './components/SanadChat';
import { MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative">
      <AbsherHome onOpenChat={() => setIsChatOpen(true)} />

      {/* Floating Action Button (FAB) for Sanad */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-absher hover:bg-absher-dark text-white rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center z-30 group animate-in zoom-in duration-300"
        >
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            تحدث مع سَنَد
          </span>
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Interface */}
      <SanadChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
