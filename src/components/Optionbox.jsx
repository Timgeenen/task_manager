function Optionbox({options, register}) {
  return (
    <select {...register}>
      {options.map((item) => (
        <option value={item} >{item}</option>
      ))}
    </select>
  )
}

export default Optionbox
