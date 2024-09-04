import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";

function DateSelect({ text, control }) {

  return (
    <Controller
    control={control}
    name="deadline"
    defaultValue={new Date()}
    render={({ field }) => (
      <>
        <label>{text}</label>
        <DatePicker
        {...field}
        value={field.value}
        selected={field.value}
        minDate={new Date()}
        onChange={date => field.onChange(date) }
        />
      </>
    )}
    />
  )
}

export default DateSelect
