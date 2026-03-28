import { Card, CardContent } from "@/components/ui/card";

export default function BrandCard({ brand }) {
  return (
    <Card className="group h-40 flex flex-col items-center justify-center p-6 border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card focus-within:ring-2 focus-within:ring-ring overflow-hidden">
      <div className="mb-4 text-3xl opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 text-foreground">
        {brand.logo}
      </div>
      <h3 className="font-serif text-lg font-medium tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">
        {brand.name}
      </h3>
    </Card>
  );
}
