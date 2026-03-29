'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { categories } from '@/data/products';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductCard from '@/components/ProductCard/ProductCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ProductPageClient({ params }) {
  const resolvedParams = use(params);
  const { category, slug } = resolvedParams;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  
  const categoryName = categories.find(c => c.id === category)?.name || 'Category';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products and find by slug
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const allProducts = await res.json();
        
        const found = allProducts.find(p => p.slug === slug);
        if (!found) return;
        
        setProduct(found);
        setRelatedProducts(
          allProducts.filter(p => p.category === category && p.id !== found.id).slice(0, 3)
        );
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, slug]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse font-serif">
        <RefreshCw size={40} className="animate-spin" />
        <p className="tracking-widest uppercase text-xs">Loading piece details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-24">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-12">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${category}`}>{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ProductGallery images={product.images} title={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">
              {product.brand}
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium tracking-tight mb-6">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-foreground mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="prose prose-lg prose-zinc font-light leading-relaxed mb-10 text-muted-foreground border-b border-border pb-10">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="flex-1 py-6 text-sm uppercase tracking-widest" onClick={handleAddToCart}>
                Inquire About Piece
              </Button>
            </div>

            {/* Specifications Accordion */}
            <Accordion type="single" collapsible="true" className="w-full">
              <AccordionItem value="dimensions">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Dimensions
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {product.dimensions || "Dimensions vary by modular configuration. Please contact us for specific sizing."}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="materials">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Materials & Finishes
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {product.materials?.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    )) || <li>Premium materials selected by artisan craftsmen.</li>}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-secondary/30 py-24 border-t border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeading title="Complete the Look" align="center" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
