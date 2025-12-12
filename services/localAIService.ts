import { pipeline, env } from '@xenova/transformers';

// Configuration to skip local model check if not found (downloads from HF)
env.allowLocalModels = false;
env.useBrowserCache = true;

// --- 1. Massive Intent Dataset (Training Data) ---
const intents = [
    // --- Traffic & Violations (المرور) 🚗 ---
    { label: 'pay_fines', examples: ['سدد المخالفات', 'عندي مخالفات؟', 'ابغى ادفع المخالفة', 'سدد كل اللي علي', 'دفع مخالفات', 'كم علي مخالفات', 'تسديد مخالفات المرور', 'ادفع الغرامات', 'علي قسائم؟'] },
    { label: 'traffic_objection', examples: ['اعتراض على مخالفة', 'المخالفة هذي غلط', 'كيف اعترض على ساهر', 'رفع اعتراض مروري', 'المخالفة غير صحيحة', 'ابغى اشتكي على المرور', 'اعتراض آلي'] },
    { label: 'driving_license', examples: ['تجديد رخصة القيادة', 'رخصتي بتنتهي', 'اصدار رخصة بدل فاقد', 'كيف اجدد الرخصة', 'حجز موعد رخصة', 'استخراج رخصة قيادة', 'طباعة الرخصة', 'رخصة خاصة', 'رخصة دباب'] },
    { label: 'vehicle_auth', examples: ['تفويض قيادة', 'ابغى اسوي تفويض لسيارتي', 'تفويض خارجي', 'إلغاء التفويض', 'إضافة مستخدم فعلي', 'تفويض مركبة', 'أبوي يسوق سيارتي'] },
    { label: 'vehicle_plates', examples: ['مزاد اللوحات', 'شراء لوحة مميزة', 'استبدال لوحات', 'لوحة السيارة مفقودة', 'بدل فاقد لوحة', 'طلب لوحات طويلة', 'لوحات ملكية'] },
    { label: 'traffic_accidents', examples: ['الاستعلام عن الحوادث', 'تقرير حادث', 'نجم', 'تقدير الحوادث', 'اعتراض على نسبة الخطأ', 'طباعة تقرير حادث'] },

    // --- Passports (الجوازات) 🛂 ---
    { label: 'renew_passport', examples: ['جدد الجواز', 'جوازي بينتهي', 'ابغى تجديد جواز', 'تجديد الجواز', 'الجوازات', 'كم رسوم تجديد الجواز', 'اصدار جواز سفر', 'جواز السفر السعودي'] },
    { label: 'issue_visa', examples: ['اصدار تأشيرة خروج وعودة', 'الغاء التأشيرة', 'تمديد تأشيرة', 'خروج نهائي', 'عمل تاشيرة للسواق', 'استخراج فيزا', 'طباعة التأشيرة', 'إلغاء الخروج النهائي'] },
    { label: 'iqama_services', examples: ['تجديد الإقامة', 'الاستعلام عن صلاحية الإقامة', 'اصدار إقامة', 'نقل كفالة', 'بلاغ هروب', 'تعديل المهنة', 'إصدار إقامة بدل فاقد', 'نقل خدمات عامل'] },
    { label: 'travel_permits', examples: ['تصاريح السفر', 'تصريح سفر للاسرة', 'الغاء تصريح سفر', 'تصريح سفر للعراق', 'استثناءات السفر'] },
    { label: 'visit_visa', examples: ['تأشيرة زيارة', 'تمديد الزيارة العائلية', 'تحويل الزيارة لإقامة', 'طلب زيارة عائلية', 'مستند تأشيرة'] },

    // --- Civil Affairs (الأحوال المدنية) 🆔 ---
    { label: 'national_id', examples: ['تجديد الهوية الوطنية', 'بطاقة الاحوال', 'بدل فاقد هوية', 'حجز موعد الاحوال', 'اصدار هوية جديدة', 'تسجيل مولود', 'صورة الهوية', 'بطاقة الهوية منتهية'] },
    { label: 'family_documents', examples: ['سجل الاسرة', 'كرت العائلة', 'اصدار سجل اسرة', 'اضافة تابع', 'تحديث بيانات العائلة', 'تسجيل زواج', 'واقعة ميلاد', 'تسجيل مولود جديد', 'شهادة ميلاد'] },
    { label: 'check_reports', examples: ['بياناتي', 'شريحة بيانات', 'طباعة برنت', 'تقرير عن المواطن', 'تقرير البيانات الأساسية', 'برنت الأحوال', 'خطاب تعريف', 'التحقق من الهوية'] },
    { label: 'name_change', examples: ['تغيير الاسم', 'تعديل الاسم بالانجليزي', 'تصحيح الاسم', 'تغيير اللقب'] },

    // --- Vehicles (المركبات) 🚙 ---
    { label: 'transfer_car', examples: ['نقل ملكية سيارة', 'ابيع سيارتي', 'شروط نقل الملكية', 'كيف انقل السيارة لصاحبي', 'نقل ملكية', 'مبايعة مركبة', 'تمم المبايعة', 'بيع مركبة'] },
    { label: 'vehicle_insurance', examples: ['تأمين المركبة', 'صلاحية التأمين', 'هل سيارتي مأمنة؟', 'تجديد التأمين', 'ارخص تأمين', 'تأمين ضد الغير', 'تأمين شامل'] },
    { label: 'vehicle_istimara', examples: ['تجديد الاستمارة', 'رخصة السير منتهية', 'المطوفة', 'كم رسوم تجديد الاستمارة', 'طباعة الاستمارة', 'تجديد رخصة السير', 'استمارة السيارة'] },
    { label: 'cancel_vehicle', examples: ['إسقاط المركبة', 'تشليح السيارة', 'بيع السيارة تشليح', 'الغاء تسجيل المركبة', 'لوحات السيارة', 'سيارة تالفة', 'المهلة التصحيحية'] },
    { label: 'vehicle_user', examples: ['مستخدم فعلي', 'اضافة سائق', 'تفويض مستخدم', 'الغاء مستخدم فعلي'] },

    // --- General Security & Others 👮‍♂️ ---
    { label: 'criminal_record', examples: ['صحيفة خلو سوابق', 'شهادة خلو سوابق', 'علي سوابق؟', 'طلب صحيفة جنائية', 'شهادة حسن سيرة وسلوك'] },
    { label: 'weapon_license', examples: ['رخصة سلاح', 'تجديد رخصة السلاح', 'نقل ملكية سلاح', 'تصريح حمل سلاح', 'شروط السلاح'] },
    { label: 'amen_report', examples: ['بلاغ أمني', 'كلنا أمن', 'ابغى ابلغ عن جريمة', 'بلاغ مروري', 'تقديم بلاغ', 'تحرش', 'جرائم معلوماتية'] },
    { label: 'lost_documents', examples: ['الإبلاغ عن وثائق مفقودة', 'ضاعت بطاقتي', 'فقدان جواز', 'فقدان لوحة', 'ابلاغ عن فقدان'] },

    // --- General & Support 🤝 ---
    { label: 'appointments', examples: ['حجز موعد', 'ابغى موعد مرور', 'حجز موعد جوازات', 'متى اقرب موعد', 'الغاء الموعد', 'تأكيد الموعد', 'مواعيد الأحوال'] },
    { label: 'national_address', examples: ['العنوان الوطني', 'تحديث العنوان', 'طباعة العنوان الوطني', 'اضافة عنوان جديد', 'رقم المبنى', 'إثبات عنوان'] },
    { label: 'check_all', examples: ['شيك على كل شي', 'ايش عندي التزامات؟', 'وضع خدماتي', 'ملخص حسابي', 'لوحة المعلومات', 'اعطني تقرير شامل', 'عندي تعاميم؟', 'ايقاف خدمات'] },
    { label: 'greeting', examples: ['سلام', 'مرحبا', 'هلا', 'صباح الخير', 'مساء الخير', 'كيف الحال', 'مين انت', 'اهلين', 'السلام عليكم', 'حياك', 'ألو'] },
    { label: 'thanks', examples: ['شكرا', 'يعطيك العافية', 'ما قصرت', 'تسلم', 'شكرا لك', 'جزاك الله خير', 'بيض الله وجهك', 'كفو'] },
    { label: 'help', examples: ['مساعدة', 'وش تقدر تسوي؟', 'علمني خدماتك', 'كيف استخدمك', 'قائمة الاوامر', 'ماذا تستطيع أن تفعل؟', 'القائمة'] },
    { label: 'tawakkalna', examples: ['توكلنا', 'تعريف صحي', 'الجواز الصحي', 'رقم الجوال في توكلنا'] },
    { label: 'absher_account', examples: ['تغيير كلمة المرور', 'تحديث رقم الجوال', 'نسيت الرقم السري', 'استعادة الحساب', 'تغيير البريد الالكتروني', 'توثيق البصمة'] },
];

