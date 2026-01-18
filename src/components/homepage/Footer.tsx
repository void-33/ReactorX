import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  product: [
    { name: "Features", href: "#" },
    { name: "Simulations", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Integrations", href: "#" },
    { name: "Pricing", href: "#" }
  ],
  solutions: [
    { name: "Fire Response", href: "#" },
    { name: "Hazmat Training", href: "#" },
    { name: "Process Control", href: "#" },
    { name: "Emergency Protocols", href: "#" },
    { name: "Team Coordination", href: "#" }
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" }
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Case Studies", href: "#" }
  ]
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-slate-400">
                Get the latest updates on simulation technology and safety training best practices.
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500 h-12"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 px-6 whitespace-nowrap">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">RX</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl">ReactorX</span>
              </div>
            </div>
            <p className="text-sm mb-6 text-slate-400 leading-relaxed">
              Leading provider of advanced simulation software for industrial emergency response and safety training.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors group"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors group"
              >
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors group"
              >
                <Youtube className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Email</div>
                <a href="mailto:info@virtsim.com" className="text-white hover:text-blue-400 transition-colors">
                  info@reactorx.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Phone</div>
                <a href="tel:+1234567890" className="text-white hover:text-blue-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Office</div>
                <div className="text-white">
                  123 Innovation Drive<br />
                  Tech Valley, CA 94000
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 ReactorX. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Cookie Policy</a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
