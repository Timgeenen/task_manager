import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";

function DateSelect({ text, name, control, minDate, maxDate, defaultValue }) {

  return (
    <Controller
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <span className="flex flex-nowrap p-2 shadow-lg rounded-full bg-blue-100">
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
