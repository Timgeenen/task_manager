
function Checkbox({value, register, id}) {
  return (
    <span>
      <input 
      className="mr-2"
      id={id}
      value={value}
      type="checkbox"
      {...register} />
      <label>{value}</label>
    </span>
  )
}

export default Checkbox
