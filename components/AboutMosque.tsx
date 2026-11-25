"use client";

import React, { useState, useEffect } from "react";
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
  Maximize2,
  X,
} from "lucide-react";

export default function AboutMosque({ id = "about" }: { id?: string }) {
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

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
      image: "/facilities/prayer-hall.jpg?v=2",
      mobileImage: "/facilities/portrait/prayer-hall.jpg?v=2",
    },
    {
      title: "مصلى النساء الموسع",
      desc: "أعيدت توسعته عام 2014م ليتكون من 3 قاعات للصلاة (قاعتان أرضيتان وقاعة علوية) تتسع لـ 180 مصلية، وقاعة مخصصة للنساء ذوات الأعذار الشرعية، مع 6 دورات مياه مكيّفة و7 مغاسل للوضوء، وربط مرئي وصوتي مباشر بالمحراب.",
      tag: "خصوصية وراحة",
      icon: Users,
      image: "/facilities/facade-canopy.jpg?v=2",
      mobileImage: "/facilities/portrait/women.jpg?v=2",
    },
    {
      title: "مبنى المجلس العام",
      desc: "صرح مجتمعي يتسع لنحو 700 شخص بكراسي مريحة. تتوسط صدره خارطة سلطنة عمان وقلاعها وحصونها التاريخية من مسندم إلى ظفار، مع دور علوي مخصص لسكن المعلمين والطلبة. دشّن في 1 مارس 2024م بعقد زواج مبارك ليكون مقصداً جامعاً لأفراح ومناسبات المجتمع.",
      tag: "مناسبات وأفراح وعزاء",
      icon: HeartHandshake,
      image: "/facilities/majlis.jpg?v=2",
      mobileImage: "/facilities/portrait/majlis.jpg?v=2",
    },
    {
      title: "مطبخ المجلس العام والضيافة",
      desc: "مطبخ واسع ومتكامل صُمم لخدمة كافة مناسبات المجلس العام، مجهز بأفران الحلوى العمانية الساخنة وأحدث أدوات الطهي والإعاشة لتقديم وجبات الضيافة وإكرام الحضور وضيوف الجامع في كافة الفعاليات والمناسبات.",
      tag: "خدمات الضيافة والإعاشة",
      icon: Coffee,
      image: "/facilities/kitchen.jpg?v=2",
      mobileImage: "/facilities/portrait/kitchen.jpg?v=2",
    },
    {
      title: "مبنى مكتب الإدارة والمراقبة",
      desc: "افتتح في 24 شعبان 1436هـ (يونيو 2015م) لإدارة شؤون الجامع وتوثيق عقود الاستثمار والمحلات التجارية، ومزود بشاشات متطورة تنقل الصوت والصورة من كاميرات المراقبة، وربط إلكتروني كامل بين المحراب ومصلى النساء والمجلس العام.",
      tag: "إدارة متطورة",
      icon: Building,
      image: "/facilities/courtyard.jpg?v=2",
      mobileImage: "/facilities/portrait/admin.jpg?v=2",
      textPosition: "bottom" as const,
    },
    {
      title: "مبنى الميضأة ودورات المياه للرجال",
      desc: "مبنى مسقف ومكيّف صُمم بعناية لخدمة جموع المصلين، يحتوي على 22 دورة مياه مجهزة و70 مغسلة للوضوء تحيط بالمبنى لضمان انسيابية وسهولة الحركة، بالإضافة إلى مستودعات المواد الصحية.",
      tag: "خدمات متكاملة",
      icon: Sparkles,
      image: "/facilities/ablution.jpg?v=2",
      mobileImage: "/facilities/portrait/ablution.jpg?v=2",
    },
    {
      title: "الأنشطة والبرامج الدينية والعلمية",
      desc: "تقام بالجامع صلوات الجمعة والعيدين وصلاة التهجد في أواخر رمضان، ودروس أسبوعية ومحاضرات وندوات لكبار مشايخ العلم والعلماء على مدار العام، ومركز صيفي سنوي للناشئة لمدة شهر كامل.",
      tag: "منارة العلم والمعرفة",
      icon: BookOpen,
      image: "/facilities/night-courtyard.jpg?v=2",
      mobileImage: "/facilities/portrait/sunset-courtyard.jpg?v=2",
      textPosition: "bottom" as const,
    },
  ];

  // Track the active visible slide to trigger smooth fade-in both when scrolling DOWN and scrolling UP
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      const vh = window.innerHeight;
      // Use mid-screen threshold so state flips cleanly without jittering at the top edge
      const threshold = vh * 0.55;

      let current = 0;
      for (let i = 0; i < facilities.length; i++) {
        const el = document.getElementById(`${id}-facility-${i + 1}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Skip hidden instance (e.g. mobile view when on laptop, or desktop view when on mobile)
        if (rect.height === 0 || rect.width === 0) continue;
        if (rect.top <= threshold) {
          current = i;
        }
      }

      setActiveSlideIndex(current);
    };

    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [facilities.length, id]);

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
      className="relative w-full bg-[#050A14] text-[#FAF7F0] border-t border-[#1E3A63]/60 overflow-visible text-right scroll-mt-4 sm:scroll-mt-8"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF85]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#122849]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Narrative & Stats Container (Constrained width) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 sm:pt-24 pb-14 sm:pb-20 space-y-16 sm:space-y-20 relative z-10">
        {/* Header with Smooth Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4 max-w-3xl mx-auto will-change-[opacity,transform]"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A1628] border border-[#1E3A63] text-[#D4AF85] text-xs font-bold shadow-sm">
            <Compass className="w-4 h-4 text-[#D4AF85]" />
            <span>مسيرة البناء والتعمير</span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-5xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block px-3 pt-1 pb-4 leading-[1.45]">
              عن جامع الحق وصرحه المبارك
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#8EA3BF] leading-relaxed">
            صرح إيماني ومنارة مجتمعية في قلب الموالح الجنوبية بولاية السيب، يجسد أصالة العمارة العمانية
            الإسلامية والهمة الصادقة لأهل البر والإحسان.
          </p>
        </motion.div>

        {/* Holy Quran & Hadith Card (Scroll Fade-In) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#D4AF85]/40 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden will-change-[opacity,transform]"
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

        {/* Stats Grid with Smooth Fade-In */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.65, delay: (i % 2) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 hover:border-[#D4AF85] rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition group shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,133,0.25)] will-change-[opacity,transform]"
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
        </div>

        {/* History and Location Story (Individual Smooth Fade-In per card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Story Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg will-change-[opacity,transform]"
          >
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
          </motion.div>

          {/* Location & Advantages Box */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg will-change-[opacity,transform]"
          >
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
          </motion.div>
        </div>

        {/* Facilities Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-right pt-6 border-t border-[#1E3A63]/60 will-change-[opacity,transform]"
        >
          <span className="text-xs font-bold text-[#D4AF85] flex items-center gap-1.5 mb-1">
            <Building className="w-4 h-4 text-[#D4AF85]" />
            <span>مرافق متكاملة تخدم رواد الجامع والمجتمع</span>
          </span>
          <div>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block pt-1 pb-2 leading-[1.45]">
              مكونات ومراحل إنجاز مرافق جامع الحق
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#8EA3BF] leading-relaxed">
            انزل للأسفل لاستكشاف مرافق وصروح الجامع المبارك
          </p>
        </motion.div>
      </div>

      {/* Sticky Stacking Deck of Full-Width Edge-to-Edge Sections (like Dialed reference, NOT cards) */}
      <div className="relative w-full">
        {facilities.map((fac, idx) => {
          const isActive = activeSlideIndex === idx;
          return (
            <div
              key={fac.title}
              id={`${id}-facility-${idx + 1}`}
              style={{
                position: "sticky",
                top: 0,
                zIndex: idx + 10,
              }}
              className={`relative w-full h-screen min-h-[620px] overflow-hidden border-t border-[#D4AF85]/35 shadow-[0_-30px_70px_rgba(0,0,0,0.95)] ${
                idx !== facilities.length - 1 ? "mb-[35vh] sm:mb-[45vh]" : "mb-0"
              } will-change-transform bg-black flex flex-col justify-between`}
            >
              {/* Full Bleed Background Image - Responsive: Portrait on Mobile (< 768px), Landscape on Desktop */}
              <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
                <source media="(max-width: 768px)" srcSet={fac.mobileImage || fac.image} />
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 pointer-events-none select-none"
                />
              </picture>

              {/* Subtle Bottom-Only Neutral Scrim - NO side gradient on left or right, NO blue tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

              {/* Clean Top Spacer without any badge or icons */}
              <div className="w-full h-12 sm:h-20 pointer-events-none" />

              {/* Main Text Content - Fades in smoothly both when scrolling DOWN and UP with readable typography */}
              <div
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
                  transition:
                    "opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 space-y-3 sm:space-y-4 text-right will-change-[opacity,transform] ${
                  fac.textPosition === "bottom"
                    ? "my-auto translate-y-12 sm:translate-y-8"
                    : "my-auto"
                }`}
              >
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFE2B0] tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                  <Sparkles className="w-4 h-4 text-[#D4AF85] drop-shadow-[0_2px_6px_rgba(0,0,0,1)]" />
                  <span className="bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    صرح جامع الحق المعماري
                  </span>
                </div>

                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-aref text-[#FFF7E6] drop-shadow-[0_3px_18px_rgba(0,0,0,1)] transition-colors leading-[1.3] text-stroke-thin">
                  {fac.title}
                </h4>

                <p className="max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl text-[#FFFFFF] leading-loose drop-shadow-[0_2px_12px_rgba(0,0,0,1)] font-medium">
                  {fac.desc}
                </p>
              </div>

              {/* Bottom Features Strip */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-8 sm:pb-12 border-t border-white/15 flex flex-wrap items-center justify-start gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-[#FFE8B8] font-bold">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF85]" />
                  <span>مجهز وفق أعلى المعايير المعمارية والخدمية</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Future Projects & Conclusion Container (Constrained width) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-28 pb-16 sm:pb-24 space-y-16 sm:space-y-20 relative z-10 text-right">
        {/* Future Projects Banner (Scroll Fade-In) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-b from-[#0D1A2D] to-[#070F1E] border border-[#1E3A63]/80 rounded-3xl p-6 sm:p-10 shadow-xl will-change-[opacity,transform]"
        >
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#050A14] text-[#D4AF85] border border-[#1E3A63] inline-block">
              الرؤية المستقبلية
            </span>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black font-aref bg-gradient-to-l from-[#C59B63] via-[#FFE8B8] to-[#D4AF85] bg-clip-text text-transparent inline-block px-3 pt-1 pb-3 leading-[1.45]">
                مشاريع التوسعة والإنشاءات المستقبلية
              </h3>
            </div>

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
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-3 pt-6 border-t border-[#1E3A63]/60 will-change-[opacity,transform]"
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

      {/* Lightbox Modal for Facility Photos */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#0A1628] border border-[#D4AF85]/50 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col items-center"
          >
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedLightboxImage(null)}
                className="p-2.5 rounded-full bg-black/70 text-white hover:text-[#FFE8B8] hover:bg-black/90 transition border border-white/20 cursor-pointer shadow-lg"
                title="إغلاق المعاينة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedLightboxImage}
              alt="معاينة المرفق"
              className="w-full h-auto max-h-[85vh] object-contain select-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}
