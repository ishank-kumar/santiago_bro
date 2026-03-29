'use client';

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useUser } from "@clerk/nextjs";
import { Trash, ShoppingBag, X, ArrowRight, RefreshCw, Minus, Plus } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CartDrawer({ open, setOpen }) {
  const { cart, removeFromCart, updateQuantity, updateStatus, cartTotal, cartCount, clearCart } = useCart();
  const { user, isSignedIn } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const handleConsultationRequest = async () => {
    if (!isSignedIn) {
      toast.error('Please log in to request a consultation.');
      return;
    }

    if (cart.length === 0) return;

    setIsCheckingOut(true);

    try {
      const payload = {
        cart: cart,
        customerName: user.fullName || user.firstName || 'Valued Client',
        customerEmail: user.primaryEmailAddress?.emailAddress
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      toast.success('Consultation Requested', {
        description: 'Your formal invoice has been sent to your email.'
      });
      
      clearCart();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to process request', {
        description: error.message
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col h-full border-l border-border shadow-2xl">
        <SheetHeader className="p-6 border-b border-border bg-secondary/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl font-medium flex items-center gap-2">
              <ShoppingBag size={22} className="text-primary" />
              Your Selection
            </SheetTitle>
          </div>
          <SheetDescription className="text-sm font-light uppercase tracking-widest text-muted-foreground mt-1">
            {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Basket
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/30">
                <ShoppingBag size={32} />
              </div>
              <p className="text-muted-foreground font-light italic">Your basket is currently empty.</p>
              <button 
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-primary hover:underline uppercase tracking-wider"
              >
                Browse Our Collections
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="group relative flex gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary/50">
                  <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                </div>
                
                <div className="flex flex-grow flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-base font-medium text-foreground">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-light uppercase tracking-tight">{item.brand}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-primary capitalize font-medium w-fit">
                        {item.status.replace('-', ' ')}
                      </span>
                      <div className="flex items-center border border-border rounded-md overflow-hidden h-8 w-24">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="flex-1 flex items-center justify-center text-xs font-medium border-x border-border">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-muted-foreground">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <SheetFooter className="p-6 border-t border-border bg-white mt-auto block">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-light uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="text-xl font-medium text-foreground">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                Taxes and shipping calculated at inquiry. All prices are indicative of the current collection.
              </p>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button 
                  onClick={handleConsultationRequest}
                  disabled={isCheckingOut}
                  className="w-full bg-primary text-primary-foreground py-3.5 px-4 rounded-md font-semibold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <><RefreshCw size={16} className="animate-spin" /> Generating Invoice...</>
                  ) : (
                    <>Request Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
                <button  
                  onClick={() => setOpen(false)}
                  className="w-full bg-transparent text-muted-foreground py-2 text-xs font-medium hover:text-foreground transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
