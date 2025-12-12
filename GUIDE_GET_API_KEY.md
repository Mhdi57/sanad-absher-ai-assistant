# طريقة الحصول على مفتاح Gemini API Key

عشان يشتغل معاك الذكاء الاصطناعي في "سَنَد"، تحتاج مفتاح (API Key) من جوجل. الطريقة مجانية وسهلة، اتبع الخطوات:

## الخطوات

1. **ادخل موقع Google AI Studio:**
   اضغط على هذا الرابط: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **سجل دخول:**
   سجل دخول بحسابك في جوجل (Gmail).

3. **أنشئ المفتاح:**
   - اضغط على زر **Create API key**.
   - اختر **Create API key in new project**.

4. **انسخ المفتاح:**
   - بيطلع لك كود طويل يبدأ بـ `AIza...`
   - اضغط زر النسخ (Copy).

5. **ضعه في المشروع:**
   - ارجع لملفات المشروع في جهازك.
   - افتح الملف المسمى `.env.local`.
   - الصق المفتاح مكان `PLACEHOLDER_API_KEY`، بحيث يصير الملف كذا:
     ```bash
     GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - **احفظ الملف**.

## بعد الحفظ
ارجع للموقع ([http://localhost:3000](http://localhost:3000)) وسوي تحديث للصفحة (Refresh)، وجرب تكلم سَنَد وبيشتغل معاك! 🚀
