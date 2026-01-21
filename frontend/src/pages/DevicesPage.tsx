import { useState } from 'react';
import { DeviceList, DeviceSelector } from '@/components/devices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Smartphone, Signal, SignalLow, Activity, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// Sample devices data
const sampleDevices = [
    {
        id: 'AS-2024-001',
        name: 'Living Room Sensor',
        location: 'Living Room, Home',
        status: 'online' as const,
        lastSeen: new Date().toISOString(),
        aqi: 42,
    },
    {
        id: 'AS-2024-002',
        name: 'Master Bedroom',
        location: 'Bedroom, Home',
        status: 'online' as const,
        lastSeen: new Date().toISOString(),
        aqi: 35,
    },
    {
        id: 'AS-2024-003',
        name: 'Office Sensor',
        location: 'Study Room, Home',
        status: 'offline' as const,
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
    },
];

export function DevicesPage() {
    const [devices] = useState(sampleDevices);
    const totalDevices = devices.length;
    const onlineDevices = devices.filter((d) => d.status === 'online').length;

    const handleAddDevice = () => {
        toast.info('Device discovery started...', {
            description: 'Searching for nearby AirSense sensors. Please ensure your device is in pairing mode.',
        });
    };

    return (
        <div className="space-y-8 py-4">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">Devices</h1>
                    <p className="text-lg text-muted-foreground mt-2">Manage and monitor all your air quality sensors</p>
                </div>
                <Button onClick={handleAddDevice} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-12">
                    <Plus className="w-5 h-5" />
                    Add Device
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Devices</CardTitle>
                        <Smartphone className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{totalDevices}</div>
                        <p className="text-xs text-muted-foreground mt-1">Configured in your account</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Online Status</CardTitle>
                        <Signal className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-green-500">{onlineDevices}</div>
                        <p className="text-xs text-muted-foreground mt-1">Actively broadcasting data</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Offline Status</CardTitle>
                        <SignalLow className="w-4 h-4 text-muted-foreground/40" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-muted-foreground/40">{totalDevices - onlineDevices}</div>
                        <p className="text-xs text-muted-foreground mt-1">Require attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Device Filtering/Selection */}
            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border">
                <Activity className="w-5 h-5 text-primary ml-2" />
                <span className="text-sm font-semibold text-foreground">Active Selection:</span>
                <DeviceSelector devices={devices} />
            </div>

            {/* Device List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Registered Locations</h2>
                </div>
                <DeviceList devices={devices} />
            </div>
        </div>
    );
}
