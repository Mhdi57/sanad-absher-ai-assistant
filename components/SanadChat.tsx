import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Minimize2, MoreVertical, AlertTriangle, Bell } from 'lucide-react';
import ChatMessage from './ChatMessage';
import VoiceOverlay from './VoiceOverlay';
import { generateLocalResponse } from '../services/localAIService'; // Use Local Service
import { Message } from '../types';

interface SanadChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const SanadChat: React.FC<SanadChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'أهلاً بك، أنا سَنَد 👋\nمساعدك الذكي من أبشر. كيف أقدر أساعدك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Notifications for Chat
  const chatNotifications = [
    { id: 1, type: 'urgent', title: 'مخالفات مرورية', desc: 'عليك مخالفات بقيمة 450 ريال', action: 'سدد المخالفات' },
    { id: 2, type: 'warning', title: 'جواز السفر', desc: 'سينتهي جواز سفرك خلال 45 يوم', action: 'تجديد جواز' },
    { id: 3, type: 'info', title: 'تأمين المركبة', desc: 'وثيقة التأمين تنتهي قريباً', action: 'تجديد التأمين' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isProcessing) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    setShowNotifications(false); // Close notifications if open

    try {
      // 2. Generate Local Response (No API Calls)
      const response = await generateLocalResponse(text);
      await new Promise(r => setTimeout(r, 800));

      if (response.text) {
        const aiMsg: Message = {
          id: Date.now().toString() + '-ai',
          role: 'model',
          content: response.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      }

      if (response.widget) {
        await new Promise(r => setTimeout(r, 400));
        const widgetMsg: Message = {
          id: `sys-${Date.now()}`,
          role: 'system',
          content: '',
          type: response.widget.type as any,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, widgetMsg]);
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: 'عذراً، حدث خطأ في النظام المحلي.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidgetAction = (action: string, payload?: any) => {
    let userText = '';
    switch (action) {
      case 'pay_fines': userText = 'إيه، سددها الآن'; break;
      case 'download_receipt': alert('جاري تحميل الإيصال...'); return;
      case 'confirm_renew': userText = 'أكمل التجديد'; break;
      case 'cancel': userText = 'لا شكراً، بعدين'; break;
      case 'select_auth_contact': userText = `${payload}`; break;
      case 'select_appointment': userText = `${payload}`; break;
    }
    if (userText) handleSend(userText);
  };

  const handleNotificationClick = (actionText: string) => {
    handleSend(actionText);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[95vw] md:w-[400px] h-[85vh] md:h-[650px] bg-[#f0f2f5] rounded-[20px] shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-200 font-sans">

        {/* Header - Matching Screenshot */}
        <div className="bg-[#006c35] text-white p-4 flex items-center justify-between shadow-md relative z-10" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-white">
                {/* Sanad Logo */}
                <img src="/sanad.png" alt="Sanad" className="w-full h-full object-contain p-1" />
              </div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-400 border-2 border-[#006c35] rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-lg leading-tight">سَنَد</h3>
              <span className="text-xs text-green-100 opacity-90">مساعد أبشر الذكي • متصل</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Notification Bell matching screenshot - now interactive */}
            <button
              className={`p-2 rounded-full transition relative ${showNotifications ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#006c35]"></span>
            </button>

            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><Minimize2 className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-white/10 rounded-full transition"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Notifications Dropdown (Absolute Positioned) */}
        {showNotifications && (
          <div className="absolute top-20 left-4 right-4 bg-white rounded-xl shadow-xl z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2" dir="rtl">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm">التنبيهات الهامة</h4>
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">3 جديدة</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {chatNotifications.map((note) => (
                <div
                  key={note.id}
                  className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition flex items-start gap-3"
                  onClick={() => handleNotificationClick(note.action)}
                >
                  <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${note.type === 'urgent' ? 'bg-red-500' : note.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-800">{note.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{note.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Alert - NEW: At the top of the chat area */}
        <div className="bg-yellow-50 border-b border-yellow-100 p-2 flex items-center gap-2 justify-center" dir="rtl">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-[10px] text-yellow-800 font-medium">هذا النظام تجريبي ومدرب على بيانات افتراضية.</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative" dir="rtl">
          {/* Date Divider */}
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-px bg-gray-300 w-12"></div>
            <span className="text-xs text-gray-400 font-medium">اليوم</span>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>

          {messages.map((msg) => (
            <div key={msg.id}>
              {/* Custom Chat Message Component Logic Inline for specific styling control */}
              {msg.role === 'model' ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-white">
                    <img src="/sanad.png" alt="Sanad" className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-sm text-gray-800 text-sm leading-relaxed border border-gray-100 relative">
                      {msg.content}
                      <div className="text-[10px] text-gray-400 text-left mt-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : msg.role === 'user' ? (
                <div className="flex flex-row-reverse items-start gap-3">
                  <div className="bg-[#006c35] text-white p-3 rounded-2xl rounded-tl-none shadow-md max-w-[80%] text-sm leading-relaxed">
                    {msg.content}
                    <div className="text-[10px] text-green-100/70 text-right mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ) : (
                <ChatMessage message={msg} onAction={handleWidgetAction} />
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100" dir="rtl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsListening(true)}
              className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition"
            >
              <Mic className="w-5 h-5" />
            </button>

            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالتك هنا..."
                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500 text-sm"
              />
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className={`p-3 rounded-full transition shadow-sm ${input.trim() ? 'bg-[#006c35] text-white hover:bg-[#005c2e]' : 'bg-gray-200 text-gray-400'}`}
            >
              <Send className={`w-5 h-5 ${input.trim() ? '-ml-1 rotate-180' : ''}`} />
            </button>
          </div>

          {/* Suggestions Chips (Replacing 'Services' button) */}
          <div className="absolute bottom-20 left-4 right-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar" dir="rtl">
            <button onClick={() => handleSend('سدد المخالفات')} className="whitespace-nowrap bg-white border border-[#006c35] text-[#006c35] px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-green-50 transition">
              💸 سدد المخالفات
            </button>
            <button onClick={() => handleSend('تجديد جواز')} className="whitespace-nowrap bg-white border border-[#006c35] text-[#006c35] px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-green-50 transition">
              🛂 تجديد جواز
            </button>
            <button onClick={() => handleSend('حجز موعد')} className="whitespace-nowrap bg-white border border-[#006c35] text-[#006c35] px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-green-50 transition">
              📅 حجز موعد
            </button>
            <button onClick={() => handleSend('تجديد الهوية')} className="whitespace-nowrap bg-white border border-[#006c35] text-[#006c35] px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-green-50 transition">
              🆔 تجديد الهوية
            </button>
            <button onClick={() => handleSend('نقل ملكية')} className="whitespace-nowrap bg-white border border-[#006c35] text-[#006c35] px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-green-50 transition">
              🚗 نقل ملكية
            </button>
          </div>
        </div>
      </div>

      {isListening && (
        <VoiceOverlay
          onClose={() => setIsListening(false)}
          onSpeechResult={(text) => {
            setIsListening(false);
            setInput(text);
            handleSend(text);
          }}
        />
      )}
    </>
  );
};

export default SanadChat;