// --- 2. Static Knowledge Base (FAQ) ---
// Used when confidence is moderate or as a direct lookup fallback
const knowledgeBase = [
    { q: 'طريقة التسجيل في أبشر', a: 'للتسجيل في أبشر: ادخل الموقع الرسمي، اختر "مستخدم جديد"، ادخل رقم الهوية والجوال، ثم فعل الحساب عن طريق البصمة في أجهزة الخدمة الذاتية أو البنوك.' },
    { q: 'نسيت كلمة المرور', a: 'تقدر تستعيد كلمة المرور عن طريق الضغط على "نسيت كلمة المرور" في صفحة الدخول، وراح يوصلك رمز تحقق على جوالك المسجل.' },
    { q: 'رقم الدعم الفني', a: 'لأي مشاكل تقنية، تقدر تتصل على الدعم الفني لأبشر على الرقم: 920020405.' },
    { q: 'شروط نقل الملكية', a: 'شروط نقل الملكية: 1. وجود فحص دوري ساري. 2. تأمين ساري للمركبة. 3. سداد المخالفات على المشتري والبائع. 4. سداد رسوم النقل.' },
    { q: 'رسوم تجديد الجواز', a: 'رسوم تجديد الجواز هي 300 ريال لمدة 5 سنوات، و 600 ريال لمدة 10 سنوات.' },
    { q: 'سن استخراج الهوية', a: 'يكون إصدار الهوية الوطنية إجبارياً عند إتمام سن 15 عاماً، واختيارياً من سن 10 إلى 15 عاماً.' },
    { q: 'شروط الخروج النهائي', a: 'شروط الخروج النهائي: سداد جميع المخالفات، عدم وجود سيارة مسجلة باسم العامل، تواجد العامل داخل المملكة، وسريان الإقامة.' },
];

