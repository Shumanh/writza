'use client';

import { Mail, Phone, Github, Twitter, MessageCircle } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center">
        <div className="flex items-center gap-6 sm:gap-8 text-primary/80 order-2 sm:order-1">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=theshumanhere@gmail.com&su=Contact%20from%20OwnTheWeb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5 p-2 sm:p-1 hover:bg-gray-50 rounded-full"
            aria-label="Email Shuman"
            title="Email"
          >
            <Mail className="h-5 w-5 sm:h-5 sm:w-5" />
          </a>
          
          <a
            href="https://wa.me/9746861822"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5 p-2 sm:p-1 hover:bg-gray-50 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <MessageCircle className="h-5 w-5 sm:h-5 sm:w-5" />
          </a>
          <a
            href="https://github.com/Shumanh"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5 p-2 sm:p-1 hover:bg-gray-50 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="h-5 w-5 sm:h-5 sm:w-5" />
          </a>
          <a
            href="https://x.com/asynchron_"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5 p-2 sm:p-1 hover:bg-gray-50 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter/X"
            title="Twitter/X"
          >
            <Twitter className="h-5 w-5 sm:h-5 sm:w-5" />
          </a>
        </div>
        
        <div className="text-xs sm:text-sm text-primary/80 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <span>© {currentYear} OwnTheWeb.</span>
          <span className="hidden sm:inline">All rights reserved.</span>
          <span className="sm:hidden">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


