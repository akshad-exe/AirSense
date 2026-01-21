import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wind, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { PWAInstallPrompt } from '@/components/settings/PWAInstallPrompt';
import { cn } from '@/lib/utils';

interface NavbarProps {
    onGetStarted?: () => void;
}

const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Dashboard', href: '#dashboard' },
];

export function Navbar({ onGetStarted }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <Wind className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            AirSense
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <PWAInstallPrompt />
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            className="text-sm font-medium"
                        >
                            Sign In
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                            onClick={onGetStarted}
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-3">
                        <ThemeToggle />
                        <button
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-foreground" />
                            ) : (
                                <Menu className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background border-t border-border shadow-lg">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-border space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                            >
                                Sign In
                            </Button>
                            <Button
                                className="w-full bg-primary text-primary-foreground"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onGetStarted?.();
                                }}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
