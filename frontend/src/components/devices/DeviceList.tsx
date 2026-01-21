import { DeviceCard } from './DeviceCard';

interface Device {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'offline';
    lastSeen: string;
    aqi?: number;
}

interface DeviceListProps {
    devices: Device[];
    onEdit?: (device: Device) => void;
    onDelete?: (deviceId: string) => void;
}

export function DeviceList({ devices, onEdit, onDelete }: DeviceListProps) {
    if (devices.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No devices found</p>
                <p className="text-sm text-gray-400 mt-1">Add a device to get started</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
