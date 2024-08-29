function Textbox({label, type, placeholder, error, register}) {
  return (
    <div className="flex flex-col">
      {label && <span className="text-md mb-1">{label}</span>}
      <input 
        type={type}
        name={type}
        placeholder={placeholder}
        {...register}
        className="border p-1 rounded-md focus:outline-none"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

export default Textbox
