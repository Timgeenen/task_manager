
function Checkbox({value, text, register, checked, disabled }) {
  return (
    <span key={value}>
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
