import Hero from '@/components/Hero/Hero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryCard from '@/components/CategoryCard/CategoryCard';
import ProductCard from '@/components/ProductCard/ProductCard';
import BrandCard from '@/components/BrandCard/BrandCard';
import { categories, getFeaturedProducts } from '@/data/products';
import { brands } from '@/data/brands';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <Hero
        title="Where Heritage Meets Modern Living"
        subtitle="Curated luxury furniture and interior design from the Mediterranean. Each piece tells a story of craftsmanship and timeless elegance."
        ctaText="Explore Collections"
        ctaLink="/products"
        overlayImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop"
      />

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Our Collections"
            subtitle="Explore carefully curated categories of luxury furniture and design"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Featured Pieces"
            subtitle="Iconic designs selected by our interior experts"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/products" className={buttonVariants({ variant: "outline", size: "lg", className: "px-10 uppercase tracking-widest text-sm" })}>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Design Philosphy Highlight */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl text-center">
          <span className="text-sm font-semibold tracking-widest uppercase mb-6 block">Our Philosophy</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-8">
            Creating spaces that breathe with Mediterranean soul and modern sophistication.
          </h2>
          <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg", className: "px-10 uppercase tracking-widest text-sm" })}>
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Partner Brands"
            subtitle="We collaborate with the world's most prestigious furniture makers"
            align="center"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.slice(0, 4).map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/brands" className="text-sm font-semibold uppercase tracking-widest text-primary hover:text-foreground transition-colors group inline-flex items-center gap-2">
              Discover All Brands
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
