import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  ExternalLink,
  ChevronRight,
  Plus,
  Layers,
  FolderKanban,
  MessageSquare
} from 'lucide-react';

import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { auth as clerkAuth } from "@clerk/nextjs/server";

export default async function AdminLayout({ children }) {
  const { userId } = await clerkAuth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Double-check the user's role in the database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (dbUser?.role !== 'ADMIN') {
    redirect('/');
  }
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Consultations', icon: MessageSquare, href: '/admin/consultations' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Brands', icon: Layers, href: '/admin/brands' },
    { name: 'Projects', icon: FolderKanban, href: '/admin/projects' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-border bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-center border-b border-border">
            <Link href="/" className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-semibold">Santiago</span>
              <span className="font-serif text-xl italic text-primary">Bros</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-grow space-y-1 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary"
            >
              <ExternalLink size={14} />
              View Live Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/products/new" 
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Plus size={16} />
              Add Product
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
