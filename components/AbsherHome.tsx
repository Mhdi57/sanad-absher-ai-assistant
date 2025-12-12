import React from 'react';
import { Search, Bell, Menu, LayoutGrid, FileText, CreditCard, Users, Calendar, Car, UserCheck, UserCog, HardHat } from 'lucide-react';

interface AbsherHomeProps {
   onOpenChat?: () => void;
}

const AbsherHome: React.FC<AbsherHomeProps> = ({ onOpenChat }) => {
   const [showNotifications, setShowNotifications] = React.useState(false);

   // Mock Notifications
   const notifications = [
      { id: 1, text: 'تم تسجيل مخالفة مرورية جديدة', time: 'منذ ساعة', read: false },
      { id: 2, text: 'موعد تجديد الجواز اقترب', time: 'منذ يوم', read: false },
   ];

   const unreadCount = notifications.filter(n => !n.read).length;

   const handleServiceClick = (service: string) => {
      alert(`خدمة ${service} ستتوفر قريباً عبر المساعد الذكي سَنَد!`);
   };

   // Exact grid from screenshot:
   // Row 1: Services (Grid), Vehicles (Car), Family (Users), Appointments (Calendar) -> In RTL: Appointments, Family, Vehicles, Services
   // Wait, screenshot shows LTR visual order or RTL?
   // Arabic reads Right to Left.
   // Screenshot Row 1 Right to Left: Appointments (Orange), Family (Purple), Vehicles (Blue), Services (Green Grid).
   // Screenshot Row 2 Right to Left: Workers (Purple), Civil Affairs (Teal), Passports (Green), Payments (Red).

   const services = [
      { id: 1, title: 'المواعيد', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
      { id: 2, title: 'أفراد الأسرة', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
      { id: 3, title: 'مركباتي', icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
      { id: 4, title: 'خدماتي', icon: LayoutGrid, color: 'text-green-600', bg: 'bg-green-50' },
      { id: 5, title: 'العمالة', icon: HardHat, color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { id: 6, title: 'الأحوال', icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
      { id: 7, title: 'الجوازات', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
      { id: 8, title: 'المدفوعات', icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50' },
   ];

   return (
      <div className="min-h-screen bg-[#f3f4f6]" dir="rtl">
         {/* Top Navigation - Standard Green */}
         <header className="bg-[#006c35] text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Menu className="w-6 h-6 cursor-pointer md:hidden" />
                  <div className="flex items-center gap-2 select-none">
                     <div className="text-3xl font-bold font-arabic tracking-wider">أبشر</div>
                     <span className="text-xs opacity-80 mt-2">أفراد</span>
                  </div>
               </div>

               <div className="flex-1 max-w-xl mx-8 hidden md:block">
                  {/* Search Bar matching standard Absher */}
                  <div className="relative">
                     <input
                        type="text"
                        placeholder="ابحث عن خدمة..."
                        className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-10 text-white placeholder-green-100 focus:outline-none focus:bg-white/20 transition-all"
                     />
                     <Search className="absolute right-3 top-2.5 w-5 h-5 text-green-100" />
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="relative cursor-pointer hover:bg-white/10 p-2 rounded-full transition" onClick={() => setShowNotifications(!showNotifications)}>
                     <Bell className="w-6 h-6" />
                     {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#006c35]"></span>
                     )}
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                     <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/30">ع</div>
                  </div>
               </div>
            </div>
         </header>

         {/* Hero Section - Simplified for contrast */}
         <section className="bg-[#006c35] text-white pb-16 pt-8 px-4 relative overflow-hidden">
            <div className="container mx-auto relative z-10 text-center">
               <h1 className="text-3xl md:text-5xl font-bold mb-6 font-arabic">
                  مرحباً بك في منصة أبشر
               </h1>

               {/* Sanad Call to Action - Clean Design */}
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 hover:bg-white/15 transition duration-300 shadow-lg cursor-pointer" onClick={onOpenChat}>
                  <div className="text-right flex-1">
                     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
                        <span className="text-3xl">👋</span>
                        المساعد الذكي "سَنَد"
                     </h2>
                     <p className="text-green-50 text-base opacity-90">
                        أنا هنا لمساعدتك في إنجاز خدماتك الحكومية والرد على استفساراتك.
                     </p>
                  </div>
                  <button
                     className="bg-white text-[#006c35] px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-all flex items-center gap-2 shrink-0 shadow-md transform hover:scale-105"
                  >
                     <Users className="w-5 h-5" />
                     ابدأ المحادثة الآن
                  </button>
               </div>
            </div>

            {/* Decorative Curve */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
               <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#f3f4f6]"></path>
               </svg>
            </div>
         </section>

         <main className="container mx-auto px-4 -mt-10 relative z-10 pb-20">
            {/* Services Grid - Exact Match to Screenshot */}
            <h3 className="text-right text-gray-500 mb-2 font-bold text-sm">الخدمات الإلكترونية</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {services.map((service) => (
                  <div
                     key={service.id}
                     className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center justify-center gap-4 cursor-pointer group h-40 border border-gray-100"
                     onClick={() => handleServiceClick(service.title)}
                  >
                     <div className={`p-4 rounded-full ${service.bg} bg-opacity-50 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className={`w-8 h-8 ${service.color}`} strokeWidth={1.5} />
                     </div>
                     <span className="font-bold text-gray-800 text-lg group-hover:text-[#006c35] transition-colors">{service.title}</span>
                  </div>
               ))}
            </div>

            {/* Dashboard Widgets - Clean */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-gray-800 text-lg">آخر العمليات</h3>
                     <button className="text-sm text-[#006c35] font-bold hover:underline">عرض السجل</button>
                  </div>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#006c35]">
                                 <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-gray-800">تجديد رخصة سير</div>
                                 <div className="text-xs text-gray-500 mt-1">رقم العملية: 8293***</div>
                              </div>
                           </div>
                           <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">منذ {i} يوم</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#006c35] text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                  <div>
                     <h3 className="font-bold text-xl mb-3 border-b border-white/20 pb-2">تنبيهات هامة</h3>
                     <p className="text-base text-green-50 leading-relaxed mb-4">
                        عزيزي المستفيد، نود تذكيركم بضرورة تحديث بيانات العنوان الوطني لضمان وصول الوثائق الحكومية.
                     </p>
                  </div>
                  <button className="self-end bg-white text-[#006c35] px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition shadow-sm">
                     تحديث البيانات
                  </button>
               </div>
            </div>
         </main>
      </div>
   );
};

export default AbsherHome;
