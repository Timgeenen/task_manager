import clsx from "clsx"

function Optionbox({options, register, defaultValue, defaultText, classes}) {
  return (
    <select
    {...register}
    className={clsx(classes, "rounded-full shadow-lg p-2")}
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
