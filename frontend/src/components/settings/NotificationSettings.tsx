import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
    settings?: {
        enabled: boolean;
        threshold: number;
        sound: boolean;
    };
    onChange?: (settings: any) => void;
}

export function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
    const currentSettings = settings || {
        enabled: true,
        threshold: 100,
        sound: true,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Enable Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                        <p className="text-sm text-gray-500">Receive alerts for air quality changes</p>
                    </div>
                    <Switch
                        id="notifications"
                        checked={currentSettings.enabled}
                        onCheckedChange={(enabled) => onChange?.({ ...currentSettings, enabled })}
                    />
                </div>

                {/* AQI Threshold */}
                <div className="space-y-2">
                    <Label htmlFor="threshold" className="text-base">Alert Threshold</Label>
                    <p className="text-sm text-gray-500 mb-2">Get notified when AQI exceeds this value</p>
                    <Select
                        value={currentSettings.threshold.toString()}
                        onValueChange={(value) => onChange?.({ ...currentSettings, threshold: parseInt(value) })}
                    >
                        <SelectTrigger id="threshold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="50">50 - Good</SelectItem>
                            <SelectItem value="100">100 - Moderate</SelectItem>
                            <SelectItem value="150">150 - Unhealthy for Sensitive</SelectItem>
                            <SelectItem value="200">200 - Unhealthy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="sound" className="text-base">Notification Sound</Label>
                        <p className="text-sm text-gray-500">Play sound for alerts</p>
                    </div>
                    <Switch
                        id="sound"
                        checked={currentSettings.sound}
                        onCheckedChange={(sound) => onChange?.({ ...currentSettings, sound })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
