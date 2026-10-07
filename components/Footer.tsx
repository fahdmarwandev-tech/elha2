export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] py-12 text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wider">
        <p>© {new Date().getFullYear()} Dar Monasbat. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
