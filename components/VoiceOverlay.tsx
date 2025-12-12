import React, { useEffect } from 'react';
import { X, Mic } from 'lucide-react';

interface VoiceOverlayProps {
  onClose: () => void;
  onSpeechResult: (text: string) => void;
}

// Simulating speech recognition for the demo since actual browser SpeechAPI 
// requires specific HTTPS/permissions that might be flaky in preview.
const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ onClose, onSpeechResult }) => {

  useEffect(() => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window)) {
      alert("عذراً، متصفحك لا يدعم خاصية التعرف الصوتي.");
      onClose();
      return;
    }

    // Initialize Recognition
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ar-SA'; // Saudi Arabic
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSpeechResult(transcript); // Send result back
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        alert("يرجى السماح بالوصول للميكروفون.");
      }
      onClose();
    };

    recognition.onend = () => {
      // If we didn't get a result (e.g. silence), just close
      // The onresult handles the success case
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [onClose, onSpeechResult]);


  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-xl font-medium mb-12 opacity-90">سَنَد يستمع لك...</div>

      {/* Pulsing Mic Circle */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-absher-light rounded-full animate-ping opacity-20 delay-75"></div>
        <div className="absolute inset-0 bg-absher-light rounded-full animate-ping opacity-20 delay-150"></div>
        <div className="w-24 h-24 bg-absher rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(45,167,94,0.6)]">
          <Mic className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Audio Wave Visualization */}
      <div className="h-12 flex items-center gap-1.5">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 bg-absher-light rounded-full wave-bar"
            style={{
              animationDuration: `${400 + Math.random() * 400}ms`,
              height: `${10 + Math.random() * 20}px`
            }}
          ></div>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-400">تكلم الآن...</p>
    </div>
  );
};

export default VoiceOverlay;