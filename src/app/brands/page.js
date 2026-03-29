import Hero from '@/components/Hero/Hero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import BrandCard from '@/components/BrandCard/BrandCard';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Our Brands | Santiago Bros',
  description: 'We collaborate with the world\'s most prestigious furniture makers and design houses.',
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <>
      <Hero
        title="Our Brands"
        subtitle="Exclusive collaborations with legendary European design houses"
        overlayImage="https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1920&h=1080&fit=crop"
      />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="A Network of Excellence"
            subtitle="Representing the pinnacle of craftsmanship from Italy, Scandinavia, and beyond"
            align="center"
          />

          <div className="max-w-3xl mx-auto mb-20 text-center prose prose-zinc font-light leading-relaxed">
            <p className="text-muted-foreground text-lg">
              At Santiago Bros, we don't just sell furniture; we curate relationships. Our brand partners are selected through a rigorous process evaluating material sourced, traditional craftsmanship, environmental responsibility, and timeless design vocabulary.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-32 border-t border-border mt-12">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">Become a Partner</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed font-light">
            We are always looking to discover exceptional new artisans and established design houses that align with our vision of Mediterranean luxury.
          </p>
          <Link href="/showroom" className={buttonVariants({ size: "lg", className: "px-10 py-6 uppercase tracking-widest text-sm" })}>
            Contact Our Buyers
          </Link>
        </div>
      </section>
    </>
  );
}
