import { Wind, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'API', href: '#api' },
    ],
    company: [
        { name: 'About', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
        { name: 'Contact', href: '#contact' },
    ],
    resources: [
        { name: 'Documentation', href: '#docs' },
        { name: 'Help Center', href: '#help' },
        { name: 'Community', href: '#community' },
        { name: 'Status', href: '#status' },
    ],
    legal: [
        { name: 'Privacy', href: '#privacy' },
        { name: 'Terms', href: '#terms' },
        { name: 'Security', href: '#security' },
        { name: 'Cookies', href: '#cookies' },
    ],
};

const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
];

export function Footer() {
    return (
        <footer className="bg-muted/30 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1">
                        <div className="flex items-center mb-6 group cursor-pointer">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                                <Wind className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-foreground tracking-tighter">AirSense</span>
                        </div>
                        <p className="text-base text-muted-foreground mb-8 max-w-xs leading-relaxed">
                            Monitoring air quality for a healthier tomorrow. Real-time data, personalized insights, and global connectivity.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">{category}</h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group font-medium"
                                        >
                                            {link.name}
                                            <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 opacity-60">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                            <p className="text-sm text-muted-foreground font-medium">
                                © {new Date().getFullYear()} AirSense. All rights reserved.
                            </p>
                            <div className="hidden md:block w-px h-4 bg-border" />
                            <p className="text-sm text-muted-foreground font-medium">
                                Designed with ❤️ for a cleaner world.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest">Privacy Policy</a>
                            <a href="#" className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
