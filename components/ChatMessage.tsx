import React from 'react';
import { Message } from '../types';
import { Check, FileText, AlertCircle, Calendar, CreditCard, User, Clock, ArrowLeft } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onAction: (action: string, payload?: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onAction }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system'; // Internal UI messages

  if (isSystem) {
    // Render Custom Widgets based on type
    return (
      <div className="w-full flex justify-center my-4 animate-in zoom-in-95 duration-300">
        {renderWidget(message, onAction)}
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md flex items-center justify-center ml-3 shrink-0 overflow-hidden transform hover:scale-110 transition-transform duration-300">
          {/* Robot Avatar */}
          <div className="relative w-full h-full flex items-center justify-center bg-green-50">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <rect x="20" y="30" width="60" height="40" rx="10" fill="#006c35" />
              <circle cx="35" cy="45" r="5" fill="#c5a45e" />
              <circle cx="65" cy="45" r="5" fill="#c5a45e" />
              <rect x="40" y="60" width="20" height="4" rx="2" fill="#fff" />
              <path d="M30 30 L50 10 L70 30" fill="#006c35" />
            </svg>
          </div>
        </div>
      )}

      <div className={`max-w-[85%] relative group ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-7 font-medium tracking-wide ${isUser
            ? 'bg-gradient-to-bl from-absher-dark to-absher text-white rounded-br-none shadow-md'
            : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100 rounded-bl-none shadow-sm hover:shadow-md transition-shadow'
            }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-medium opacity-80">
          {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );

};

// --- Widget Renderers ---

const renderWidget = (message: Message, onAction: (action: string, payload?: any) => void) => {
  switch (message.type) {
    case 'fines_summary':
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 w-72">
          <div className="flex items-center gap-2 mb-3 text-absher font-bold border-b border-gray-100 pb-2">
            <AlertCircle className="w-5 h-5" />
            <span>تفاصيل المخالفات</span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">عدد المخالفات</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الإجمالي</span>
              <span className="font-bold text-red-600">950 ر.س</span>
            </div>
          </div>
          <button
            onClick={() => onAction('pay_fines')}
            className="w-full bg-absher hover:bg-absher-dark text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            ادفع الآن
          </button>
        </div>
      );

    case 'payment_success':
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5 w-72 text-center animate-in zoom-in-50 duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="font-bold text-xl text-gray-800 mb-1">تمت العملية بنجاح</div>
          <div className="text-sm text-gray-500 mb-4">تم تجديد الجواز وسداد الرسوم</div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs space-y-2 border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">رقم العملية</span>
              <span className="font-mono font-bold">#829301</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">المبلغ</span>
              <span className="font-bold text-[#006c35]">300.00 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">التاريخ</span>
              <span className="font-mono">{new Date().toLocaleDateString('en-US')}</span>
            </div>
          </div>

          <button
            onClick={() => onAction('download_receipt')}
            className="w-full bg-[#006c35] text-white px-4 py-2.5 rounded-xl hover:bg-[#004d26] transition flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transform active:scale-95"
          >
            <FileText className="w-4 h-4" />
            تحميل الإيصال الإلكتروني
          </button>
        </div>
      );

    case 'passport_renewal':
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 w-72">
          <div className="flex items-center gap-2 mb-3 text-absher font-bold border-b border-gray-100 pb-2">
            <User className="w-5 h-5" />
            <span>تجديد الجواز</span>
          </div>
          <ul className="text-sm space-y-2 mb-4 text-gray-600">
            <li className="flex justify-between"><span>الرسوم:</span> <span className="font-bold text-gray-900">300 ر.س</span></li>
            <li className="flex justify-between"><span>الصلاحية:</span> <span className="font-bold text-gray-900">5 سنوات</span></li>
          </ul>
          <div className="flex gap-2">
            <button onClick={() => onAction('confirm_renew')} className="flex-1 bg-absher hover:bg-absher-dark text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition transform active:scale-95">تجديد ودفع الرسوم (300 ﷼)</button>
            <button onClick={() => onAction('cancel')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold transition">إلغاء</button>
          </div>
        </div>
      );

    case 'auth_selection':
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 w-64">
          <div className="text-sm font-bold text-gray-700 mb-3 text-center">اختر الشخص للتفويض</div>
          <div className="space-y-2">
            {['محمد القحطاني', 'عبدالله الشمري', 'يوسف الشهراني'].map(name => (
              <button
                key={name}
                onClick={() => onAction('select_auth_contact', name)}
                className="w-full text-right p-2 hover:bg-gray-50 rounded-lg text-sm border border-transparent hover:border-gray-200 transition flex items-center justify-between group"
              >
                <span>{name}</span>
                <ArrowLeft className="w-3 h-3 text-gray-300 group-hover:text-absher" />
              </button>
            ))}
          </div>
        </div>
      );

    case 'appointment_selection':
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 w-72">
          <div className="flex items-center gap-2 mb-3 text-absher font-bold border-b border-gray-100 pb-2">
            <Calendar className="w-5 h-5" />
            <span>المواعيد المتاحة</span>
          </div>
          <div className="space-y-2">
            {[
              { id: 1, day: 'الخميس', time: '10:30 ص' },
              { id: 2, day: 'الأحد', time: '9:00 ص' },
              { id: 3, day: 'الاثنين', time: '1:45 م' }
            ].map(slot => (
              <button
                key={slot.id}
                onClick={() => onAction('select_appointment', slot.day)}
                className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-absher-light/10 border border-gray-100 rounded-lg transition"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{slot.day}</span>
                </div>
                <span className="text-xs bg-white px-2 py-1 rounded text-gray-600 shadow-sm">{slot.time}</span>
              </button>
            ))}
          </div>
        </div>
      );

    case 'status_check':
      return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 w-72">
          <div className="font-bold text-gray-800 mb-3 border-b pb-2">ملخص حالتك</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> الجواز</span>
              <span className="font-bold text-green-700">جديد ✔</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> الهوية</span>
              <span className="font-bold text-green-700">سارية ✔</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> المخالفات</span>
              <span className="font-bold text-gray-800">0</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> الموعد القادم</span>
              <span className="font-bold text-xs">الخميس 10:30</span>
            </li>
          </ul>
        </div>
      );

    default:
      return null;
  }
};

export default ChatMessage;
