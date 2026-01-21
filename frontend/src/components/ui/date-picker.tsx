"use client"

import * as React from "react"
import { ChevronDownIcon, CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    label?: string
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
}

export function DatePicker({ label, value, onChange, placeholder = "Select date" }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <Label htmlFor="date" className="text-sm font-semibold text-foreground">
                    {label}
                </Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className={cn(
                            "w-full justify-between font-medium h-11 rounded-xl border-border hover:bg-muted transition-colors",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            {value ? value.toLocaleDateString() : placeholder}
                        </div>
                        <ChevronDownIcon className="w-4 h-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0 rounded-2xl shadow-xl border-border" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            onChange?.(date)
                            setOpen(false)
                        }}
                        className="rounded-2xl"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
