import { useState } from 'react';
import { HistoryChart, DataTable, DateRangePicker } from '@/components/history';
import { Button } from '@/components/ui/button';
import { Download, Filter, Share2 } from 'lucide-react';
import { toast } from 'sonner';

// Sample historical data
const sampleData = [
    { timestamp: '2024-03-20T10:00:00Z', aqi: 45, pm25: 12.5, pm10: 24.8 },
    { timestamp: '2024-03-20T11:00:00Z', aqi: 48, pm25: 13.2, pm10: 26.1 },
    { timestamp: '2024-03-20T12:00:00Z', aqi: 52, pm25: 15.8, pm10: 30.5 },
    { timestamp: '2024-03-20T13:00:00Z', aqi: 42, pm25: 11.2, pm10: 22.4 },
    { timestamp: '2024-03-20T14:00:00Z', aqi: 38, pm25: 10.1, pm10: 20.2 },
    { timestamp: '2024-03-20T15:00:00Z', aqi: 55, pm25: 16.5, pm10: 32.8 },
    { timestamp: '2024-03-20T16:00:00Z', aqi: 62, pm25: 19.8, pm10: 38.5 },
];

export function HistoryPage() {
    const [data] = useState(sampleData);

    const handleExport = () => {
        toast.success('Historical data exported to CSV successfully!', {
            description: 'The file has been saved to your downloads folder.',
            duration: 5000,
        });
    };

    const handleDateChange = (from?: Date, to?: Date) => {
        console.log('Date range changed:', { from, to });
        // Filter logic would go here
    };

    return (
        <div className="space-y-8 py-4">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">History</h1>
                    <p className="text-lg text-muted-foreground mt-2">Analyze historical air quality trends and metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-xl border-border hover:bg-muted" onClick={() => toast.info('Share feature coming soon!')}>
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                    <Button onClick={handleExport} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6">
                        <Download className="w-4 h-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                <div className="lg:col-span-3">
                    <DateRangePicker onDateChange={handleDateChange} />
                </div>
                <Button variant="ghost" className="h-12 gap-2 text-muted-foreground hover:text-primary rounded-xl border border-dashed border-border hover:border-primary transition-all">
                    <Filter className="w-4 h-4" />
                    More Filters
                </Button>
            </div>

            {/* Chart Section */}
            <div className="space-y-8">
                <HistoryChart data={data} />
                <DataTable data={data} />
            </div>
        </div>
    );
}
