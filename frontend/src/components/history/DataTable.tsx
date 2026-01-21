import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAQICategory } from '@/lib/aqi-utils';

interface DataTableProps {
    data: Array<{
        timestamp: string;
        aqi: number;
        pm25: number;
        pm10: number;
    }>;
}

export function DataTable({ data }: DataTableProps) {
    const getCategoryColor = (aqi: number) => {
        if (aqi <= 50) return 'bg-green-500 hover:bg-green-600';
        if (aqi <= 100) return 'bg-yellow-500 hover:bg-yellow-600';
        if (aqi <= 150) return 'bg-orange-500 hover:bg-orange-600';
        if (aqi <= 200) return 'bg-red-500 hover:bg-red-600';
        return 'bg-purple-500 hover:bg-purple-600';
    };

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-foreground">Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="text-muted-foreground font-semibold">Timestamp</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">AQI</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">PM2.5 (µg/m³)</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">PM10 (µg/m³)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, index) => (
                                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium text-foreground">
                                            {new Date(row.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-foreground">{row.aqi}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getCategoryColor(row.aqi)} text-white border-none shadow-sm`}>
                                                {getAQICategory(row.aqi).label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-medium">{row.pm25.toFixed(1)}</TableCell>
                                        <TableCell className="text-muted-foreground font-medium">{row.pm10.toFixed(1)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
