
function Checkbox({value, register}) {
  return (
    <span>
      <input 
      className="mr-2"
      id={value}
      value={value}
      type="checkbox"
      {...register} />
      <label for={value}>{value}</label>
    </span>
  )
}

export default Checkbox
