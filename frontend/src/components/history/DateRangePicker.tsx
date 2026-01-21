import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';

interface DateRangePickerProps {
    onDateChange?: (from?: Date, to?: Date) => void;
}

export function DateRangePicker({ onDateChange }: DateRangePickerProps) {
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();

    const handleFromDateChange = (date: Date | undefined) => {
        setFromDate(date);
        onDateChange?.(date, toDate);
    };

    const handleToDateChange = (date: Date | undefined) => {
        setToDate(date);
        onDateChange?.(fromDate, date);
    };

    return (
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* From Date */}
                    <DatePicker
                        label="From Date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        placeholder="Pick starting date"
                    />

                    {/* To Date */}
                    <DatePicker
                        label="To Date"
                        value={toDate}
                        onChange={handleToDateChange}
                        placeholder="Pick ending date"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
