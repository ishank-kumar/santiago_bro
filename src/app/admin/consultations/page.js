'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setConsultations(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Update failed');
      
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`Inquiry status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredInquiries = consultations.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': 
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider"><Clock size={10} /> Pending</span>;
      case 'contacted':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider"><Mail size={10} /> Contacted</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider"><CheckCircle2 size={10} /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 uppercase tracking-wider"><XCircle size={10} /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse font-serif">
        <RefreshCw size={40} className="animate-spin" />
        <p className="tracking-widest uppercase text-xs font-bold">Accessing Archived Inquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight flex items-center gap-3">
            <MessageSquare className="text-primary opacity-80" />
            Client Consultations
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Archiving formal design inquiries and selection details.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-64 rounded-xl border border-border bg-white px-10 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300 shadow-sm"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground hover:bg-secondary transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden transition-all hover:shadow-md duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Request Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Selection Total</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right italic">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground font-light italic">No consultations found matching your search.</td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <React.Fragment key={inquiry.id}>
                    <tr 
                      className={`group hover:bg-secondary/5 transition-all cursor-pointer ${expandedId === inquiry.id ? 'bg-secondary/10' : ''}`}
                      onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{inquiry.customerName}</span>
                          <span className="text-xs text-muted-foreground font-light">{inquiry.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-foreground flex items-center gap-1.5 capitalize">
                            <Calendar size={13} className="opacity-40" />
                            {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-serif text-base font-medium text-foreground">
                          {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(inquiry.totalPrice)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                          {expandedId === inquiry.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Content */}
                    {expandedId === inquiry.id && (
                      <tr className="bg-secondary/5 border-t border-border animate-in slide-in-from-top-2 duration-300">
                        <td colSpan="5" className="px-12 py-8">
                          <div className="grid lg:grid-cols-2 gap-12">
                            {/* Items List */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Selected Pieces</h4>
                              <div className="space-y-3">
                                {inquiry.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-border/50">
                                    <div className="h-12 w-12 rounded bg-secondary/30 overflow-hidden flex-shrink-0">
                                      <img src={item.images?.[0]} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-grow">
                                      <p className="text-sm font-medium">{item.name}</p>
                                      <p className="text-[10px] text-muted-foreground uppercase">{item.brand} | Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-serif">{new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(item.price * item.quantity)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions & Logistics */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Logistics Management</h4>
                              
                              <div className="grid grid-cols-2 gap-3">
                                {['pending', 'contacted', 'completed', 'cancelled'].map((state) => (
                                  <button
                                    key={state}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(inquiry.id, state);
                                    }}
                                    className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                      inquiry.status === state 
                                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                      : 'bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                    }`}
                                  >
                                    {state}
                                  </button>
                                ))}
                              </div>

                              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-3">
                                <p className="text-[11px] leading-relaxed text-muted-foreground italic font-light">
                                  Upon clicking a status, an automated system logs the timestamp. Please ensure the client has been emailed or called before marking as "Contacted".
                                </p>
                                <a 
                                  href={`mailto:${inquiry.customerEmail}`}
                                  className="w-full h-11 bg-white border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                  <Mail size={14} /> Send Master Email
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