/**
 * Singleton Class for the Feature Extraction Pipeline
 */
class IntentClassifier {
    static instance: any = null;
    static modelId = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

    static async getInstance() {
        if (!this.instance) {
            console.log('Loading Local AI Model...');
            this.instance = await pipeline('feature-extraction', this.modelId);
            console.log('Local AI Model Loaded.');
        }
        return this.instance;
    }
}

/**
 * Calculate Cosine Similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]) {
    let dot = 0, n1 = 0, n2 = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        n1 += a[i] * a[i];
        n2 += b[i] * b[i];
    }
    return dot / (Math.sqrt(n1) * Math.sqrt(n2));
}

// Cache for intent embeddings
let intentEmbeddings: { label: string, embedding: number[] }[] = [];

/**
 * Pre-compute embeddings for intents
 */
async function prepareIntentEmbeddings() {
    if (intentEmbeddings.length > 0) return;

    try {
        const pipe = await IntentClassifier.getInstance();
        console.log('Generating embeddings for ' + intents.length + ' intents...');

        for (const intent of intents) {
            // Embed generic examples - Limit to first 3 examples for performance initially to allow fast load
            const examplesToEmbed = intent.examples;
            for (const example of examplesToEmbed) {
                const output = await pipe(example, { pooling: 'mean', normalize: true });
                intentEmbeddings.push({ label: intent.label, embedding: Array.from(output.data) });
            }
        }
        console.log('Embeddings generated successfully.');
    } catch (e) {
        console.error("Embedding generation failed", e);
    }
}

/**
 * Main function to classify text
 */
