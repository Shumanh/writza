import { Mail, Phone, Github, Twitter, MessageCircle } from "lucide-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        <div className="text-sm text-primary/80 flex items-center gap-2">
          <span>© {currentYear}</span>
          <span>OwnTheWeb. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5 text-primary/80">
          <a
            href="mailto:theshumanhere@gmail.com"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5"
            aria-label="Email Shuman"
            title="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
          
          <a
            href="https://wa.me/9746861822"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/Shumanh"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/asynchron_"
            className="hover:text-primary transition-all duration-400 hover:-translate-y-0.5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter/X"
            title="Twitter/X"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}


