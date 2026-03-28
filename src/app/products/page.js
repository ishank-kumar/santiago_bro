import Hero from '@/components/Hero/Hero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryCard from '@/components/CategoryCard/CategoryCard';
import ProductCard from '@/components/ProductCard/ProductCard';
import { categories, products } from '@/data/products';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


export const metadata = {
  title: 'Our Collections | Santiago Bros',
  description: 'Explore our eight curated collections of exceptional furniture.',
};

export default function ProductsPage() {
  return (
    <>
      <Hero
        title="Our Products"
        subtitle="Eight curated collections of exceptional furniture"
        overlayImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=1080&fit=crop"
      />

      {/* Categories Grid */}
      <section className="py-24 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Browse by Category"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Highlight */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="The Complete Archive"
            subtitle="Discover our full range of masterfully crafted pieces"
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-16">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className="text-muted-foreground hover:text-foreground hover:bg-secondary cursor-not-allowed pointer-events-none opacity-50" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive className="border-primary text-primary hover:bg-primary/10">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="hover:bg-secondary">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="hover:bg-secondary">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="hover:bg-secondary" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>
    </>
  );
}
