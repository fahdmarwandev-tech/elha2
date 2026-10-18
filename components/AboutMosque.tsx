"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  MapPin,
  Calendar,
  Users,
  Award,
  BookOpen,
  Sparkles,
  HeartHandshake,
  Compass,
  Building,
  Coffee,
  CheckCircle2,
  Clock,
  Volume2,
} from "lucide-react";

export default function AboutMosque({ id = "about" }: { id?: string }) {
  const stats = [
    { number: "9,171 م²", label: "المساحة الكلية للأرض", sub: "المنطقة السابعة - الموالح الجنوبية" },
    { number: "1,800+", label: "إجمالي سعة المصلين", sub: "الصحن الداخلي والصرح والمظلة" },
    { number: "700 شخص", label: "سعة المجلس العام", sub: "مناسبات وعقد القران" },
    { number: "24 متر", label: "ارتفاع المنارتين", sub: "بإضاءة ونقوش إسلامية شامخة" },
    { number: "6 مداخل", label: "مداخل ومخارج رحبة", sub: "ومواقف تحيط بالجامع من كل جانب" },
    { number: "2011م", label: "سنة الافتتاح الرسمي", sub: "برعاية سماحة الشيخ أحمد الخليلي" },
  ];

  const facilities = [
    {
      title: "الجامع والصحن الداخلي",
      desc: "يتسع لـ 900 مصلي في الصحن الداخلي و300 بالصرح و500 بالمظلة. يتوسطه عمودان يحملان السقف، وثريا كبرى بقطر 3 أمتار، وقبة مركزية بقطر 5 أمتار. جدرانه مزدانة بالرخام العماني المنقوش بالآيات القرآنية، ومحرابه مرصع بماء الذهب والفسيفساء الإسلامية وبوسطه آية الكرسي.",
      tag: "صرح العبادة الرئيسي",
      icon: Landmark,
    },
    {
      title: "مصلى النساء الموسع",
      desc: "أعيدت توسعته عام 2014م ليتكون من 3 قاعات للصلاة (قاعتان أرضيتان وقاعة علوية) تتسع لـ 180 مصلية، وقاعة مخصصة للنساء ذوات الأعذار الشرعية، مع 6 دورات مياه مكيّفة و7 مغاسل للوضوء، وربط مرئي وصوتي مباشر بالمحراب.",
      tag: "خصوصية وراحة",
      icon: Users,
    },
    {
      title: "مبنى المجلس العام",
      desc: "صرح مجتمعي يتسع لنحو 700 شخص بكراسي مريحة. تتوسط صدره خارطة سلطنة عمان وقلاعها وحصونها من مسندم إلى ظفار. يضم مطبخاً كبيراً لخدمات الضيافة والإعاشة وأفران الحلوى العمانية الساخنة، ودور علوي لسكن المعلمين والطلبة. دشّن في 1 مارس 2024م بعقد زواج مبارك.",
      tag: "مناسبات وأفراح وعزاء",
      icon: HeartHandshake,
    },
    {
      title: "مبنى مكتب الإدارة والمراقبة",
      desc: "افتتح في 24 شعبان 1436هـ (يونيو 2015م) لإدارة شؤون الجامع وتوثيق عقود الاستثمار والمحلات التجارية، ومزود بشاشات متطورة تنقل الصوت والصورة من كاميرات المراقبة، وربط إلكتروني كامل بين المحراب ومصلى النساء والمجلس العام.",
      tag: "إدارة متطورة",
      icon: Building,
    },
    {
      title: "مبنى الميضأة ودورات المياه للرجال",
      desc: "مبنى مسقف ومكيّف صُمم بعناية لخدمة جموع المصلين، يحتوي على 22 دورة مياه مجهزة و70 مغسلة للوضوء تحيط بالمبنى لضمان انسيابية وسهولة الحركة، بالإضافة إلى مستودعات المواد الصحية.",
      tag: "خدمات متكاملة",
      icon: Sparkles,
    },
    {
      title: "الأنشطة والبرامج الدينية والعلمية",
      desc: "تقام بالجامع صلوات الجمعة والعيدين وصلاة التهجد في أواخر رمضان، ودروس أسبوعية ومحاضرات وندوات لكبار مشايخ العلم والعلماء على مدار العام، ومركز صيفي سنوي للناشئة لمدة شهر كامل.",
      tag: "منارة العلم والمعرفة",
      icon: BookOpen,
    },
  ];

  const futureProjects = [
    "إنشاء مدرسة القرآن الكريم من دورين (الدور الأرضي للبنات والعلوي للبنين)",
    "إنشاء مكتبة عامة زاخرة بأمهات الكتب ومراجع العلم",
    "إنشاء محلات تجارية إضافية لتعزيز الوقف الخيري",
    "إنشاء شقق سكنية لأئمة الجامع",
    "توسعة الجامع بإنشاء قاعة طعام تحت الأرض ودور أرضي وعلوي فوقها",
  ];

  return (
    <section
      id={id}
      className="relative w-full bg-[#050A14] text-[#FAF7F0] border-t border-[#1E3A63]/60 py-16 sm:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden text-right"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF85]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#122849]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20 relative z-10">
        {/* Header with Fade-In (replays smoothly every time on scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A1628] border border-[#1E3A63] text-[#D4AF85] text-xs font-bold shadow-sm">
            <Compass className="w-4 h-4 text-[#D4AF85]" />
            <span>مسيرة البناء والتعمير</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent tracking-tight leading-tight">
            عن جامع الحق وصرحه المبارك
          </h2>

          <p className="text-sm sm:text-base text-[#8EA3BF] leading-relaxed">
            صرح إيماني ومنارة مجتمعية في قلب الموالح الجنوبية بولاية السيب، يجسد أصالة العمارة العمانية
            الإسلامية والهمة الصادقة لأهل البر والإحسان.
          </p>
        </motion.div>

        {/* Holy Quran & Hadith Card (Scroll Fade-In) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#D4AF85]/40 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden"
        >
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#D4AF85]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 text-center max-w-4xl mx-auto">
            <span className="text-xs font-bold text-[#D4AF85] block tracking-widest font-mono">
              بسم الله الرحمن الرحيم
            </span>

            {/* Quran Verse */}
            <blockquote className="font-aref text-lg sm:text-2xl text-[#FAF7F0] leading-loose drop-shadow-sm px-2">
              (( إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ
              الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ ۖ فَعَسَىٰ أُولَٰئِكَ أَن يَكُونُوا
              مِنَ الْمُهْتَدِينَ ))
            </blockquote>

            {/* Hadiths */}
            <div className="pt-4 border-t border-[#1E3A63]/60 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-[#8EA3BF] leading-relaxed">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF85]" />
                قال رسول الله ﷺ: <strong className="text-[#FAF7F0]">«أحبُّ البلاَدِ إلى الله مساجدها»</strong>
              </span>
              <span className="hidden sm:inline text-[#1E3A63]">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF85]" />
                وقال ﷺ: <strong className="text-[#FAF7F0]">«المسجد بيت كل تقي»</strong>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid with Fade-In (replays smoothly every time on scroll) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 hover:border-[#D4AF85] rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition group shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,133,0.25)]"
            >
              <div className="text-2xl sm:text-4xl font-black font-aref text-[#FFF2D2] drop-shadow-[0_0_15px_rgba(212,175,133,0.5)] group-hover:scale-105 transition-transform mb-1">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#FAF7F0] mb-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] sm:text-xs text-[#8EA3BF]">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* History and Location Story (Fade-In) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Story Narrative */}
          <div className="lg:col-span-7 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#D4AF85] font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#D4AF85]" />
              <span>فكرة التأسيس والنشأة المباركة</span>
            </div>

            <h3 className="text-2xl font-bold font-aref text-[#FAF7F0] leading-snug">
              من الحاجة المجتمعية إلى صرح معماري رائد
            </h3>

            <p className="text-xs sm:text-sm text-[#FAF7F0]/90 leading-relaxed">
              مع التزايد المتسارع في نمو الكثافة السكانية بمنطقة الموالح الجنوبية، ولتغطية بعد المسافة بين المساجد
              القائمة حينها، انطلقت فكرة تأسيس جامع يتسع للأعداد المتزايدة من المصلين، برغبة كريمة من أهالي المنطقة
              ليكون مشروعاً جامعاً يضم كافة المرافق الحيوية التي يحتاج إليها المجتمع.
            </p>

            <p className="text-xs sm:text-sm text-[#FAF7F0]/90 leading-relaxed">
              بدأ التخطيط للجامع عام 2002م، وانطلق العمل الفعلي في 2004م، ليتوج هذا العطاء بالإنجاز والافتتاح الرسمي
              في <strong>24 شعبان 1432هـ (الموافق 27 يونيو 2011م)</strong> تحت رعاية كريمة من{" "}
              <strong className="text-[#D4AF85]">سماحة الشيخ أحمد بن حمد الخليلي - المفتي العام لسلطنة عمان</strong>.
            </p>

            <div className="pt-3 border-t border-[#1E3A63]/60 flex flex-wrap gap-2 text-[11px] text-[#D4AF85] font-semibold">
              <span className="bg-[#050A14] px-3 py-1 rounded-full border border-[#1E3A63]">
                • أرض وقفية لوزارة الأوقاف والشؤون الدينية
              </span>
              <span className="bg-[#050A14] px-3 py-1 rounded-full border border-[#1E3A63]">
                • بني بالجهود الذاتية وأصحاب الأيادي البيضاء
              </span>
            </div>
          </div>

          {/* Location & Advantages Box */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#D4AF85] font-bold text-xs">
              <MapPin className="w-4 h-4 text-[#D4AF85]" />
              <span>مميزات موقع الجامع الاستراتيجي</span>
            </div>

            <h3 className="text-xl font-bold font-aref text-[#FAF7F0]">
              في قلب الموالح وعلى شارع الجسر المزدوج
            </h3>

            <ul className="space-y-2.5 text-xs text-[#FAF7F0]/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF85] shrink-0 mt-0.5" />
                <span>يقع بالمنطقة السابعة – الموالح الجنوبية – ولاية السيب، على الشارع العام المزدوج الرابط لمناطق السيب.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF85] shrink-0 mt-0.5" />
                <span>سهولة فائقة في الدخول والخروج مع توفر 6 مداخل ومخارج للمصلين من كافة الجهات.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF85] shrink-0 mt-0.5" />
                <span>مواقف سيارات فسيحة تحيط بأرض الجامع من كل الجوانب لاستيعاب كبار الشخصيات وجموع المصلين.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF85] shrink-0 mt-0.5" />
                <span>مرور <strong>ممشى اليوبيل الذهبي</strong> التابع لبلدية مسقط أمام الجامع، مما أضفى عليه رونقاً وبعداً حيوياً بالغ الأهمية.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Comprehensive Facilities Section (Fade-In on Scroll) */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-right"
          >
            <span className="text-xs font-bold text-[#D4AF85] flex items-center gap-1.5 mb-1">
              <Building className="w-4 h-4 text-[#D4AF85]" />
              <span>مرافق متكاملة تخدم رواد الجامع والمجتمع</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent">
              مكونات ومراحل إنجاز مرافق جامع الحق
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <motion.div
                  key={fac.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 hover:border-[#D4AF85] rounded-3xl p-6 flex flex-col justify-between group transition shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,133,0.2)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#050A14] border border-[#1E3A63] flex items-center justify-center text-[#D4AF85] group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-[#D4AF85]" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#050A14] text-[#D4AF85] border border-[#1E3A63]">
                        {fac.tag}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold font-aref text-[#FAF7F0] group-hover:text-[#FFF2D2] transition-colors mb-2.5">
                      {fac.title}
                    </h4>

                    <p className="text-xs text-[#8EA3BF] leading-relaxed mb-4">
                      {fac.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1E3A63]/60 flex items-center gap-1.5 text-[11px] text-[#D4AF85] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF85]" />
                    <span>مجهز وفق أعلى المعايير المعمارية</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future Projects Banner (Scroll Fade-In) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-10 shadow-xl"
        >
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#050A14] text-[#D4AF85] border border-[#1E3A63] inline-block">
              الرؤية المستقبلية
            </span>

            <h3 className="text-2xl sm:text-3xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent">
              مشاريع التوسعة والإنشاءات المستقبلية
            </h3>

            <p className="text-xs sm:text-sm text-[#8EA3BF] leading-relaxed">
              بإذن الله وتوفيقه، وعند توفر السيولة المالية والمساهمات الكريمة، تم التخطيط لاستكمال مسيرة البناء بمشاريع
              تخدم أجيال الحاضر والمستقبل:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {futureProjects.map((proj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#FAF7F0]">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#C59B63] to-[#D4AF85] text-[#050A14] border border-[#D4AF85] flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    {i + 1}
                  </span>
                  <span>{proj}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conclusion Callout (Scroll Fade-In) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3 pt-6 border-t border-[#1E3A63]/60"
        >
          <p className="text-xs sm:text-sm text-[#8EA3BF] leading-relaxed">
            «إن هذا المشروع الكبير الذي يحتوي على العديد من المرافق الحيوية قد تم بناؤه بالجهود الذاتية من أموال أصحاب الأيادي
            البيضاء الناصعة، ليكون مركزاً علمياً يشع نوره كل أرجاء المعمورة... نسأل الله أن يتقبل من كل من ساهم وقام وأشرف ونفذ.»
          </p>
          <span className="block text-[#D4AF85] font-aref text-lg font-bold">
            هذا وبالله التوفيق
          </span>
        </motion.div>
      </div>
    </section>
  );
}
