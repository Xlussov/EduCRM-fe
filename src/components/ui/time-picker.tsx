import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function TimePicker({ value = "00:00", onChange, disabled }: TimePickerProps) {
  const [hours, minutes] = value?.split(":") || ["00", "00"];

  const handleHourChange = (newHour: string) => {
    onChange?.(`${newHour}:${minutes || '00'}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onChange?.(`${hours || '00'}:${newMinute}`);
  };

  const hoursList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutesList = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

  return (
    <div className="flex items-center gap-2">
      <Select disabled={disabled} value={hours} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent position="popper" className="!max-h-[200px]">
          {hoursList.map((h) => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground font-bold">:</span>

      <Select disabled={disabled} value={minutes} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent position="popper" className="!max-h-[200px]">
          {minutesList.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}