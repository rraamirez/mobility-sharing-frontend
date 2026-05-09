import React from "react";

type DateTimeFieldProps = {
  value: Date;
  mode: "date" | "time";
  display?: "default" | "spinner" | "calendar" | "clock";
  onChange: (value: Date | null) => void;
};

const toDateValue = (value: Date) => value.toISOString().split("T")[0];

const toTimeValue = (value: Date) => value.toTimeString().slice(0, 5);

export default function DateTimeField({
  value,
  mode,
  onChange,
}: DateTimeFieldProps) {
  return React.createElement("input", {
    type: mode,
    value: mode === "date" ? toDateValue(value) : toTimeValue(value),
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (!inputValue) {
        onChange(null);
        return;
      }

      if (mode === "date") {
        onChange(new Date(`${inputValue}T00:00:00`));
        return;
      }

      const [hours, minutes] = inputValue.split(":").map(Number);
      const next = new Date();
      next.setHours(hours, minutes, 0, 0);
      onChange(next);
    },
    style: {
      backgroundColor: "#333",
      border: "1px solid #555",
      borderRadius: 5,
      color: "#fff",
      font: "inherit",
      marginBottom: 15,
      padding: 10,
      width: "100%",
    },
  });
}
