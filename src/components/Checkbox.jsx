import clsx from "clsx"
import { ellipsis } from "../library/styles"

function Checkbox({value, text, register, checked, disabled }) {
  return (
    <span
    key={value}
    className={clsx("w-1/4 min-w-32 text-nowrap", ellipsis)}
    >
      <input 
      className="mr-2"
      value={value}
      disabled={disabled}
      defaultChecked={checked ? true : false}
      type="checkbox"
      {...register} />
      <label>{text}</label>
    </span>
  )
}

export default Checkbox