export async function detectIntent(text: string) {
    try {
        // 1. Fast Path: Keyword/Substring Matching (Hybrid Approach)
        // This ensures that if the user types something that literally exists in our examples, it matches 100%.
        let bestKeywordMatch = 'unknown';
        let maxKeywordOverlap = 0;

        for (const intent of intents) {
            for (const example of intent.examples) {
                // Check if the user input contains the example, or the example contains the user input (if long enough)
                if (text.includes(example) || (example.length > 5 && example.includes(text))) {
                    console.log(`Keyword Match Found: ${intent.label} (via "${example}")`);
                    return intent.label; // Return immediately on strong match
                }

                // Partial match check (if 70% of words match)
                const textWords = text.split(' ');
                const exampleWords = example.split(' ');
                const intersection = textWords.filter(w => exampleWords.includes(w));
                if (intersection.length >= 2 && intersection.length >= exampleWords.length * 0.6) {
                    return intent.label;
                }
            }
        }

        // 2. Deep Path: Semantic Embeddings (AI Model)
        // Only run this if no obvious keyword match was found
        await prepareIntentEmbeddings();
        const pipe = await IntentClassifier.getInstance();
        const output = await pipe(text, { pooling: 'mean', normalize: true });
        const inputEmbedding = Array.from(output.data) as number[];

        let maxScore = -1;
        let bestIntent = 'unknown';

        for (const item of intentEmbeddings) {
            const score = cosineSimilarity(inputEmbedding, item.embedding);
            if (score > maxScore) {
                maxScore = score;
                bestIntent = item.label;
            }
        }

        console.log(`AI Detected: ${bestIntent} (${maxScore.toFixed(2)})`);

        // Threshold tuning
        if (maxScore < 0.38) return 'unknown'; // Slightly increased threshold since we have the fast path now
        return bestIntent;

    } catch (error) {
        console.error("AI Error:", error);
        return 'error';
    }
}

// --- Mock Data ---
const mockFines = [
    { id: 'F001', amount: 300, description: 'سرعة', date: '2023-10-01' },
    { id: 'F002', amount: 150, description: 'عدم ربط حزام', date: '2023-11-15' },
    { id: 'F003', amount: 500, description: 'تجاوز خاطئ', date: '2023-12-05' },
];

/**
 * Generate Response based on Intent
 */
