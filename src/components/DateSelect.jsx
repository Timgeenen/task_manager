import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";

function DateSelect({ text, name, control, minDate, maxDate, defaultValue }) {

  return (
    <Controller
    control={control}
    name={name}
    defaultValue={defaultValue}
    render={({ field }) => (
      <>
        <label>{text}</label>
        <DatePicker
        {...field}
        value={field.value}
        selected={field.value}
        placeholderText="select date"
        minDate={minDate}
        maxDate={maxDate}
        onChange={date => field.onChange(date)}
        />
      </>
    )}
    />
  )
}

export default DateSelect
