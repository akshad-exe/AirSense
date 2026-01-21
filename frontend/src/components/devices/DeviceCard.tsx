import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Smartphone, MoreVertical, MapPin, Activity, Clock, Trash2, Edit3 } from 'lucide-react';

interface Device {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'offline';
    lastSeen: string;
    aqi?: number;
}

interface DeviceCardProps {
    device: Device;
    onEdit?: (device: Device) => void;
    onDelete?: (id: string) => void;
}

export function DeviceCard({ device, onEdit, onDelete }: DeviceCardProps) {
    const isOnline = device.status === 'online';

    return (
        <Card className="group bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border-border overflow-hidden rounded-[2rem] hover:-translate-y-1">
            <CardHeader className="pb-4 relative">
                {/* Connection Status Indicator */}
                <div className={`absolute top-6 right-6 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse ring-4 ring-green-500/20' : 'bg-muted-foreground/30'}`} />

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isOnline ? 'bg-primary/10 shadow-inner' : 'bg-muted'
                            }`}>
                            <Smartphone className={`w-7 h-7 ${isOnline ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-foreground">{device.name}</CardTitle>
                            <p className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {device.location}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl w-10 h-10 hover:bg-muted group-hover:text-primary transition-colors">
                                <MoreVertical className="w-5 h-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-2xl border-border p-2 min-w-[160px]">
                            <DropdownMenuItem onClick={() => onEdit?.(device)} className="rounded-lg gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary font-semibold">
                                <Edit3 className="w-4 h-4" />
                                Edit Device
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete?.(device.id)} className="rounded-lg gap-2 text-destructive cursor-pointer focus:bg-destructive/5 focus:text-destructive font-semibold">
                                <Trash2 className="w-4 h-4" />
                                Delete Device
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
                {/* Status and Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Current Status</span>
                        <Badge
                            variant={isOnline ? 'default' : 'secondary'}
                            className={`rounded-full px-3 py-0.5 font-bold uppercase tracking-wider text-[10px] ${isOnline ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20' : 'bg-muted-foreground/20 text-muted-foreground'}`}
                        >
                            {isOnline ? 'Connected' : 'Offline'}
                        </Badge>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Signal Strength</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-1.5 h-4 rounded-full ${isOnline && i <= 3 ? (i === 4 ? 'bg-muted-foreground/30' : 'bg-primary') : 'bg-muted-foreground/20'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Current AQI */}
                {device.aqi !== undefined && isOnline && (
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-bold text-muted-foreground font-mono">Real-time AQI</span>
                        </div>
                        <span className="text-2xl font-black text-primary drop-shadow-sm">{device.aqi}</span>
                    </div>
                )}

                {/* Last Seen and ID */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            Last Check
                        </span>
                        <span className="text-foreground">
                            {new Date(device.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="pt-3 border-t border-border mt-2">
                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] block text-center"> Device ID: {device.id}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
