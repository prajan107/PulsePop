import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1F2937] bg-[#0F172A] py-6 text-center text-xs text-[#64748B]">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} PulsePop AI. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#94A3B8] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#94A3B8] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#94A3B8] transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};
