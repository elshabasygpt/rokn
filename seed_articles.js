import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import pool, { initDB } from './server/db.js';

const articles = [
  {
    title_ar: "نصائح ذهبية لنقل الأثاث بدون خدوش أو أضرار",
    title_en: "Golden Tips for Moving Furniture Without Scratches",
    slug: "tips-for-moving-furniture-without-scratches",
    content_ar: `عملية نقل الأثاث تعتبر خطوة مقلقة للكثيرين بسبب الخوف من تعرض الممتلكات الثمينة للخدش أو التلف. لكن مع التنظيم الصحيح، يمكنك تجاوز ذلك بسهولة.

أولاً: وفر مواد تغليف ممتازة!
لا تبخل في شراء البابلز (النايلون الفقاعي) والكرتون المقوى، لأنها خط الدفاع الأول عن أثاثك.

ثانياً: التفكيك الحذر
لا تحاول نقل الدواليب الكبيرة أو الأسرة وهي مجمعة، استخدم أدوات مناسبة لفكها برفق واحتفظ بالمسامير في أكياس صغيرة ملصقة على نفس القطعة.

ثالثاً: تغطية الحواف
تعتبر حواف الطاولات والكنب هي الأكثر عرضة للخدش أثناء المرور بالأبواب الضيقة، استخدم واقيات حواف زوايا بلاستيكية أو بطانيات ناعمة.

نحن في شركة ركن الريان نوفر لك كل هذه العناء من خلال توفير عمالة ماضية وخبيرة في الفك والتغليف بأجود المواد الأوروبية!`,
    content_en: `Moving furniture can be stressful due to the fear of damage. However, with proper organization, you can easily avoid scratches.

First: High-quality packing materials!
Invest in bubble wrap and sturdy boxes, as they are the first line of defense for your furniture.

Second: Careful Disassembly
Do not attempt to move large wardrobes or beds while fully assembled. Disassemble them carefully and keep screws in labeled bags.

Third: Edge Protection
The edges of tables and sofas are most prone to scratches. Use soft blankets or corner protectors.

At Rokn Elryan Refrigerated Transport, we save you from this hassle by providing experts in packing using the best European materials!`,
    seo_desc_ar: "اكتشف أهم الخطوات لحماية عفشك من التلف أثناء النقل بمواد تغليف صحيحة وطرق فك آمنة مع نصائح خبراء ركن الريان.",
    seo_desc_en: "Discover the most important steps to protect your furniture from damage during shipping with proper packing and disassembly tips.",
    seo_keywords: "نقل اثاث, حماية العفش, تغليف الاثاث, شركة ركن الريان, نصائح نقل",
    image: "/uploads/placeholder1.jpg"
  },
  {
    title_ar: "كيف تختار أفضل شركة نقل عفش في أبها وخميس مشيط؟",
    title_en: "How to Choose the Best Moving Company in Abha & Khamis",
    slug: "choose-best-moving-company-abha-khamis",
    content_ar: `تنتشر العديد من شركات النقل في المنطقة الجنوبية، لكن ليس جميعها تقدم نفس الجودة والضمانات. فكيف تختار الأفضل لضمان سلامة ممتلكاتك؟

١. ابحث عن السمعة الطيبة والمراجعات:
تأكد من تقييمات العملاء السابقين للشركة على الإنترنت. مراجعات جوجل هي مؤشر ممتاز.

٢. الضمان الشامل:
الشركة الموثوقة كشركة ركن الريان تمنحك ضماناً كاملاً بتعويضك في حال حدوث أي تلفيات (لا سمح الله) أثناء النقل.

٣. فريق متكامل من النجارين والعمال:
تأكد أن الشركة تمتلك نجارين لفك وتركيب المطابخ وغرف النوم باحترافية، وليس مجرد عمال حمل فقط.

٤. سيارات نقل مغلقة:
لتجنب تقلبات الطقس والأمطار في أبها، اطلب دائماً شاحنة نقل مغلقة بالكامل.

نحن في ركن الريان نجمع كل هذه الميزات لتقديم تجربة نقل لا تضاهى.`,
    content_en: `There are many moving companies in the southern region, but not all provide the same quality. How do you choose the best?

1. Look for good reviews: Check Google Reviews from previous customers to gauge reliability.
2. Full Guarantee: A trusted company like Rokn Elryan provides full compensation guarantees in case of damage.
3. Complete team: Ensure the company has professional carpenters to assemble bedrooms and kitchens.
4. Closed moving trucks: To avoid rain and bad weather in Abha, always ask for closed trucks.

At Rokn Elryan, we combine all these features for an unmatched moving experience.`,
    seo_desc_ar: "معايير هامة جداً يجب معرفتها قبل الاتفاق مع أي شركة نقل عفش في أبها وخميس مشيط للحفاظ على ممتلكاتك.",
    seo_desc_en: "Crucial criteria you must know before hiring any furniture moving company in Abha and Khamis Mushait.",
    seo_keywords: "افضل شركة نقل عفش, نقل عفش ابها, شاحنة نقل خميس مشيط, شركة ركن الريان",
    image: "/uploads/placeholder2.jpg"
  },
  {
    title_ar: "دليلك الشامل لتغليف الأثاث الزجاجي والقابل للكسر",
    title_en: "Comprehensive Guide to Packing Glass & Fragile Furniture",
    slug: "packing-glass-and-fragile-furniture",
    content_ar: `يُعد الزجاج والتحف من أكثر القطع التي تسبب الرعب عند نقل العفش. إذا لم يتم تغليفها بأسس علمية، فنسبة كسرها مرتفعة جداً.

الخطوات العملية لتأمين الزجاج:
- التوسيد السُفلي: ضع طبقة سميكة من الورنيش أو البطانيات الناعمة في قاع الكرتون قبل وضع أي قطعة زجاجية.
- تغليف فردي: لا تضع قطعتين من الزجاج معاً! قم بلف كل كوب أو لوح زجاجي على حدة باستخدام ورق الجرائد أو (البابلز).
- ملء الفراغات: بعد ترتيب الزجاج داخل الصندوق، تأكد من ملء أي فراغات لتجنب ارتطام القطع بعضها ببعض أثناء حركة الشاحنة.
- ملصق "قابل للكسر": هذه الخطوة يغفل عنها الكثيرون! يجب تمييز هذه الصناديق بوضوح حتى يتعامل معها العمال بحذر شديد.

إذا شعرت بصعوبة الأمر، يمكنك طلب خدمة التغليف المخصص (VIP) من مؤسستنا ركن الريان وسنتكفل بالأمر كاملاً.`,
    content_en: `Glass and antiques are the most terrifying pieces to move. If not packed scientifically, the chance of breaking is high.

Practical steps to secure glass:
- Bottom Cushioning: Place a thick layer of soft blankets at the bottom of the box.
- Individual Wrapping: Never put two glass pieces together without wrapping each separately in bubble wrap.
- Fill the Gaps: Make sure to fill any gaps inside the box so items don't collide when the truck moves.
- "Fragile" Labels: Very important step so workers handle the box with extreme care.

If in doubt, request our VIP packing service at Rokn Elryan Refrigerated Transport!`,
    seo_desc_ar: "تعلم الطريقة الصحيحة والمضمونة لتغليف الأكواب واللوحات الزجاجية والتحف الثمينة لتأمينها تماماً أثناء عملية نقل العفش.",
    seo_desc_en: "Learn the guaranteed way to pack cups, glass panels, and precious antiques for safe moving.",
    seo_keywords: "تغليف الزجاج, تغليف العفش, حماية الممتلكات القابلة للكسر",
    image: "/uploads/placeholder3.jpg"
  },
  {
    title_ar: "خطوات تجهيز الأجهزة الكهربائية قبل نقل العفش",
    title_en: "Steps to Prepare Electrical Appliances Before Moving",
    slug: "preparing-appliances-for-moving",
    content_ar: `نقل الأجهزة الكهربائية (كالثلاجات، الغسالات، والشاشات) لا يتم بشكل عشوائي، بل يتطلب تحضيراً مسبقاً لحفظ عمرها الافتراضي.

- الثلاجات: يجب فصل الثلاجة عن الكهرباء وإفراغها كاملاً من الأطعمة قبل موعد النقل بمدة لا تقل عن ٢٤ ساعة! للسماح بتصريف السوائل وذوبان الثلج.
- الغسالات: افصل خراطيم المياه وتأكد من تجفيف الحوض الداخلي تماماً لمنع تسرب الماء على بقية العفش، مع ربط الأسلاك خلف الغسالة.
- شاشات التلفاز المفرطحة: من أخطر الأجهزة. أفضل طريقة لنقلها هي استخدام كرتونها الأصلي المدعم بالفلين، وإذا لم يتوفر، نوفر في شركة ركن الريان فلين خاص وتغليف كرتوني مقوى لحمايتها.

تذكر دائماً ألا تعيد تشغيل الثلاجة في منزلك الجديد إلا بعد مرور ٤ ساعات على الأقل من استقرارها.`,
    content_en: `Moving appliances like fridges, washing machines, and TVs requires prior preparation to maintain their lifespan.

- Fridges: Unplug and empty the fridge at least 24 hours before moving to allow ice to melt.
- Washers: Disconnect water hoses and dry the drum to prevent water leakage.
- Flat TVs: The best way to move them is in their original box. If not available, we at Rokn Elryan provide custom foam and hard carton packing for perfect protection.

Always remember not to turn on your fridge in the new home until 4 hours have passed in an upright position.`,
    seo_desc_ar: "كيفية فك وتجهيز ونقل الثلاجات والغسالات والشاشات الذكية بآمان وبدون تعريضها للأعطال الفنية.",
    seo_desc_en: "How to safely unplug, prepare, and move your refrigerators, washers, and flat-screen TVs.",
    seo_keywords: "نقل ثلاجة, تغليف شاشات, نقل كهربائيات, نقل امن",
    image: "/uploads/placeholder4.jpg"
  },
  {
    title_ar: "أخطاء شائعة يقع فيها الكثيرون أثناء نقل العفش وكيف تتجنبها",
    title_en: "Common Moving Mistakes and How to Avoid Them",
    slug: "common-moving-mistakes-to-avoid",
    content_ar: `الانتقال لمنزل جديد يمكن أن يكون فوضوياً إذا لم يتم التخطيط له بذكاء. في مسيرتنا مع آلاف العملاء في نقل الأثاث، لاحظنا بعض الأخطاء التي تتكرر باستمرار:

الخطأ الأول: تأجيل التغليف لليوم الأخير
ترك كل شيء لآخر لحظة يسبب الإرهاق الشديد ويزيد احتمالية فقدان الأشياء الدقيقة. ابدأ بالترتيب قبل أسبوعين.

الخطأ الثاني: عدم تصنيف الكراتين (Labeling)
أن تصل لمنزلك الجديد ومعك ٢٠ كرتوناً لا تدري أيهم للمطبخ وأيهم لغرفة النوم هو جحيم حقيقي! استخدم قلماً عريضاً واكتب محتوى الصندوق ووجهته.

الخطأ الثالث: الاستعانة بعمالة غير متخصصة من الشارع
استئجار عمالة مجهولة لتوفير التكلفة غالباً ما ينتهي بكسر شاشة غالية أو خدش غرفة نوم فاخرة، مما يجعل التكلفة مضاعفة.

اعتمد على المتخصصين في مؤسسة ركن الريان للحصول على عملية نقل احترافية من الألف للياء!`,
    content_en: `Moving to a new home can be chaotic if not planned smartly. We've noticed repeating mistakes among clients:

Mistake 1: Delaying packing until the last day. This causes extreme stress. Start packing two weeks in advance.
Mistake 2: Not labeling boxes. Arriving with 20 boxes and not knowing what's inside is a nightmare. Use a thick marker.
Mistake 3: Hiring unprofessional street labor. Trying to save money often ends up with broken expensive TVs or scratched furniture.

Rely on the specialists at Rokn Elryan for a fully professional moving process!`,
    seo_desc_ar: "تجنب الأخطاء الكارثية أثناء التجهيز للنقل، من التغليف المتأخر إلى عدم كتاية محتوى الصناديق لتوفير وقتك وجهدك.",
    seo_desc_en: "Avoid disastrous moving mistakes, from late packing to unlabeled boxes, to save your time and effort.",
    seo_keywords: "اخطاء النقل, قبل النقل, ترتيب الكراتين, نقل اثاث منظم",
    image: "/uploads/placeholder1.jpg"
  },
  {
    title_ar: "أهمية خدمة الفك والتركيب من قبل نجار متخصص",
    title_en: "The Importance of Disassembly and Assembly by an Expert Carpenter",
    slug: "importance-of-expert-carpenter-for-moving",
    content_ar: `كثير من العملاء يعتقدون أن عملية النقل تقتصر على "حمل" الأثاث، لكن في الحقيقة أصعب وأهم جزء هو الفك والتركيب.

لماذا تحتاج إلى نجار متخصص لغرف النوم والمطابخ؟
- الحفاظ على المفاصل والأبواب: غرف النوم وخاصة غرف ايكيا الحديثة تحتوي على مسامير ومفاصل خشبية معقدة، الفك العشوائي لها سيجعل الأبواب تعلق أو لا تغلق بعد نقلها.
- ترقيم القطع: النجار المحترف يقوم بترقيم كل لوح خشبي ليعرف مكانه الدقيق عند إعادة التركيب في المنزل الجديد.
- تفادي كسر الرخام: تفكيك تركيبات المطبخ الرخامية يحتاج إلى تقنيات خاصة لمنع شرخ الرخام.

في شركة ركن الريان، لا نوفر لك عمالة عادية، بل نوفر لك مجموعة من أمهر النجارين الذين سيعيدون تركيب غرفتك وكأنها جديدة تماماً.`,
    content_en: `Many think moving is just about "carrying" items, but the hardest and most vital part is assembly and disassembly.

Why do you need an expert carpenter for bedrooms and kitchens?
- Protecting Joints: Modern bedrooms (like IKEA) involve complex wooden joints. Haphazard dismantling will cause doors to sag.
- Piece Numbering: A professional numbers each wooden plank to know its precise place upon reassembly.
- Avoiding Marble Cracks: Kitchen marble dismantling requires precise techniques.

At Rokn Elryan Refrigerated Transport, we provide the most skilled carpenters who will assemble your room exactly like new.`,
    seo_desc_ar: "تعرف على الأهمية القصوى لتوفير نجار محترف عند فك غرف النوم الحديثة والمطابخ لضمان عدم ترخي الأبواب وتلف المفاصل.",
    seo_desc_en: "Learn the supreme importance of hiring a professional carpenter for dismantling modern bedrooms to avoid sagging doors.",
    seo_keywords: "فك وتركيب ايكيا, نجار نقل اثاث, تركيب غرف نوم, نقل عفش مع فك وتركيب",
    image: "/uploads/placeholder2.jpg"
  },
  {
    title_ar: "كيف ترتب منزلك الجديد بسرعة وبدون إرهاق؟",
    title_en: "How to Setup Your New Home Quickly and Without Fatigue",
    slug: "organize-new-home-quickly",
    content_ar: `بعد الانتهاء من النقل ووضع الأثاث، قد يبدو ترتيب المنزل الجديد مهمة شاقة للغاية، لكن يمكنك اختصار الوقت بهذه الحيل:

١. ابدأ بالغرف الحيوية دائماً
قم بتجهيز غرفة النوم أولاً ثم الحمام والمطبخ، لا تشغل نفسك بترتيب الصالون وغرف الضيوف في اليوم الأول! فأنت تحتاج للراحة وتناول الطعام بانتظام أولاً.

٢. استغل صناديق "اليوم الأول"
وهي حقيبة أو صندوق يجب أن تعبئه قبل النقل بملابس نظيفة للعائلة، أدوات استحمام، شواحن الهواتف، وبعض الأطباق البلاستيكية. هذا الصندوق ينقذك في الفوضى.

٣. تفريغ الكراتين تدريجياً
لا تقم بفتح جميع الكراتين في وقت واحد فتصاب بالصدمة. افتح كراتين الغرفة التي تتواجد فيها فقط لكي تحافظ على نظافة المنزل.

تذكر أن خدمات ركن الريان تتضمن وضع كل الأثاث الثقيل في مكانه المطلوب لكي يتبقى عليك فقط ترتيب القطع الخفيفة الممتعة.`,
    content_en: `After moving, setting up the new home might seem daunting, but you can save time with these tricks:

1. Always start with vital rooms: Setup the bedroom, bathroom, and kitchen first. Leave the guest living room for the next day.
2. "First Day" Box: Keep a box packed with fresh clothes, toiletries, phone chargers, and basic plates. This saves you during the initial chaos.
3. Gradual Unpacking: Don't open all boxes at once. Take it one room at a time.

Remember, Rokn Elryan services place all heavy furniture in exact designated spots, leaving only the light, enjoyable arranging to you!`,
    seo_desc_ar: "طرق عبقرية لترتيب منزلك الجديد بعد النقل وفتح الكراتين بدون فوضى للوصول لحالة الاستقرار بأسرع وقت.",
    seo_desc_en: "Genius ways to organize and unpack your new home without chaos for the fastest settlement.",
    seo_keywords: "ترتيب المنزل الجديد, بعد النقل, صندوق اليوم الاول, فتح الكراتين",
    image: "/uploads/placeholder3.jpg"
  },
  {
    title_ar: "أفضل طرق تخزين الأثاث لفترات طويلة لحمايته",
    title_en: "Best Ways to Store Furniture Long-term and Protect It",
    slug: "long-term-furniture-storage-methods",
    content_ar: `إذا كنت ملزماً بالسفر أو الانتقال لمدينة أخرى وتحتاج للحفاظ على أثاثك لفترة تتجاوز الشهر، يجب أن تقوم بتخزينه بأسلوب يحميه من الحشرات والعوامل الجوية.

نصائح لحماية العفش المخزن:
- التنظيف القوي: اغسل الكنب والستائر، وتأكد من جفافها تماماً. أي رطوبة متبقية ستتحول إلى عفن (فطريات) سريعاً!
- تغليف البلاستيك المقوى الاسترتش: لف الكنب بالبلاستيك الشفاف، بينما الأسطح الخشبية تتنفس بشكل أفضل عبر تغليفها ببطانيات قطنية أو فلين لمنع تمدد الخشب.
- الرش الوقائي: رش المستودع أو المكان المخصص بمواد طرد الحشرات قبل التخزين بأسبوع.
- الرفع عن الأرض: استخدام الطبالي الخشبية لرفع العفش بضع سنتيمترات عن الأرض ليمنع وصول الماء إليه في حال التسريبات.

شركة ركن الريان للنقل المبرد تقدم استشارات مستمرة لعملائها لتغليف الأثاث بغرض التخزين العالي الجودة.`,
    content_en: `If you have to travel and store your furniture for over a month, you must store it properly to protect it from bugs and weather.

Tips for protecting stored furniture:
- Deep Cleaning: Wash sofas and curtains, completely drying them. Any remaining moisture turns into mold!
- Stretch Wrap vs Blankets: Wrap sofas in stretch plastic, but let wooden furniture breathe by wrapping it in cotton blankets to prevent wood expansion.
- Pest Control: Spray the storage location a week before keeping items there.
- Elevate: Use wooden pallets to keep furniture off the ground in case of water leaks.

Rokn Elryan Refrigerated Transport offers top-tier packing consultations for long-term storage!`,
    seo_desc_ar: "كيف تقوم بتنظيف وتغليف ورش عفشك بالكامل لحمايته من الحشرات والرطوبة إذا كنت تخطط لتخزينه لفترة طويلة.",
    seo_desc_en: "How to clean, pack, and protect your furniture completely from bugs and humidity if you plan a long-term storage.",
    seo_keywords: "تخزين اثاث, تغليف للتخزين, حماية الأثاث من العفن, مستودع عفش",
    image: "/uploads/placeholder4.jpg"
  },
  {
    title_ar: "نقل الأثاث كبداية جديدة: التجهيز النفسي لرحلة الانتقال الممتعة",
    title_en: "Moving Furniture as a New Beginning: Psychological Preparation",
    slug: "moving-as-a-new-beautiful-beginning",
    content_ar: `يصاحب عملية النقل دائماً شعور بالترقب والتوتر، والانفصال عن الذكريات في المنزل القديم، ولكن يمكن تحويلها إلى رحلة إيجابية وشيقة لك ولأسرتك.

التخلص من الكراكيب هي أفضل بداية! 
لا تأخذ معك الأشياء التي تراكمت في غرف التخزين القديمة (مثل الملابس غير المستخدمة أو الأجهزة المعطلة). اعتبر الانتقال فرصة لتطهير حياتك من الأشياء الزائدة والتبرع للجمعيات الخيرية.

توديع المنزل القديم بشكر:
علمياً، الجلوس لبضع دقائق مع أسرتك في المنزل القديم وشكره على احتضان ذكرياتكم يخفف التوتر النفسي.

اختر شركة نقل توفر لك الهدوء:
الضغوط النفسية تزيد بشكل مضاعف إذا اعتمدت على التعامل اليدوي البطيء في النقل، لذا فإن تكليفك لشركة احترافية (مثل ركن الريان) بالقيام بكل المهام بالنيابة عنك سيجعلك قادراً على الاستمتاع ببدايتك الجديدة في المنزل الجديد بروح عالية جداً وطاقة مشرقة.`,
    content_en: `Moving brings anticipation and stress, breaking away from old memories, but it can be a highly positive journey for you and your family.

Decluttering is the best start!
Do not take items hoarded in your old storage. Consider moving as a chance to clear out your life and donate items to charity.

Saying goodbye beautifully:
Scientifically, sitting with your family for a minute to say a grateful goodbye to the old house relieves mental tension.

Pick a stress-free Moving Company:
Mental strain doubles if you rely on chaotic slow labor. Hiring a professional company (like Rokn Elryan) to handle everything allows you to enjoy your fresh new beginning!`,
    seo_desc_ar: "كيف تتغلب على توتر عملية جمع ونقل الاثاث وجعلها فرصة إيجابية للتخلص من الكراكيب لتبدأ حياة جديدة مريحة.",
    seo_desc_en: "Overcome the stress of packing and moving your furniture and make it a positive chance to declutter and start fresh.",
    seo_keywords: "نقل بدون توتر, التخلص من الكراكيب, التحضير النفسي للنقل",
    image: "/uploads/placeholder1.jpg"
  },
  {
    title_ar: "لماذا نعتبر ركن الريان الخيار الأول لنقل الأثاث في المنطقة الجنوبية؟",
    title_en: "Why Rokn Elryan is the First Choice for Moving in the Southern Region",
    slug: "why-Rokn Elryan-is-the-best-moving-choice",
    content_ar: `على مدى سنوات طويلة، حجزت شركة ركن الريان للنقل المبرد مقعد الريادة في أبها وخميس مشيط، وذلك لم يأتِ من فراغ بل نتيجة التزام وحرفية لا تتزعزع.

ما الذي نقدمه لعملائنا الكرام؟
١. الاحترافية العالية: نحن لا نستخدم عمالة يومية، بل كادراً رسمياً مدرباً بشكل دائم ومتخصص في فنون الفك والتركيب والتغليف المتكامل بالكرتون والنايلون المقاوم للتمزق.
٢. النطاق الشامل: فروعنا التغطية لا تقتصر على أبها فقط، فنحن نصل بكافة دياناتنا المجهزة إلى الرياض، جدة، الدمام، ومكة، عبر رحلات مؤمنة.
٣. رضا العميل: ٩٨٪ من عملائنا يصوتون دائماً برضاهم التام وأصبحوا يعتمدون علينا في جميع التزامهم.

لا تساوم على ممتلكاتك، ركن الريان للنقل المبرد توفر لك أرقى الخدمات بأنسب الأسعار مع ضمان سلامة كل قطعة حتى أصغر الأكواب.`,
    content_en: `For many years, Rokn Elryan Refrigerated Transport has secured the pioneering spot in Abha and Khamis Mushait. This came through unwavering commitment and professionalism.

What do we offer?
1. High Professionalism: We don't use daily labor. We have officially trained, permanent staff specializing in fine assembly and total packing using tear-proof nylon.
2. Comprehensive Scope: We cover not just Abha but all of KSA via secured, scheduled trips to Riyadh, Jeddah, Dammam, and Makkah.
3. Customer Satisfaction: 98% of our clients continuously report immense satisfaction.

Don't compromise on your belongings. Rokn Elryan Refrigerated Transport offers the finest services at the best prices with guaranteed safety for every single item!`,
    seo_desc_ar: "نبذة عن أسباب تصدر مؤسسة ركن الريان لخدمات نقل الأثاث في المنطقة الجنوبية كأفضل فريق فني وأقوى تغليف بسعر تنافسي.",
    seo_desc_en: "Reasons why Rokn Elryan is leading the furniture moving sector in the Southern Region with top tech team and best packing.",
    seo_keywords: "مؤسسة ركن الريان, ركن الريان لنقل الاثاث, افضل شركة بابها, نقل اثاث مضمون",
    image: "/uploads/placeholder2.jpg"
  }
];

async function seed() {
  try {
    await initDB();
    
    console.log('Clearing existing mock articles (if any)...');
    
    let count = 0;
    for (const article of articles) {
      const { title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, seo_keywords } = article;
      
      const checkRes = await pool.query('SELECT id FROM articles WHERE slug = $1', [slug]);
      if (checkRes.rows.length === 0) {
         await pool.query(
           `INSERT INTO articles (title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, seo_keywords, active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
           [title_ar, title_en, slug, content_ar, content_en, image, seo_desc_ar, seo_desc_en, seo_keywords, true]
         );
         count++;
      }
    }
    
    console.log(`✅ Successfully injected ${count} high-quality SEO articles!`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

seed();
