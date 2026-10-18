export default function Footer() {
  return (
    <footer className="border-t border-[#22334A] bg-[#080D18] py-12 text-[#8A9BB3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wider">
        <p>© {new Date().getFullYear()} جامع الحق • المجلس العام. جميع الحقوق محفوظة.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#D4AF85] transition-colors">سياسة الخصوصية</a>
          <a href="#" className="hover:text-[#D4AF85] transition-colors">الشروط والأحكام</a>
        </div>
      </div>
    </footer>
  );
}
