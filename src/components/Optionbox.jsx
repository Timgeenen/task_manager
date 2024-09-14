function Optionbox({options, register, defaultValue, defaultText}) {
  return (
    <select {...register}>
      <option value={defaultValue}>{defaultText}</option>
      {options.map((item) => (
        <option value={item.id ? item.id : item}>
          {item.name ? item.name : item}
        </option>
      ))}
    </select>
  )
}

export default Optionbox
