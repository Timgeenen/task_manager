import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import clsx from "clsx";

function DateSelect({ text, name, control, minDate, maxDate, defaultValue, classes }) {

  return (
    <Controller
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <span className={clsx(classes, "flex flex-nowrap p-2 shadow-lg rounded-full")}>
        <label className="mr-2">{text}</label>
        <DatePicker
        {...field}
        value={field.value}
        selected={field.value}
        placeholderText="select date"
        className="bg-transparent"
        minDate={minDate}
        maxDate={maxDate}
        onChange={date => field.onChange(date)}
        />
      </span>
    )}
    />
  )
}

export default DateSelect
