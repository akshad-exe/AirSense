import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { DataExport } from '@/components/settings/DataExport';

export function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto py-4">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">Settings</h1>
                <p className="text-lg text-muted-foreground mt-2">Manage your app preferences and data</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Visual Settings */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>Appearance</CardTitle>
                        </div>
                        <CardDescription>Customize how AirSense looks on your device</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                            <div className="space-y-0.5">
                                <Label className="text-base">Color Theme</Label>
                                <p className="text-sm text-muted-foreground">Switch between light, dark, and system theme</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <NotificationSettings />

                {/* Data Management */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-primary" />
                            <CardTitle>Data Refresh</CardTitle>
                        </div>
                        <CardDescription>Configure how often data is updated</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-0.5">
                                <Label className="text-base">Auto Refresh</Label>
                                <p className="text-sm text-muted-foreground">Update data automatically in real-time</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-0.5">
                                <Label className="text-base">Refresh Interval</Label>
                                <p className="text-sm text-muted-foreground">Time between updates (seconds)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">30s</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Export/Import */}
                <DataExport />
            </div>
        </div>
    );
}
