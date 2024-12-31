import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const StyleGuide = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-serif mb-8">Style Guide</h1>
      
      {/* Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-lg"></div>
            <p className="text-sm font-mono">Primary (#403E43)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary-light rounded-lg"></div>
            <p className="text-sm font-mono">Primary Light (#F2FCE2)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-accent-sage rounded-lg"></div>
            <p className="text-sm font-mono">Accent Sage (#D4DCCD)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-accent-sand rounded-lg"></div>
            <p className="text-sm font-mono">Accent Sand (#F5E6D3)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-[#FCFAF7] rounded-lg border border-primary/10"></div>
            <p className="text-sm font-mono">Background (#FCFAF7)</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Typography</h2>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-serif">Heading 1 - Playfair Display</h1>
            <p className="text-sm font-mono text-primary/60">font-serif text-4xl (36px)</p>
          </div>
          <div>
            <h2 className="text-3xl font-serif">Heading 2 - Playfair Display</h2>
            <p className="text-sm font-mono text-primary/60">font-serif text-3xl (30px)</p>
          </div>
          <div>
            <h3 className="text-2xl font-serif">Heading 3 - Playfair Display</h3>
            <p className="text-sm font-mono text-primary/60">font-serif text-2xl (24px)</p>
          </div>
          <div>
            <h4 className="text-xl font-serif">Heading 4 - Playfair Display</h4>
            <p className="text-sm font-mono text-primary/60">font-serif text-xl (20px)</p>
          </div>
          <div>
            <p className="text-lg font-mono">Large Body Text - IBM Plex Mono</p>
            <p className="text-sm font-mono text-primary/60">font-mono text-lg (18px)</p>
          </div>
          <div>
            <p className="text-base font-mono">Body Text - IBM Plex Mono</p>
            <p className="text-sm font-mono text-primary/60">font-mono text-base (16px)</p>
          </div>
          <div>
            <p className="text-sm font-mono">Small Text - IBM Plex Mono</p>
            <p className="text-sm font-mono text-primary/60">font-mono text-sm (14px)</p>
          </div>
          <div>
            <p className="text-xs font-mono">Extra Small Text - IBM Plex Mono</p>
            <p className="text-sm font-mono text-primary/60">font-mono text-xs (12px)</p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Components</h2>
        
        {/* Buttons */}
        <div className="mb-8">
          <h3 className="text-xl font-serif mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-serif mb-4">Cards</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
            </Card>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-serif mb-2">Glass Card</h3>
              <p>Our custom glass card style.</p>
            </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="mb-8">
          <h3 className="text-xl font-serif mb-4">Form Elements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input placeholder="Default Input" />
              <Calendar mode="single" />
            </div>
          </div>
        </div>

        {/* Avatars & Badges */}
        <div className="mb-8">
          <h3 className="text-xl font-serif mb-4">Avatars & Badges</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://randomuser.me/api/portraits/women/17.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Badge>New</Badge>
            <Badge variant="secondary">Premium</Badge>
            <Badge variant="outline">Basic</Badge>
          </div>
        </div>

        {/* Animations */}
        <div className="mb-8">
          <h3 className="text-xl font-serif mb-4">Animations</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-float">
              Float Animation
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-fade-up">
              Fade Up Animation
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-pulse-subtle">
              Pulse Animation
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif mb-4">Usage Guidelines</h2>
        <div className="prose prose-slate max-w-none">
          <h3>Typography</h3>
          <ul>
            <li>Use Playfair Display for headings (font-serif)</li>
            <li>Use IBM Plex Mono for body text (font-mono)</li>
            <li>Main headings should be text-4xl (36px)</li>
            <li>Section headings should be text-2xl (24px)</li>
            <li>Body text should be text-base (16px)</li>
            <li>Small text and captions should be text-sm (14px)</li>
          </ul>
          
          <h3>Colors</h3>
          <ul>
            <li>Primary color (#403E43) for main text and important UI elements</li>
            <li>Primary Light (#F2FCE2) for subtle backgrounds and highlights</li>
            <li>Accent Sage (#D4DCCD) for secondary elements and borders</li>
            <li>Accent Sand (#F5E6D3) for call-to-action elements</li>
            <li>Background (#FCFAF7) for all page backgrounds</li>
          </ul>
          
          <h3>Components</h3>
          <ul>
            <li>Use glass card style for content modules</li>
            <li>Maintain consistent spacing with gap-4 or gap-6</li>
            <li>Use animations sparingly to enhance user experience</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;
