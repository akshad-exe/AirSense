import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Device {
    id: string;
    name: string;
    location: string;
}

interface DeviceSelectorProps {
    devices: Device[];
    selectedDeviceId?: string;
    onDeviceChange?: (deviceId: string) => void;
}

export function DeviceSelector({ devices, selectedDeviceId, onDeviceChange }: DeviceSelectorProps) {
    return (
        <Select value={selectedDeviceId} onValueChange={onDeviceChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
                {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                        <div className="flex flex-col">
                            <span className="font-medium">{device.name}</span>
                            <span className="text-xs text-gray-500">{device.location}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
