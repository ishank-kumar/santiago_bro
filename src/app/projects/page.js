import Hero from '@/components/Hero/Hero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProjectCard from '@/components/ProjectCard/ProjectCard';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Our Projects | Santiago Bros',
  description: 'A showcase of our finest interior design collaborations.',
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <Hero
        title="Our Projects"
        subtitle="A showcase of our finest interior design collaborations"
        overlayImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=1080&fit=crop"
      />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Designed Environments"
            subtitle="From private villas on the Mediterranean coast to ultra-modern penthouses in London, explore spaces transformed by Santiago Bros."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground border-t border-primary-dark">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto text-center divide-x divide-primary-light">
            <div className="flex flex-col gap-2">
              <span className="font-serif text-5xl md:text-6xl font-medium">18+</span>
              <span className="font-sans text-xs uppercase tracking-widest opacity-80">Years Experience</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-serif text-5xl md:text-6xl font-medium">450</span>
              <span className="font-sans text-xs uppercase tracking-widest opacity-80">Completed Projects</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-serif text-5xl md:text-6xl font-medium">12</span>
              <span className="font-sans text-xs uppercase tracking-widest opacity-80">Global Cities</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-serif text-5xl md:text-6xl font-medium">1</span>
              <span className="font-sans text-xs uppercase tracking-widest opacity-80">Design Standard</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
