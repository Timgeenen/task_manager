function SubmitButton({ disabled }) {
  return (
    <input
    type="submit"
    value="SUBMIT"
    disabled={disabled}
    className="shadow rounded-full h-8 bg-blue-600 text-gray-100 w-32 hover:cursor-pointer"
    />
  )
}

export default SubmitButton