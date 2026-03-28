'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function Hero({ title, subtitle, ctaText, ctaLink, overlayImage }) {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute -inset-[5%] w-[110%] h-[110%] bg-secondary bg-cover bg-center animate-pulse"
          style={{ 
            backgroundImage: overlayImage ? `url(${overlayImage})` : undefined,
            animation: 'kenBurns 20s ease-in-out infinite alternate' 
          }}
        />
        {/* Light theme gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-white/90" />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-4 lg:px-8 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] text-foreground mb-6 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Link href={ctaLink} className={buttonVariants({ size: "lg", className: "h-14 px-10 text-sm tracking-widest uppercase" })}>
            {ctaText}
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-primary/80 to-transparent animate-bounce" />
      </div>

      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
