function Optionbox({options, register}) {
  return (
    <select {...register}>
      <option value="">--Select Team</option>
      {options.map((item) => (
        <option value={item.id}>{item.name}</option>
      ))}
    </select>
  )
}

export default Optionbox
