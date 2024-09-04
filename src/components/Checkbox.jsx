
function Checkbox({value, text, register }) {
  return (
    <span>
      <input 
      className="mr-2"
      value={value}
      type="checkbox"
      {...register} />
      <label>{text}</label>
    </span>
  )
}

export default Checkbox
