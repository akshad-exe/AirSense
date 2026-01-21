import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, WifiOff, MapPin } from 'lucide-react';

interface DeviceStatusProps {
    deviceId: string;
    status: 'online' | 'offline';
    lastSeen?: string;
    location?: string;
}

export function DeviceStatus({ deviceId, status, lastSeen, location }: DeviceStatusProps) {
    const isOnline = status === 'online';

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    Device Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Device ID */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Device ID</span>
                    <span className="text-sm font-medium font-mono text-foreground">{deviceId}</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                        variant={isOnline ? 'default' : 'secondary'}
                        className={isOnline ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                        {isOnline ? (
                            <>
                                <Wifi className="w-3 h-3 mr-1" />
                                Online
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3 mr-1" />
                                Offline
                            </>
                        )}
                    </Badge>
                </div>

                {/* Location */}
                {location && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm font-medium flex items-center gap-1 text-foreground">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {location}
                        </span>
                    </div>
                )}

                {/* Last Seen */}
                {lastSeen && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Seen</span>
                        <span className="text-sm font-medium text-foreground">
                            {new Date(lastSeen).toLocaleString()}
                        </span>
                    </div>
                )}

                {/* Connection Indicator */}
                <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40'
                                }`}
                        />
                        <span className="text-xs text-muted-foreground">
                            {isOnline ? 'Receiving real-time data' : 'No connection'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
