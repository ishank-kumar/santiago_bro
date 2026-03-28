import Link from 'next/link';

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects#${project.id}`} className="group block h-[450px] relative overflow-hidden rounded-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
        style={{ backgroundImage: project.image ? `url(${project.image})` : undefined }}
      />
      
      {/* Dark gradient overlay for text legibility, making text stand out on image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
      
      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-xs font-semibold text-primary tracking-widest mb-3 uppercase">
          {project.year}
        </span>
        <h3 className="font-serif text-2xl font-medium text-white mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-300 font-light tracking-wide flex items-center gap-2">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {project.location}
        </p>
        
        {/* Hidden on default, sliding up on hover */}
        <div className="mt-4 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex flex-wrap gap-2">
          {project.categories.map((cat, idx) => (
            <span key={idx} className="text-[10px] uppercase tracking-widest text-zinc-400 border border-zinc-600 rounded px-2 py-1">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
