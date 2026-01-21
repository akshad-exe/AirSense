import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, Smartphone, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        to: '/',
        icon: Home,
        label: 'Home',
        exact: true,
    },
    {
        to: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
    },
    {
        to: '/history',
        icon: History,
        label: 'History',
    },
    {
        to: '/devices',
        icon: Smartphone,
        label: 'Devices',
    },
    {
        to: '/settings',
        icon: Settings,
        label: 'Settings',
    },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-background min-h-[calc(100vh-73px)] sticky top-[73px] hidden md:block z-40">
            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={cn('w-5 h-5 transition-transform duration-300 group-hover:scale-110', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}
