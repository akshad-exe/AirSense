import { useState } from 'react';
import { Wind, Bell, Search, User, MapPin, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { PWAInstallPrompt } from '@/components/settings/PWAInstallPrompt';
import { cn } from '@/lib/utils';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const mockupResults = [
        { id: 1, type: 'device', name: 'Living Room Sensor', location: 'Home' },
        { id: 2, type: 'device', name: 'Bedroom Air Monitor', location: 'Home' },
        { id: 3, type: 'location', name: 'New York City', aqi: 42 },
    ].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <header className="bg-background/80 backdrop-blur-xl shadow-sm shadow-primary/5 sticky top-0 z-50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative flex items-center justify-center transition-all duration-300">
                            <Wind className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground leading-tight">AirSense</h1>
                            <p className="text-xs text-muted-foreground font-medium">Air Quality Monitoring</p>
                        </div>
                    </div>

                    {/* Search Bar - Hidden on Mobile */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
                        <div className="relative w-full">
                            <Search className={cn(
                                "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                                isFocused ? "text-primary" : "text-muted-foreground"
                            )} />
                            <Input
                                placeholder="Search devices or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:ring-1 focus:ring-primary transition-all duration-300 rounded-xl h-11"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {isFocused && searchQuery.length > 0 && (
                            <div className="absolute top-14 left-0 right-0 bg-background border border-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="p-2">
                                    {mockupResults.length > 0 ? (
                                        mockupResults.map((result) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                                            >
                                                {result.type === 'device' ? (
                                                    <Smartphone className="w-4 h-4 text-primary" />
                                                ) : (
                                                    <MapPin className="w-4 h-4 text-orange-500" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{result.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {result.type === 'device' ? result.location : `AQI: ${result.aqi}`}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center">
                                            <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Connection Status */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Live</span>
                        </div>

                        {/* PWA Install */}
                        <PWAInstallPrompt />

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative w-11 h-11 rounded-xl hover:bg-muted transition-colors">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
                        </Button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-border ml-2">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-foreground">John Doe</p>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                            <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full bg-muted border-2 border-border p-0 overflow-hidden hover:scale-105 transition-transform">
                                <User className="w-6 h-6 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
