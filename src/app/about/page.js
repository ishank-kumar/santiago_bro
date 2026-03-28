import Hero from '@/components/Hero/Hero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: 'About Us | Santiago Bros',
  description: 'The story of Santiago Bros: Mediterranean heritage meets contemporary vision.',
};

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Our Story"
        subtitle="Mediterranean Heritage. Contemporary Vision."
        overlayImage="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1920&h=1080&fit=crop"
      />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <SectionHeading
            title="A Legacy of Design"
            align="center"
          />
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="prose prose-lg prose-zinc font-light leading-relaxed">
              <p>
                Founded in Barcelona in 2005, Santiago Bros began with a simple belief: that the furniture we live with should elevate our daily experience. What started as a small curation of local artisan pieces has grown into a definitive collection of international luxury design.
              </p>
              <p>
                Our founders, Mateo and Julian Santiago, spent their formative years surrounded by the rich architectural heritage of the Mediterranean. They learned early on that true luxury isn't about ostentation, but about the perfection of materials, the precision of proportion, and the honesty of craftsmanship.
              </p>
              <p>
                Today, Santiago Bros partners with the world's most exacting manufacturers, from multi-generational Italian leather workshops to avant-garde Scandinavian studios, bringing an unparalleled selection of design to our discerning clients.
              </p>
            </div>
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&h=1000&fit=crop")' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <SectionHeading
            title="Our Values"
            align="center"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <span className="text-4xl mb-6 text-primary block">✨</span>
                <h3 className="font-serif text-2xl font-medium mb-4">Uncompromising Quality</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  We select pieces not just for their aesthetic appeal, but for their structural integrity and the longevity of their materials. True design must endure.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <span className="text-4xl mb-6 text-primary block">🌿</span>
                <h3 className="font-serif text-2xl font-medium mb-4">Sustainable Luxury</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  We champion brands that respect their environment, preferring sustainable harvesting, ethical labor, and production methods that minimize impact.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <span className="text-4xl mb-6 text-primary block">🤝</span>
                <h3 className="font-serif text-2xl font-medium mb-4">Personal Curation</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Our relationship with clients extends beyond a single purchase. We act as curators, assisting in building a cohesive aesthetic across entire homes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
