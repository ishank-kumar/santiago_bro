'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const mainImage = product.images?.[0];

  return (
    <Card className="group flex flex-col h-full overflow-hidden border-border/40 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Link href={`/products/${product.category}/${product.slug}`} className="flex-grow focus:outline-none">
        <div className="relative aspect-square w-full bg-secondary overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
            style={{ backgroundImage: mainImage ? `url('${mainImage.replace(/['"]/g, '')}')` : undefined }}
          />
          {product.featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-1 tracking-widest rounded shadow-sm">
              Featured
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex flex-col gap-1.5 flex-grow">
          <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground">
            {product.brand}
          </span>
          <h3 className="font-serif text-lg font-medium leading-snug">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-primary mt-auto pt-2">
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-5 pt-0 mt-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0 flex gap-2">
        <Link 
          href={`/products/${product.category}/${product.slug}`}
          className={buttonVariants({ variant: "outline", className: "flex-1 uppercase tracking-wider text-[10px] h-9" })}
        >
          Details
        </Link>
        <button
          onClick={() => addToCart(product)}
          className={buttonVariants({ variant: "default", className: "w-10 h-9 p-0 bg-primary hover:bg-primary/90" })}
          aria-label="Add to cart"
        >
          <ShoppingCart size={16} />
        </button>
      </CardFooter>
    </Card>
  );
}