export async function generateLocalResponse(text: string) {
    // 0. specialized commands (State Management Sim)
    if (text === 'أكمل التجديد' || text === 'سدد الرسوم' || text.includes('دفعت')) {
        return {
            text: "تم استلام المبلغ (300 ريال) بنجاح! 💰\n\nتم تجديد الجواز، وسيصلك عبر البريد السعودي خلال 3 أيام عمل.\n\nوهذا إيصال العملية 👇",
            widget: { type: 'payment_success' }
        };
    }

    if (text === 'إيه، سددها الآن') {
        return {
            text: "بيض الله وجهك، تم السداد! ✅\n\nالمخالفات تسددت، وسجلك الحين نظيف.\n\nتبي إيصال السداد؟",
            widget: { type: 'payment_success' }
        };
    }

    const intent = await detectIntent(text);

    let responseText = '';
    let widget = null;

    switch (intent) {
        case 'greeting':
            responseText = "يا هلا والله! 👋 أنا سَنَد، مساعدك الذكي في أبشر.\nكيف أقدر أخدمك اليوم؟ (سداد مخالفات، تجديد جواز، نقل ملكية...)";
            break;

        case 'thanks':
            responseText = "العفو! واجبي أخدمك طال عمرك 🫡\n\nتبي شي ثاني؟";
            break;

        case 'help':
            responseText = "أنا هنا لمساعداتك في كل خدمات وزارة الداخلية (أبشر) 🇸🇦\n\nأقدر أساعدك في:\n\n🚗 **المرور**: مخالفات، رخص، تفويض، إسقاط مركبات.\n🛂 **الجوازات**: تأشيرات، جواز سفر، عمالة منزلية.\n🆔 **الأحوال**: هوية، مواليد، سجل أسرة.\n👮‍♂️ **أمن**: صحيفة خلو سوابق، رخص سلاح.\n\nبإيش نبدأ؟";
            break;

        case 'pay_fines':
            const total = mockFines.reduce((sum, f) => sum + f.amount, 0);
            responseText = `شيكت لك وحصلت عندك ${mockFines.length} مخالفات بإجمالي ${total} ريال.\n\nتفاصيلها:\n${mockFines.map(f => `- ${f.description}: ${f.amount} ريال`).join('\n')}\n\nتبي أسددها لك كلها الحين؟`;
            widget = { type: 'fines_summary' };
            break;

        case 'traffic_objection':
            responseText = "حقك تعترض وتأخذ حقك النظامي.\nتقدر تقدم اعتراض على المخالفة خلال 30 يوم من تسجيلها عبر منصة أبشر.\n\nتبي أفتح لك نموذج الاعتراض المباشر؟";
            widget = { type: 'link', text: 'فتح نموذج الاعتراض', url: '#' };
            break;

        case 'driving_license':
            responseText = "الرخصة هي هويتك في الطريق 🚗\nيوجد طلب تجديد رخصة قيادة معلق يتطلب إجراء الفحص الطبي.\n\nهل أجريت الفحص الطبي عشان أرفع لك الطلب؟";
            break;

        case 'vehicle_auth':
            responseText = "خدمة التفويض (تفويض قيادة) 🔑\nتقدر تفوض شخص آخر بقيادة مركبتك داخل أو خارج المملكة إلكترونياً.\n\nلمن تبي تفوض السيارة؟ (الوالد، الأخ، السائق..)";
            break;

        case 'cancel_vehicle':
            responseText = "إسقاط المركبات خدمة تيح لك التخلص من السيارات التالفة أو القديمة مجاناً خلال المهلة التصحيحية وإسقاطها من سجلاتك.\n\nهل لديك 'رمز التحقق' من محل التشليح؟";
            break;

        case 'vehicle_plates':
            responseText = "خدمات اللوحات 🔢\nتقدر تستفيد من:\n- مزاد اللوحات الإلكتروني.\n- استبدال لوحات المركبة.\n- طلب لوحات بشعار مميز.\n\nوش اللي في بالك؟";
            break;

        case 'traffic_accidents':
            responseText = "الحمدلله على السلامة. 🚑\nللاستعلام عن تقارير الحوادث، يرجى تزويدي برقم الحادث أو رقم اللوحة.";
            break;

        // --- Passports ---
        case 'renew_passport':
            responseText = "أبشر، براجع بيانات جوازك... 🛂\n\nالجواز ينتهي بعد 45 يوم.\n- رسوم 5 سنوات: 300 ريال\n- رسوم 10 سنوات: 600 ريال\n\nأي مدة تبي أجدد لك؟";
            widget = { type: 'passport_renewal' };
            break;

        case 'issue_visa':
            responseText = "خدمات التأشيرات للمكفولين ✈️\nعشان أصدر تأشيرة خروج وعودة، أحتاج منك تحديد:\n1. اسم المكفول\n2. مدة التأشيرة (بالأيام أو الشهور)\n\nمن هو الشخص المقصود؟";
            break;

        case 'iqama_services':
            responseText = "خدمات الإقامة 🪪\nتأكدت لك من النظام:\n- عندك مكفول واحد إقامته بتنتهي خلال شهر.\n\nتحب أجددها له الآن (الرسوم 650 ريال)؟";
            break;

        case 'travel_permits':
            responseText = "تصاريح السفر لأفراد الأسرة.\nيسمح لك بإصدار تصريح سفر لمن هم دون 21 عاماً (القصر) أو العمالة المنزلية.\n\nلمن تبي تصدر التصريح؟";
            break;

        // --- Vehicles ---
        case 'transfer_car':
            responseText = "خدمة مبايعة المركبات عبر أبشر 🤝\nعشان نتمم النقل، لازم:\n1. لا توجد مخالفات على البائع والمشتري.\n2. سريان الفحص والتأمين.\n\nهل اتفقت مع المشتري وتم تحديد المبلغ؟";
            break;

        case 'vehicle_insurance':
            responseText = "تأمينك الحالي منتهي! ⚠️\nأنصحك بتجديد التأمين فوراً لتجنب المخالفات الآلية.\n\nأقدر أجيب لك عروض أسعار من شركات مختلفة، تبي تشوفها؟";
            break;

        case 'vehicle_istimara':
            responseText = "تجديد رخصة السير (الاستمارة).\nالسيارة ما شاء الله فحصها جديد وتأمينها ساري.\n\nرسوم التجديد 300 ريال (3 سنوات). اعتمد التجديد؟";
            break;

        // --- Civil Affairs ---
        case 'national_id':
            responseText = "الهوية الوطنية 🆔\nتجديد الهوية يتطلب حجز موعد وزيارة الفرع للتصوير والبصمة.\n\nأقرب موعد متاح في 'فرع الياسمين' يوم الأحد القادم. أحجزه لك؟";
            break;

        case 'family_documents':
            responseText = "سجل الأسرة وخدمات التابعين 👨‍👩‍👧‍👦\nمبروك ما جاكم! إذا بتضيف مولود جديد، أحتاج بس تاريخ الميلاد ورقم تبليغ الولادة من المستشفى.";
            break;

        case 'check_reports':
            responseText = "خدمة 'بياناتي' 📄\nتم تجهيز تقرير البيانات الأساسية.\nيحتوي على: الاسم، رقم الهوية، المهنة، الحالة الاجتماعية، وتواريخ الانتهاء.\n\nجاري تجهيز ملف PDF...";
            break;

        case 'name_change':
            responseText = "خدمة تغيير الاسم تتطلب حجز موعد في الأحوال المدنية مع إحضار المستندات الثبوتية.\nهل تبي أحجز لك موعد؟";
            break;

        // --- Security ---
        case 'criminal_record':
            responseText = "طلب صحيفة خلو سوابق 👮‍♂️\nالخدمة تتطلب موافقتك لإرسال الطلب للأدلة الجنائية.\n\nالغرض من الصحيفة: (توظيف، دراسة، أخرى)؟";
            break;

        case 'amen_report':
            responseText = "خدمة البلاغات الأمنية (كلنا أمن) 🚨\nفي الحالات الطارئة جداً يرجى الاتصال بـ 911.\n\nللبلاغات الأخرى، وش نوع البلاغ؟ (جنائي، مروري، مساس بالحياة الخاصة..)؟";
            break;

        // --- General ---
        case 'appointments':
            responseText = "نظام المواعيد الموحد 📅\nأقدر أشوف لك المواعيد المتاحة في كل القطاعات.\n\nتبي موعد في (المرور) ولا (الأحوال) ولا (الجوازات)؟";
            break;

        case 'national_address':
            responseText = "عنوانك الوطني المسجل هو: 🏠\nالرياض، حي النرجس، شارع العليا، مبنى 45.\n\nهل تبي تطبع إثبات العنوان؟";
            break;

        case 'check_all':
            responseText = "حيّاك الله يا عبدالله، هذا موجز لحسابك: 📊\n\n🔴 **تنبيهات**: إقامة سائقك بتنتهي.\n🟡 **التزامات**: عليك مخالفات بـ 450 ريال.\n🟢 **ساري**: جوازك وهويتك ورخصتك أمورهم طيبة.\n\nتبي تفاصيل أكثر عن شي معين؟";
            widget = { type: 'status_check' };
            break;

        case 'absher_account':
            responseText = "لإدارة حسابك في أبشر (كلمة المرور، رقم الجوال)، لازم تتوجه لإعدادات الملف الشخصي.\n\nتبي أرسل لك رابط التعديل المباشر؟";
            break;

        case 'unknown':
        default:
            // 1. Check Knowledge Base first
            const kbMatch = knowledgeBase.find(kb => text.includes(kb.q) || text.includes(kb.q.split(' ')[0]));

            // 2. Fallback Pattern Matching
            if (kbMatch) {
                responseText = kbMatch.a;
            }
            else if (text.includes('سدد') || text.includes('دفع') || text.includes('نعم') || text.includes('موافق') || text.includes('تم')) {
                responseText = "تم تنفيذ طلبك بنجاح! ✅\nرقم العملية الموحد: 839402\n\nتبي خدمة ثانية طال عمرك؟";
            } else {
                responseText = "ما فهمت عليك زين المعذرة 😅\n\nأنا متخصص في خدمات وزارة الداخلية، مثلاً تقدر تقولي:\n- 'جدد جوازي'\n- 'عندي مخالفات؟'\n- 'ابغى شهادة خلو سوابق'\n\nجرب تعيد الصياغة، وأنا معك.";
            }
            break;
    }

    return {
        text: responseText,
        widget: widget
    };
}
