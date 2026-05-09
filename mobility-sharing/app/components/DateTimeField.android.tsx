import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateTimeFieldProps = {
  value: Date;
  mode: "date" | "time";
  display?: "default" | "spinner" | "calendar" | "clock";
  onChange: (value: Date | null) => void;
};

export default function DateTimeField({
  value,
  mode,
  display,
  onChange,
}: DateTimeFieldProps) {
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={display}
      onChange={(_, selectedValue) => onChange(selectedValue ?? null)}
    />
  );
}
