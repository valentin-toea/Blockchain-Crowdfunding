import React, { HTMLInputTypeAttribute, useState } from "react";
import DatePickerPrimitive from "react-datepicker";
import TextField from "./common/TextField";

import "react-datepicker/dist/react-datepicker.css";
import { Popover } from "./common/Popover";

interface TextFieldProps {
  label?: string | null | undefined;
  type?: HTMLInputTypeAttribute;
  error?: boolean;
  errorLabel?: string;
  bold?: boolean;
  value?: string;
  onChange?: (date: string) => any;
  disabled?: boolean;
}

const DatePicker = ({
  value = new Date().toLocaleDateString("en-GB"),
  onChange,
  disabled,
  ...props
}: TextFieldProps) => {
  const [open, setOpen] = useState(false);
  const splitDate = value.split("/").map((x) => parseInt(x));
  const year = splitDate[2];
  const month = splitDate[1];
  const day = splitDate[0];

  const handleChange = (date: Date) => {
    setOpen(false);
    onChange?.(date.toLocaleDateString("en-GB"));
  };

  return (
    <Popover
      trigger={
        <TextField
          placeholder="Date"
          value={value}
          readOnly
          {...props}
          disabled={disabled}
        />
      }
      modal={false}
      show={open}
      onShowChange={(event: boolean) => setOpen(event)}
    >
      <DatePickerPrimitive
        disabled={disabled}
        selected={new Date(year, month - 1, day, 0, 0, 0)}
        onChange={handleChange}
        inline
      />
    </Popover>
  );
};

export default DatePicker;
