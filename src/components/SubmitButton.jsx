function SubmitButton({ disabled }) {
  return (
    <input
    type="submit"
    disabled={disabled}
    className="shadow rounded-full h-8 bg-blue-600 text-gray-100 hover:cursor-pointer"
    />
  )
}

export default SubmitButton
