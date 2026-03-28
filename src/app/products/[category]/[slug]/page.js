'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsByCategory, categories } from '@/data/products';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductCard from '@/components/ProductCard/ProductCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
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

// Note: generateStaticParams and generateMetadata would normally be here
// but they must be in a Server Component. Since we need client interactivity (Toast),
// we use 'use client'. In a real Next.js app, you'd separate the interactive parts
// into a child client component and keep the page as a server component.

export default function ProductPageClient({ params }) {
  const resolvedParams = use(params);
  const { category, slug } = resolvedParams;
  
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const categoryName = categories.find(c => c.id === category)?.name || 'Category';
  const relatedProducts = getProductsByCategory(category).filter(p => p.id !== product.id).slice(0, 3);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const handleAddToCart = () => {
    toast.success(`${product.name} added to inquiry list`, {
      description: "You can send all your inquiries from the Showroom page.",
      action: {
        label: "View List",
        onClick: () => console.log("View list clicked")
      }
    });
  };

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
            <Accordion type="single" collapsible className="w-full">
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
              
              <AccordionItem value="colors">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Available Colors
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="flex flex-wrap gap-3 mt-2">
                    {product.colors?.map((col, idx) => (
                      <span key={idx} className="px-4 py-2 bg-secondary text-sm font-medium rounded-md border border-border">
                        {col}
                      </span>
                    ))}
                  </div>
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
