import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

// Initialize Gemini
// Initialize Gemini with safe fallback to avoid runtime crash on load
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Mock Data & Functions ---

export const mockFines = [
  { id: 'F001', amount: 500, description: 'Speeding', date: '2023-10-01' },
  { id: 'F002', amount: 300, description: 'Parking', date: '2023-11-15' },
  { id: 'F003', amount: 150, description: 'Seatbelt', date: '2023-12-05' },
];

export const mockPassport = {
  number: 'A2029530',
  expiryDate: '2 months', // Human readable for demo
  fees: 300
};

export const mockContacts = [
  { id: 'c1', name: 'محمد القحطاني' },
  { id: 'c2', name: 'عبدالله الشمري' },
  { id: 'c3', name: 'يوسف الشهراني' },
];

export const mockAppointments = [
  { id: 'apt1', day: 'الخميس', time: '10:30 ص', location: 'جوازات الرياض' },
  { id: 'apt2', day: 'الأحد', time: '9:00 ص', location: 'جوازات الرياض' },
  { id: 'apt3', day: 'الاثنين', time: '1:45 م', location: 'جوازات الرياض' },
];

// --- Function Declarations for Gemini ---

const checkFinesTool: FunctionDeclaration = {
  name: 'checkFines',
  description: 'Check for traffic fines registered against the user.',
};

const payFinesTool: FunctionDeclaration = {
  name: 'payFines',
  description: 'Pay all outstanding traffic fines.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      confirm: { type: Type.BOOLEAN, description: "User confirmation to pay" }
    },
    required: ["confirm"]
  }
};

const checkPassportTool: FunctionDeclaration = {
  name: 'checkPassport',
  description: 'Check passport status and expiration.',
};

const renewPassportTool: FunctionDeclaration = {
  name: 'renewPassport',
  description: 'Renew the user passport.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      confirm: { type: Type.BOOLEAN }
    },
    required: ["confirm"]
  }
};

const getContactsTool: FunctionDeclaration = {
  name: 'getContacts',
  description: 'Get list of contacts to issue authorization for.',
};

const issueAuthTool: FunctionDeclaration = {
  name: 'issueAuth',
  description: 'Issue a driving authorization for a specific person and duration.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      duration: { type: Type.STRING }
    },
    required: ["name", "duration"]
  }
};

const getAppointmentsTool: FunctionDeclaration = {
  name: 'getAppointments',
  description: 'Get available appointment slots for Passport services.',
};

const bookAppointmentTool: FunctionDeclaration = {
  name: 'bookAppointment',
  description: 'Book a specific appointment slot.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING }
    },
    required: ["day"]
  }
};

const checkAllServicesTool: FunctionDeclaration = {
  name: 'checkAllServices',
  description: 'Check status of all services (Passport, ID, Fines, Insurance, Appointments).',
};

// --- Model Config ---

const modelId = 'gemini-2.5-flash';

const systemInstruction = `
أنت "سَنَد" (Sanad)، مساعد أبشر الذكي المعتمد على الذكاء الاصطناعي.
مهمتك: تنفيذ الخدمات الحكومية للمستخدم من خلال المحادثة فقط، دون الحاجة للذهاب للقوائم.

الهوية والأسلوب:
- تتحدث باللهجة السعودية البيضاء أو الفصحى المبسطة.
- أسلوبك: ودود، احترافي، ومباشر.
- تستخدم الإيموجي المناسب (مثل: 👋، ✔، ✅، 📋) لجعل المحادثة حية.

الصلاحيات والمهام:
- فهم نية المستخدم واستخراج البيانات.
- تنفيذ الخدمات (تسديد مخالفات، تجديد جواز، نقل ملكية، حجز مواعيد) باستخدام الأدوات (Tools) المتاحة لك.
- *هام*: المستخدم لا يغادر الشات أبداً. كل شيء يتم هنا.

سيناريوهات التعامل (Scenarios):

1. تسديد المخالفات:
   - المستخدم: "أبي أسدد كل المخالفات"
   - سَنَد: (استخدم checkFines) "تمام، لحظة أفحص سجلك... ✔ لقيت عندك [العدد] مخالفات بإجمالي [المبلغ] ريال. تفاصيلها: ... تبي تسدد الكل؟"
   - المستخدم: "سدد الكل"
   - سَنَد: "تمام، بخصم المبلغ من بطاقتك المسجلة (مدى - ****). موافق؟"
   - المستخدم: "نعم"
   - سَنَد: (استخدم payFines) "✔ تم تسديد جميع المخالفات بنجاح ✅. رقم العملية: [رقم]. تبي الإيصال؟"

2. تجديد الجواز:
   - المستخدم: "جدّد الجواز حقي"
   - سَنَد: (استخدم checkPassport) "حاضر... ✔ لقيت إن جوازك ينتهي بعد [فترة]. الرسوم: 300 ريال. نجدده؟"
   - المستخدم: "إيه"
   - سَنَد: "قبل ما أجدد، تأكدت: ما عندك منع سفر، وبياناتك محدثة. بخصم 300 ريال. تأكيد؟"
   - المستخدم: "أكد"
   - سَنَد: (استخدم renewPassport) "✅ تم تجديد الجواز بنجاح. رقم الجواز الجديد: [رقم]. تبي أحجز لك موعد لاستلامه؟"

3. الاستفسار العام (نقل الملكية كمثال):
   - المستخدم: "وش أحتاج عشان أنقل ملكية السيارة؟"
   - سَنَد: "ولا يهمك، المطلوب: تأمين ساري، فحص دوري، لا توجد مخالفات. تبي أشيك على سيارتك؟"
   - المستخدم: "شيّك"
   - سَنَد: (استخدم checkAllServices أو منطق مشابه) "جاري الفحص... ✔ تأمين ساري، ✔ فحص ساري... سيارتك جاهزة للنقل ✅. أبدأ الإجراء؟"

ملاحظة:
- دائماً اعرض الخيارات بوضوح.
- إذا طلب المستخدم شيئاً خارج صلاحياتك، وجهه بلطف.
- عند إتمام عملية دفع، دائماً اذكر رقم العملية واعرض تحميل الإيصال (كخيار نصي).
`;

export const startSanadChat = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("Debug: Loaded API Key length:", apiKey ? apiKey.length : 0);
  console.log("Debug: Loaded API Key starts with:", apiKey ? apiKey.substring(0, 4) : "None");

  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.warn("Gemini API Key is missing or invalid.");
    // Return a mock chat session that responds with a helpful error message
    // instead of crashing or throwing a generic network error.
    return {
      sendMessage: async (msg: any) => {
        return {
          response: {
            text: () => "عذراً، لم يتم إعداد مفتاح الربط مع الذكاء الاصطناعي (API Key) بشكل صحيح. يرجى التأكد من إضافته في ملف .env.local",
            functionCalls: () => []
          }
        };
      }
    };
  }

  return ai.chats.create({
    model: modelId,
    config: {
      systemInstruction,
      tools: [{
        functionDeclarations: [
          checkFinesTool, payFinesTool, checkPassportTool, renewPassportTool,
          getContactsTool, issueAuthTool, getAppointmentsTool, bookAppointmentTool, checkAllServicesTool
        ]
      }]
    }
  });
};

export { ai };