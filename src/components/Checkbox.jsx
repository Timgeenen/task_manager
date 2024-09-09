
function Checkbox({value, text, register, checked }) {
  return (
    <span key={value}>
      <input 
      className="mr-2"
      value={value}
      checked={checked ? checked : false}
      type="checkbox"
      {...register} />
      <label>{text}</label>
    </span>
  )
}

export default Checkbox
