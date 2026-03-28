import Link from 'next/link';
import { categories } from '@/data/products';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="font-serif text-3xl font-semibold text-foreground tracking-wide">Santiago</span>
              <span className="font-serif text-3xl font-normal text-primary italic">Bros</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Curating luxury furniture and interior design since 2005. 
              Mediterranean heritage meets contemporary elegance.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-1 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" aria-label="Pinterest" className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-1 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 21c1-3 2-6 3-8 .5-1 1-2 2-2s2 1 2 2c0 2-1 4-1 5s1 2 3 1"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-1 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 11v6M7 7v.01M11 11v6m0-3c0-2 1-3 3-3s3 1 3 3v3"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-foreground mb-6">Navigation</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/brands" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Brands</Link></li>
              <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/showroom" className="text-sm text-muted-foreground hover:text-primary transition-colors">Showroom</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-foreground mb-6">Categories</h4>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products/${cat.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-foreground mb-6">Contact</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Showroom</span>
                <span className="text-sm text-muted-foreground">Passeig de Gràcia 55, Barcelona</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Phone</span>
                <a href="tel:+34934567890" className="text-sm text-foreground hover:text-primary transition-colors">+34 93 456 78 90</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Email</span>
                <a href="mailto:info@santiagobros.com" className="text-sm text-foreground hover:text-primary transition-colors">info@santiagobros.com</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Hours</span>
                <span className="text-sm text-muted-foreground">Mon–Sat: 10:00 – 20:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-6 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2024 Santiago Bros. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
