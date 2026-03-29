import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  Package,
  Layers,
  FolderKanban
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const [productCount, brandCount, projectCount, consultations] = await Promise.all([
    prisma.product.count(),
    prisma.brand.count(),
    prisma.project.count(),
    prisma.consultation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4
    })
  ]);

  const totalInquiryValue = consultations.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const formatPrice = (price) => new Intl.NumberFormat('en-IE', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0 
  }).format(price);

  const stats = [
    { label: 'Inquiry Volume', value: formatPrice(totalInquiryValue), icon: DollarSign, trend: 'Active Leads', trendUp: true },
    { label: 'Collection Items', value: productCount.toString(), icon: Package, trend: 'Stable', trendUp: null },
    { label: 'Partner Brands', value: brandCount.toString(), icon: Layers, trend: 'Active', trendUp: null },
    { label: 'Total Inquiries', value: consultations.length.toString(), icon: ShoppingBag, trend: 'Growing', trendUp: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          Good morning, Admin
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-wider font-light">
          Here is what's happening with the Santiago Bros collection today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2 text-primary">
                <stat.icon size={20} />
              </div>
            </div>
            {stat.trend && (
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                {stat.trendUp !== null && (
                  <TrendingUp size={14} className={stat.trendUp ? 'text-emerald-600' : 'text-rose-600'} />
                )}
                <span className={stat.trendUp ? 'text-emerald-600' : 'text-muted-foreground'}>{stat.trend}</span>
                <span className="text-muted-foreground font-light">vs last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="border-b border-border bg-secondary/10 px-6 py-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium">Latest Fulfillment Requests</h3>
            <Link 
              href="/admin/consultations" 
              className="text-xs font-medium text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {consultations.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground italic font-light">No requests logged yet.</div>
            ) : (
              consultations.map((inquiry) => (
                <Link 
                  key={inquiry.id} 
                  href="/admin/consultations"
                  className="flex items-center justify-between px-6 py-4 hover:bg-secondary/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-serif text-xs font-bold text-primary">
                      {inquiry.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{inquiry.customerName}</h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        Requested: {inquiry.items[0]?.name} {inquiry.items.length > 1 ? `+${inquiry.items.length - 1} more` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      inquiry.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                      inquiry.status === 'contacted' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <Clock size={10} /> {inquiry.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Tips or Inventory Alert */}
        <div className="rounded-xl border border-border bg-primary text-primary-foreground p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-2xl font-medium mb-4">Inventory Insight</h3>
            <p className="text-sm font-light leading-relaxed opacity-90">
              The "Outdoor" collection has seen a 25% increase in inquiries since the last showroom update. Consider highlighting new pieces in the featured section.
            </p>
          </div>
          <button className="mt-8 w-full rounded-md bg-white py-2.5 text-xs font-bold text-primary uppercase tracking-widest hover:bg-opacity-95 transition-all">
            Update Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
