import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

export default function ProductCard({ product }) {
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
            style={{ backgroundImage: mainImage ? `url(${mainImage})` : undefined }}
          />
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
      <CardFooter className="p-5 pt-0 mt-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0">
        <Link 
          href={`/products/${product.category}/${product.slug}`}
          className={buttonVariants({ variant: "outline", className: "w-full uppercase tracking-wider text-xs" })}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
