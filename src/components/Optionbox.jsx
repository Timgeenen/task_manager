function Optionbox({options, register, error}) {
  //TODO: add error handling when no team is selected
  return (
    <select {...register}>
      <option value="">--Select Team</option>
      {options.map((item) => (
        <option value={item.title}>{item.title}</option>
      ))}
      {/* {error && <span className="text-xs text-red-600">{error}</span>} */}
    </select>
  )
}

export default Optionbox
