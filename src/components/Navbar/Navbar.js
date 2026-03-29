'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/data/products';
import { buttonVariants } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/Cart/CartDrawer';
import { 
  SignInButton, 
  UserButton, 
  useUser
} from '@clerk/nextjs';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Menu, X, ShoppingBag, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isLoaded } = useUser();  const isAdmin = user?.publicMetadata?.role === 'admin';

  const userId = user?.id;
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  // Hide Navbar on Admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1.5 z-[51]">
            <span className="font-serif text-2xl font-semibold text-foreground tracking-wide">Santiago</span>
            <span className="font-serif text-2xl font-normal text-primary italic">Bros</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/about">About</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="uppercase tracking-widest text-sm font-medium">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 w-[600px] p-6 gap-4">
                      <div className="col-span-4 flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="font-serif text-lg font-medium">Our Collections</h3>
                        <Link href="/products" className="text-sm font-medium text-primary hover:text-primary/80 uppercase tracking-wider">
                          View All &rarr;
                        </Link>
                      </div>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products/${cat.id}`}
                          className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-secondary/50 transition-colors"
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <span className="text-xl">{getCategoryIcon(cat.id)}</span>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/brands">Our Brands</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/projects">Projects</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/showroom">Showroom</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Cart Trigger */}
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Admin Display */}
            <div className="hidden lg:flex items-center gap-4 border-l border-border pl-6">
              {userId ? (
                <>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Admin Dashboard"
                    >
                      <LayoutDashboard size={20} strokeWidth={1.5} />
                    </Link>
                  )}
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors">
                    Login
                  </button>
                </SignInButton>
              )}
              <Link href="/showroom" className={buttonVariants({ variant: "default", size: "sm", className: "h-9 px-5" })}>
                Book Appointment
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col justify-center items-center transition-all duration-300 ${
            mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col gap-8 text-center px-4">
            <Link href="/about" className="font-serif text-3xl font-medium tracking-wide">About</Link>
            <Link href="/products" className="font-serif text-3xl font-medium tracking-wide">Products</Link>
            <Link href="/brands" className="font-serif text-3xl font-medium tracking-wide">Our Brands</Link>
            <Link href="/projects" className="font-serif text-3xl font-medium tracking-wide">Projects</Link>
            <Link href="/showroom" className="font-serif text-3xl font-medium tracking-wide">Showroom</Link>
            <div className="mt-8 flex flex-col gap-4">
              {userId ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="font-medium text-primary text-xl uppercase tracking-widest">Admin Dashboard</Link>
                  )}
                  <div className="flex justify-center">
                    <UserButton afterSignOutUrl="/" showName />
                  </div>
                </>
              ) : (
                 <SignInButton mode="modal">
                  <button className="text-xl font-medium uppercase tracking-widest">
                    Login
                  </button>
                </SignInButton>
              )}
              <Link href="/showroom" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
}

function getCategoryIcon(id) {
  const icons = {
    outdoor: '🌿',
    sofas: '🛋️',
    armchair: '💺',
    tables: '🪑',
    chairs: '🪜',
    bedroom: '🛏️',
    cabinets: '🗄️',
    lighting: '💡',
  };
  return icons[id] || '✦';
}
