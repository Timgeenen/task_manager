import clsx from "clsx"
import { ellipsis, inputStyle } from "../library/styles"

function Optionbox({options, register, defaultValue, defaultText, classes}) {
  return (
    <select
    {...register}
    className={clsx(classes, inputStyle, ellipsis)}
    >
      {defaultText && 
      <option
      value={defaultValue}>
        {defaultText}
      </option>
      }
      {options.map((item) => (
        <option value={item.id ? item.id : item}>
          {item.name ? item.name : item}
        </option>
      ))}
    </select>
  )
}

export default Optionbox
