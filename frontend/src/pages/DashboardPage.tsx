import { useState, useEffect } from 'react';
import { AQIDisplay, HealthSuggestions, DeviceStatus, AQIScale } from '@/components/dashboard';
import { saveMetrics, getLatestMetrics } from '@/lib/db';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export function DashboardPage() {
    const [aqi, setAqi] = useState(42);
    const [temperature, setTemperature] = useState(25.0);  // DHT22
    const [humidity, setHumidity] = useState(60.0);         // DHT22
    const [airQualityPPM, setAirQualityPPM] = useState(50); // MQ135
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isOnline, setIsOnline] = useState(true);
    const [deviceId, setDeviceId] = useState('AS-2024-001');

    // Fetch real data from backend
    const fetchBackendData = async () => {
        try {
            const response = await apiClient.getLatest();

            if (response.success && response.data) {
                // Backend returns: {success: true, data: {id, device_id, temperature, humidity, air_quality_ppm, aqi, ...}}
                const sensorData: any = response.data;

                // Update state with real backend data
                setAqi(sensorData.aqi || 0);
                setTemperature(sensorData.temperature || 0);
                setHumidity(sensorData.humidity || 0);
                setAirQualityPPM(sensorData.air_quality_ppm || 0);
                setLastUpdated(new Date(sensorData.timestamp));
                setDeviceId(sensorData.device_id || 'AS-2024-001');
                setIsOnline(true);

                // Save to IndexedDB for offline access
                await saveMetrics({
                    aqi: sensorData.aqi,
                    pm25: sensorData.temperature,  // Store as pm25 for compatibility
                    pm10: sensorData.humidity,      // Store as pm10 for compatibility
                    timestamp: sensorData.timestamp,
                });

                console.log('✅ Fetched real data from backend:', sensorData);
            } else {
                // Fallback to offline data
                console.warn('⚠️ Backend returned no data, using offline data');
                await loadOfflineData();
                setIsOnline(false);
            }
        } catch (error) {
            console.error('❌ Failed to fetch from backend:', error);
            toast.error('Using offline data - backend unavailable');
            await loadOfflineData();
            setIsOnline(false);
        }
    };

    // Load offline data from IndexedDB
    const loadOfflineData = async () => {
        const history = await getLatestMetrics(1);
        if (history && history.length > 0) {
            const latest = history[0];
            setAqi(latest.aqi);
            setTemperature(latest.pm25);  // Stored as pm25
            setHumidity(latest.pm10);      // Stored as pm10
            setLastUpdated(new Date(latest.timestamp));
        }
    };

    // Initial load: Try backend first, fallback to offline
    useEffect(() => {
        fetchBackendData();
    }, []);

    // Poll backend every 10 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            fetchBackendData();
        }, 10000); // Fetch from backend every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 py-4">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-lg text-muted-foreground mt-2">Real-time air quality monitoring for <span className="text-primary font-semibold">Living Room Sensor</span></p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    {isOnline ? 'Live data from backend' : 'Offline mode'} • Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: AQI Display and Sensor Cards */}
                <div className="xl:col-span-2 space-y-8">
                    <AQIDisplay aqi={Math.round(aqi)} />

                    {/* Sensor Data Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Temperature Card - DHT22 */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Temperature</h3>
                                <span className="text-2xl">🌡️</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-3xl font-bold text-foreground">{temperature.toFixed(1)}°C</p>
                                <p className="text-xs text-muted-foreground">DHT22 Sensor</p>
                            </div>
                        </div>

                        {/* Humidity Card - DHT22 */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Humidity</h3>
                                <span className="text-2xl">💧</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-3xl font-bold text-foreground">{humidity.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">DHT22 Sensor</p>
                            </div>
                        </div>

                        {/* Air Quality PPM Card - MQ135 */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Air Quality</h3>
                                <span className="text-2xl">🌫️</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-3xl font-bold text-foreground">{Math.round(airQualityPPM)} PPM</p>
                                <p className="text-xs text-muted-foreground">MQ135 Sensor</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Health Suggestions and Status */}
                <div className="space-y-8">
                    <HealthSuggestions aqi={Math.round(aqi)} />
                    <DeviceStatus
                        deviceId={deviceId}
                        status={isOnline ? "online" : "offline"}
                        lastSeen={lastUpdated.toISOString()}
                        location="Living Room, Home"
                    />
                    <AQIScale />
                </div>
            </div>
        </div>
    );
}
