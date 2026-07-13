import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3">
      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-zinc-400 font-medium">
        <div className="flex items-center gap-4">
          <span>&copy; {currentYear} TransitOps-odoo-devdaas</span>
          <span className="hidden sm:inline text-gray-300 dark:text-zinc-700">|</span>
          <span className="hidden sm:inline">Version 4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[#714B67] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#714B67] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#714B67] transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};