'use client';

import { useState } from 'react';
import Hero from '@/components/Hero/Hero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ShowroomPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
    toast.success("Appointment Request Sent", {
      description: "Our design team will contact you shortly to confirm your visit.",
    });
    
    setFormData({ name: '', email: '', phone: '', date: '', message: '' });
  };

  return (
    <>
      <Hero
        title="Our Showroom"
        subtitle="Experience our collections in an inspiring setting"
        overlayImage="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&h=1080&fit=crop"
      />

      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Visit Us"
            align="left"
          />

          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Contact Details */}
            <div className="flex flex-col gap-10">
              <div className="prose prose-zinc leading-relaxed text-muted-foreground font-light mb-6">
                <p>
                  Our flagship Barcelona showroom spans over 10,000 square feet, designed as a 
                  living gallery where each room tells a story. We invite you to experience the comfort, 
                  texture, and scale of our pieces firsthand.
                </p>
                <p>
                  To ensure personalized attention, we highly recommend booking a private consultation 
                  with one of our senior interior designers.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <Card className="bg-card hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Location</h3>
                    <p className="font-serif text-lg text-foreground mb-1">Passeig de Gràcia 55</p>
                    <p className="text-muted-foreground text-sm">08007 Barcelona, Spain</p>
                  </CardContent>
                </Card>

                <Card className="bg-card hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Opening Hours</h3>
                    <ul className="text-sm text-foreground flex flex-col gap-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Mon - Fri:</span>
                        <span className="font-medium">10:00 - 20:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Saturday:</span>
                        <span className="font-medium">10:00 - 18:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Sunday:</span>
                        <span className="font-medium text-destructive">Closed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="aspect-[16/9] bg-secondary w-full rounded-xl overflow-hidden shadow-inner relative border border-border/50">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop")' }}
                />
              </div>
            </div>

            {/* Booking Form */}
            <Card className="bg-white shadow-xl lg:-mt-32 max-h-max isolate relative z-10 border-border/40">
              <CardContent className="p-8 sm:p-12">
                <h3 className="font-serif text-3xl font-medium mb-4">Book an Appointment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  Schedule a private consultation with one of our design experts to discuss your upcoming project.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-secondary/50 focus-visible:ring-primary h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-widest">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-secondary/50 focus-visible:ring-primary h-12"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs uppercase tracking-widest">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (234) 567-8900"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-secondary/50 focus-visible:ring-primary h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-xs uppercase tracking-widest">Preferred Date</Label>
                      <Input 
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="bg-secondary/50 focus-visible:ring-primary h-12 min-h-12 w-full appearance-none block"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs uppercase tracking-widest">Project Details</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Tell us briefly about the spaces you are looking to furnish..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="bg-secondary/50 focus-visible:ring-primary h-32 resize-y"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full mt-2 h-14 uppercase tracking-widest font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Requesting...' : 'Request Consultation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
